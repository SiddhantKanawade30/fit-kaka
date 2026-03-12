"use client"

import { useMemo, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Download } from "lucide-react"
import { reportsData } from "@/data/dashboardData"
import { fetchBasicProfile, fetchMealHistory, getStoredPhone } from "@/lib/api"
import { exportNutritionReport, type ReportFileType } from "@/lib/reportExport"

export default function ReportsPage() {
  const [fileType, setFileType] = useState("pdf")
  const [loadingReport, setLoadingReport] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const formatLabel = useMemo(
    () => (fileType === "pdf" ? "PDF Document" : "Excel (.xlsx)"),
    [fileType]
  )

  const handleDownload = async (title: string, period: string) => {
    const phone = getStoredPhone()

    if (!phone) {
      setErrorMessage("Please log in again to download your reports.")
      return
    }

    setLoadingReport(title)
    setErrorMessage(null)

    try {
      const [meals, profile] = await Promise.all([
        fetchMealHistory(phone).catch(() => []),
        fetchBasicProfile(phone).catch(() => null),
      ])

      const days = period.includes("30") ? 30 : 7

      await exportNutritionReport({
        title,
        days,
        fileType: fileType as ReportFileType,
        phone,
        meals,
        profile,
      })
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Failed to download report.")
    } finally {
      setLoadingReport(null)
    }
  }

  return (
    <div className="flex flex-col w-full animate-in fade-in duration-500">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex flex-col gap-1.5">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Reports</h1>
          <p className="text-muted-foreground">Export your health and nutrition data.</p>
        </div>

        <div className="w-full sm:w-44">
          <Select value={fileType} onValueChange={setFileType}>
            <SelectTrigger className="w-full sm:ml-auto" aria-label="Select report file type">
              <SelectValue placeholder="Select format" />
            </SelectTrigger>
            <SelectContent align="end">
              <SelectItem value="pdf">PDF</SelectItem>
              <SelectItem value="xlsx">XLSX</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {errorMessage ? (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/20 dark:text-red-300">
          {errorMessage}
        </div>
      ) : null}

      <div className="flex flex-col gap-6">
      <div className="grid gap-6 md:grid-cols-2">
        {reportsData.map((report, idx) => (
          <Card key={idx} className="hover:shadow-md transition-shadow group flex flex-col">
            <CardHeader>
              <div className={`p-3 rounded-xl w-fit mb-2 ${report.iconBg}`}>
                <report.icon className={`size-6 ${report.iconColor}`} />
              </div>
              <CardTitle>{report.title}</CardTitle>
              <CardDescription>{report.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <div className="space-y-4">
                <div className="flex justify-between text-sm py-2 border-b">
                  <span className="text-muted-foreground">Format</span>
                  <span className="font-medium">{formatLabel}</span>
                </div>
                <div className="flex justify-between text-sm py-2 border-b">
                  <span className="text-muted-foreground">Period</span>
                  <span className="font-medium">{report.period}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                className={report.buttonClass}
                disabled={loadingReport === report.title}
                onClick={() => handleDownload(report.title, report.period)}
              >
                <Download className="mr-2 size-4" /> {loadingReport === report.title ? "Downloading..." : "Download"}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
      </div>
    </div>
  )
}
