interface ScheduleBlockProps {
  startTime: string; // Format: "8:00 AM"
  endTime: string; // Format: "12:00 PM"
  course: string;
  section: string;
  instructor: string;
  room: string;
  view: "rooms" | "faculty" | "sections";
}

export function ScheduleBlock({
  startTime,
  endTime,
  course,
  section,
  instructor,
  room,
  view,
}: ScheduleBlockProps) {
  const viewColors = {
    rooms: "bg-emerald-50 border-emerald-100",
    faculty: "bg-blue-50 border-blue-100",
    sections: "bg-purple-50 border-purple-100",
  };

  return (
    <div
      className={`rounded-lg border ${viewColors[view]} w-full h-full flex flex-col`}
    >
      <div className=" text-center text-xs text-muted-foreground border-b p-2 pb-1 mb-1">
        {startTime} - {endTime}
      </div>
      <div className="flex flex-1 flex-col justify-center items-center p-2">
        <div className="space-y-2 text-center">
          <div className="space-y-1">
            <div className="font-medium leading-3 ">{course}</div>
            <div className="font-medium leading-3">{section}</div>
          </div>
          <div className="space-y-1">
          <div className="text-sm leading-3">{instructor}</div>
          <div className="text-sm leading-3 text-muted-foreground">{room}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
