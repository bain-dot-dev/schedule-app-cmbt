"use client";

import { useParams } from "next/navigation";
import { ScheduleView } from "../../schedule-view";

export default function RoomPage() {
  const params = useParams();
  const roomId = params.id as string;

  return <ScheduleView view="Room" roomId={roomId} />;
}
