"use client"

import { useEffect, useState } from "react"
import { format, parseISO, subDays } from "date-fns"
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"

interface SleepEntry {
  id: string
  date: string
  sleepTime: string
  wakeTime: string
  duration: number
}

interface SleepChartProps {
  sleepHistory: SleepEntry[]
}

export function SleepChart({ sleepHistory }: SleepChartProps) {
  const [chartData, setChartData] = useState<any[]>([])

  useEffect(() => {
    // Generate data for the last 7 days
    const generateChartData = () => {
      try {
        const today = new Date()
        const last7Days = Array.from({ length: 7 }, (_, i) => {
          const date = subDays(today, i)
          return format(date, "yyyy-MM-dd")
        }).reverse()

        // Create a map of dates to durations
        const durationMap: Record<string, number> = {}
        sleepHistory.forEach((entry) => {
          if (entry.date && entry.duration) {
            durationMap[entry.date] = entry.duration / 60 // Convert to hours
          }
        })

        // Create chart data with all 7 days
        const data = last7Days.map((date) => {
          return {
            date,
            hours: durationMap[date] ? Number(durationMap[date].toFixed(1)) : 0,
            label: format(parseISO(date), "MMM dd"),
          }
        })

        setChartData(data)
      } catch (error) {
        console.error("Error generating chart data:", error)
        setChartData([])
      }
    }

    generateChartData()
  }, [sleepHistory])

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      try {
        return (
          <div className="bg-white p-2 border border-[#E7E7E7] shadow-sm rounded">
            <p className="text-[#353839] font-semibold">{format(parseISO(label), "MMM dd, yyyy")}</p>
            <p className="text-[#353839]">{payload[0].value} hours</p>
          </div>
        )
      } catch (error) {
        return null
      }
    }
    return null
  }

  return (
    <div className="h-[200px] w-full">
      {chartData.length > 0 ? (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <XAxis
              dataKey="label"
              tick={{ fill: "#353839", fontSize: 12 }}
              axisLine={{ stroke: "#E7E7E7" }}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: "#353839", fontSize: 12 }}
              axisLine={{ stroke: "#E7E7E7" }}
              tickLine={false}
              domain={[0, 12]}
              label={{
                value: "Hours",
                angle: -90,
                position: "insideLeft",
                style: { textAnchor: "middle", fill: "#D3D3D3" },
              }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="hours" fill="#9DB2BF" radius={[4, 4, 0, 0]} animationDuration={1000} />
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <div className="h-full flex items-center justify-center py-10">
          <p className="text-[#D3D3D3]">No sleep data available for chart</p>
        </div>
      )}
    </div>
  )
}
