"use client";

import { useState, useEffect, useCallback } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SectionFormValues, sectionFormSchema } from "@/schemas/section.schema";

interface SectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  section?: {
    id?: string;
    sectionName: string;
    courseProgram: string;
  } | null;
}

export function SectionModal({ isOpen, onClose, section }: SectionModalProps) {
  const isEditMode = !!section?.id;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [courses, setCourses] = useState<{ id: string; code: string }[]>([]);

  // Fetch courses data
  const fetchCourses = useCallback(async () => {
    try {
      const response = await fetch("/api/course");
      if (!response.ok) {
        throw new Error("Failed to fetch courses");
      }
      const data = await response.json();
      setCourses(data);
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  }, []);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  // Initialize the form with react-hook-form
  const form = useForm<SectionFormValues>({
    resolver: zodResolver(sectionFormSchema),
    defaultValues: {
      sectionName: "",
      courseProgram: "",
    },
  });

  // Update form values when section data changes (for edit mode)
  useEffect(() => {
    if (section) {
      form.reset({
        sectionName: section.sectionName || "",
        courseProgram: section.courseProgram || "",
      });
    } else {
      form.reset({
        sectionName: "",
        courseProgram: "",
      });
    }
  }, [section, form]);

  // Handle form submission
  const onSubmit = async (data: SectionFormValues) => {
    setIsSubmitting(true);
    try {
      if (isEditMode && section?.id) {
        // PUT request to update existing section
        const response = await fetch(`/api/section/${section.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });

        if (!response.ok) {
          throw new Error("Failed to update section");
        }

        toast.success("Section updated", {
          description: "Section has been updated successfully.",
        });
      } else {
        // POST request to create new section
        const response = await fetch("/api/section", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });

        if (!response.ok) {
          throw new Error("Failed to add section");
        }

        toast.success("Section added", {
          description: "New section has been added successfully.",
        });
      }

      // Close the modal and reset form
      onClose();
      form.reset();
    } catch (error) {
      console.error("Error submitting section data:", error);
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
                {isEditMode ? "Edit Section" : "Add Section"}
              </DialogTitle>
              <DialogDescription>
                Fill in the data below to {isEditMode ? "edit" : "add"} a
                section
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="sectionName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Section name</FormLabel>
                    <FormControl>
                      <Input placeholder="Section name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
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
                        {courses.map((program) => (
                          <SelectItem key={program.id} value={program.id}>
                            {program.code}
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
