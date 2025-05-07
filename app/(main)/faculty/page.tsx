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
import { FacultyModal } from "@/components/faculty/faculty-modal";
import { useRouter } from "next/navigation";

// Define the Faculty type

// Format faculty data
interface Faculty {
  facultyID: number;
  employeeNumber: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  rank: string;
  CourseProgram: CourseProgram | null;
}

interface CourseProgram {
  courseProgramID: number;
  courseCode: string;
  courseProgram: string;
}

interface PaginationMeta {
  totalItems: number;
  itemsPerPage: number;
  totalPages: number;
  currentPage: number;
}

export default function FacultyPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFaculty, setSelectedFaculty] = useState<Faculty | null>(null);
  const [facultyList, setFacultyList] = useState<Faculty[]>([]);
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
  const fetchFacultyList = useCallback(
    async (page = 1) => {
      setIsLoading(true);
      try {
        // Add pagination parameters to the API request
        const response = await fetch(
          `/api/faculty?page=${page}&limit=${itemsPerPage}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch rooms");
        }

        const data = await response.json();

        // If your API returns paginated data in a specific format, adjust accordingly
        // This assumes the API returns { data: Room[], meta: PaginationMeta }
        if (data.data && data.meta) {
          setFacultyList(data.data);
          setPaginationMeta(data.meta);
        } else {
          // Fallback if API doesn't support pagination yet
          setFacultyList(data);

          // Calculate pagination meta manually
          const totalItems = data.length;
          const totalPages = Math.ceil(totalItems / itemsPerPage);

          // Get the current page of data
          const startIndex = (page - 1) * itemsPerPage;
          const endIndex = startIndex + itemsPerPage;
          const paginatedData = data.slice(startIndex, endIndex);

          setFacultyList(paginatedData);
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
    fetchFacultyList(currentPage);
  }, [fetchFacultyList, currentPage]);

  // Handle page change
  const handlePageChange = (page: number) => {
    if (page < 1 || page > paginationMeta.totalPages) return;
    setCurrentPage(page);
  };

  // const fetchFaculty = useCallback(async () => {
  //   setIsLoading(true);
  //   try {
  //     const response = await fetch("/api/faculty");
  //     if (!response.ok) {
  //       throw new Error("Failed to fetch faculty data");
  //     }
  //     const data = await response.json();
  //     console.log("Raw faculty data:", data); // Debug log

  //     // Use the data directly without remapping
  //     setFacultyList(data);
  //   } catch (error) {
  //     console.error("Error fetching faculty:", error);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // }, []);

  // // Load faculty data on component mount
  // useEffect(() => {
  //   fetchFaculty();
  // }, [fetchFaculty]);

  // Open modal for adding a new faculty
  const handleAddFaculty = () => {
    setSelectedFaculty(null);
    setIsModalOpen(true);
  };

  // Open modal for editing an existing faculty
  const handleEditFaculty = (faculty: Faculty) => {
    setSelectedFaculty(faculty);
    setIsModalOpen(true);
  };

  // Close the modal and refresh data
  const handleCloseModal = () => {
    setIsModalOpen(false);
    fetchFacultyList(); // Refresh the data after modal closes
  };

  // Handle search input change
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    // Reset to first page when searching
    setCurrentPage(1);
  };

  // Filter rooms based on search term
  const filteredFacultyList = facultyList.filter(
    (faculty) =>
      faculty.employeeNumber.includes(searchTerm.toLowerCase()) ||
      faculty.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faculty.middleName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faculty.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faculty.CourseProgram?.courseCode
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      faculty.rank.toLowerCase().includes(searchTerm.toLowerCase())
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

  // Navigate to faculty schedule
  const handleViewFacultySchedule = (faculty: Faculty) => {
    router.push(`/faculty-sched/${faculty.facultyID}`);
  };

  return (
    <div className="py-8">
      <div className="mb-8 flex flex-col lg:flex-row items-center justify-between">
        <h1 className="text-[32px] leading-5 font-semibold text-masala-900 pb-8 lg:pb-0">
          List of faculty
        </h1>
        <div className="flex items-center gap-4">
          <div className="relative">
            <SearchIcon className="absolute left-3 top-2 h-5 w-5 text-rock-blue-500" />
            <Input
              placeholder="Search instructor..."
              className="w-[230px] pl-10 pr-4"
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>
          <Button onClick={handleAddFaculty} className="gap-2">
            <Plus className="h-5 w-5" />
            Add Faculty
          </Button>
        </div>
      </div>

      <div className="h-auto rounded-lg border bg-zircon-50/60">
        {isLoading ? (
          <div className="flex justify-center py-8">
            Loading faculty data...
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredFacultyList.length === 0 ? (
              <div className="text-center py-8">
                No faculty members found. Add your first faculty member.
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee no.</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Rank</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredFacultyList.map((faculty) => (
                    <TableRow key={faculty.employeeNumber}>
                      <TableCell>{faculty.employeeNumber}</TableCell>
                      <TableCell>
                        {faculty.firstName}{" "}
                        {faculty.middleName ? faculty.middleName + " " : ""}
                        {faculty.lastName}
                      </TableCell>
                      <TableCell>{faculty.CourseProgram?.courseCode}</TableCell>
                      <TableCell>{faculty.rank}</TableCell>
                      <TableCell>
                        <div className="flex justify-center gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleViewFacultySchedule(faculty)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleEditFaculty(faculty)}
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

      <FacultyModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        faculty={selectedFaculty}
      />
    </div>
  );
}
