"use client";

import { useState, useEffect } from "react";
import { House } from "lucide-react";
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
import { RoomFormValues, roomFormSchema } from "@/schemas/room.schema";

// Room types data
const roomTypes = [
  { id: "Classroom", name: "Classroom" },
  { id: "Laboratory", name: "Laboratory" },
  { id: "Lecture Room", name: "Lecture Room" },
  { id: "Audio Visual Room", name: "Audio Visual Room" },
  { id: "Virtual Reality Room", name: "Virtual Reality Room" },
];

interface RoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  room?: {
    roomID?: string;
    roomNumber: string;
    type: string;
  } | null;
}

export function RoomModal({ isOpen, onClose, room }: RoomModalProps) {
  const isEditMode = !!room?.roomID;
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize the form with react-hook-form
  const form = useForm<RoomFormValues>({
    resolver: zodResolver(roomFormSchema),
    defaultValues: {
      roomNumber: "",
      type: "",
    },
  });

  // Update form values when room data changes (for edit mode)
  useEffect(() => {
    if (room) {
      form.reset({
        roomNumber: room.roomNumber || "",
        type: room.type || "",
      });
    } else {
      form.reset({
        roomNumber: "",
        type: "",
      });
    }
  }, [room, form]);

  // Handle form submission
  const onSubmit = async (data: RoomFormValues) => {
    setIsSubmitting(true);
    try {
      if (isEditMode && room?.roomID) {
        // PUT request to update existing room
        const response = await fetch(`/api/room/${room.roomID}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });

        if (!response.ok) {
          throw new Error("Failed to update room");
        }

        toast.success("Room updated", {
          description: "Room has been updated successfully.",
        });
      } else {
        // POST request to create new room
        const response = await fetch("/api/room", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });

        if (!response.ok) {
          throw new Error("Failed to add room");
        }

        toast.success("Room added", {
          description: "New room has been added successfully.",
        });
      }

      // Close the modal and reset form
      onClose();
      form.reset();
    } catch (error) {
      console.error("Error submitting room data:", error);
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
            <House className="h-5 w-5" />
            </div>
            <div className="flex flex-col items-start">
              <DialogTitle className="text-xl">
                {isEditMode ? "Edit Room" : "Add Room"}
              </DialogTitle>
              <DialogDescription>
                Fill in the data below to {isEditMode ? "edit" : "add"} a room
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="roomNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Room number</FormLabel>
                    <FormControl>
                      <Input placeholder="Room number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {roomTypes.map((type) => (
                          <SelectItem key={type.id} value={type.id}>
                            {type.name}
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
