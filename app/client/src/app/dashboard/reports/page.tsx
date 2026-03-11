"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"
import { reportsData } from "@/data/dashboardData"

export default function ReportsPage() {
  return (
    <div className="flex flex-col w-full animate-in fade-in duration-500">
      <div className="flex flex-col gap-1.5 mb-6">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Reports</h1>
        <p className="text-muted-foreground">Export your health and nutrition data.</p>
      </div>

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
                  <span className="font-medium">{report.format}</span>
                </div>
                <div className="flex justify-between text-sm py-2 border-b">
                  <span className="text-muted-foreground">Period</span>
                  <span className="font-medium">{report.period}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className={report.buttonClass}>
                <Download className="mr-2 size-4" /> {report.buttonLabel}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
      </div>
    </div>
  )
}
