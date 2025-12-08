"use client"

import type React from "react"

import { Sidebar } from "./sidebar"
import { DashboardHeader } from "./header"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader />
        <main className="flex-1 overflow-auto p-8 bg-background">{children}</main>
      </div>
    </div>
  )
}
