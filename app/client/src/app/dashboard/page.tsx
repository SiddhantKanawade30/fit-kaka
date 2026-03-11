"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Activity, Droplets, Flame, Sparkles, Clock } from "lucide-react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts"

const weeklyData = [
  { day: "Mon", calories: 2100 },
  { day: "Tue", calories: 1950 },
  { day: "Wed", calories: 2200 },
  { day: "Thu", calories: 1800 },
  { day: "Fri", calories: 2300 },
  { day: "Sat", calories: 2500 },
  { day: "Sun", calories: 2000 },
]

const macroData = [
  { name: "Protein", value: 30, color: "#16a34a" },
  { name: "Carbs", value: 45, color: "#22c55e" },
  { name: "Fat", value: 25, color: "#86efac" },
]

const meals = [
  { id: 1, type: "Breakfast", name: "Oatmeal with Berries", calories: 320, protein: "12g", time: "8:42 AM" },
  { id: 2, type: "Lunch", name: "Chicken Rice Bowl", calories: 520, protein: "32g", time: "1:15 PM" },
  { id: 3, type: "Snack", name: "Apple & Peanut Butter", calories: 220, protein: "6g", time: "4:05 PM" },
  { id: 4, type: "Dinner", name: "Paneer Butter Masala with 2 Rotis", calories: 650, protein: "24g", time: "8:10 PM" },
]

