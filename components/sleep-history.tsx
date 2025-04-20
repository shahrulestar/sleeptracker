import { format, parseISO } from "date-fns"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Calendar, Clock, Moon, Bed } from "lucide-react"

interface SleepEntry {
  id: string
  date: string
  sleepTime: string
  wakeTime: string
  duration: number
}

interface SleepHistoryProps {
  sleepHistory: SleepEntry[]
}

export function SleepHistory({ sleepHistory }: SleepHistoryProps) {
  // Format duration for display
  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return `${hours}h ${mins}m`
  }

  // Sort entries by date (newest first)
  const sortedHistory = [...sleepHistory].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  return (
    <div className="overflow-x-auto">
      {sleepHistory.length === 0 ? (
        <p className="text-[#D3D3D3] text-center py-4">No sleep data recorded yet.</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="font-semibold text-[#353839]">
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 text-gray-300 mr-2 opacity-0 animate-fade-in" />
                  Date
                </div>
              </TableHead>
              <TableHead className="font-semibold text-[#353839]">
                <div className="flex items-center">
                  <Moon className="w-4 h-4 text-gray-300 mr-2 opacity-0 animate-fade-in" />
                  Sleep Time
                </div>
              </TableHead>
              <TableHead className="font-semibold text-[#353839]">
                <div className="flex items-center">
                  <Clock className="w-4 h-4 text-gray-300 mr-2 opacity-0 animate-fade-in" />
                  Wake Time
                </div>
              </TableHead>
              <TableHead className="font-semibold text-[#353839]">
                <div className="flex items-center">
                  <Bed className="w-4 h-4 text-gray-300 mr-2 opacity-0 animate-fade-in" />
                  Duration
                </div>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedHistory.map((entry) => (
              <TableRow key={entry.id}>
                <TableCell className="text-[#353839]">{format(parseISO(entry.date), "MMM dd, yyyy")}</TableCell>
                <TableCell className="text-[#353839]">{entry.sleepTime}</TableCell>
                <TableCell className="text-[#353839]">{entry.wakeTime}</TableCell>
                <TableCell className="text-[#353839]">{formatDuration(entry.duration)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  )
}
