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
import { useRouter } from "next/navigation";

interface Room {
  roomID: string;
  roomNumber: string;
  type: string;
}

interface PaginationMeta {
  totalItems: number;
  itemsPerPage: number;
  totalPages: number;
  currentPage: number;
}

export default function RoomPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10); // You can make this adjustable if needed
  const [paginationMeta, setPaginationMeta] = useState<PaginationMeta>({
    totalItems: 0,
    itemsPerPage: itemsPerPage,
    totalPages: 1,
    currentPage: 1,
  });

  // Fetch rooms data with pagination
  const fetchRooms = useCallback(
    async (page = 1) => {
      setIsLoading(true);
      try {
        // Add pagination parameters to the API request
        const response = await fetch(
          `/api/room?page=${page}&limit=${itemsPerPage}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch rooms");
        }

        const data = await response.json();

        // If your API returns paginated data in a specific format, adjust accordingly
        // This assumes the API returns { data: Room[], meta: PaginationMeta }
        if (data.data && data.meta) {
          setRooms(data.data);
          setPaginationMeta(data.meta);
        } else {
          // Fallback if API doesn't support pagination yet
          setRooms(data);

          // Calculate pagination meta manually
          const totalItems = data.length;
          const totalPages = Math.ceil(totalItems / itemsPerPage);

          // Get the current page of data
          const startIndex = (page - 1) * itemsPerPage;
          const endIndex = startIndex + itemsPerPage;
          const paginatedData = data.slice(startIndex, endIndex);

          setRooms(paginatedData);
          setPaginationMeta({
            totalItems,
            itemsPerPage,
            totalPages,
            currentPage: page,
          });
        }
      } catch (error) {
        console.error("Error fetching rooms:", error);
      } finally {
        setIsLoading(false);
      }
    },
    [itemsPerPage]
  );

  // Load rooms data on component mount or when page changes
  useEffect(() => {
    fetchRooms(currentPage);
  }, [fetchRooms, currentPage]);

  // Handle page change
  const handlePageChange = (page: number) => {
    if (page < 1 || page > paginationMeta.totalPages) return;
    setCurrentPage(page);
  };

  // // Fetch rooms data
  // const fetchRooms = useCallback(async () => {
  //   setIsLoading(true);
  //   try {
  //     const response = await fetch("/api/room");
  //     if (!response.ok) {
  //       throw new Error("Failed to fetch rooms");
  //     }
  //     const data = await response.json();
  //     setRooms(data);
  //   } catch (error) {
  //     console.error("Error fetching rooms:", error);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // }, []);

  // // Load rooms data on component mount
  // useEffect(() => {
  //   fetchRooms();
  // }, [fetchRooms]);

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

  // Handle search input change
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    // Reset to first page when searching
    setCurrentPage(1);
  };

  // Filter rooms based on search term
  const filteredRooms = rooms.filter(
    (room) =>
      room.roomNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      room.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const { totalPages, currentPage } = paginationMeta;
    const pageNumbers = [];

    // Always show first page
    pageNumbers.push(1);

    // Show ellipsis if needed
    if (currentPage > 3) {
      pageNumbers.push("ellipsis1");
    }

    // Show current page and surrounding pages
    for (
      let i = Math.max(2, currentPage - 1);
      i <= Math.min(totalPages - 1, currentPage + 1);
      i++
    ) {
      if (i !== 1 && i !== totalPages) {
        pageNumbers.push(i);
      }
    }

    // Show ellipsis if needed
    if (currentPage < totalPages - 2) {
      pageNumbers.push("ellipsis2");
    }

    // Always show last page if there's more than one page
    if (totalPages > 1) {
      pageNumbers.push(totalPages);
    }

    return pageNumbers;
  };

  const handleViewRoomSchedule = (room: Room) => {
    router.push(`/room-sched/${room.roomID}`);
  };

  return (
    <div className="py-8">
      <div className="mb-8 flex flex-col lg:flex-row items-center justify-between">
        <h1 className="text-[32px] leading-5 font-semibold text-masala-900 pb-8 lg:pb-0">
          List of rooms
        </h1>
        <div className="flex items-center gap-4">
          {/* <button
            onClick={() =>
              toast.success("Success!", {
                description: "This is a success message!",
              })
            }
          >
            Show Toast
          </button> */}
          <div className="relative">
            <SearchIcon className="absolute left-3 top-2 h-5 w-5 text-rock-blue-500" />
            <Input
              placeholder="Search room..."
              className="w-[230px] pl-10 pr-4"
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>
          <Button onClick={handleAddRoom} className="gap-2">
            <Plus className="h-5 w-5" />
            Add Room
          </Button>
        </div>
      </div>

      <div className="lg:mx-12 h-auto rounded-lg border bg-zircon-50/60">
        {isLoading ? (
          <div className="flex justify-center py-8">Loading rooms...</div>
        ) : (
          <div className="grid gap-4">
            {filteredRooms.length === 0 ? (
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
                  {filteredRooms.map((room) => (
                    <TableRow key={room.roomID}>
                      <TableCell>{room.roomNumber}</TableCell>
                      <TableCell>{room.type}</TableCell>
                      <TableCell>
                        <div className="flex justify-center gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleViewRoomSchedule(room)}
                          >
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

      {/* <Pagination className="mt-4">
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
      </Pagination> */}

      {paginationMeta.totalPages > 1 && (
        <Pagination className="mt-4">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => handlePageChange(currentPage - 1)}
                className={
                  currentPage === 1
                    ? "pointer-events-none opacity-50"
                    : "cursor-pointer"
                }
              />
            </PaginationItem>

            {getPageNumbers().map((page, index) => {
              if (page === "ellipsis1" || page === "ellipsis2") {
                return (
                  <PaginationItem key={`ellipsis-${index}`}>
                    <PaginationEllipsis />
                  </PaginationItem>
                );
              }

              return (
                <PaginationItem key={`page-${page}`}>
                  <PaginationLink
                    onClick={() => handlePageChange(page as number)}
                    isActive={currentPage === page}
                    className="cursor-pointer"
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              );
            })}

            <PaginationItem>
              <PaginationNext
                onClick={() => handlePageChange(currentPage + 1)}
                className={
                  currentPage === paginationMeta.totalPages
                    ? "pointer-events-none opacity-50"
                    : "cursor-pointer"
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}

      <RoomModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        room={selectedRoom}
      />
    </div>
  );
}
