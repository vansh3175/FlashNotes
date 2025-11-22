"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import Header from "@/components/layout/Header";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@radix-ui/react-dropdown-menu";
import {
  Home,
  Upload,
  FileText,
  Layers,
  BarChart,
  Bell,
  User,
  Menu,
  X,
  Sun,
  Moon,
  NotepadText,
  LogOut
} from "lucide-react";
import { useTheme } from "next-themes";
import { useSelector, UseSelector } from "react-redux";
import { RootState } from "@/lib/store";
import Link from "next/link";
import GenericHeader from "@/components/layout/Header";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { setTheme } = useTheme();
  const session = useSelector((state:RootState)=>state.auth);
  const router = useRouter();
  

  const navItems = [
    { icon: Home, label: "Home",route:"/dashboard" },
    { icon: Upload, label: "Upload Lecture",route:"/upload" },
    { icon: FileText, label: "Notes",route:"/my-notes" }
  ];

    const handleLogOut = async () => {
      console.log("Logging out...");
          await authClient.signOut({
        fetchOptions: {
          onSuccess: () => {
            router.push("/");
          },
        },
      });

    }


  return (
    <div className="flex min-h-screen bg-neutral-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 relative">
      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col justify-between z-40 transform transition-transform duration-300 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="flex flex-col gap-6 p-4">
          {/* Logo */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <NotepadText className="text-sky-500" />
              <h1 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                QuickNotes
              </h1>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsSidebarOpen(false)}
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex flex-col gap-2">
            {navItems.map(({ icon: Icon, label,route }) => (
              <Link
                key={label}
                href={route}
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-sky-100 dark:hover:bg-gray-700 transition-colors duration-200"
              >
                <Icon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                <span className="text-sm font-medium">{label}</span>
              </Link>
            ))}
          </nav>
        </div>

        {/* Logout */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 cursor-pointer">
          <button
            onClick={handleLogOut}
            className="flex items-center cursor-pointer gap-3 px-3 py-2 w-full rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-gray-700 transition-colors duration-200"
          >
            <LogOut className="w-5 h-5 text-red-600 dark:text-red-400" />
            <span className="text-sm font-medium">Log Out</span>
          </button>
        </div>

      </aside>

      {/* Sidebar overlay (mobile) */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="flex-1 md:ml-64 p-6 sm:p-8">
        {/* Header */}
        <GenericHeader
  logo={
    <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">
      {`Welcome back, ${session.session.user.name}!`}
    </h1>
  }
  showHamburger={true}
  onHamburgerClick={() => setIsSidebarOpen(true)}
  
/>


        <Separator className="bg-gray-200 dark:bg-gray-700" />

        {/* Quick Access */}
        <section className="mt-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Quick Access
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: Upload,
                title: "Upload a New Lecture",
                desc: "Upload audio, video, or text files to get started.",
              },
              {
                icon: FileText,
                title: "Review Notes",
                desc: "Review your notes and summaries.",
              },
              {
                icon: Layers,
                title: "Test Your Knowledge",
                desc: "Take quizzes and flashcards based on your lecture materials.",
              },
            ].map(({ icon: Icon, title, desc }) => (
              <Card
                key={title}
                className="hover:shadow-md transition hover:scale-95 bg-white dark:bg-gray-800"
              >
                <CardContent className="p-6 flex flex-col gap-4">
                  <div className="w-12 h-12 flex items-center justify-center rounded-lg bg-sky-100 dark:bg-gray-700">
                    <Icon className="w-6 h-6 text-sky-600 dark:text-sky-400" />
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                      {title}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {desc}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <Separator className="my-8 bg-gray-200 dark:bg-gray-700" />

        <section>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Study Suggestions
        </h2>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <div className="h-3 w-3 bg-sky-500 rounded-full"></div>
            <span className="text-gray-700 dark:text-gray-300 text-sm">
              Revise your older lectures once every week.
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="h-3 w-3 bg-green-500 rounded-full"></div>
            <span className="text-gray-700 dark:text-gray-300 text-sm">
              Try solving a quiz before reading notes.
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="h-3 w-3 bg-orange-500 rounded-full"></div>
            <span className="text-gray-700 dark:text-gray-300 text-sm">
              Break long study sessions into smaller chunks.
            </span>
          </div>
        </div>
      </section>

      </main>
    </div>
  );
}
