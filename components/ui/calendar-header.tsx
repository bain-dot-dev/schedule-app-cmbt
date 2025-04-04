"use client";

import { Plus, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CalendarHeaderProps {
  title: string;
  // month: string;
  academicYear: string;
  view?: "rooms" | "faculty" | "sections";
  academicYears?: string[];
  semester: string;
  semesters?: string[];
  onSemesterChange?: (semester: string) => void;
  onAcademicYearChange?: (year: string) => void;
  onAddClick?: () => void;
}

export function CalendarHeader({
  title,
  // month,
  academicYear,
  view,
  academicYears = [],
  semester,
  semesters = [],
  onSemesterChange,
  onAcademicYearChange,
  onAddClick,
}: CalendarHeaderProps) {
  return (
    <div className="no-print flex items-center justify-between pb-4 px-4">
      <h1 className="text-2xl font-semibold">
        {title} Program - Academic Year {academicYear}
      </h1>
      <div className="flex items-center gap-2">
        <Select
          value={semester || ""}
          onValueChange={onSemesterChange}
          disabled={semesters.length === 0}
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Semester" />
          </SelectTrigger>
          <SelectContent>
            {semesters.length > 0 ? (
              semesters.map((sem) => (
                <SelectItem key={sem} value={sem}>
                  {sem}
                </SelectItem>
              ))
            ) : (
              <SelectItem value="1st Semester">Current Semester</SelectItem>
            )}
          </SelectContent>
        </Select>
        <Select
          value={academicYear || ""}
          onValueChange={onAcademicYearChange}
          disabled={academicYears.length === 0}
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Academic Year" />
          </SelectTrigger>
          <SelectContent>
            {academicYears.length > 0 ? (
              academicYears.map((year) => (
                <SelectItem key={year} value={year}>
                  {year}
                </SelectItem>
              ))
            ) : (
              <SelectItem value="2024-2025">Current Year</SelectItem>
            )}
          </SelectContent>
        </Select>
        <div className="relative">
          <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search..." className="w-[200px] pl-8" />
        </div>
        <Button className="gap-2" onClick={onAddClick}>
          <Plus className="h-4 w-4" />
          Add Event
        </Button>
      </div>
    </div>
  );
}
