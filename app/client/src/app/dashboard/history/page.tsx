"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Flame, Activity, Calendar } from "lucide-react"

export default function MealHistoryPage() {
  const history = [
    { id: 1, date: "2026-03-11", meal: "Paneer Butter Masala", calories: 650, protein: "24g" },
    { id: 2, date: "2026-03-11", meal: "2 Rotis", calories: 240, protein: "6g" },
    { id: 3, date: "2026-03-10", meal: "Chicken Rice Bowl", calories: 520, protein: "32g" },
    { id: 4, date: "2026-03-10", meal: "Oatmeal with Berries", calories: 320, protein: "12g" },
    { id: 5, date: "2026-03-09", meal: "Grilled Salmon & Veggies", calories: 450, protein: "40g" },
  ]

  return (
    <div className="flex flex-col w-full animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="flex flex-col gap-1.5">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Meal History</h1>
          <p className="text-muted-foreground">Review your past meals and nutritional intake.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-900 rounded-full h-9">
            Today
          </Button>
          <Button variant="ghost" className="rounded-full h-9 text-muted-foreground hover:bg-neutral-100 dark:hover:bg-neutral-900">
            Last 7 Days
          </Button>
          <Button variant="ghost" className="rounded-full h-9 text-muted-foreground hover:bg-neutral-100 dark:hover:bg-neutral-900">
            Last 30 Days
          </Button>
        </div>
      </div>

      <Card className="hover:shadow-md transition-shadow overflow-hidden border-border/50">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-muted-foreground uppercase bg-neutral-50 dark:bg-neutral-900 border-b border-border/50">
                <tr>
                  <th className="px-6 py-4 font-semibold tracking-wider">Date</th>
                  <th className="px-6 py-4 font-semibold tracking-wider">Meal</th>
                  <th className="px-6 py-4 font-semibold tracking-wider text-right">Calories</th>
                  <th className="px-6 py-4 font-semibold tracking-wider text-right">Protein</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {history.map((item) => (
                  <tr key={item.id} className="bg-white dark:bg-zinc-950 hover:bg-neutral-50 dark:hover:bg-neutral-900/40 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="size-3" />
                        <span>{item.date}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="font-medium text-foreground text-sm">{item.meal}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex justify-end items-center gap-1.5 font-semibold text-foreground">
                        {item.calories} <Flame className="size-3 text-muted-foreground" />
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                        {item.protein} <Activity className="size-3" />
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
      
      <div className="flex justify-center mt-4">
        <Button variant="outline" className="w-full sm:w-auto h-10 px-8 rounded-full">
          Load More Data
        </Button>
      </div>

    </div>
  )
}
