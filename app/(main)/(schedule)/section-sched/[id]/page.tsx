"use client";

import { useParams } from "next/navigation";
import { ScheduleView } from "../../schedule-view";

export default function SectionPage() {
  const params = useParams();
  const sectionId = params.id as string;

  return <ScheduleView view="Section" sectionId={sectionId} />;
}