export default function DashboardPage() {
  return (
    <div className="flex flex-col w-full animate-in fade-in duration-500">
      {/* Title Section */}
      <div className="flex flex-col gap-1.5 mb-6">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back! Here's your health & nutrition summary for today.</p>
      </div>

      <div className="flex flex-col gap-6">
      {/* Top Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="hover:shadow-md transition-shadow border-green-100 dark:border-green-900/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between space-y-0 pb-2">
              <p className="text-sm font-medium leading-none">Calories Consumed</p>
              <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-full">
                <Flame className="size-4 text-green-600 dark:text-green-400" />
              </div>
            </div>
            <div className="flex items-baseline space-x-2">
              <h2 className="text-3xl font-bold tracking-tight">1650</h2>
              <span className="text-sm text-muted-foreground">/ 2200 kcal</span>
            </div>
            <div className="mt-4 h-2 w-full bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
              <div className="h-full bg-green-500 w-[75%] rounded-full" />
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between space-y-0 pb-2">
              <p className="text-sm font-medium leading-none">Protein Intake</p>
              <div className="p-2 bg-neutral-100 dark:bg-neutral-800 rounded-full">
                <Activity className="size-4 text-foreground" />
              </div>
            </div>
            <div className="flex items-baseline space-x-2">
              <h2 className="text-3xl font-bold tracking-tight">80g</h2>
              <span className="text-sm text-muted-foreground">/ 120g</span>
            </div>
            <div className="mt-4 h-2 w-full bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
              <div className="h-full bg-blue-500 w-[66%] rounded-full" />
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between space-y-0 pb-2">
              <p className="text-sm font-medium leading-none">Water Intake</p>
              <div className="p-2 bg-neutral-100 dark:bg-neutral-800 rounded-full">
                <Droplets className="size-4 text-blue-500" />
              </div>
            </div>
            <div className="flex items-baseline space-x-2">
              <h2 className="text-3xl font-bold tracking-tight">5</h2>
              <span className="text-sm text-muted-foreground">/ 8 glasses</span>
            </div>
            <div className="mt-4 h-2 w-full bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
              <div className="h-full bg-cyan-500 w-[62%] rounded-full" />
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between space-y-0 pb-2">
              <p className="text-sm font-medium leading-none">Nutrition Score</p>
              <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-full">
                <Activity className="size-4 text-green-600 dark:text-green-400" />
              </div>
            </div>
            <div className="flex items-baseline space-x-2">
              <h2 className="text-3xl font-bold tracking-tight text-green-600 dark:text-green-400">78</h2>
              <span className="text-sm text-muted-foreground">/ 100</span>
            </div>
            <div className="mt-4 h-2 w-full bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
              <div className="h-full bg-green-500 w-[78%] rounded-full" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Charts Area */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        
        {/* Weekly Calorie Trend */}
        <Card className="lg:col-span-4 shrink-0 hover:shadow-md transition-shadow flex flex-col">
          <CardHeader>
            <CardTitle>Weekly Calorie Trend</CardTitle>
            <CardDescription>Your daily caloric intake over the last 7 days.</CardDescription>
          </CardHeader>
          <CardContent className="pl-0 pb-2 flex-1 min-h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={weeklyData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e5e5" />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#888888' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#888888' }} />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  cursor={{ stroke: '#e5e5e5', strokeWidth: 2 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="calories" 
                  stroke="#16a34a" 
                  strokeWidth={3}
                  dot={{ r: 4, fill: '#16a34a', strokeWidth: 2, stroke: '#fff' }}
                  activeDot={{ r: 6, fill: '#16a34a', strokeWidth: 0 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Daily Nutrition Chart */}
        <Card className="lg:col-span-3 shrink-0 hover:shadow-md transition-shadow flex flex-col">
          <CardHeader>
            <CardTitle>Macro Distribution</CardTitle>
            <CardDescription>Your daily protein, carbs, and fat split.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center flex-1 min-h-[300px] relative pb-6">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={macroData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {macroData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
              </PieChart>
            </ResponsiveContainer>
            
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none mt-[-10px]">
              <span className="text-2xl font-bold tracking-tight block leading-none">100%</span>
              <span className="text-xs text-muted-foreground uppercase tracking-wider">Target</span>
            </div>

            <div className="flex justify-center gap-6 mt-2">
              {macroData.map((macro, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: macro.color }} />
                  <span className="text-sm font-medium text-muted-foreground">{macro.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

      </div>

      {/* Meals Timeline & AI Tip */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        
        {/* Today's Meals Timeline */}
        <Card className="lg:col-span-2 hover:shadow-md transition-shadow overflow-hidden">
          <CardHeader className="bg-neutral-50/50 dark:bg-neutral-900/20 border-b border-border/40 pb-4">
            <CardTitle>Today's Meals</CardTitle>
            <CardDescription>What you've eaten so far today.</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-border/50">
              {meals.map((meal) => (
                <div key={meal.id} className="flex gap-4 p-4 hover:bg-neutral-50 dark:hover:bg-neutral-900/50 transition-colors">
                  <div className="flex flex-col flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-0.5">
                      <p className="text-xs font-semibold text-green-600 dark:text-green-500 uppercase tracking-wider">{meal.type}</p>
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium bg-neutral-100 dark:bg-neutral-800 px-2 py-1 rounded-md">
                        <Clock className="size-3" />
                        <span>{meal.time}</span>
                      </div>
                    </div>
                    <p className="text-sm font-medium truncate">{meal.name}</p>
                    <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Flame className="size-3" /> {meal.calories} kcal
                      </span>
                      <span className="flex items-center gap-1">
                        <Activity className="size-3" /> Protein: {meal.protein}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* AI Tip of the Day */}
        <Card className="bg-gradient-to-br from-green-50 to-emerald-100/50 dark:from-green-950/30 dark:to-emerald-900/20 border-green-200 dark:border-green-800 hover:shadow-md transition-shadow">
          <CardHeader>
            <div className="flex items-center gap-2 text-green-700 dark:text-green-400 mb-1">
              <Sparkles className="size-5" />
              <CardTitle className="text-green-800 dark:text-green-300">AI Tip of the Day</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-green-900/80 dark:text-green-100/80 leading-relaxed text-sm">
              "You are slightly low on protein today. Consider adding eggs, tofu, or a serving of chicken for dinner to hit your 120g target and maintain muscle synthesis."
            </p>
            <div className="mt-6">
              <button className="text-sm font-medium text-green-700 dark:text-green-400 bg-green-200/50 dark:bg-green-800/30 px-4 py-2 rounded-lg hover:bg-green-200 dark:hover:bg-green-800/50 transition-colors">
                View more insights
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
      </div>
    </div>
  )
}
