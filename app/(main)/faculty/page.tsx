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

// Define the Faculty type
interface Faculty {
  id: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  employeeNumber: string;
  department: string;
  rank: string;
}

// This would typically come from your database
// const facultyData = [
//   {
//     employeeNo: "2010413702099",
//     name: "John D. Dela Fuente",
//     department: "CMBT",
//     rank: "Instructor 1",
//   },
// ];

export default function FacultyPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFaculty, setSelectedFaculty] = useState<Faculty | null>(null);
  const [facultyList, setFacultyList] = useState<Faculty[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch faculty data
  const fetchFaculty = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/faculty");
      if (!response.ok) {
        throw new Error("Failed to fetch faculty data");
      }
      const data = await response.json();
      setFacultyList(data);
    } catch (error) {
      console.error("Error fetching faculty:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Load faculty data on component mount
  useEffect(() => {
    fetchFaculty();
  }, [fetchFaculty]);

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
    fetchFaculty(); // Refresh the data after modal closes
  };

  return (
    <div className="py-8">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-[32px] leading-5 font-semibold text-masala-900">
          List of faculty
        </h1>
        <div className="flex items-center gap-4">
          <div className="relative">
            <SearchIcon className="absolute left-3 top-2 h-5 w-5 text-rock-blue-500" />
            <Input
              placeholder="Search instructor..."
              className="w-[230px] pl-10 pr-4"
            />
          </div>
          <Button onClick={handleAddFaculty} className="gap-2">
            <Plus className="h-5 w-5" />
            Add Faculty
          </Button>
        </div>
      </div>

      <div className="mx-12 h-[620px] rounded-lg border bg-zircon-50/60">
      {isLoading ? (
        <div className="flex justify-center py-8">Loading faculty data...</div>
      ) : (
        <div className="grid gap-4">
          {facultyList.length === 0 ? (
            <div className="text-center py-8">No faculty members found. Add your first faculty member.</div>
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
                {facultyList.map((faculty) => (
                  <TableRow key={faculty.employeeNumber}>
                    <TableCell>{faculty.employeeNumber}</TableCell>
                    <TableCell>{faculty.firstName} {faculty.middleName ? faculty.middleName + " " : ""}
                    {faculty.lastName}</TableCell>
                    <TableCell>{faculty.department}</TableCell>
                    <TableCell>{faculty.rank}</TableCell>
                    <TableCell>
                      <div className="flex justify-center gap-2">
                        <Button variant="outline" size="icon">
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

      <FacultyModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        faculty={selectedFaculty}
      />
    </div>
  );
}
