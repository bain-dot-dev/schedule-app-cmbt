"use client";

import { useIsMobile } from "@/hooks/use-mobile";

interface ScheduleBlockProps {
  startTime: string;
  endTime: string;
  subject: string;
  sectionCourse: string;
  courseCode: string;
  instructor: string;
  room: string;
  view: "Room" | "Faculty" | "Section";
}

export function ScheduleBlock({
  startTime,
  endTime,
  subject,
  sectionCourse,
  courseCode,
  instructor,
  room,
  view,
}: ScheduleBlockProps) {
  const isMobile = useIsMobile();

  const viewColors = {
    Room: "bg-emerald-50 border-emerald-100",
    Faculty: "bg-blue-50 border-blue-100",
    Section: "bg-purple-50 border-purple-100",
  };

  // Calculate duration in minutes to determine display mode
  const getMinutes = (timeStr: string): number => {
    const [time, period] = timeStr.split(" ");
    const [hours, minutes] = time.split(":").map(Number);
    let totalHours = hours;
    if (period === "PM" && hours !== 12) totalHours += 12;
    if (period === "AM" && hours === 12) totalHours = 0;
    return totalHours * 60 + (minutes || 0);
  };

  // Format instructor name to show first initial and last name
  const formatInstructorName = (fullName: string): string => {
    if (!fullName) return "";

    const nameParts = fullName.trim().split(" ");
    if (nameParts.length === 1) return fullName;

    // Check for common compound last name prefixes
    const compoundLastNamePrefixes = [
      "de",
      "del",
      "dela",
      "della",
      "di",
      "du",
      "la",
      "van",
      "von",
      "el",
    ];

    let lastNameStartIndex = nameParts.length - 1;

    // Check if we have a compound last name (e.g., "De Leon", "Van Dyke")
    for (let i = nameParts.length - 2; i >= 0; i--) {
      const lowerCasePart = nameParts[i].toLowerCase();
      if (compoundLastNamePrefixes.includes(lowerCasePart)) {
        lastNameStartIndex = i;
      } else {
        break;
      }
    }

    // Get first name initial (first word only)
    const firstInitial = nameParts[0].charAt(0);

    // Get last name (could be compound)
    const lastName = nameParts.slice(lastNameStartIndex).join(" ");

    return `${firstInitial}. ${lastName}`;
  };

  const formattedInstructor = formatInstructorName(instructor);

  const startMinutes = getMinutes(startTime);
  const endMinutes = getMinutes(endTime);
  const durationMinutes = endMinutes - startMinutes;

  // Define different layouts based on duration
  const isVeryShortBlock = durationMinutes <= 60; // 1 hour or less
  const isShortBlock = durationMinutes <= 89 && !isVeryShortBlock; // Between 1 hour and 1.5 hours
  const isMediumBlock =
    durationMinutes <= 119 && !isShortBlock && !isVeryShortBlock; // Between 1.5 and 2 hours

  // For mobile, use more compact layouts
  const layoutType = isMobile
    ? isVeryShortBlock || isShortBlock || isMediumBlock
      ? "very-short"
      : "short"
    : isVeryShortBlock
    ? "very-short"
    : isShortBlock
    ? "short"
    : isMediumBlock
    ? "medium"
    : "normal";

  return (
    <div
      className={`rounded-lg border ${viewColors[view]} w-full h-full flex flex-col overflow-hidden print:border print:border-gray-300 print:shadow-none`}
    >
      <div className="text-center text-sm md:text-[8px] lg:text-[12px] xl:text-sm whitespace-nowrap overflow-hidden text-ellipsis print:text-xs text-muted-foreground border-b print:border-gray-300 no-print">
        {startTime} - {endTime}
      </div>

      {layoutType === "very-short" && (
        // Super compact layout for very short blocks and mobile
        <div className="flex flex-row md:flex-1 md:flex-col xl:flex-row justify-center gap-2 md:gap-0 xl:gap-2 print:flex print:flex-1 print:flex-col print:justify-center print:items-center print:p-0 w-full h-full items-center overflow-hidden">
          <div className="flex flex-col items-center justify-center text-center ">
            <div className="font-medium leading-none text-base md:text-[8px] lg:text-[10px] xl:text-[12px] print:text-xs truncate w-full">
              {subject}
            </div>
            <div className="text-sm leading-none md:text-[8px] lg:text-[9px] xl:text-[10px] print:text-xs truncate w-full">
              {formattedInstructor}
            </div>
          </div>
          <div className="flex flex-col items-center justify-center text-center px-0.5">
            <div className="flex flex-row items-center justify-center gap-1 md:gap-1 w-full">
              <div className="text-base leading-none md:text-[8px] lg:text-[10px] xl:text-[12px] font-medium print:text-xs truncate">
                {courseCode}
              </div>
              <div className="text-base leading-none md:text-[8px] lg:text-[10px] xl:text-[12px] font-medium print:text-xs truncate">
                {sectionCourse}
              </div>
            </div>
            <div className="text-sm leading-none md:text-[8px] lg:text-[9px] xl:text-[10px] print:text-xs text-muted-foreground truncate w-full">
              {room && `Room ${room}`}
            </div>
          </div>
        </div>
      //   <div className="flex flex-1 flex-col justify-center items-center p-0 overflow-hidden">
      //   <div className="space-y-3 md:space-y-0  print:space-y-0.5 text-center">
      //     <div className="space-y-3 md:space-y-0 print:space-y-0.5">
      //       <div className="font-medium text-xl md:text-[8px] print:text-xs print:font-bold leading-3 md:leading-none print:leading-tight">
      //         {subject}
      //       </div>
      //       <div className="flex flex-1 flex-row justify-center items-center gap-1 md:gap-2 print:gap-1">
      //         <div className="font-medium  text-xl md:text-[8px] print:text-xs leading-3 md:leading-none print:leading-tight">
      //           {courseCode}
      //         </div>
      //         <div className="font-medium text-xl md:text-[8px] print:text-xs leading-3 md:leading-none print:leading-tight">
      //           {sectionCourse}
      //         </div>
      //       </div>
      //     </div>
      //     <div className="space-y-3 md:space-y-0 print:space-y-0">
      //       <div className="text-lg md:text-[8px] print:text-xs leading-3 md:leading-none print:leading-tight">
      //         {formattedInstructor}
      //       </div>
      //       <div className="text-lg md:text-[8px] print:text-xs leading-3 md:leading-none print:leading-tight text-muted-foreground">
      //         {room && `Room ${room}`}
      //       </div>
      //     </div>
      //   </div>
      // </div>
      )}

      {layoutType === "short" && (
        // Horizontal layout for short blocks
        <div className="flex flex-1 flex-col justify-center items-center p-0 overflow-hidden">
          <div className="space-y-3 md:space-y-0  print:space-y-0.5 text-center">
            <div className="space-y-3 md:space-y-0 print:space-y-0.5">
              <div className="font-medium text-xl md:text-[12px] print:text-xs print:font-bold leading-3 md:leading-4 print:leading-tight">
                {subject}
              </div>
              <div className="flex flex-1 flex-row justify-center items-center gap-1  print:gap-1">
                <div className="font-medium  text-xl md:text-[11px] print:text-xs leading-3 print:leading-tight">
                  {courseCode}
                </div>
                <div className="font-medium text-xl md:text-[11px] print:text-xs leading-3 print:leading-tight">
                  {sectionCourse}
                </div>
              </div>
            </div>
            <div className="space-y-3 md:space-y-0 print:space-y-0">
              <div className="text-lg md:text-[10px] print:text-xs leading-3 print:leading-tight">
                {formattedInstructor}
              </div>
              <div className="text-lg md:text-[10px] print:text-xs leading-3 print:leading-tight text-muted-foreground">
                {room && `Room ${room}`}
              </div>
            </div>
          </div>
        </div>
      )}

      {layoutType === "medium" && (
        // Vertical layout for medium blocks
        <div className="flex flex-1 flex-col justify-center items-center p-0 overflow-hidden">
          <div className="space-y-1  md:space-y-0 print:space-y-0.5 text-center">
            <div className="space-y-1 md:space-y-0 print:space-y-0.5">
              <div className="font-medium text-xs md:text-[11px] lg:text-sm xl:text-base print:text-xs print:font-bold leading-3 md:leading-4 xl:leading-5 print:leading-tight">
                {subject}
              </div>
              <div className="flex flex-1 flex-row justify-center items-center gap-1  print:gap-1">
                <div className="font-medium text-[10px] md:text-[11px] lg:text-sm xl:text-base print:text-xs leading-3 xl:leading-4 print:leading-tight">
                  {courseCode}
                </div>
                <div className="font-medium text-[10px] md:text-[11px] lg:text-sm xl:text-base print:text-xs leading-3 xl:leading-4 print:leading-tight">
                  {sectionCourse}
                </div>
              </div>
            </div>
            <div className="space-y-0.5 md:space-y-0 print:space-y-0">
              <div className="text-[10px] md:text-[10px] lg:text-xs xl:text-sm print:text-xs leading-3  xl:leading-4 print:leading-tight">
                {formattedInstructor}
              </div>
              <div className="text-[10px] md:text-[10px] lg:text-xs xl:text-sm print:text-xs leading-3 xl:leading-4 print:leading-tight text-muted-foreground">
                {room && `Room ${room}`}
              </div>
            </div>
          </div>
        </div>
      )}

      {layoutType === "normal" && (
        // Original vertical layout for normal blocks
        <div className="flex flex-1 flex-col justify-center items-center p-0 overflow-hidden">
          <div className="space-y-1 md:space-y-0 lg:space-y-0 print:space-y-0.5 text-center">
            <div className="space-y-1 md:space-y-0 lg:space-y-0 print:space-y-0.5">
              <div className="font-medium text-xs lg:text-[14px] xl:text-lg print:text-xs print:font-bold leading-3 md:leading-5 xl:leading-6 print:leading-tight">
                {subject}
              </div>
              <div className="flex flex-1 flex-row justify-center items-center gap-1  print:gap-1">
                <div className="font-medium text-[10px] lg:text-[14px] xl:text-lg print:text-xs leading-3 md:leading-4 xl:leading-5 print:leading-tight">
                  {courseCode}
                </div>
                <div className="font-medium text-[10px] lg:text-[14px] xl:text-lg print:text-xs leading-3 md:leading-4 xl:leading-5 print:leading-tight">
                  {sectionCourse}
                </div>
              </div>
            </div>
            <div className="space-y-0.5 md:space-y-0 lg:space-y-0 print:space-y-0">
              <div className="text-[10px] lg:text-[12px] xl:text-base print:text-xs leading-3 md:leading-4 xl:leading-5 print:leading-tight">
                {formattedInstructor}
              </div>
              <div className="text-[10px] lg:text-[12px] xl:text-base print:text-xs leading-3 md:leading-4 xl:leading-5 print:leading-tight text-muted-foreground">
                {room && `Room ${room}`}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
