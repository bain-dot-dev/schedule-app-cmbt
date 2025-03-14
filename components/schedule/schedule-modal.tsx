"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarIcon } from "lucide-react";
import { toast } from "sonner";
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
import { ScheduleFormValues, scheduleFormSchema } from "@/schemas/schedule.schema";

// Sample data - replace with API calls
const sampleData = {
  faculty: [
    { id: "K.FERNANDEZ", name: "K. Fernandez" },
    { id: "J.SMITH", name: "J. Smith" },
    { id: "M.JOHNSON", name: "M. Johnson" },
  ],
  subjects: [
    { id: "HMPE 3", name: "HMPE 3" },
    { id: "MATH 101", name: "MATH 101" },
    { id: "CS 201", name: "CS 201" },
  ],
  sections: [
    { id: "BSHM 2D", name: "BSHM 2D" },
    { id: "BSCS 1A", name: "BSCS 1A" },
    { id: "BSIT 3B", name: "BSIT 3B" },
  ],
  rooms: [
    { id: "101 Laboratory", name: "101 Laboratory" },
    { id: "102 Lecture", name: "102 Lecture" },
    { id: "201 Computer Lab", name: "201 Computer Lab" },
  ],
  days: [
    { id: "MON", name: "Monday" },
    { id: "TUE", name: "Tuesday" },
    { id: "WED", name: "Wednesday" },
    { id: "THU", name: "Thursday" },
    { id: "FRI", name: "Friday" },
    { id: "SAT", name: "Saturday" },
    { id: "SUN", name: "Sunday" },
  ],
  academicYears: [
    { id: "2023-2024", name: "2023-2024" },
    { id: "2024-2025", name: "2024-2025" },
  ],
};

interface ScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  schedule?: {
    id?: string | number;
    course: string;
    section: string;
    instructor: string;
    room: string;
    academicYear?: string;
    day: string;
    startTime: string;
    endTime: string;
  } | null;
  currentAcademicYear?: string;
}

export function ScheduleModal({
  isOpen,
  onClose,
  schedule,
  currentAcademicYear = "2024-2025",
}: ScheduleModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEditMode = !!schedule?.id;

  const form = useForm<ScheduleFormValues>({
    resolver: zodResolver(scheduleFormSchema),
    defaultValues: {
      faculty: "",
      subject: "",
      section: "",
      room: "",
      academicYear: currentAcademicYear || "2024-2025",
      day: "",
      startTime: "",
      endTime: "",
    },
  });

  // Update form values when schedule data changes (for edit mode)
  useEffect(() => {
    if (schedule) {
      form.reset({
        faculty: schedule.instructor || "",
        subject: schedule.course || "",
        section: schedule.section || "",
        room: schedule.room || "",
        academicYear:
          schedule.academicYear || currentAcademicYear || "2024-2025",
        day: schedule.day || "",
        startTime: schedule.startTime || "",
        endTime: schedule.endTime || "",
      });
    } else {
      form.reset({
        faculty: "",
        subject: "",
        section: "",
        room: "",
        academicYear: currentAcademicYear || "2024-2025",
        day: "",
        startTime: "",
        endTime: "",
      });
    }
  }, [schedule, form, currentAcademicYear]);

  const onSubmit = async (data: ScheduleFormValues) => {
    setIsSubmitting(true);
    try {
      // Format the data to match your API expectations
      const formattedData = {
        id: schedule?.id,
        course: data.subject,
        section: data.section,
        instructor: data.faculty,
        room: data.room,
        academicYear: data.academicYear,
        day: data.day,
        startTime: data.startTime,
        endTime: data.endTime,
      };

      if (isEditMode && schedule?.id) {
        // PUT request to update existing schedule
        const response = await fetch(`/api/schedules/${schedule.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formattedData),
        });

        if (!response.ok) {
          throw new Error("Failed to update schedule");
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
          body: JSON.stringify(formattedData),
        });

        if (!response.ok) {
          throw new Error("Failed to create schedule");
        }

        toast.success("Schedule created", {
          description: "New schedule has been created successfully.",
        });
      }

      onClose();
      form.reset();
    } catch (error) {
      console.error("Error submitting schedule:", error);
      toast.error("Error", {
        description:
          error instanceof Error ? error.message : "An error occurred",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full border">
              <CalendarIcon className="h-5 w-5" />
            </div>
            <div>
              <DialogTitle className="text-xl">
                {isEditMode ? "Edit Schedule" : "Create Schedule"}
              </DialogTitle>
              <DialogDescription>
                Fill in the data below to {isEditMode ? "edit" : "add a"}{" "}
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
                        {sampleData.faculty.map((faculty) => (
                          <SelectItem key={faculty.id} value={faculty.id}>
                            {faculty.name}
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
                        {sampleData.subjects.map((subject) => (
                          <SelectItem key={subject.id} value={subject.id}>
                            {subject.name}
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
                name="section"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Section</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select section" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {sampleData.sections.map((section) => (
                          <SelectItem key={section.id} value={section.id}>
                            {section.name}
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
                        {sampleData.rooms.map((room) => (
                          <SelectItem key={room.id} value={room.id}>
                            {room.name}
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
                name="academicYear"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Academic year</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="YYYY-YYYY" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {sampleData.academicYears.map((year) => (
                          <SelectItem key={year.id} value={year.id}>
                            {year.name}
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
                        {sampleData.days.map((day) => (
                          <SelectItem key={day.id} value={day.id}>
                            {day.name}
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
                    <FormLabel>Start time</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. 8:00 AM" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="endTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>End time</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. 10:00 AM" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => form.reset()}
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
