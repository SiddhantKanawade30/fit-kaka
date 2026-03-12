"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Activity, Flame, Sparkles, Clock } from "lucide-react"
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
import { dashboardStats, weeklyData, macroData, todayMeals } from "@/data/dashboardData"
import { fetchMealHistory, getStoredPhone } from "@/lib/api"

export default function DashboardPage() {
	const [stats, setStats] = useState(dashboardStats)
	const [weekly, setWeekly] = useState(weeklyData)
	const [meals, setMeals] = useState(todayMeals)
	const [macros, setMacros] = useState(macroData.map((m) => ({ ...m, value: 0, amount: 0 })))

	useEffect(() => {
		const phone = getStoredPhone()
		if (!phone) return
		fetchMealHistory(phone)
			.then((data) => {
				if (data.length === 0) return

				const mealDateKey = (input: string | Date) =>
					typeof input === "string" ? input.split("T")[0] : input.toISOString().split("T")[0]
				const now = new Date()
				const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`
				const todayData = data.filter((m) => mealDateKey(m.date) === todayStr)
				const latestDate = mealDateKey(data[0].date)
				const displayDayData = todayData.length > 0
					? todayData
					: data.filter((m) => mealDateKey(m.date) === latestDate)

				// Today's meals timeline
				const mealTypes = ["Breakfast", "Lunch", "Snack", "Dinner"]
				if (displayDayData.length > 0) {
					setMeals(
						displayDayData.map((m, idx) => ({
							id: idx + 1,
							type: mealTypes[idx % mealTypes.length],
							name: m.mealName,
							calories: Math.round(m.calories),
							protein: `${Math.round(m.protein)}g`,
							time: new Date(m.date).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
						}))
					)
				}

				// Weekly calorie trend (last 7 days)
				const dayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
				const last7: Record<string, number> = {}
				for (let i = 6; i >= 0; i--) {
					const d = new Date()
					d.setDate(d.getDate() - i)
					last7[mealDateKey(d)] = 0
				}
				data.forEach((m) => {
					const key = mealDateKey(m.date)
					if (key in last7) last7[key] += m.calories
				})
				setWeekly(
					Object.entries(last7).map(([dateStr, cals]) => ({
						day: dayLabels[new Date(`${dateStr}T00:00:00Z`).getUTCDay()],
						calories: Math.round(cals),
					}))
				)

				// Macro distribution from displayed day meals
				const macroSource = displayDayData

				const macroTotals = macroSource.reduce(
					(acc, m) => {
						acc.protein += Number(m.protein) || 0
						acc.carbs += Number(m.carbs) || 0
						acc.fats += Number(m.fats) || 0
						return acc
					},
					{ protein: 0, carbs: 0, fats: 0 }
				)

				const proteinCalories = macroTotals.protein * 4
				const carbsCalories = macroTotals.carbs * 4
				const fatsCalories = macroTotals.fats * 9
				const totalMacroCalories = proteinCalories + carbsCalories + fatsCalories

				if (totalMacroCalories > 0) {
					const proteinPct = Math.round((proteinCalories / totalMacroCalories) * 100)
					const carbsPct = Math.round((carbsCalories / totalMacroCalories) * 100)
					const fatsPct = Math.max(0, 100 - proteinPct - carbsPct)

					setMacros([
						{ name: "Protein", value: proteinPct, color: "#16a34a", amount: Math.round(macroTotals.protein) },
						{ name: "Carbs", value: carbsPct, color: "#22c55e", amount: Math.round(macroTotals.carbs) },
						{ name: "Fat", value: fatsPct, color: "#86efac", amount: Math.round(macroTotals.fats) },
					])
				}

				// Update top stat cards with displayed day totals
				const totalCals = displayDayData.reduce((sum, m) => sum + m.calories, 0)
				const totalProtein = displayDayData.reduce((sum, m) => sum + m.protein, 0)
				const totalCarbs = displayDayData.reduce((sum, m) => sum + (Number(m.carbs) || 0), 0)
				setStats((prev) =>
					prev.map((s, idx) => {
						if (idx === 0)
							return {
								...s,
								value: String(Math.round(totalCals)),
								progressValue: Math.min(100, Math.round((totalCals / 2200) * 100)),
							}
						if (idx === 1)
							return {
								...s,
								value: `${Math.round(totalProtein)}g`,
								progressValue: Math.min(100, Math.round((totalProtein / 120) * 100)),
							}
						if (idx === 2)
							return {
								...s,
								value: `${Math.round(totalCarbs)}g`,
								progressValue: Math.min(100, Math.round((totalCarbs / 250) * 100)),
							}
						return s
					})
				)
			})
			.catch(() => {})
	}, [])

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
				{stats.map((stat, idx) => (
					<Card key={idx} className={`hover:shadow-md transition-shadow ${idx === 0 ? 'border-green-100 dark:border-green-900/50' : ''}`}>
						<CardContent className="p-6">
							<div className="flex items-center justify-between space-y-0 pb-2">
								<p className="text-sm font-medium leading-none">{stat.title}</p>
								<div className={`p-2 rounded-full ${stat.bgClass}`}>
									<stat.icon className={`size-4 ${stat.color}`} />
								</div>
							</div>
							<div className="flex items-baseline space-x-2">
								<h2 className={`text-3xl font-bold tracking-tight ${stat.title === 'Nutrition Score' ? 'text-green-600 dark:text-green-400' : ''}`}>{stat.value}</h2>
								<span className="text-sm text-muted-foreground">/ {stat.target}</span>
							</div>
							<div className="mt-4 h-2 w-full bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
								<div className={`h-full rounded-full ${stat.progressClass}`} style={{ width: `${stat.progressValue}%` }} />
							</div>
						</CardContent>
					</Card>
				))}
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
							<LineChart data={weekly} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
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
									data={macros}
									cx="50%"
									cy="50%"
									innerRadius={60}
									outerRadius={90}
									paddingAngle={5}
									dataKey="value"
									stroke="none"
								>
									{macros.map((entry, index) => (
										<Cell key={`cell-${index}`} fill={entry.color} />
									))}
								</Pie>
								<Tooltip 
									formatter={(_value, _name, item) => [String(item?.payload?.amount ?? 0), item?.payload?.name ?? "Macro"]}
									contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
								/>
							</PieChart>
						</ResponsiveContainer>
            
						<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none mt-[-10px]">
							<span className="text-2xl font-bold tracking-tight block leading-none">100%</span>
							<span className="text-xs text-muted-foreground uppercase tracking-wider">Target</span>
						</div>

						<div className="flex justify-center gap-6 mt-2">
							{macros.map((macro, idx) => (
								<div key={idx} className="flex items-center gap-2">
									<div className="w-3 h-3 rounded-full" style={{ backgroundColor: macro.color }} />
									<span className="text-sm font-medium text-muted-foreground">{macro.name} {macro.value}%</span>
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
							{meals.length === 0 ? (
								<div className="p-4 text-sm text-muted-foreground">
									No meals logged for today yet.
								</div>
							) : (
								meals.map((meal) => (
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
								))
							)}
						</div>
					</CardContent>
				</Card>

				{/* AI Tip of the Day */}
				<Card className="bg-linear-to-br from-green-50 to-emerald-100/50 dark:from-green-950/30 dark:to-emerald-900/20 border-green-200 dark:border-green-800 hover:shadow-md transition-shadow">
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
