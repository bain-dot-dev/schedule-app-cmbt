"use client";

import { useState, useEffect, useCallback } from "react";
import { UserPlus } from "lucide-react";
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
import { Checkbox } from "@/components/ui/checkbox";
import { userFormSchema, UserFormValues } from "@/schemas/userForm.schema";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  user?: {
    userID: string;
    firstName: string;
    middleName?: string;
    lastName: string;
    email: string;
    role: string;
    isActive: boolean;
    courseProgramID?: string;
  } | null;
}

interface Course {
  courseProgramID: string;
  courseCode: string;
  courseProgram: string;
}

export function UserModal({ isOpen, onClose, user }: UserModalProps) {
  const isEditMode = !!user?.userID;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [courses, setCourses] = useState<Course[]>([]);

  // Fetch courses data
  const fetchCourses = useCallback(async () => {
    try {
      const response = await fetch("/api/course-list");
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
    if (isOpen) {
      fetchCourses();
    }
  }, [fetchCourses, isOpen]);

  // Initialize the form with react-hook-form
  const form = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      firstName: "",
      middleName: "",
      lastName: "",
      email: "",
      password: "",
      role: "faculty",
      isActive: true,
      courseProgramID: "",
      // sendVerificationEmail: true,
      sendVerificationEmail: false,
    },

    // just comment out the sendVerificationEmail field in the schema above
    // to that says default(false) to enable it by default then uncomment this line
    // sendVerificationEmail: z.boolean().default(true),
    // then uncomment the checkbox for sendverification email in the form below to enable email verification in forms
  });

  // Update form values when user data changes (for edit mode)
  useEffect(() => {
    if (user) {
      const courseProgramID =
        user.courseProgramID ||
        courses.find((c) => c.courseProgramID === user.courseProgramID)
          ?.courseProgramID ||
        "";

      form.reset({
        firstName: user.firstName || "",
        middleName: user.middleName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        password: "", // Don't populate password in edit mode
        role: ["superadmin", "admin", "faculty"].includes(user.role)
          ? (user.role as "superadmin" | "admin" | "faculty")
          : undefined,
        isActive: user.isActive || true,
        courseProgramID: courseProgramID,
        sendVerificationEmail: false, // Default to false in edit mode
      });
    } else {
      form.reset({
        firstName: "",
        middleName: "",
        lastName: "",
        email: "",
        password: "",
        role: "faculty",
        isActive: true,
        courseProgramID: "",
        sendVerificationEmail: false,
      });
    }
  }, [user, form, courses]);

  useEffect(() => {
    console.log(form.formState.errors);
  }, [form.formState.errors]);

  // Handle form submission
  const onSubmit = async (data: UserFormValues) => {
    setIsSubmitting(true);
    try {
      if (isEditMode && user?.userID) {
        // PUT request to update existing user
        const response = await fetch(`/api/users/${user.userID}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.log("data", data);
          throw new Error(errorData.error || "Failed to update user");
        }

        toast.success("User updated", {
          description: "User has been updated successfully.",
        });
      } else {
        // POST request to create new user
        const response = await fetch("/api/users", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to add user");
        }

        toast.success("User added", {
          description: data.sendVerificationEmail
            ? "New user has been added successfully. A verification email has been sent."
            : "New user has been added successfully.",
        });
      }

      // Close the modal and reset form
      onClose();
      form.reset();
    } catch (error) {
      console.error("Error submitting user data:", error);
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
      <DialogContent className="sm:max-w-[540px]">
        <DialogHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full border">
              <UserPlus className="h-5 w-5" />
            </div>
            <div className="flex flex-col items-start">
              <DialogTitle className="text-xl">
                {isEditMode ? "Edit User" : "Add User"}
              </DialogTitle>
              <DialogDescription>
                Fill in the data below to {isEditMode ? "edit" : "add"} a user
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="flex flex-col gap-4">
              <div className="flex sm:flex-row flex-col gap-4">
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
                      <FormLabel>Middle name (optional)</FormLabel>
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
              <div className="grid grid-rows-2 lg:grid-rows-1 lg:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="courseProgramID"
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
                            <SelectValue placeholder="Department" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {courses.map((course) => (
                            <SelectItem
                              key={`course-${course.courseProgramID}`}
                              value={course.courseProgramID}
                            >
                              {course.courseProgram}
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
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Role</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Role" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="superadmin">
                              Super Admin
                            </SelectItem>
                            <SelectItem value="admin">Admin</SelectItem>
                            <SelectItem value="faculty">Faculty</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-rows-2 lg:grid-rows-1 lg:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Email address"
                          type="email"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {isEditMode ? "New password (optional)" : "Password"}
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Password"
                          type="password"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <FormField
                control={form.control}
                name="isActive"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Active</FormLabel>
                      <p className="text-sm text-muted-foreground">
                        User will be able to log in.
                      </p>
                    </div>
                  </FormItem>
                )}
              />
            </div>
            {/* 
            {!isEditMode && (
              <FormField
                control={form.control}
                name="sendVerificationEmail"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Send verification email</FormLabel>
                      <p className="text-sm text-muted-foreground">
                        The user will need to verify their email before they can
                        log in.
                      </p>
                    </div>
                  </FormItem>
                )}
              />
            )} */}

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
