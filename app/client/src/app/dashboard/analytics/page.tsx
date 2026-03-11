"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import { Activity } from "lucide-react"

const weeklyData = [
  { day: "Week 1", calories: 15400 },
  { day: "Week 2", calories: 14800 },
  { day: "Week 3", calories: 15900 },
  { day: "Week 4", calories: 15100 }
]

const macroData = [
  { name: "Protein", value: 32, color: "#16a34a" },
  { name: "Carbs", value: 48, color: "#22c55e" },
  { name: "Fat", value: 20, color: "#86efac" },
]

export default function AnalyticsPage() {
  return (
    <div className="flex flex-col w-full animate-in fade-in duration-500">
      <div className="flex flex-col gap-1.5 mb-6">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Nutrition Analytics</h1>
        <p className="text-muted-foreground">Detailed insights into your dietary habits and progress.</p>
      </div>
      
      <div className="flex flex-col gap-6">

      {/* Main Score & Summary */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="hover:shadow-md transition-shadow bg-green-600 dark:bg-green-700 text-white border-none shadow-sm md:col-span-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-green-50">Meal Consistency Score</CardTitle>
            <CardDescription className="text-green-100/70">Based on last 30 days of logging.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center p-6 gap-2">
              <div className="relative flex items-center justify-center">
                <svg className="w-32 h-32 transform -rotate-90">
                  <circle cx="64" cy="64" r="56" fill="transparent" stroke="rgba(255,255,255,0.2)" strokeWidth="12" />
                  <circle cx="64" cy="64" r="56" fill="transparent" stroke="white" strokeWidth="12" strokeDasharray="351" strokeDashoffset={351 - (351 * 82) / 100} className="transition-all duration-1000 ease-out" />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center flex-col">
                  <span className="text-4xl font-bold tracking-tighter">82</span>
                  <span className="text-xs font-medium text-green-100">/ 100</span>
                </div>
              </div>
              <p className="text-sm text-center font-medium mt-4 bg-white/20 px-4 py-1.5 rounded-full inline-flex items-center gap-2">
                <Activity className="size-4" /> Great Consistency!
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Macro Distribution Pie Chart */}
        <Card className="hover:shadow-md transition-shadow md:col-span-2">
          <CardHeader>
            <CardTitle>Macro Distribution</CardTitle>
            <CardDescription>Your 30-day average protein, carbs, and fat breakdown.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col lg:flex-row items-center justify-center min-h-[250px] gap-8">
            <div className="w-full h-[250px] lg:w-1/2">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={macroData}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                  >
                    {macroData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            <div className="w-full lg:w-1/2 flex flex-col gap-4 px-4">
              {macroData.map((macro, idx) => (
                <div key={idx} className="flex flex-col gap-1">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full shadow-sm" style={{ backgroundColor: macro.color }} />
                      <span className="font-medium text-foreground">{macro.name}</span>
                    </div>
                    <span className="font-bold">{macro.value}%</span>
                  </div>
                  <div className="h-2 w-full bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${macro.value}%`, backgroundColor: macro.color }} />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Weekly Calorie Intake Line Chart */}
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader>
          <CardTitle>Weekly Calorie Intake</CardTitle>
          <CardDescription>Calorie accumulation per week over the last month.</CardDescription>
        </CardHeader>
        <CardContent className="h-[350px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={weeklyData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e5e5" />
              <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#888888', dy: 10 }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#888888' }} dx={-10} />
              <Tooltip 
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                cursor={{ stroke: '#e5e5e5', strokeWidth: 2 }}
                formatter={(value: number) => [`${value} kcal`, 'Calories']}
              />
              <Line 
                type="monotone" 
                dataKey="calories" 
                stroke="#16a34a" 
                strokeWidth={3}
                dot={{ r: 5, fill: '#16a34a', strokeWidth: 2, stroke: '#fff' }}
                activeDot={{ r: 8, fill: '#16a34a', strokeWidth: 0 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      </div>
    </div>
  )
}
