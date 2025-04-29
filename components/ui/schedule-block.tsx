interface ScheduleBlockProps {
  startTime: string; // Format: "8:00 AM"
  endTime: string; // Format: "12:00 PM"
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

  return (
    <div
      className={`rounded-lg border ${viewColors[view]} w-full h-full flex flex-col`}
    >
      <div className="text-center text-sm lg:text-base print:text-sm text-muted-foreground border-b mb-1">
        {startTime} - {endTime}
      </div>
      <div className="flex flex-1 flex-col justify-center items-center p-0">
        <div className="space-y-2 print:space-y-1 text-center">
          <div className="space-y-2 print:space-y-0">
            <div className="font-medium text-lg print:text-sm leading-3">
              {subject}
            </div>
            <div className="flex flex-1 flex-row justify-center items-center gap-2">
              <div className="font-medium text-lg print:text-sm leading-3">
                {courseCode}
              </div>
              <div className="font-medium text-lg print:text-sm leading-3">
                {sectionCourse}
              </div>
            </div>
          </div>
          <div className="space-y-1 print:space-y-0">
            <div className="text-base  print:text-sm leading-3">
              {instructor}
            </div>
            <div className="text-base  print:text-sm leading-3 text-muted-foreground">
              Room {room}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
