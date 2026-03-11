"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, FileSpreadsheet, Download } from "lucide-react"

export default function ReportsPage() {
  return (
    <div className="flex flex-col w-full animate-in fade-in duration-500">
      <div className="flex flex-col gap-1.5 mb-6">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Reports</h1>
        <p className="text-muted-foreground">Export your health and nutrition data.</p>
      </div>

      <div className="flex flex-col gap-6">
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="hover:shadow-md transition-shadow group flex flex-col">
          <CardHeader>
            <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-xl w-fit mb-2">
              <FileText className="size-6 text-red-600 dark:text-red-400" />
            </div>
            <CardTitle>Weekly Nutrition Report</CardTitle>
            <CardDescription>Detailed PDF summarizing daily logs, macro distribution, and insights.</CardDescription>
          </CardHeader>
          <CardContent className="flex-1">
            <div className="space-y-4">
              <div className="flex justify-between text-sm py-2 border-b">
                <span className="text-muted-foreground">Format</span>
                <span className="font-medium">PDF Document</span>
              </div>
              <div className="flex justify-between text-sm py-2 border-b">
                <span className="text-muted-foreground">Period</span>
                <span className="font-medium">Last 7 Days</span>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full bg-red-600 hover:bg-red-700 text-white dark:bg-red-950/20 dark:hover:bg-red-950/40 dark:text-red-400 transition-colors duration-300">
              <Download className="mr-2 size-4" /> Download PDF
            </Button>
          </CardFooter>
        </Card>

        <Card className="hover:shadow-md transition-shadow group flex flex-col">
          <CardHeader>
            <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-xl w-fit mb-2">
              <FileSpreadsheet className="size-6 text-green-600 dark:text-green-400" />
            </div>
            <CardTitle>Monthly Health Report</CardTitle>
            <CardDescription>Raw tabular Excel data for custom analysis and sharing with doctors.</CardDescription>
          </CardHeader>
          <CardContent className="flex-1">
            <div className="space-y-4">
              <div className="flex justify-between text-sm py-2 border-b">
                <span className="text-muted-foreground">Format</span>
                <span className="font-medium">Excel (.xlsx)</span>
              </div>
              <div className="flex justify-between text-sm py-2 border-b">
                <span className="text-muted-foreground">Period</span>
                <span className="font-medium">Last 30 Days</span>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full bg-green-600 hover:bg-green-700 text-white dark:bg-green-950/20 dark:hover:bg-green-950/40 dark:text-green-400 transition-colors duration-300">
              <Download className="mr-2 size-4" /> Export Excel
            </Button>
          </CardFooter>
        </Card>
      </div>
      </div>
    </div>
  )
}
