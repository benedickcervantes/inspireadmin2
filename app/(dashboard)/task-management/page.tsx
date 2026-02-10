"use client";

import React from "react";
import TaskDashboardHeader from "./_components/TaskDashboardHeader";
import TaskGrid from "./_components/TaskGrid";

export default function TaskManagementPage() {
  return (
    <div className="flex w-full flex-col gap-6">
      <TaskDashboardHeader />
      <TaskGrid />
    </div>
  );
}
