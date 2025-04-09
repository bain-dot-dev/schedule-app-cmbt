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
import { SectionModal } from "@/components/section/section-modal";
import { useRouter } from "next/navigation";

interface CourseProgram {
  courseProgramID: string;
  courseCode: string;
  courseProgram: string;
}

interface Section {
  sectionID: string;
  sectionName: string;
}

interface SectionCourse {
  SectionCourseID: string;
  sectionID: string;
  courseProgramID: string;
  section: Section;
  courseProgram: CourseProgram;
}

// Combined interface for the UI
interface SectionDisplay {
  id: string; // Using SectionCourseID as the primary id
  sectionID: string;
  courseProgramID: string;
  sectionName: string;
  courseProgram: string;
  courseCode: string;
}

interface PaginationMeta {
  totalItems: number;
  itemsPerPage: number;
  totalPages: number;
  currentPage: number;
}

export default function SectionPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSection, setSelectedSection] = useState<SectionDisplay | null>(
    null
  );
  const [sections, setSections] = useState<SectionDisplay[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [paginationMeta, setPaginationMeta] = useState<PaginationMeta>({
    totalItems: 0,
    itemsPerPage: itemsPerPage,
    totalPages: 1,
    currentPage: 1,
  });

  // Fetch sections data with pagination
  const fetchSections = useCallback(
    async (page = 1) => {
      setIsLoading(true);
      try {
        // Add pagination parameters to the API request
        const response = await fetch(
          `/api/section?page=${page}&limit=${itemsPerPage}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch sections");
        }

        const data = await response.json();

        // If your API returns paginated data in a specific format, adjust accordingly
        // This assumes the API returns { data: SectionCourse[], meta: PaginationMeta }
        if (data.data && data.meta) {
          // Map the API response to match our display interface
          const formattedSections = data.data.map((item: SectionCourse) => ({
            id:
              item.SectionCourseID ||
              `section-course-${item.sectionID}-${item.courseProgramID}`,
            sectionID: item.sectionID || item.section?.sectionID || "",
            courseProgramID:
              item.courseProgramID || item.courseProgram?.courseProgramID || "",
            sectionName: item.section?.sectionName || "",
            courseProgram: item.courseProgram?.courseProgram || "",
            courseCode: item.courseProgram?.courseCode || "",
          }));

          setSections(formattedSections);
          setPaginationMeta(data.meta);
        } else {
          // Fallback if API doesn't support pagination yet
          // Map the API response to match our display interface
          const formattedSections = data.map((item: SectionCourse) => ({
            id:
              item.SectionCourseID ||
              `section-course-${item.sectionID}-${item.courseProgramID}`,
            sectionID: item.sectionID || item.section?.sectionID || "",
            courseProgramID:
              item.courseProgramID || item.courseProgram?.courseProgramID || "",
            sectionName: item.section?.sectionName || "",
            courseProgram: item.courseProgram?.courseProgram || "",
            courseCode: item.courseProgram?.courseCode || "",
          }));

          // Calculate pagination meta manually
          const totalItems = formattedSections.length;
          const totalPages = Math.ceil(totalItems / itemsPerPage);

          // Get the current page of data
          const startIndex = (page - 1) * itemsPerPage;
          const endIndex = startIndex + itemsPerPage;
          const paginatedData = formattedSections.slice(startIndex, endIndex);

          setSections(paginatedData);
          setPaginationMeta({
            totalItems,
            itemsPerPage,
            totalPages,
            currentPage: page,
          });
        }
      } catch (error) {
        console.error("Error fetching sections:", error);
      } finally {
        setIsLoading(false);
      }
    },
    [itemsPerPage]
  );

  // Load sections data on component mount or when page changes
  useEffect(() => {
    fetchSections(currentPage);
  }, [fetchSections, currentPage]);

  // Handle page change
  const handlePageChange = (page: number) => {
    if (page < 1 || page > paginationMeta.totalPages) return;
    setCurrentPage(page);
  };

  // // Fetch sections data
  // const fetchSections = useCallback(async () => {
  //   setIsLoading(true)
  //   try {
  //     const response = await fetch("/api/section")
  //     if (!response.ok) {
  //       throw new Error("Failed to fetch sections")
  //     }
  //     const data = await response.json()

  //     // Map the API response to match our display interface
  //     // The API should return SectionCourse records with their relations
  //     const formattedSections = data.map((item: SectionCourse) => ({
  //       id: item.SectionCourseID || item.SectionCourseID || `section-course-${item.sectionID}-${item.courseProgramID}`,
  //       sectionID: item.sectionID || item.section?.sectionID || "",
  //       courseProgramID: item.courseProgramID || item.courseProgram?.courseProgramID || "",
  //       sectionName: item.section?.sectionName || item.section.sectionName || "",
  //       courseProgram: item.courseProgram?.courseProgram || item.courseProgram || "",
  //       courseCode: item.courseProgram?.courseCode || item.courseProgram.courseCode || "",
  //     }))

  //     setSections(formattedSections)
  //     console.log("Formatted sections:", formattedSections)
  //   } catch (error) {
  //     console.error("Error fetching sections:", error)
  //   } finally {
  //     setIsLoading(false)
  //   }
  // }, [])

  // // Load sections data on component mount
  // useEffect(() => {
  //   fetchSections();
  // }, [fetchSections]);

  // Open modal for adding a new section
  const handleAddSection = () => {
    setSelectedSection(null);
    setIsModalOpen(true);
  };

  // Open modal for editing an existing section
  const handleEditSection = (section: SectionDisplay) => {
    setSelectedSection(section);
    setIsModalOpen(true);
  };

  // Close the modal and refresh data
  const handleCloseModal = () => {
    setIsModalOpen(false);
    fetchSections(); // Refresh the data after modal closes
  };

  // Handle search input change
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    // Reset to first page when searching
    setCurrentPage(1);
  };

  // Filter sections based on search term
  const filteredSections = sections.filter(
    (section) =>
      section.sectionName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      section.courseProgram.toLowerCase().includes(searchTerm.toLowerCase()) ||
      section.courseCode.toLowerCase().includes(searchTerm.toLowerCase())
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

  const handleViewSectionSchedule = (section: SectionDisplay) => {
    router.push(`/section-sched/${section.id}`);
  };

  return (
    <div className="py-8">
      <div className="mb-8 flex flex-col lg:flex-row items-center justify-between">
        <h1 className="text-[32px] leading-5 font-semibold text-masala-900 pb-8 lg:pb-0">
          List of sections
        </h1>
        <div className="flex items-center gap-4">
          <div className="relative">
            <SearchIcon className="absolute left-3 top-2 h-5 w-5 text-rock-blue-500" />
            <Input
              placeholder="Search section..."
              className="w-[230px] pl-10 pr-4"
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>
          <Button onClick={handleAddSection} className="gap-2">
            <Plus className="h-5 w-5" />
            Add Section
          </Button>
        </div>
      </div>

      <div className="lg:mx-12 h-auto rounded-lg border bg-zircon-50/60">
        {isLoading ? (
          <div className="flex justify-center py-8">Loading sections...</div>
        ) : (
          <div className="grid gap-4">
            {filteredSections.length === 0 ? (
              <div className="text-center py-8">
                No sections found. Add your first section.
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Section Name</TableHead>
                    <TableHead>Course Program</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSections.map((section) => (
                    <TableRow key={section.id}>
                      <TableCell>{section.sectionName}</TableCell>
                      <TableCell>{section.courseProgram}</TableCell>
                      <TableCell>
                        <div className="flex justify-center gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleViewSectionSchedule(section)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleEditSection(section)}
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

      <SectionModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        section={selectedSection}
      />
    </div>
  );
}
