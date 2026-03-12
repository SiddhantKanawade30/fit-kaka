"use client"

import { useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"

export default function DirectDashboardPage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const token = searchParams.get("token")
    const phone = searchParams.get("phone")

    if (!token || !phone) {
      router.replace("/login")
      return
    }

    try {
      localStorage.setItem("fitkaka_token", token)
      localStorage.setItem("fitkaka_phone", phone)
      router.replace("/dashboard")
    } catch {
      router.replace("/login")
    }
  }, [router, searchParams])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="text-center">
        <p className="text-lg font-semibold text-gray-800">Opening your dashboard...</p>
        <p className="text-sm text-gray-500 mt-2">Please wait a moment.</p>
      </div>
    </div>
  )
}
