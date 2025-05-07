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
import { CourseModal } from "@/components/course/course-modal";

// // Course programs mapping for display
// const courseProgramsMap = {
//   BSHM: "Hospitality Management",
//   BSIT: "Information Technology",
//   BSCS: "Computer Science",
//   BSA: "Accountancy",
// };

interface Course {
  courseProgramID: string;
  courseCode: string;
  courseProgram: string;
}

interface PaginationMeta {
  totalItems: number;
  itemsPerPage: number;
  totalPages: number;
  currentPage: number;
}

export default function SectionPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10); // You can make this adjustable if needed
  const [paginationMeta, setPaginationMeta] = useState<PaginationMeta>({
    totalItems: 0,
    itemsPerPage: itemsPerPage,
    totalPages: 1,
    currentPage: 1,
  });

  // // Fetch courses data
  // const fetchCourses = useCallback(async () => {
  //   setIsLoading(true);
  //   try {
  //     const response = await fetch("/api/course");
  //     if (!response.ok) {
  //       throw new Error("Failed to fetch courses");
  //     }
  //     const data = await response.json();
  //     setCourses(data);
  //   } catch (error) {
  //     console.error("Error fetching courses:", error);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // }, []);

  // // Load courses data on component mount
  // useEffect(() => {
  //   fetchCourses();
  // }, [fetchCourses]);

  // Fetch courses data with pagination
  const fetchCourses = useCallback(
    async (page = 1) => {
      setIsLoading(true);
      try {
        // Add pagination parameters to the API request
        const response = await fetch(
          `/api/course?page=${page}&limit=${itemsPerPage}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch courses");
        }

        const data = await response.json();

        // If your API returns paginated data in a specific format, adjust accordingly
        // This assumes the API returns { data: Course[], meta: PaginationMeta }
        if (data.data && data.meta) {
          setCourses(data.data);
          setPaginationMeta(data.meta);
        } else {
          // Fallback if API doesn't support pagination yet
          setCourses(data);

          // Calculate pagination meta manually
          const totalItems = data.length;
          const totalPages = Math.ceil(totalItems / itemsPerPage);

          // Get the current page of data
          const startIndex = (page - 1) * itemsPerPage;
          const endIndex = startIndex + itemsPerPage;
          const paginatedData = data.slice(startIndex, endIndex);

          setCourses(paginatedData);
          setPaginationMeta({
            totalItems,
            itemsPerPage,
            totalPages,
            currentPage: page,
          });
        }
      } catch (error) {
        console.error("Error fetching courses:", error);
      } finally {
        setIsLoading(false);
      }
    },
    [itemsPerPage]
  );

  // Load courses data on component mount or when page changes
  useEffect(() => {
    fetchCourses(currentPage);
  }, [fetchCourses, currentPage]);

  // Handle page change
  const handlePageChange = (page: number) => {
    if (page < 1 || page > paginationMeta.totalPages) return;
    setCurrentPage(page);
  };

  // Open modal for adding a new course
  const handleAddCourse = () => {
    setSelectedCourse(null);
    setIsModalOpen(true);
  };

  // Open modal for editing an existing course
  const handleEditCourse = (course: Course) => {
    setSelectedCourse(course);
    setIsModalOpen(true);
  };

  // Close the modal and refresh data
  const handleCloseModal = () => {
    setIsModalOpen(false);
    fetchCourses(); // Refresh the data after modal closes
  };

  // Filter courses based on search term
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    // Reset to first page when searching
    setCurrentPage(1);
  };

  // Apply search filter
  const filteredCourses = courses.filter(
    (course) =>
      course.courseCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.courseProgram.toLowerCase().includes(searchTerm.toLowerCase())
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

  return (
    <div className="py-8">
      <div className="mb-8 flex flex-col lg:flex-row items-center justify-between">
      <h1 className="text-[32px] leading-5 font-semibold text-masala-900 pb-8 lg:pb-0">
          List of course programs
        </h1>
        <div className="flex items-center gap-4">
          <div className="relative">
            <SearchIcon className="absolute left-3 top-2 h-5 w-5 text-rock-blue-500" />
            <Input
              placeholder="Search course..."
              className="w-[230px] pl-10 pr-4"
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>
          <Button className="gap-2" onClick={handleAddCourse}>
            <Plus className="h-5 w-5" />
            Add Course
          </Button>
        </div>
      </div>

      <div className="h-auto rounded-lg border bg-zircon-50/60">
        {isLoading ? (
          <div className="flex justify-center py-8">Loading courses...</div>
        ) : (
          <div className="grid gap-4">
            {filteredCourses.length === 0 ? (
              <div className="text-center py-8">
                No courses found. Add your first course.
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Course Code</TableHead>
                    <TableHead>Course Program</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCourses.map((course) => (
                    <TableRow key={course.courseProgramID}>
                      <TableCell>{course.courseCode}</TableCell>
                      <TableCell>{course.courseProgram}</TableCell>
                      <TableCell>
                        <div className="flex justify-center gap-2">
                          <Button variant="outline" size="icon">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleEditCourse(course)}
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

      <CourseModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        course={selectedCourse}
      />
    </div>
  );
}
