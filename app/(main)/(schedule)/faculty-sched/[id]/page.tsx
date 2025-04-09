// import { ScheduleView } from "../schedule-view"

// export default function FacultyPage() {
//   return <ScheduleView view="faculty" />
// }

"use client";

import { useParams } from "next/navigation";
import { ScheduleView } from "../../schedule-view";

export default function FacultySchedulePage() {
  const params = useParams();
  const facultyId = params.id as string;

  return <ScheduleView view="Faculty" facultyId={facultyId} />;
}
