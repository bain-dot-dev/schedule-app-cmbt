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
import { SubjectModal } from "@/components/subject/subject-modal";

// Subject names mapping for display
// const subjectNamesMap = {
//   MATH101: "Mathematics 1",
//   ENG101: "English 1",
//   COMP101: "Computer Programming 1",
//   SCI101: "Science 1",
// }

interface Subject {
  subjectID: string;
  subjectName: string;
  subjectCode: string;
  numberOfUnits: string;
}

// This would typically come from your database
// const subjectData = [
//   {
//     subjectName: "Hospitality Management Physical Education",
//     subjectCode: "HM",
//     numberOfUnits: "3",
//   },
// ];

export default function SectionPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch subjects data
  const fetchSubjects = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/subject");
      if (!response.ok) {
        throw new Error("Failed to fetch subjects");
      }
      const data = await response.json();
      setSubjects(data);
    } catch (error) {
      console.error("Error fetching subjects:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Load subjects data on component mount
  useEffect(() => {
    fetchSubjects();
  }, [fetchSubjects]);

  // Open modal for adding a new subject
  const handleAddSubject = () => {
    setSelectedSubject(null);
    setIsModalOpen(true);
  };

  // Open modal for editing an existing subject
  const handleEditSubject = (subject: Subject) => {
    setSelectedSubject(subject);
    setIsModalOpen(true);
  };

  // Close the modal and refresh data
  const handleCloseModal = () => {
    setIsModalOpen(false);
    fetchSubjects(); // Refresh the data after modal closes
  };

  return (
    <div className="py-8">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-[32px] leading-5 font-semibold text-masala-900">
          List of subjects
        </h1>
        <div className="flex items-center gap-4">
          <div className="relative">
            <SearchIcon className="absolute left-3 top-2 h-5 w-5 text-rock-blue-500" />
            <Input
              placeholder="Search subject..."
              className="w-[230px] pl-10 pr-4"
            />
          </div>
          <Button onClick={handleAddSubject} className="gap-2">
            <Plus className="h-5 w-5" />
            Add Subject
          </Button>
        </div>
      </div>

      <div className="mx-12 h-[620px] rounded-lg border bg-zircon-50/60">
        {isLoading ? (
          <div className="flex justify-center py-8">Loading subjects...</div>
        ) : (
          <div className="grid gap-4">
            {subjects.length === 0 ? (
              <div className="text-center py-8">
                No subjects found. Add your first subject.
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>subject Name</TableHead>
                    <TableHead>subject Code</TableHead>
                    <TableHead>No. Of Units</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {subjects.map((subject) => (
                    <TableRow key={subject.subjectID}>
                      <TableCell>{subject.subjectName}</TableCell>
                      <TableCell>{subject.subjectCode}</TableCell>
                      <TableCell>{subject.numberOfUnits}</TableCell>
                      <TableCell>
                        <div className="flex justify-center gap-2">
                          <Button variant="outline" size="icon">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleEditSubject(subject)}
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

      <SubjectModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        subject={selectedSubject}
      />
    </div>
  );
}
