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

interface CourseProgram {
  courseProgramID: string
  courseCode: string
  courseProgram: string
}

interface Section {
  sectionID: string
  sectionName: string
}

interface SectionCourse {
  SectionCourseID: string
  sectionID: string
  courseProgramID: string
  section: Section
  courseProgram: CourseProgram
}

// Combined interface for the UI
interface SectionDisplay {
  id: string // Using SectionCourseID as the primary id
  sectionID: string
  courseProgramID: string
  sectionName: string
  courseProgram: string
  courseCode: string
}

// This would typically come from your database
// const sectionData = [
//   {
//     sectionName: "2D",
//     courseProgram: "Hospitality Management",
//   },
// ];

export default function SectionPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSection, setSelectedSection] = useState<SectionDisplay | null>(null);
  const [sections, setSections] = useState<SectionDisplay[]>([])
  const [isLoading, setIsLoading] = useState(true);

  // Fetch sections data
  const fetchSections = useCallback(async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/section")
      if (!response.ok) {
        throw new Error("Failed to fetch sections")
      }
      const data = await response.json()

      // Map the API response to match our display interface
      // The API should return SectionCourse records with their relations
      const formattedSections = data.map((item: SectionCourse) => ({
        id: item.SectionCourseID || item.SectionCourseID || `section-course-${item.sectionID}-${item.courseProgramID}`,
        sectionID: item.sectionID || item.section?.sectionID || "",
        courseProgramID: item.courseProgramID || item.courseProgram?.courseProgramID || "",
        sectionName: item.section?.sectionName || item.section.sectionName || "",
        courseProgram: item.courseProgram?.courseProgram || item.courseProgram || "",
        courseCode: item.courseProgram?.courseCode || item.courseProgram.courseCode || "",
      }))

      setSections(formattedSections)
      console.log("Formatted sections:", formattedSections)
    } catch (error) {
      console.error("Error fetching sections:", error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Load sections data on component mount
  useEffect(() => {
    fetchSections();
  }, [fetchSections]);

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

  return (
    <div className="py-8">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-[32px] leading-5 font-semibold text-masala-900">
          List of sections
        </h1>
        <div className="flex items-center gap-4">
          <div className="relative">
            <SearchIcon className="absolute left-3 top-2 h-5 w-5 text-rock-blue-500" />
            <Input
              placeholder="Search section..."
              className="w-[230px] pl-10 pr-4"
            />
          </div>
          <Button onClick={handleAddSection} className="gap-2">
            <Plus className="h-5 w-5" />
            Add Section
          </Button>
        </div>
      </div>

      <div className="mx-12 h-[620px] rounded-lg border bg-zircon-50/60">
        {isLoading ? (
          <div className="flex justify-center py-8">Loading sections...</div>
        ) : (
          <div className="grid gap-4">
            {sections.length === 0 ? (
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
                  {sections.map((section) => (
                    <TableRow key={section.sectionID}>
                      <TableCell>{section.sectionName}</TableCell>
                      <TableCell>{section.courseProgram}</TableCell>
                      <TableCell>
                        <div className="flex justify-center gap-2">
                          <Button variant="outline" size="icon">
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

      <SectionModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        section={selectedSection}
      />
    </div>
  );
}
