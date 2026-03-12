import { 
  LayoutDashboard, 
  History, 
  PieChart, 
  User, 
  FileText,
  Flame,
  Activity,
  FileSpreadsheet
} from "lucide-react"

export const sidebarNavigation = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Meal History", url: "/dashboard/history", icon: History },
  { title: "Nutrition Analytics", url: "/dashboard/analytics", icon: PieChart },
  { title: "Health Profile", url: "/dashboard/profile", icon: User },
  { title: "Reports", url: "/dashboard/reports", icon: FileText },
]

export const dashboardStats = [
  {
    title: "Calories Consumed",
    value: "1650",
    target: "2200 kcal",
    unit: "",
    icon: Flame,
    color: "text-green-600 dark:text-green-400",
    bgClass: "bg-green-100 dark:bg-green-900/30",
    progressClass: "bg-green-500",
    progressValue: 75,
  },
  {
    title: "Protein Intake",
    value: "80g",
    target: "120g",
    unit: "",
    icon: Activity,
    color: "text-foreground",
    bgClass: "bg-neutral-100 dark:bg-neutral-800",
    progressClass: "bg-blue-500",
    progressValue: 66,
  },
  {
    title: "Daily Carbs",
    value: "0g",
    target: "250g",
    unit: "",
    icon: Activity,
    color: "text-foreground",
    bgClass: "bg-neutral-100 dark:bg-neutral-800",
    progressClass: "bg-emerald-500",
    progressValue: 0,
  },
  {
    title: "Nutrition Score",
    value: "78",
    target: "100",
    unit: "",
    icon: Activity,
    color: "text-green-600 dark:text-green-400",
    bgClass: "bg-green-100 dark:bg-green-900/30",
    progressClass: "bg-green-500",
    progressValue: 78,
  }
]

export const weeklyData = [
  { day: "Mon", calories: 2100 },
  { day: "Tue", calories: 1950 },
  { day: "Wed", calories: 2200 },
  { day: "Thu", calories: 1800 },
  { day: "Fri", calories: 2300 },
  { day: "Sat", calories: 2500 },
  { day: "Sun", calories: 2000 },
]

export const analyticsWeeklyData = [
  { day: "Week 1", calories: 15400 },
  { day: "Week 2", calories: 14800 },
  { day: "Week 3", calories: 15900 },
  { day: "Week 4", calories: 15100 }
]

export const macroData = [
  { name: "Protein", value: 30, color: "#16a34a" },
  { name: "Carbs", value: 45, color: "#22c55e" },
  { name: "Fat", value: 25, color: "#86efac" },
]

export const fullMealHistory = [
  { id: 1, date: "2026-03-11", meal: "Paneer Butter Masala", calories: 650, protein: "24g" },
  { id: 2, date: "2026-03-11", meal: "2 Rotis", calories: 240, protein: "6g" },
  { id: 3, date: "2026-03-10", meal: "Chicken Rice Bowl", calories: 520, protein: "32g" },
  { id: 4, date: "2026-03-10", meal: "Oatmeal with Berries", calories: 320, protein: "12g" },
  { id: 5, date: "2026-03-09", meal: "Grilled Salmon & Veggies", calories: 450, protein: "40g" },
]

export const todayMeals: Array<{ id: number; type: string; name: string; calories: number; protein: string; time: string }> = []

export const healthProfileFields = [
  { id: "age", label: "Age", type: "input", inputType: "number", defaultValue: "28" },
  { id: "height", label: "Height (cm)", type: "input", inputType: "number", defaultValue: "175" },
  { id: "weight", label: "Weight (kg)", type: "input", inputType: "number", defaultValue: "72" },
]

export const calculatedTargets = [
  { title: "BMI", value: "23.5", unit: "", badge: "Normal" },
  { title: "Recommended Daily Calories", value: "2,200", unit: "kcal/day" },
  { title: "Recommended Protein", value: "120", unit: "g/day", subtext: 'Based on target "Build Muscle"' }
]

export const reportsData = [
  {
    title: "Weekly Nutrition Report",
    description: "Detailed PDF summarizing daily logs, macro distribution, and insights.",
    format: "PDF Document",
    period: "Last 7 Days",
    icon: FileText,
    iconColor: "text-red-600 dark:text-red-400",
    iconBg: "bg-red-100 dark:bg-red-900/30",
    buttonLabel: "Download PDF",
    buttonClass: "w-full bg-red-600 hover:bg-red-700 text-white dark:bg-red-950/20 dark:hover:bg-red-950/40 dark:text-red-400 transition-colors duration-300"
  },
  {
    title: "Monthly Health Report",
    description: "Raw tabular Excel data for custom analysis and sharing with doctors.",
    format: "Excel (.xlsx)",
    period: "Last 30 Days",
    icon: FileSpreadsheet,
    iconColor: "text-green-600 dark:text-green-400",
    iconBg: "bg-green-100 dark:bg-green-900/30",
    buttonLabel: "Export Excel",
    buttonClass: "w-full bg-green-600 hover:bg-green-700 text-white dark:bg-green-950/20 dark:hover:bg-green-950/40 dark:text-green-400 transition-colors duration-300"
  }
]
