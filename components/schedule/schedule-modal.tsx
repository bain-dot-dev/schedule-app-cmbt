"use client";

import { useState, useEffect, useCallback } from "react";
import { CalendarClock } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import scheduleFormSchema from "@/schemas/schedule.schema";
import { FacultyViewValues } from "@/schemas/faculty.schema";
import { SubjectViewValues } from "@/schemas/subject.schema";
import { SectionCourseViewValues } from "@/schemas/sectionCourse.schema";
import { RoomViewValues } from "@/schemas/room.schema";

interface ScheduleValues {
  id?: string | number;
  day: string;
  startTime: string;
  endTime: string;
  subject: string;
  sectionCourse: string;
  faculty: string;
  room: string;
  academicYear: string;
  semester: string;
  instructor: string; // Added this property
}

// Define the type based on the schema
type ScheduleFormValues = z.infer<typeof scheduleFormSchema>;

interface ScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  schedule: ScheduleValues | null;
  currentAcademicYear: string;
  currentSemester?: string;
}

export function ScheduleModal({
  isOpen,
  onClose,
  schedule,
  currentAcademicYear,
  currentSemester,
}: ScheduleModalProps) {
  const isEditMode = !!schedule?.id;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [faculties, setFaculties] = useState<FacultyViewValues[]>([]);
  const [subjects, setSubjects] = useState<SubjectViewValues[]>([]);
  const [sections, setSections] = useState<SectionCourseViewValues[]>([]);
  const [rooms, setRooms] = useState<RoomViewValues[]>([]);
  // const [academicYears, setAcademicYears] = useState<any[]>([])

  // Initialize the form with react-hook-form
  const form = useForm<ScheduleFormValues>({
    resolver: zodResolver(scheduleFormSchema),
    defaultValues: {
      day: "",
      startTime: "",
      endTime: "",
      subject: "",
      sectionCourse: "",
      faculty: "",
      room: "",
      academicYear: currentAcademicYear || "",
      semester: currentSemester || "First_Semester",
    },
  });

  useEffect(() => {
    console.log(form.formState.errors);
  }, [form.formState.errors]);

  // Fetch faculties data
  const fetchFaculties = useCallback(async () => {
    try {
      const response = await fetch("/api/faculty-list");
      if (!response.ok) {
        throw new Error("Failed to fetch faculties");
      }
      const data = await response.json();
      setFaculties(data);
    } catch (error) {
      console.error("Error fetching faculties:", error);
    }
  }, []);

  // Fetch subjects data
  const fetchSubjects = useCallback(async () => {
    try {
      const response = await fetch("/api/subject-list");
      if (!response.ok) {
        throw new Error("Failed to fetch subjects");
      }
      const data = await response.json();
      setSubjects(data);
    } catch (error) {
      console.error("Error fetching subjects:", error);
    }
  }, []);

  // Fetch sections data
  const fetchSections = useCallback(async () => {
    try {
      const response = await fetch("/api/section-list");
      if (!response.ok) {
        throw new Error("Failed to fetch sections");
      }
      const data = await response.json();
      setSections(data);
    } catch (error) {
      console.error("Error fetching sections:", error);
    }
  }, []);

  // Fetch rooms data
  const fetchRooms = useCallback(async () => {
    try {
      const response = await fetch("/api/room-list");
      if (!response.ok) {
        throw new Error("Failed to fetch rooms");
      }
      const data = await response.json();
      setRooms(data);
    } catch (error) {
      console.error("Error fetching rooms:", error);
    }
  }, []);

  // Fetch all required data when modal opens
  useEffect(() => {
    if (isOpen) {
      fetchFaculties();
      fetchSubjects();
      fetchSections();
      fetchRooms();
      // fetchAcademicYears()
    }
  }, [isOpen, fetchFaculties, fetchSubjects, fetchSections, fetchRooms]);

  // Update form values when schedule data changes (for edit mode)
  useEffect(() => {
    if (schedule) {
      console.log("Schedule data:", schedule);
      // Find the IDs from the related entities
      const facultyId =
        faculties.find(
          (f) => `${f.firstName} ${f.lastName}` === schedule.instructor
        )?.facultyID || "";

      const subjectId =
        subjects.find((s) => s.subjectCode === schedule.subject)?.subjectID ||
        "";

      const sectionId =
        sections.find((s) => s.section.sectionName === schedule.sectionCourse)
          ?.sectionCourseID || "";

      const roomId =
        rooms.find((r) => r.roomNumber === schedule.room)?.roomID || "";

      const academicYear = schedule.academicYear || "";

      form.reset({
        day: schedule.day || "",
        startTime: schedule.startTime || "",
        endTime: schedule.endTime || "",
        subject: subjectId,
        sectionCourse: sectionId,
        faculty: facultyId,
        room: roomId,
        academicYear: academicYear,
        semester: schedule.semester || "First_Semester",
      });
    } else {
      form.reset({
        day: "",
        startTime: "",
        endTime: "",
        subject: "",
        sectionCourse: "",
        faculty: "",
        room: "",
        academicYear: currentAcademicYear || "",
        semester: "First_Semester",
      });
    }
  }, [
    schedule,
    form,
    currentAcademicYear,
    faculties,
    subjects,
    sections,
    rooms,
  ]);

  // Handle form submission
  const onSubmit = async (data: ScheduleFormValues) => {
    setIsSubmitting(true);
    try {
      if (isEditMode) {
        // PUT request to update existing schedule
        const response = await fetch(`/api/schedules/${schedule.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to update schedule");
        }

        toast.success("Schedule updated", {
          description: "Schedule has been updated successfully.",
        });
      } else {
        // POST request to create new schedule
        const response = await fetch("/api/schedules", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to add schedule");
        }

        toast.success("Schedule added", {
          description: "New schedule has been added successfully.",
        });
      }

      // Close the modal and reset form
      onClose();
      form.reset();
    } catch (error) {
      console.error("Error submitting schedule data:", error);
      toast.error("Error", {
        description:
          error instanceof Error ? error.message : "An error occurred",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle form clearing
  const handleClear = () => {
    form.reset();
  };

  // Time options for select dropdowns
  const timeOptions = [
    "7:00 AM",
    "7:30 AM",
    "8:00 AM",
    "8:30 AM",
    "9:00 AM",
    "9:30 AM",
    "10:00 AM",
    "10:30 AM",
    "11:00 AM",
    "11:30 AM",
    "12:00 PM",
    "12:30 PM",
    "1:00 PM",
    "1:30 PM",
    "2:00 PM",
    "2:30 PM",
    "3:00 PM",
    "3:30 PM",
    "4:00 PM",
    "4:30 PM",
    "5:00 PM",
    "5:30 PM",
    "6:00 PM",
    "6:30 PM",
    "7:00 PM",
    "7:30 PM",
    "8:00 PM",
    "8:30 PM",
    "9:00 PM",
  ];

  // Day options
  const dayOptions = [
    { value: "MON", label: "Monday" },
    { value: "TUE", label: "Tuesday" },
    { value: "WED", label: "Wednesday" },
    { value: "THU", label: "Thursday" },
    { value: "FRI", label: "Friday" },
    { value: "SAT", label: "Saturday" },
    { value: "SUN", label: "Sunday" },
  ];

  // Academic year options (fallback if API fails)
  // const academicYearOptions =
  //   academicYears.length > 0
  //     ? academicYears
  //     : ["2023-2024", "2024-2025", "2025-2026", "2026-2027"].map((year) => ({
  //         academicYearID: year,
  //         academicYear: year,
  //       }))

  // Semester options
  const semesterOptions = ["First_Semester", "Second_Semester", "Summer"];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full border">
              <CalendarClock className="h-5 w-5" />
            </div>
            <div className="flex flex-col items-start">
              <DialogTitle className="text-xl">
                {isEditMode ? "Edit Schedule" : "Add Schedule"}
              </DialogTitle>
              <DialogDescription>
                Fill in the data below to {isEditMode ? "edit" : "add"} a
                schedule
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="academicYear"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Academic Year</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., 2024-2025" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="semester"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Semester</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select semester" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {semesterOptions.map((semester) => (
                          <SelectItem
                            key={`semester-${semester}`}
                            value={semester}
                          >
                            {semester.replace(/_/g, " ")}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="day"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Day</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select day" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {dayOptions.map((day) => (
                          <SelectItem
                            key={`day-${day.value}`}
                            value={day.value}
                          >
                            {day.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="startTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start Time</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select start time" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {timeOptions.map((time) => (
                          <SelectItem key={`start-${time}`} value={time}>
                            {time}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="endTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>End Time</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select end time" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {timeOptions.map((time) => (
                          <SelectItem key={`end-${time}`} value={time}>
                            {time}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="faculty"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Faculty</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select faculty" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {faculties.map((faculty) => (
                          <SelectItem
                            key={`faculty-${faculty.facultyID}`}
                            value={faculty.facultyID}
                          >
                            {[
                              faculty.firstName,
                              faculty.middleName,
                              faculty.lastName,
                            ]
                              .filter(Boolean) // Removes `undefined` or empty values
                              .join(" ")}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="room"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Room</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select room" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {rooms.map((room) => (
                          <SelectItem
                            key={`room-${room.roomID}`}
                            value={room.roomID}
                          >
                            {room.roomNumber} {""} {room.type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="subject"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Subject</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select subject" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {subjects.map((subject) => (
                          <SelectItem
                            key={`subject-${subject.subjectID}`}
                            value={subject.subjectID}
                          >
                            {subject.subjectName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="sectionCourse"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Section</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select section" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {sections.map((sectionCourse, index) => (
                          <SelectItem
                            key={`section-${
                              sectionCourse.sectionCourseID || index
                            }`}
                            value={
                              sectionCourse.sectionCourseID ||
                              `section-${index}`
                            }
                          >
                            {sectionCourse.section?.sectionName ||
                              "Unknown Section"}{" "}
                            {""}{" "}
                            {sectionCourse.courseProgram?.courseProgram ||
                              "Unknown Course"}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleClear}
                disabled={isSubmitting}
              >
                Clear
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : "Save"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
