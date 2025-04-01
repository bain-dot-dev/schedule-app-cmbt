"use client";

import React from "react";
import { Toaster, toast } from "sonner";

export default function Sidebar() {
  return (
    <div>
      <Toaster />
      <button
        onClick={() =>
          toast.success("Success!", {
            description: "This is a success message!",
          })
        }
      >
        Show Toast
      </button>
    </div>
  );
}
