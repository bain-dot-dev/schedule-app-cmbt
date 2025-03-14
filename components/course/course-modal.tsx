"use client";

import { useState, useEffect } from "react";
import { FileEdit } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { Input } from "@/components/ui/input";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
import { CourseFormValues, courseFormSchema } from "@/schemas/course.schema";

// // Course programs data
// const coursePrograms = [
//   { id: "BSHM", name: "Hospitality Management" },
//   { id: "BSIT", name: "Information Technology" },
//   { id: "BSCS", name: "Computer Science" },
//   { id: "BSA", name: "Accountancy" },
// ];

interface CourseModalProps {
  isOpen: boolean;
  onClose: () => void;
  course?: {
    courseProgramID?: string;
    courseCode: string;
    courseProgram: string;
  } | null;
}

export function CourseModal({ isOpen, onClose, course }: CourseModalProps) {
  const isEditMode = !!course?.courseProgramID;
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize the form with react-hook-form
  const form = useForm<CourseFormValues>({
    resolver: zodResolver(courseFormSchema),
    defaultValues: {
      courseCode: "",
      courseProgram: "",
    },
  });

  // Update form values when course data changes (for edit mode)
  useEffect(() => {
    if (course) {
      form.reset({
        courseCode: course.courseCode || "",
        courseProgram: course.courseProgram || "",
      });
    } else {
      form.reset({
        courseCode: "",
        courseProgram: "",
      });
    }
  }, [course, form]);

  // Handle form submission
  const onSubmit = async (data: CourseFormValues) => {
    setIsSubmitting(true);
    try {
      if (isEditMode && course?.courseProgramID) {
        // PUT request to update existing course
        const response = await fetch(`/api/course/${course.courseProgramID}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });

        if (!response.ok) {
          throw new Error("Failed to update course");
        }

        toast.success("Course updated", {
          description: "Course has been updated successfully.",
        });
      } else {
        // POST request to create new course
        const response = await fetch("/api/course", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });

        if (!response.ok) {
          throw new Error("Failed to add course");
        }

        toast.success("Course added", {
          description: "New course has been added successfully.",
        });
      }

      // Close the modal and reset form
      onClose();
      form.reset();
    } catch (error) {
      console.error("Error submitting course data:", error);
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
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full border">
              <FileEdit className="h-5 w-5" />
            </div>
            <div>
              <DialogTitle className="text-xl">
                {isEditMode ? "Edit Course" : "Add Course"}
              </DialogTitle>
              <DialogDescription>
                Fill in the data below to {isEditMode ? "edit" : "add"} a course
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="courseCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Course code</FormLabel>
                    <FormControl>
                      <Input placeholder="Course code" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* <FormField
                control={form.control}
                name="courseProgram"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Course program</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Course program" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {coursePrograms.map((program) => (
                          <SelectItem key={program.id} value={program.id}>
                            {program.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              /> */}
              <FormField
                control={form.control}
                name="courseProgram"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Course program</FormLabel>
                    <FormControl>
                      <Input placeholder="Course Program" {...field} />
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
