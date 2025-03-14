"use client"
import { useState, useEffect, useMemo } from "react"
import { CalendarHeader } from "@/components/ui/calendar-header"
import { ScheduleBlock } from "@/components/ui/schedule-block"
import { ScheduleModal } from "@/components/schedule/schedule-modal"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"

interface ScheduleViewProps {
  view: "rooms" | "faculty" | "sections"
}

// Helper function to convert time string to minutes since midnight
function timeToMinutes(timeStr: string): number {
  const [time, period] = timeStr.split(" ")
  let [hours, minutes] = time.split(":").map(Number)

  if (period === "PM" && hours !== 12) {
    hours += 12
  } else if (period === "AM" && hours === 12) {
    hours = 0
  }

  return hours * 60 + minutes
}

export function ScheduleView({ view }: ScheduleViewProps) {
  const [selectedAcademicYear, setSelectedAcademicYear] = useState<string>("")
  const [filteredSchedule, setFilteredSchedule] = useState<any[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedSchedule, setSelectedSchedule] = useState<any>(null)
  const [schedules, setSchedules] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [allSchedules, setAllSchedules] = useState<any[]>([]) // Store all schedules

  const viewTitles = {
    rooms: "Rooms",
    faculty: "Faculty",
    sections: "Sections",
  }

  // Extract unique academic years from ALL schedules data
  const uniqueAcademicYears = useMemo(() => {
    const years = new Set<string>()
    allSchedules.forEach((item) => {
      if (item.academicYear) {
        years.add(item.academicYear)
      }
    })
    return Array.from(years)
  }, [allSchedules])

  // Set initial academic year
  useEffect(() => {
    if (uniqueAcademicYears.length > 0 && !selectedAcademicYear) {
      setSelectedAcademicYear(uniqueAcademicYears[0])
    } else if (uniqueAcademicYears.length === 0 && !isLoading) {
      // If there are no academic years after loading, set a default
      setSelectedAcademicYear("2024-2025")
    }
  }, [uniqueAcademicYears, selectedAcademicYear, isLoading])

  // Filter schedule data when academic year changes
  useEffect(() => {
    if (selectedAcademicYear && allSchedules.length > 0) {
      const filtered = allSchedules.filter((item) => item.academicYear === selectedAcademicYear)
      setFilteredSchedule(filtered)
      setSchedules(filtered) // Update the schedules state for rendering
    } else {
      setFilteredSchedule(allSchedules)
      setSchedules(allSchedules)
    }
  }, [selectedAcademicYear, allSchedules])

  // Fetch ALL schedules from API (without filtering by year)
  const fetchAllSchedules = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/schedules")
      if (!response.ok) {
        throw new Error("Failed to fetch schedules")
      }
      const data = await response.json()
      setAllSchedules(data) // Store all schedules
    } catch (error) {
      console.error("Error fetching schedules:", error)
      toast.error("Failed to load schedules")
    } finally {
      setIsLoading(false)
    }
  }

  // Load schedules on component mount
  useEffect(() => {
    fetchAllSchedules()
  }, [])

  // Handle academic year change
  const handleAcademicYearChange = (year: string) => {
    setSelectedAcademicYear(year)
    // No need to fetch again, just filter the existing data
  }

  // Handle adding a new schedule
  const handleAddSchedule = () => {
    setSelectedSchedule(null)
    setIsModalOpen(true)
  }

  // Handle editing an existing schedule
  const handleEditSchedule = (schedule: any) => {
    setSelectedSchedule(schedule)
    setIsModalOpen(true)
  }

  // Handle closing the modal
  const handleCloseModal = () => {
    setIsModalOpen(false)
    fetchAllSchedules() // Refresh all schedules after modal closes
  }

  // Define time slots from 7 AM to 6 PM
  const timeSlots = Array.from({ length: 12 }, (_, i) => {
    const hour = i + 7
    const period = hour >= 12 ? "PM" : "AM"
    const displayHour = hour > 12 ? hour - 12 : hour
    return `${displayHour} ${period}`
  })

  const weekDays = [
    { day: "SUN", date: 2 },
    { day: "MON", date: 3 },
    { day: "TUE", date: 4 },
    { day: "WED", date: 5 },
    { day: "THU", date: 6 },
    { day: "FRI", date: 7 },
    { day: "SAT", date: 8 },
  ]

  // Get current month name
  const getCurrentMonth = () => {
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ]
    return months[new Date().getMonth()]
  }

  return (
    <div className="flex h-full flex-col">
      <CalendarHeader
        title={viewTitles[view]}
        month={getCurrentMonth()}
        academicYear={selectedAcademicYear}
        view={view}
        academicYears={uniqueAcademicYears}
        onAcademicYearChange={handleAcademicYearChange}
        onAddClick={handleAddSchedule}
      />

      <div className="print-only flex-1 overflow-auto p-4">
        <div className="rounded-lg border bg-background bg-zircon-50">
          {/* Week header */}
          <div className="grid grid-cols-[100px_repeat(7,1fr)] border-b">
            <div className="flex justify-center items-center border-r p-2 text-sm font-medium text-muted-foreground">
              {/* Time */}
            </div>
            {weekDays.map(({ day, date }) => (
              <div key={`${day}-${date}`} className="flex flex-row justify-center gap-1 border-r p-2 text-center">
                <div className="text-sm font-medium">{day}</div>
                <div className="text-sm text-muted-foreground">{date}</div>
              </div>
            ))}
          </div>

          {/* Time grid */}
          <div className="relative grid grid-cols-[100px_repeat(7,1fr)]">
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-background/50 z-10">
                <div className="flex flex-col items-center gap-2">
                  <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                  <p className="text-sm text-muted-foreground">Loading schedules...</p>
                </div>
              </div>
            )}
            {/* Time column */}
            <div className="border-r">
              {timeSlots.map((time, index) => (
                <div key={time} className="flex justify-center items-center border-b h-20 p-2 text-sm">
                  {time}
                </div>
              ))}
            </div>

            {/* Days columns with schedule blocks */}
            {weekDays.map(({ day }) => (
              <div key={day} className="border-r relative">
                {filteredSchedule
                  .filter((event) => event.day === day)
                  .map((event) => {
                    // Calculate position and height based on start and end times
                    const startMinutes = timeToMinutes(event.startTime)
                    const endMinutes = timeToMinutes(event.endTime)
                    const dayStartMinutes = timeToMinutes("7:00 AM")

                    // Calculate top position (minutes from 7 AM)
                    const topPosition = ((startMinutes - dayStartMinutes) / 60) * 5

                    // Calculate height (duration in hours * row height)
                    const durationHours = (endMinutes - startMinutes) / 60
                    const height = durationHours * 5

                    return (
                      <div
                        key={event.id}
                        className="absolute left-0 right-0 px-1"
                        style={{
                          top: `${topPosition}rem`,
                          height: `${height}rem`,
                        }}
                        onClick={() => handleEditSchedule(event)}
                      >
                        <ScheduleBlock
                          startTime={event.startTime}
                          endTime={event.endTime}
                          course={`${event.course}`}
                          section={`${event.section}`}
                          instructor={event.instructor}
                          room={event.room}
                          view={view}
                        />
                      </div>
                    )
                  })}
              </div>
            ))}
          </div>
          {!isLoading && filteredSchedule.length === 0 && (
            <div className="col-span-full p-8 text-center">
              <p className="text-muted-foreground">No schedules found for the selected academic year.</p>
              <Button variant="outline" className="mt-4" onClick={handleAddSchedule}>
                Add your first schedule
              </Button>
            </div>
          )}
        </div>
      </div>

      <ScheduleModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        schedule={selectedSchedule}
        currentAcademicYear={selectedAcademicYear}
      />
    </div>
  )
}

