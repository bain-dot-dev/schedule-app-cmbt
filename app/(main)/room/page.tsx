"use client";

import { useState, useEffect, useCallback } from "react";
import { Eye, Pencil, Plus, SearchIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { RoomModal } from "@/components/room/room-modal";

interface Room {
  roomID: string;
  roomNumber: string;
  type: string;
}

// This would typically come from your database
// const roomData = [
//   {
//     roomNo: "101",
//     type: "Classroom",
//   },
// ];

export default function RoomPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch rooms data
  const fetchRooms = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/room");
      if (!response.ok) {
        throw new Error("Failed to fetch rooms");
      }
      const data = await response.json();
      setRooms(data);
    } catch (error) {
      console.error("Error fetching rooms:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Load rooms data on component mount
  useEffect(() => {
    fetchRooms();
  }, [fetchRooms]);

  // Open modal for adding a new room
  const handleAddRoom = () => {
    setSelectedRoom(null);
    setIsModalOpen(true);
  };

  // Open modal for editing an existing room
  const handleEditRoom = (room: Room) => {
    setSelectedRoom(room);
    setIsModalOpen(true);
  };

  // Close the modal and refresh data
  const handleCloseModal = () => {
    setIsModalOpen(false);
    fetchRooms(); // Refresh the data after modal closes
  };

  return (
    <div className="py-8">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-[32px] leading-5 font-semibold text-masala-900">
          List of rooms
        </h1>
        <div className="flex items-center gap-4">
          <div className="relative">
            <SearchIcon className="absolute left-3 top-2 h-5 w-5 text-rock-blue-500" />
            <Input
              placeholder="Search room..."
              className="w-[230px] pl-10 pr-4"
            />
          </div>
          <Button onClick={handleAddRoom} className="gap-2">
            <Plus className="h-5 w-5" />
            Add Room
          </Button>
        </div>
      </div>

      <div className="mx-12 h-[620px] rounded-lg border bg-zircon-50/60">
        {isLoading ? (
          <div className="flex justify-center py-8">Loading rooms...</div>
        ) : (
          <div className="grid gap-4">
            {rooms.length === 0 ? (
              <div className="text-center py-8">
                No rooms found. Add your first room.
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Room Number</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rooms.map((room) => (
                    <TableRow key={room.roomID}>
                      <TableCell>{room.roomNumber}</TableCell>
                      <TableCell>{room.type}</TableCell>
                      <TableCell>
                        <div className="flex justify-center gap-2">
                          <Button variant="outline" size="icon">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleEditRoom(room)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
        )}
      </div>

      <Pagination className="mt-4">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious href="#" />
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#">1</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#" isActive>
              2
            </PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#">3</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
          <PaginationItem>
            <PaginationNext href="#" />
          </PaginationItem>
        </PaginationContent>
      </Pagination>

      <RoomModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        room={selectedRoom}
      />
    </div>
  );
}
