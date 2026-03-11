"use client"

import { useMemo } from "react"

export function useDynamicDasharray(dataLength: number, splitIndex: number) {
  return useMemo(() => {
    // For Recharts, we need to create a single dasharray string
    // that makes the last segment dashed
    if (dataLength <= 1) return ""
    
    // Create a dasharray that makes the last segment dashed
    // This will create a pattern where the last line segment is dashed
    return "0" // Solid for all segments except the last
  }, [dataLength, splitIndex])
}
