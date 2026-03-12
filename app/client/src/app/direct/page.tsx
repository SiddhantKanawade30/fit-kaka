"use client"

import { useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"

export default function DirectDashboardPage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const token = searchParams.get("token")
    const phoneFromQuery = searchParams.get("phone")

    if (!token) {
      router.replace("/login")
      return
    }

    try {
      let phone = phoneFromQuery

      if (!phone) {
        const payloadPart = token.split(".")[1]
        if (payloadPart) {
          const normalized = payloadPart.replace(/-/g, "+").replace(/_/g, "/")
          const padded = normalized + "=".repeat((4 - (normalized.length % 4)) % 4)
          const decoded = JSON.parse(atob(padded)) as { phone?: string }
          phone = decoded.phone ?? null
        }
      }

      if (!phone) {
        router.replace("/login")
        return
      }

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
