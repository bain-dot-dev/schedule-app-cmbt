"use client";
import { useState, useEffect, useMemo, useCallback } from "react";
import { CalendarHeader } from "@/components/ui/calendar-header";
import { ScheduleBlock } from "@/components/ui/schedule-block";
import { ScheduleModal } from "@/components/schedule/schedule-modal";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

interface ScheduleViewProps {
  view: "Room" | "Faculty" | "Section";
  facultyId?: string | number;
  sectionId?: string | number;
  roomId?: string | number;
}

interface Schedule {
  id: string | number;
  day: string;
  startTime: string;
  endTime: string;
  subject: string;
  sectionCourse: string;
  courseCode: string;
  instructor: string;
  room: string;
  academicYear: string;
  semester: string;
  faculty: string;
}

// Helper function to convert time string to minutes since midnight
function timeToMinutes(timeStr: string): number {
  const [time, period] = timeStr.split(" ");
  const [hours, minutes] = time.split(":").map(Number);

  let parsedHours = hours;

  if (period === "PM" && parsedHours !== 12) {
    parsedHours += 12;
  } else if (period === "AM" && parsedHours === 12) {
    parsedHours = 0;
  }

  return parsedHours * 60 + minutes;
}

export function ScheduleView({
  view,
  facultyId,
  sectionId,
  roomId,
}: ScheduleViewProps) {
  const [selectedAcademicYear, setSelectedAcademicYear] = useState<string>("");
  const [filteredSchedule, setFilteredSchedule] = useState<Schedule[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [allSchedules, setAllSchedules] = useState<Schedule[]>([]); // Store all schedules
  const [selectedSemester, setSelectedSemester] = useState<string>("");
  const [facultyName, setFacultyName] = useState<string>("");
  const [sectionName, setSectionName] = useState<string>("");
  const [roomNumber, setRoomNumber] = useState<string>("");
  const [dataInitialized, setDataInitialized] = useState(false);

  const viewTitles = {
    Room: roomId ? "Room Schedule" : "Room",
    Faculty: facultyId ? "Faculty Schedule" : "Faculty",
    Section: sectionId ? "Section Schedule" : "Section",
  };

  // Extract unique academic years from ALL schedules data
  const uniqueAcademicYears = useMemo(() => {
    const years = new Set<string>();
    allSchedules.forEach((item) => {
      if (item.academicYear) {
        years.add(item.academicYear);
      }
    });
    return Array.from(years);
  }, [allSchedules]);

  const semesters = useMemo(() => {
    const semestersSet = new Set<string>();
    allSchedules.forEach((item) => {
      if (item.semester) {
        semestersSet.add(item.semester);
      }
    });
    return Array.from(semestersSet);
  }, [allSchedules]);

  // Fetch faculty name if facultyId is provided
  useEffect(() => {
    if (facultyId) {
      const fetchFacultyName = async () => {
        try {
          const response = await fetch(`/api/faculty/${facultyId}`);
          if (!response.ok) {
            throw new Error("Failed to fetch faculty details");
          }
          const data = await response.json();
          setFacultyName(`${data.firstName} ${data.lastName}`);
        } catch (error) {
          console.error("Error fetching faculty name:", error);
          setFacultyName("Unknown Faculty");
        }
      };

      fetchFacultyName();
    }
  }, [facultyId]);

  // Fetch section name if sectionId is provided
  useEffect(() => {
    if (sectionId) {
      const fetchSectionName = async () => {
        try {
          const response = await fetch(`/api/section-course/${sectionId}`);
          if (!response.ok) {
            throw new Error("Failed to fetch section details");
          }
          const data = await response.json();
          setSectionName(data.section.sectionName);

          console.log("Section name:", data.sectionName);
        } catch (error) {
          console.error("Error fetching section name:", error);
          setSectionName("Unknown Section");
        }
      };

      fetchSectionName();
    }
  }, [sectionId]);

  // Fetch room name if roomId is provided
  useEffect(() => {
    if (roomId) {
      const fetchRoomNumber = async () => {
        try {
          const response = await fetch(`/api/room/${roomId}`);
          if (!response.ok) {
            throw new Error("Failed to fetch room details");
          }
          const data = await response.json();
          setRoomNumber(data.roomNumber);
          console.log("Room number:", data.roomNumber);
        } catch (error) {
          console.error("Error fetching room name:", error);
          setRoomNumber("Unknown Room");
        }
      };

      fetchRoomNumber();
    }
  }, [roomId]);

  // // Fetch ALL schedules from API (without filtering by year)
  // const fetchAllSchedules = async () => {
  //   setIsLoading(true);
  //   try {
  //     // Build the URL with query parameters if facultyId is provided
  //     let url = "/api/schedules";
  //     if (facultyId) {
  //       url += `?facultyId=${facultyId}`;
  //     }

  //     const response = await fetch(url);
  //     if (!response.ok) {
  //       throw new Error("Failed to fetch schedules");
  //     }
  //     const data = await response.json();
  //     console.log("Fetched schedules:", data);
  //     setAllSchedules(data); // Store all schedules
  //   } catch (error) {
  //     console.error("Error fetching schedules:", error);
  //     toast.error("Failed to load schedules");
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  // // Load schedules on component mount
  // useEffect(() => {
  //   fetchAllSchedules();
  // }, [facultyId]);

  // Fetch ALL schedules from API (without filtering by year)
  // Use useCallback to memoize the function
  const fetchAllSchedules = useCallback(async () => {
    setIsLoading(true);
    try {
      // Build the URL with query parameters
      let url = "/api/schedules";
      const params = new URLSearchParams();

      if (facultyId) {
        params.append("facultyId", facultyId.toString());
      }

      if (sectionId) {
        params.append("sectionId", sectionId.toString());
      }

      if (roomId) {
        params.append("roomId", roomId.toString());
      }

      // Add the query parameters to the URL if any exist
      const queryString = params.toString();
      if (queryString) {
        url += `?${queryString}`;
      }

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Failed to fetch schedules");
      }
      const data = await response.json();
      console.log("Fetched schedules:", data);
      setAllSchedules(data); // Store all schedules
    } catch (error) {
      console.error("Error fetching schedules:", error);
      toast.error("Failed to load schedules");
    } finally {
      setIsLoading(false);
    }
  }, [facultyId, sectionId, roomId]); // Add dependencies here

  // Load schedules on component mount
  useEffect(() => {
    fetchAllSchedules();
  }, [fetchAllSchedules]); // Now we can safely add fetchAllSchedules as a dependency

  // Initialize default semester and academic year after data is loaded
  useEffect(() => {
    if (!isLoading && allSchedules.length > 0 && !dataInitialized) {
      // Set default semester if available
      if (semesters.length > 0 && !selectedSemester) {
        // Prefer "1st Semester" if available
        const firstSemester = semesters.find((sem) => sem === "1st Semester");
        setSelectedSemester(firstSemester || semesters[0]);
      }

      // Set default academic year if available
      if (uniqueAcademicYears.length > 0 && !selectedAcademicYear) {
        setSelectedAcademicYear(uniqueAcademicYears[0]);
      } else if (uniqueAcademicYears.length === 0) {
        setSelectedAcademicYear("2024-2025");
      }

      setDataInitialized(true);
    }
  }, [
    isLoading,
    allSchedules,
    semesters,
    uniqueAcademicYears,
    selectedSemester,
    selectedAcademicYear,
    dataInitialized,
  ]);

  // Apply filters whenever filter criteria or data changes
  useEffect(() => {
    if (allSchedules.length === 0) return;

    console.log("Applying filters:", {
      semester: selectedSemester,
      academicYear: selectedAcademicYear,
      schedulesCount: allSchedules.length,
    });

    let filtered = [...allSchedules];

    // Filter by semester if selected
    if (selectedSemester) {
      filtered = filtered.filter((item) => item.semester === selectedSemester);
    }

    // Filter by academic year if selected
    if (selectedAcademicYear) {
      filtered = filtered.filter(
        (item) => item.academicYear === selectedAcademicYear
      );
    }

    console.log("Filtered results:", filtered.length);
    setFilteredSchedule(filtered);
  }, [selectedSemester, selectedAcademicYear, allSchedules]);

  // Handle academic year change
  const handleAcademicYearChange = (year: string) => {
    console.log("Academic year changed to:", year);
    setSelectedAcademicYear(year);
  };

  const handleSemesterChange = (semester: string) => {
    console.log("Semester changed to:", semester);
    setSelectedSemester(semester);
  };

  // Handle adding a new schedule
  const handleAddSchedule = () => {
    setSelectedSchedule(null);
    setIsModalOpen(true);
  };

  // Handle editing an existing schedule
  const handleEditSchedule = (schedule: Schedule) => {
    setSelectedSchedule(schedule);
    setIsModalOpen(true);
  };

  // Handle closing the modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    fetchAllSchedules(); // Refresh all schedules after modal closes
  };

  // Define time slots from 7 AM to 6 PM
  const timeSlots = Array.from({ length: 15 }, (_, i) => {
    const hour = i + 7;
    const period = hour >= 12 ? "PM" : "AM";
    const displayHour = hour > 12 ? hour - 12 : hour;
    return `${displayHour} ${period}`;
  });

  const weekDays = [
    { day: "SUN", date: 2 },
    { day: "MON", date: 3 },
    { day: "TUE", date: 4 },
    { day: "WED", date: 5 },
    { day: "THU", date: 6 },
    { day: "FRI", date: 7 },
    { day: "SAT", date: 8 },
  ];

  return (
    <div className="flex h-full flex-col">
      <CalendarHeader
        title={
          facultyId && facultyName
            ? `${facultyName}`
            : sectionId && sectionName
            ? `${sectionName}`
            : roomId && roomNumber
            ? `${roomNumber}`
            : viewTitles[view]
        }
        academicYear={selectedAcademicYear}
        view={view}
        academicYears={uniqueAcademicYears}
        semester={selectedSemester}
        semesters={semesters}
        onSemesterChange={handleSemesterChange}
        onAcademicYearChange={handleAcademicYearChange}
        onAddClick={handleAddSchedule}
      />

      <div className="print-only flex-1 overflow-auto p-4">
        <div className="rounded-lg border bg-background">
          {/* Week header */}
          <div className="grid grid-cols-[64px_repeat(7,1fr)] border-b">
            <div className="flex justify-center items-center border-r p-2 w-16 text-sm font-medium text-muted-foreground">
              {/* Time */}
            </div>
            {weekDays.map(({ day, date }) => (
              <div
                key={`${day}-${date}`}
                className="flex flex-row justify-center gap-1 border-r p-2 text-center"
              >
                <div className="text-sm font-medium">{day}</div>
                <div className="text-sm text-muted-foreground">{date}</div>
              </div>
            ))}
          </div>

          {/* Time grid */}
          <div className="relative grid grid-cols-[64px_repeat(7,1fr)]">
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-background/50 z-10">
                <div className="flex flex-col items-center gap-2">
                  <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                  <p className="text-sm text-muted-foreground">
                    Loading schedules...
                  </p>
                </div>
              </div>
            )}
            {/* Time column */}
            <div className="border-r w-16">
              {timeSlots.map((time) => (
                <div
                  key={time}
                  className="flex justify-center items-center border-b h-16 p-2 text-sm"
                >
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
                    const startMinutes = timeToMinutes(event.startTime);
                    const endMinutes = timeToMinutes(event.endTime);
                    const dayStartMinutes = timeToMinutes("7:00 AM");

                    // Calculate top position (minutes from 7 AM)
                    const topPosition =
                      ((startMinutes - dayStartMinutes) / 60) * 4;

                    // Calculate height (duration in hours * row height)
                    const durationHours = (endMinutes - startMinutes) / 60;
                    const height = durationHours * 4;

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
                          subject={event.subject}
                          sectionCourse={event.sectionCourse}
                          courseCode={event.courseCode}
                          instructor={event.instructor}
                          room={event.room}
                          view={view}
                        />
                      </div>
                    );
                  })}
              </div>
            ))}
          </div>
          {!isLoading && filteredSchedule.length === 0 && (
            <div className="col-span-full p-8 text-center">
              <p className="text-muted-foreground">
                No schedules found for the selected filters.
              </p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={handleAddSchedule}
              >
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
        currentSemester={selectedSemester}
      />
    </div>
  );
}
