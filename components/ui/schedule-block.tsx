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
  const isShortBlock = durationMinutes <= 90 && !isVeryShortBlock; // Between 1 hour and 1.5 hours
  const isMediumBlock =
    durationMinutes <= 120 && !isShortBlock && !isVeryShortBlock; // Between 1.5 and 2 hours

  return (
    <div
      className={`rounded-lg border ${viewColors[view]} w-full h-full flex flex-col overflow-hidden print:border print:border-gray-300 print:shadow-none`}
    >
      <div className="text-center text-xs lg:text-sm print:text-xs text-muted-foreground border-b print:border-gray-300 no-print">
        {startTime} - {endTime}
      </div>

      {isVeryShortBlock ? (
        // Horizontal layout for very short blocks
        <div className="grid grid-cols-2 print:flex print:flex-1 print:flex-col print:justify-center print:items-center print:p-0 w-full h-full items-center overflow-hidden">
          <div className="flex flex-col items-center justify-center text-center px-1">
            <div className="font-medium text-sm print:text-xs truncate w-full">
              {subject}
            </div>
            <div className="text-xs print:text-xs truncate w-full">
              {formattedInstructor}
            </div>
          </div>
          <div className="flex flex-col items-center justify-center text-center px-1">
            <div className="flex flex-row items-center justify-center gap-1 w-full">
              <div className="text-xs font-medium print:text-xs truncate">
                {courseCode}
              </div>
              <div className="text-xs print:text-xs truncate">
                {sectionCourse}
              </div>
            </div>
            <div className="text-xs print:text-xs text-muted-foreground truncate w-full">
              {room && `Room ${room}`}
            </div>
          </div>
        </div>
      ) : isShortBlock ? (
        // Horizontal layout for short blocks
        <div className="grid grid-cols-2 print:flex print:flex-1 print:flex-col print:justify-center print:items-center print:p-0 w-full h-full items-center overflow-hidden">
          <div className="flex flex-col items-center justify-center text-center px-1">
            <div className="font-medium text-md print:text-xs truncate w-full">
              {subject}
            </div>
            <div className="text-sm print:text-xs truncate w-full">
              {formattedInstructor}
            </div>
          </div>
          <div className="flex flex-col items-center justify-center text-center px-1">
            <div className="flex flex-row items-center justify-center gap-1 w-full">
              <div className="text-sm font-medium print:text-xs truncate">
                {courseCode}
              </div>
              <div className="text-sm print:text-xs truncate">
                {sectionCourse}
              </div>
            </div>
            <div className="text-sm print:text-xs text-muted-foreground truncate w-full">
              {room && `Room ${room}`}
            </div>
          </div>
        </div>
      ) : isMediumBlock ? (
        // Vertical layout for medium blocks
        <div className="flex flex-1 flex-col justify-center items-center p-0 overflow-hidden">
          <div className="space-y-2 print:space-y-0.5 text-center">
            <div className="space-y-2 print:space-y-0.5">
              <div className="font-medium text-lg print:text-xs print:font-bold leading-5 print:leading-tight">
                {subject}
              </div>
              <div className="flex flex-1 flex-row justify-center items-center gap-2 print:gap-1">
                <div className="font-medium text-lg print:text-xs leading-4 print:leading-tight">
                  {courseCode}
                </div>
                <div className="font-medium text-lg print:text-xs leading-4 print:leading-tight">
                  {sectionCourse}
                </div>
              </div>
            </div>
            <div className="space-y-1 print:space-y-0">
              <div className="text-base print:text-xs leading-4 print:leading-tight">
                {formattedInstructor}
              </div>
              <div className="text-base print:text-xs leading-4 print:leading-tight text-muted-foreground">
                {room && `Room ${room}`}
              </div>
            </div>
          </div>
        </div>
      ) : (
        // Original vertical layout for normal blocks
        <div className="flex flex-1 flex-col justify-center items-center p-0 overflow-hidden">
          <div className="space-y-2 print:space-y-0.5 text-center">
            <div className="space-y-2 print:space-y-0.5">
              <div className="font-medium text-lg print:text-xs print:font-bold leading-5 print:leading-tight">
                {subject}
              </div>
              <div className="flex flex-1 flex-row justify-center items-center gap-2 print:gap-1">
                <div className="font-medium text-lg print:text-xs leading-4 print:leading-tight">
                  {courseCode}
                </div>
                <div className="font-medium text-lg print:text-xs leading-4 print:leading-tight">
                  {sectionCourse}
                </div>
              </div>
            </div>
            <div className="space-y-1 print:space-y-0">
              <div className="text-base print:text-xs leading-4 print:leading-tight">
                {formattedInstructor}
              </div>
              <div className="text-base print:text-xs leading-4 print:leading-tight text-muted-foreground">
                {room && `Room ${room}`}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
