"use client";

import { useState, useEffect, useCallback } from "react";
import { UserRound } from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  type FacultyFormValues,
  facultyFormSchema,
} from "@/schemas/faculty.schema";

// Define the ranks from the schema
const ranks = [
  "Instructor 1",
  "Instructor 2",
  "Instructor 3",
  "Assistant Professor 1",
  "Assistant Professor 2",
  "Assistant Professor 3",
  "Assistant Professor 4",
  "Associate Professor 1",
  "Associate Professor 2",
  "Associate Professor 3",
  "Associate Professor 4",
  "Associate Professor 5",
  "Professor 1",
  "Professor 2",
  "Professor 3",
  "Professor 4",
  "Professor 5",
  "Professor 6",
];

interface Department {
  courseProgramID: string;
  courseCode: string;
  courseProgram: string;
}

interface FacultyModalProps {
  isOpen: boolean;
  onClose: () => void;
  faculty?: {
    facultyID: number;
    employeeNumber: string;
    firstName: string;
    middleName?: string;
    lastName: string;
    rank: string;
    CourseProgram: CourseProgram | null;
  } | null;
}

interface CourseProgram {
  courseProgramID: number;
  courseCode: string;
  courseProgram: string;
}

export function FacultyModal({ isOpen, onClose, faculty }: FacultyModalProps) {
  const isEditMode = !!faculty?.facultyID;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [departments, setDepartments] = useState<Department[]>([]);

  // Fetch departments data
  const fetchDepartments = useCallback(async () => {
    try {
      const response = await fetch("/api/course-list");
      if (!response.ok) {
        throw new Error("Failed to fetch departments");
      }
      const data = await response.json();
      setDepartments(data);
    } catch (error) {
      console.error("Error fetching departments:", error);
      toast.error("Failed to load departments");
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      fetchDepartments();
    }
  }, [fetchDepartments, isOpen]);

  // Initialize the form with react-hook-form
  const form = useForm<FacultyFormValues>({
    resolver: zodResolver(facultyFormSchema),
    defaultValues: {
      firstName: "",
      middleName: "",
      lastName: "",
      employeeNumber: "",
      department: "",
      rank: "Instructor 1" as FacultyFormValues["rank"],
    },
  });

  // Update form values when faculty data changes (for edit mode)
  useEffect(() => {
    if (faculty) {
      form.reset({
        firstName: faculty.firstName || "",
        middleName: faculty.middleName || "",
        lastName: faculty.lastName || "",
        employeeNumber: faculty.employeeNumber || "",
        department: faculty.CourseProgram?.courseCode || "",
        rank: (faculty.rank as FacultyFormValues["rank"]) || "Instructor 1",
      });
    } else {
      form.reset({
        firstName: "",
        middleName: "",
        lastName: "",
        employeeNumber: "",
        department: "",
        rank: "Instructor 1",
      });
    }
  }, [faculty, form]);

  useEffect(() => {
    console.log(form.formState.errors);
  }, [form.formState.errors]);

  // Handle form submission
  const onSubmit = async (data: FacultyFormValues) => {
    setIsSubmitting(true);
    try {
      if (isEditMode && faculty?.facultyID) {
        // PUT request to update existing faculty
        const response = await fetch(`/api/faculty/${faculty.facultyID}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to update faculty member");
        }

        toast.success("Faculty updated", {
          description: "Faculty member has been updated successfully.",
        });
      } else {
        // POST request to create new faculty
        const response = await fetch("/api/faculty", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to add faculty member");
        }

        toast.success("Faculty added", {
          description: "New faculty member has been added successfully.",
        });
      }

      // Close the modal and reset form
      onClose();
      form.reset();
    } catch (error) {
      console.error("Error submitting faculty data:", error);
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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full border">
              <UserRound className="h-5 w-5" />
            </div>
            <div>
              <DialogTitle className="text-xl">
                {isEditMode ? "Edit faculty member" : "Add faculty member"}
              </DialogTitle>
              <DialogDescription>
                Fill in the data below to {isEditMode ? "edit" : "add an"}{" "}
                instructor
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First name</FormLabel>
                    <FormControl>
                      <Input placeholder="First name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="middleName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Middle name</FormLabel>
                    <FormControl>
                      <Input placeholder="Middle name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last name</FormLabel>
                    <FormControl>
                      <Input placeholder="Last name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="employeeNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Employee No.</FormLabel>
                    <FormControl>
                      <Input placeholder="Employee number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="department"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Department</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select department" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {departments.map((dept) => (
                          <SelectItem
                            key={`dept-${dept.courseProgram}`}
                            value={dept.courseCode}
                          >
                            {dept.courseProgram}
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
                name="rank"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Rank</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select position" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {ranks.map((rank) => (
                          <SelectItem key={`rank-${rank}`} value={rank}>
                            {rank}
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
