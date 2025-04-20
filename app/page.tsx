"use client"

import { useEffect, useState } from "react"
import { format, differenceInMinutes } from "date-fns"
import { Calendar, Clock, Moon, Bed, BarChart3, History, Trash2 } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { DatePicker } from "@/components/date-picker"
import { SleepHistory } from "@/components/sleep-history"
import { SleepChart } from "@/components/sleep-chart"

// Define the sleep entry type
interface SleepEntry {
  id: string
  date: string
  sleepTime: string
  wakeTime: string
  duration: number
}

export default function SleepTracker() {
  // Use null initial state to prevent hydration mismatch
  const [date, setDate] = useState<Date | null>(null)
  const [sleepTime, setSleepTime] = useState<string>("22:00")
  const [wakeTime, setWakeTime] = useState<string>("06:00")
  const [duration, setDuration] = useState<number>(0)
  const [sleepHistory, setSleepHistory] = useState<SleepEntry[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  // Set the date after component mounts to avoid hydration mismatch
  useEffect(() => {
    setDate(new Date())
  }, [])

  // Calculate duration whenever sleep or wake time changes
  useEffect(() => {
    if (!date) return

    const calculateDuration = () => {
      try {
        const [sleepHour, sleepMinute] = sleepTime.split(":").map(Number)
        const [wakeHour, wakeMinute] = wakeTime.split(":").map(Number)

        // Create new Date objects to avoid mutating the original date
        const sleepDate = new Date(date.getTime())
        sleepDate.setHours(sleepHour, sleepMinute, 0, 0)

        const wakeDate = new Date(date.getTime())
        wakeDate.setHours(wakeHour, wakeMinute, 0, 0)

        // If wake time is earlier than sleep time, assume it's the next day
        if (wakeDate < sleepDate) {
          wakeDate.setDate(wakeDate.getDate() + 1)
        }

        const durationInMinutes = differenceInMinutes(wakeDate, sleepDate)
        setDuration(durationInMinutes)
      } catch (error) {
        console.error("Error calculating duration:", error)
        setDuration(0)
      }
    }

    calculateDuration()
  }, [sleepTime, wakeTime, date])

  // Load sleep history from localStorage on component mount
  useEffect(() => {
    const loadSleepHistory = () => {
      try {
        const history = JSON.parse(localStorage.getItem("sleepHistory") || "[]")
        setSleepHistory(history)
      } catch (error) {
        console.error("Error loading sleep history:", error)
        setSleepHistory([])
      } finally {
        setIsLoaded(true)
      }
    }

    loadSleepHistory()
  }, [])

  // Save sleep data to localStorage
  const saveSleepData = () => {
    if (!date) return

    try {
      const formattedDate = format(date, "yyyy-MM-dd")
      const newEntry: SleepEntry = {
        id: Date.now().toString(),
        date: formattedDate,
        sleepTime,
        wakeTime,
        duration,
      }

      const updatedHistory = [...sleepHistory, newEntry]
      setSleepHistory(updatedHistory)
      localStorage.setItem("sleepHistory", JSON.stringify(updatedHistory))
    } catch (error) {
      console.error("Error saving sleep data:", error)
    }
  }

  const resetSleepHistory = () => {
    if (window.confirm("Are you sure you want to delete all sleep history?")) {
      localStorage.removeItem("sleepHistory")
      setSleepHistory([])
    }
  }

  // Format duration for display
  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return `${hours} hours and ${mins} minutes`
  }

  // Don't render until client-side hydration is complete
  if (!isLoaded || !date) {
    return (
      <main className="min-h-screen bg-white font-sans py-12 px-4 md:px-8">
        <div className="max-w-3xl mx-auto">
          <p className="text-center text-[#D3D3D3]">Loading...</p>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-white font-sans py-12 px-4 md:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-semibold text-[#353839] mb-10 flex items-center">
          <Bed className="w-6 h-6 text-gray-300 mr-3 opacity-0 animate-fade-in" />
          Sleep Tracker
        </h1>

        <div className="grid grid-cols-1 gap-8">
          {/* Input Form */}
          <Card className="p-6 border border-[#E7E7E7]">
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex items-center">
                  <Calendar className="w-5 h-5 text-gray-300 mr-2 opacity-0 animate-fade-in" />
                  <Label htmlFor="date" className="font-semibold text-[#353839]">
                    Date
                  </Label>
                </div>
                <DatePicker date={date} setDate={setDate} />
              </div>

              <div className="space-y-2">
                <div className="flex items-center">
                  <Moon className="w-5 h-5 text-gray-300 mr-2 opacity-0 animate-fade-in" />
                  <Label htmlFor="sleepTime" className="font-semibold text-[#353839]">
                    Sleep Time
                  </Label>
                </div>
                <Input
                  id="sleepTime"
                  type="time"
                  value={sleepTime}
                  onChange={(e) => setSleepTime(e.target.value)}
                  className="border-[#E7E7E7]"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center">
                  <Clock className="w-5 h-5 text-gray-300 mr-2 opacity-0 animate-fade-in" />
                  <Label htmlFor="wakeTime" className="font-semibold text-[#353839]">
                    Wake Time
                  </Label>
                </div>
                <Input
                  id="wakeTime"
                  type="time"
                  value={wakeTime}
                  onChange={(e) => setWakeTime(e.target.value)}
                  className="border-[#E7E7E7]"
                />
              </div>

              <div className="pt-2">
                <div className="flex items-center mb-4">
                  <Bed className="w-5 h-5 text-gray-300 mr-2 opacity-0 animate-fade-in" />
                  <p className="text-[#353839]">
                    <span className="font-semibold">Sleep Duration:</span> {formatDuration(duration)}
                  </p>
                </div>
                <Button onClick={saveSleepData} className="w-full bg-[#353839] hover:bg-[#4a4d4e] text-white">
                  Save Entry
                </Button>
              </div>
            </div>
          </Card>

          {/* Chart */}
          <Card className="p-6 border border-[#E7E7E7]">
            <h2 className="text-xl font-semibold text-[#353839] mb-4 flex items-center">
              <BarChart3 className="w-5 h-5 text-gray-300 mr-2 opacity-0 animate-fade-in" />
              Sleep Duration (Last 7 Days)
            </h2>
            <SleepChart sleepHistory={sleepHistory} />
          </Card>

          {/* History */}
          <Card className="p-6 border border-[#E7E7E7]">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-[#353839] flex items-center">
                <History className="w-5 h-5 text-gray-300 mr-2 opacity-0 animate-fade-in" />
                Sleep History
              </h2>
              <Button
                onClick={resetSleepHistory}
                variant="destructive"
                size="sm"
                className="bg-red-500 hover:bg-red-600 text-white"
              >
                <Trash2 className="w-4 h-4 mr-2" /> Reset
              </Button>
            </div>
            <SleepHistory sleepHistory={sleepHistory} />
          </Card>
        </div>

        {/* Footer */}
        <footer className="mt-12 py-6 text-center text-[#D3D3D3] border-t border-[#E7E7E7]">
          Built with ChatGPT and v0.Dev by{" "}
          <a
            href="https://shahrulestar.com"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-[#353839] transition-colors"
          >
            shahrulestar.com
          </a>
        </footer>
      </div>
    </main>
  )
}
