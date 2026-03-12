"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { healthProfileFields, calculatedTargets } from "@/data/dashboardData"
import { fetchBasicProfile, getStoredPhone } from "@/lib/api"

export default function ProfilePage() {
  const [profileKey, setProfileKey] = useState("default")
  const [fields, setFields] = useState(healthProfileFields)
  const [targets, setTargets] = useState(calculatedTargets)

  useEffect(() => {
    const phone = getStoredPhone()
    if (!phone) return
    fetchBasicProfile(phone)
      .then((profile) => {
        setFields(
          healthProfileFields.map((f) => {
            if (f.id === "age" && profile.age != null)
              return { ...f, defaultValue: String(profile.age) }
            if (f.id === "height" && profile.height != null)
              return { ...f, defaultValue: String(profile.height) }
            if (f.id === "weight" && profile.weight != null)
              return { ...f, defaultValue: String(profile.weight) }
            return f
          }) as typeof healthProfileFields
        )
        if (profile.weight != null && profile.height != null) {
          const heightM = profile.height / 100
          const bmi = profile.weight / (heightM * heightM)
          const age = profile.age ?? 28
          const bmr = 88.36 + 13.4 * profile.weight + 4.8 * profile.height - 5.7 * age
          const calories = Math.round(bmr * 1.55)
          const protein = Math.round(profile.weight * 1.6)
          const bmiCategory =
            bmi < 18.5 ? "Underweight" : bmi < 25 ? "Normal" : bmi < 30 ? "Overweight" : "Obese"
          setTargets([
            { title: "BMI", value: bmi.toFixed(1), unit: "", badge: bmiCategory },
            { title: "Recommended Daily Calories", value: calories.toLocaleString(), unit: "kcal/day" },
            { title: "Recommended Protein", value: String(protein), unit: "g/day", subtext: 'Based on target "Build Muscle"' },
          ])
        }
        setProfileKey("loaded")
      })
      .catch(() => {})
  }, [])

  return (
    <div className="flex flex-col w-full animate-in fade-in duration-500">
      <div className="flex flex-col gap-1.5 mb-6">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Health Profile</h1>
        <p className="text-muted-foreground">Manage your personal physiological details and goals.</p>
      </div>
      
      <div className="flex flex-col gap-6">

      <div className="grid gap-6 md:grid-cols-2">
        {/* Input Details */}
        <Card className="hover:shadow-md transition-shadow" key={profileKey}>
          <CardHeader>
            <CardTitle>Personal Details</CardTitle>
            <CardDescription>Update your metrics for accurate AI calculations.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {fields.map((field) => (
                <div key={field.id} className={`space-y-2 ${field.colSpan ? `col-span-${field.colSpan}` : ''}`}>
                  <label className="text-sm font-medium">{field.label}</label>
                  {field.type === 'input' ? (
                    <Input defaultValue={field.defaultValue} type={field.inputType} />
                  ) : (
                    <select className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring">
                      {field.options?.map((opt, i) => (
                        <option key={i} value={opt.value} selected={opt.selected}>{opt.label}</option>
                      ))}
                    </select>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full bg-green-600 hover:bg-green-700 text-white">Save Profile</Button>
          </CardFooter>
        </Card>

        {/* Calculated Metrics */}
        <Card className="bg-green-50/50 dark:bg-green-950/20 border-green-200 dark:border-green-900 border-2">
          <CardHeader>
            <CardTitle className="text-green-800 dark:text-green-400">Calculated Targets</CardTitle>
            <CardDescription>Auto-generated from your profile data.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {targets.map((target, idx) => (
              <div key={idx} className="p-4 bg-white dark:bg-zinc-950 rounded-xl border border-border shadow-sm flex justify-between items-center group hover:border-green-400 transition-colors">
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">{target.title}</p>
                  <p className="font-bold text-2xl text-foreground">
                    {target.value} <span className="text-sm text-muted-foreground font-normal">{target.unit}</span>
                    {target.badge && <span className="text-sm font-medium text-green-600 dark:text-green-500 bg-green-100 dark:bg-green-900/30 px-2 py-0.5 rounded-full ml-2 relative -top-1">{target.badge}</span>}
                  </p>
                  {target.subtext && <p className="text-xs text-muted-foreground mt-1">{target.subtext}</p>}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
      </div>
    </div>
  )
}
