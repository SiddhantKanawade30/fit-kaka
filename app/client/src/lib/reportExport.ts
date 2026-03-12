import type { BasicProfile, MealHistoryItem } from "./api"

export type ReportFileType = "pdf" | "xlsx"

export type ReportExportInput = {
  title: string
  days: number
  fileType: ReportFileType
  phone: string
  meals: MealHistoryItem[]
  profile: BasicProfile | null
}

type NutritionTotals = {
  calories: number
  protein: number
  carbs: number
  fats: number
}

function filterMealsByDays(meals: MealHistoryItem[], days: number) {
  const cutoff = new Date()
  cutoff.setHours(0, 0, 0, 0)
  cutoff.setDate(cutoff.getDate() - (days - 1))

  return meals.filter((meal) => {
    const mealDate = new Date(meal.date)
    return !Number.isNaN(mealDate.getTime()) && mealDate >= cutoff
  })
}

function calculateTotals(meals: MealHistoryItem[]): NutritionTotals {
  return meals.reduce<NutritionTotals>(
    (totals, meal) => ({
      calories: totals.calories + (meal.calories || 0),
      protein: totals.protein + (meal.protein || 0),
      carbs: totals.carbs + (meal.carbs || 0),
      fats: totals.fats + (meal.fats || 0),
    }),
    { calories: 0, protein: 0, carbs: 0, fats: 0 }
  )
}

function formatDate(value: string | Date) {
  const date = typeof value === "string" ? new Date(value) : value
  if (Number.isNaN(date.getTime())) {
    return String(value)
  }

  return new Intl.DateTimeFormat("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date)
}

function buildFilename(title: string, days: number, fileType: ReportFileType) {
  const safeTitle = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")
  const today = new Date().toISOString().split("T")[0]
  return `${safeTitle}-${days}d-${today}.${fileType}`
}

async function exportPdf(input: ReportExportInput, filteredMeals: MealHistoryItem[], totals: NutritionTotals) {
  const { jsPDF } = await import("jspdf")
  const doc = new jsPDF()
  const fileName = buildFilename(input.title, input.days, "pdf")

  let y = 20
  const lineHeight = 8
  const pageHeight = 280

  const writeLine = (text: string, options?: { indent?: number; fontSize?: number }) => {
    if (y > pageHeight) {
      doc.addPage()
      y = 20
    }

    if (options?.fontSize) {
      doc.setFontSize(options.fontSize)
    }

    doc.text(text, 14 + (options?.indent ?? 0), y)
    y += lineHeight
  }

  doc.setFontSize(18)
  writeLine(input.title, { fontSize: 18 })
  doc.setFontSize(11)
  writeLine(`Date range: Last ${input.days} days`)
  writeLine(`Exported on: ${formatDate(new Date())}`)
  writeLine(`Phone: ${input.phone}`)
  y += 2

  writeLine("Summary", { fontSize: 14 })
  writeLine(`Meals logged: ${filteredMeals.length}`, { indent: 2 })
  writeLine(`Calories: ${totals.calories} kcal`, { indent: 2 })
  writeLine(`Protein: ${totals.protein.toFixed(1)} g`, { indent: 2 })
  writeLine(`Carbs: ${totals.carbs.toFixed(1)} g`, { indent: 2 })
  writeLine(`Fats: ${totals.fats.toFixed(1)} g`, { indent: 2 })

  if (input.profile) {
    y += 2
    writeLine("Profile", { fontSize: 14 })
    writeLine(`Age: ${input.profile.age ?? "Not set"}`, { indent: 2 })
    writeLine(`Height: ${input.profile.height ?? "Not set"} cm`, { indent: 2 })
    writeLine(`Weight: ${input.profile.weight ?? "Not set"} kg`, { indent: 2 })
  }

  y += 2
  writeLine("Meals", { fontSize: 14 })

  if (filteredMeals.length === 0) {
    writeLine("No meals logged for this period.", { indent: 2 })
  } else {
    filteredMeals.forEach((meal, index) => {
      writeLine(`${index + 1}. ${meal.mealName}`, { indent: 2 })
      writeLine(
        `${formatDate(meal.date)} • ${meal.calories} kcal • P ${meal.protein}g • C ${meal.carbs}g • F ${meal.fats}g`,
        { indent: 6 }
      )
    })
  }

  doc.save(fileName)
}

async function exportXlsx(input: ReportExportInput, filteredMeals: MealHistoryItem[], totals: NutritionTotals) {
  const XLSX = await import("xlsx")
  const workbook = XLSX.utils.book_new()
  const fileName = buildFilename(input.title, input.days, "xlsx")

  const summaryRows = [
    ["Report Title", input.title],
    ["Period", `Last ${input.days} days`],
    ["Exported On", formatDate(new Date())],
    ["Phone", input.phone],
    ["Meals Logged", filteredMeals.length],
    ["Calories", totals.calories],
    ["Protein (g)", Number(totals.protein.toFixed(1))],
    ["Carbs (g)", Number(totals.carbs.toFixed(1))],
    ["Fats (g)", Number(totals.fats.toFixed(1))],
    ["Age", input.profile?.age ?? "Not set"],
    ["Height (cm)", input.profile?.height ?? "Not set"],
    ["Weight (kg)", input.profile?.weight ?? "Not set"],
  ]

  const mealRows = filteredMeals.map((meal) => ({
    Date: formatDate(meal.date),
    Meal: meal.mealName,
    Calories: meal.calories,
    Protein: meal.protein,
    Carbs: meal.carbs,
    Fats: meal.fats,
  }))

  const summarySheet = XLSX.utils.aoa_to_sheet(summaryRows)
  const mealsSheet = XLSX.utils.json_to_sheet(
    mealRows.length > 0
      ? mealRows
      : [{ Date: "", Meal: "No meals logged for this period", Calories: "", Protein: "", Carbs: "", Fats: "" }]
  )

  XLSX.utils.book_append_sheet(workbook, summarySheet, "Summary")
  XLSX.utils.book_append_sheet(workbook, mealsSheet, "Meals")
  XLSX.writeFile(workbook, fileName)
}

export async function exportNutritionReport(input: ReportExportInput) {
  const filteredMeals = filterMealsByDays(input.meals, input.days)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  const totals = calculateTotals(filteredMeals)

  if (input.fileType === "pdf") {
    await exportPdf(input, filteredMeals, totals)
    return
  }

  await exportXlsx(input, filteredMeals, totals)
}
