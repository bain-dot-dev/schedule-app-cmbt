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
import { SubjectFormValues, subjectFormSchema } from "@/schemas/subject.schema";

// Sample subjects data
// const subjectNames = [
//   { id: "MATH101", name: "Mathematics 1" },
//   { id: "ENG101", name: "English 1" },
//   { id: "COMP101", name: "Computer Programming 1" },
//   { id: "SCI101", name: "Science 1" },
// ];

interface SubjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  subject?: {
    subjectID?: string;
    subjectName: string;
    // subjectCode: string;
    numberOfUnits: number;
  } | null;
}

export function SubjectModal({ isOpen, onClose, subject }: SubjectModalProps) {
  const isEditMode = !!subject?.subjectID;
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize the form with react-hook-form
  const form = useForm<SubjectFormValues>({
    resolver: zodResolver(subjectFormSchema),
    defaultValues: {
      subjectName: "",
      // subjectCode: "",
      numberOfUnits: 0,
    },
  });

  // Update form values when subject data changes (for edit mode)
  useEffect(() => {
    if (subject) {
      form.reset({
        subjectName: subject.subjectName || "",
        // subjectCode: subject.subjectCode || "",
        numberOfUnits: subject.numberOfUnits || 0,
      });
    } else {
      form.reset({
        subjectName: "",
        // subjectCode: "",
        numberOfUnits: 0,
      });
    }
  }, [subject, form]);

  // Handle form submission
  // const onSubmit = async (data: SubjectFormValues) => {
  //   setIsSubmitting(true);
  //   try {
  //     if (isEditMode && subject?.subjectID) {
  //       // PUT request to update existing subject
  //       const response = await fetch(`/api/subject/${subject.subjectID}`, {
  //         method: "PUT",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //         body: JSON.stringify(data),
  //       });

  //       if (!response.ok) {
  //         throw new Error("Failed to update subject");
  //       }

  //       toast.success("Subject updated", {
  //         description: "Subject has been updated successfully.",
  //       });
  //     } else {
  //       // POST request to create new subject
  //       const response = await fetch("/api/subject", {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //         body: JSON.stringify(data),
  //       });

  //       if (!response.ok) {
  //         throw new Error("Failed to add subject");
  //       }

  //       toast.success("Subject added", {
  //         description: "New subject has been added successfully.",
  //       });
  //     }

  //     // Close the modal and reset form
  //     onClose();
  //     form.reset();
  //   } catch (error) {
  //     console.error("Error submitting subject data:", error);
  //     toast.error("Error", {
  //       description:
  //         error instanceof Error ? error.message : "An error occurred",
  //     });
  //   } finally {
  //     setIsSubmitting(false);
  //   }
  // };

  const onSubmit = async (data: SubjectFormValues) => {
    setIsSubmitting(true);
    try {
      // Convert numberOfUnits to a number before sending
      const formattedData = {
        ...data,
      };

      if (isEditMode && subject?.subjectID) {
        // PUT request to update existing subject
        const response = await fetch(`/api/subject/${subject.subjectID}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formattedData), // Send formatted data
        });

        if (!response.ok) {
          throw new Error("Failed to update subject");
        }

        toast.success("Subject updated", {
          description: "Subject has been updated successfully.",
        });
      } else {
        // POST request to create new subject
        const response = await fetch("/api/subject", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formattedData), // Send formatted data
        });

        if (!response.ok) {
          throw new Error("Failed to add subject");
        }

        toast.success("Subject added", {
          description: "New subject has been added successfully.",
        });
      }

      // Close modal and reset form
      onClose();
      form.reset();
    } catch (error) {
      console.error("Error submitting subject data:", error);
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
                {isEditMode ? "Edit Subject" : "Add Subject"}
              </DialogTitle>
              <DialogDescription>
                Fill in the data below to {isEditMode ? "edit" : "add"} a
                subject
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="subjectName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Subject name</FormLabel>
                    <FormControl>
                      <Input placeholder="Subject name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* <FormField
                control={form.control}
                name="subjectCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Subject code</FormLabel>
                    <FormControl>
                      <Input placeholder="Subject code" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              /> */}

              <FormField
                control={form.control}
                name="numberOfUnits"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Number of units</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="1"
                        placeholder="Number of units"
                        {...field}
                      />
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
