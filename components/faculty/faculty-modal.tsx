"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FacultyFormValues, facultyFormSchema } from "@/schemas/faculty.schema"


// Sample data for dropdowns
const departments = [
  { id: "CMBT", name: "CMBT" },
  { id: "CICS", name: "CICS" },
  { id: "COE", name: "COE" },
  { id: "CAS", name: "CAS" },
]

const ranks = [
  { id: "Instructor 1", name: "Instructor 1" },
  { id: "Instructor 2", name: "Instructor 2" },
  { id: "Assistant Professor 1", name: "Assistant Professor 1" },
  { id: "Associate Professor 1", name: "Associate Professor 1" },
  { id: "Professor 1", name: "Professor 1" },
]

interface FacultyModalProps {
  isOpen: boolean
  onClose: () => void
  faculty?: {
    id?: string
    firstName: string
    middleName?: string
    lastName: string
    employeeNumber: string
    department: string
    rank: string
  } | null
}

export function FacultyModal({ isOpen, onClose, faculty }: FacultyModalProps) {
  const isEditMode = !!faculty?.id
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Initialize the form with react-hook-form
  const form = useForm<FacultyFormValues>({
    resolver: zodResolver(facultyFormSchema),
    defaultValues: {
      firstName: "",
      middleName: "",
      lastName: "",
      employeeNumber: "",
      department: "",
      rank: "",
    },
  })

  // Update form values when faculty data changes (for edit mode)
  useEffect(() => {
    if (faculty) {
      form.reset({
        firstName: faculty.firstName || "",
        middleName: faculty.middleName || "",
        lastName: faculty.lastName || "",
        employeeNumber: faculty.employeeNumber || "",
        department: faculty.department || "",
        rank: faculty.rank || "",
      })
    } else {
      form.reset({
        firstName: "",
        middleName: "",
        lastName: "",
        employeeNumber: "",
        department: "",
        rank: "",
      })
    }
  }, [faculty, form])

  // Handle form submission
  const onSubmit = async (data: FacultyFormValues) => {
    setIsSubmitting(true)
    try {
      if (isEditMode && faculty?.id) {
        // PUT request to update existing faculty
        const response = await fetch(`/api/faculty/${faculty.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        })

        if (!response.ok) {
          throw new Error("Failed to update faculty member")
        }

        toast.success("Faculty updated", {
          description: "Faculty member has been updated successfully.",
        })
      } else {
        // POST request to create new faculty
        const response = await fetch("/api/faculty", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        })

        if (!response.ok) {
          throw new Error("Failed to add faculty member")
        }

        toast.success("Faculty added", {
          description: "New faculty member has been added successfully.",
        })
      }

      // Close the modal and reset form
      onClose()
      form.reset()
    } catch (error) {
      console.error("Error submitting faculty data:", error)
      toast.error("Error", {
        description: error instanceof Error ? error.message : "An error occurred",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle form clearing
  const handleClear = () => {
    form.reset()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full border">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-user-round"
              >
                <circle cx="12" cy="8" r="5" />
                <path d="M20 21a8 8 0 0 0-16 0" />
              </svg>
            </div>
            <div>
              <DialogTitle className="text-xl">{isEditMode ? "Edit faculty member" : "Add faculty member"}</DialogTitle>
              <DialogDescription>
                Fill in the data below to {isEditMode ? "edit" : "add an"} instructor
              </DialogDescription>
            </div>
          </div>
          {/* <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button> */}
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
                    <FormLabel>Employee number</FormLabel>
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
                    <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select department" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {departments.map((dept) => (
                          <SelectItem key={dept.id} value={dept.id}>
                            {dept.name}
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
                    <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select position" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {ranks.map((rank) => (
                          <SelectItem key={rank.id} value={rank.id}>
                            {rank.name}
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
              <Button type="button" variant="outline" onClick={handleClear} disabled={isSubmitting}>
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
  )
}

