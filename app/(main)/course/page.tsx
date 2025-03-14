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

// This would typically come from your database
// const courseData = [
//   {
//     courseCode: "HM",
//     courseProgram: "Hospitality Management",
//   },
// ];

export default function SectionPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch courses data
  const fetchCourses = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/course");
      if (!response.ok) {
        throw new Error("Failed to fetch courses");
      }
      const data = await response.json();
      setCourses(data);
    } catch (error) {
      console.error("Error fetching courses:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Load courses data on component mount
  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

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

  return (
    <div className="py-8">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-[32px] leading-5 font-semibold text-masala-900">
          List of course programs
        </h1>
        <div className="flex items-center gap-4">
          <div className="relative">
            <SearchIcon className="absolute left-3 top-2 h-5 w-5 text-rock-blue-500" />
            <Input
              placeholder="Search course..."
              className="w-[230px] pl-10 pr-4"
            />
          </div>
          <Button className="gap-2" onClick={handleAddCourse}>
            <Plus className="h-5 w-5" />
            Add Course
          </Button>
        </div>
      </div>

      <div className="mx-12 h-[620px] rounded-lg border bg-zircon-50/60">
        {isLoading ? (
          <div className="flex justify-center py-8">Loading courses...</div>
        ) : (
          <div className="grid gap-4">
            {courses.length === 0 ? (
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
                  {courses.map((course) => (
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

      <CourseModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        course={selectedCourse}
      />
    </div>
  );
}
