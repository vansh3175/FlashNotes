"use client";

import React, { useState, useEffect } from "react";
import {
  PlusCircle,
  Search,
  Layers,
  HelpCircle,
  Download,
  NotepadText,
  Sun,
  Moon,
} from "lucide-react";
import { jsPDF } from "jspdf";
import Link from "next/link";
import { useTheme } from "next-themes";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import GenericHeader from "@/components/layout/Header";


type Card = {
  id: number;
  title: string;
  createdAt: Date;
  summary_text:String
};

export default function NotesDashboard() {
  const [filterSelected, setFilterSelected] = useState<string>("all");
  const [list, setList] = useState<Card[]>([]);
  const [filteredList, setFilteredList] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { setTheme } = useTheme();
  const session = useSelector((state: RootState) => state.auth.session);
  const user = session?.user;

  useEffect(() => {
    const fetchLectureData = async () => {
      try {
        const res = await axios.get(
          `/api/summary?userId=${user?.id}&emailVerified=${user?.emailVerified}`
        );

        // ✅ Convert all createdAt values to real Date objects
        const parsedData = res.data.data.map((note: any) => ({
          ...note,
          createdAt: new Date(note.createdAt),
        }));

        // console.log("Fetched Notes:", parsedData);
        setList(parsedData);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load notes");
      } finally {
        setLoading(false);
      }
    };

    fetchLectureData();
  }, [user]);

  // 🧠 Filter notes whenever list or filterSelected changes
  useEffect(() => {
    if (!list.length) return;

    const now = new Date();

    const filtered = list.filter((note) => {
      const noteDate = note.createdAt;

      switch (filterSelected) {
        case "month":
          return (
            noteDate.getMonth() === now.getMonth() &&
            noteDate.getFullYear() === now.getFullYear()
          );

        case "days":
          const sevenDaysAgo = new Date();
          sevenDaysAgo.setDate(now.getDate() - 7);
          return noteDate >= sevenDaysAgo && noteDate <= now;

        case "today":
          return (
            noteDate.getDate() === now.getDate() &&
            noteDate.getMonth() === now.getMonth() &&
            noteDate.getFullYear() === now.getFullYear()
          );

        default:
          return true;
      }
    });

    setFilteredList(filtered);
  }, [list, filterSelected]);

  const handleDownloadPDF = (note:Card) => {
     const doc = new jsPDF();

  // Title
  doc.setFontSize(18);
  doc.text(note.title, 10, 20);

  // Optional: Add creation date
  doc.setFontSize(11);
  doc.text(`Created At: ${note.createdAt.toDateString()}`, 10, 30);

  // Content placeholder (if your note has text or summary)
  doc.setFontSize(12);
  doc.text(`${note.summary_text}`, 10, 55, { maxWidth: 190 });


  // Save file
  doc.save(`${note.title}.pdf`);
  }


  const handleFilter = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setFilterSelected(e.currentTarget.id);
  };

  if (loading) {
    return (
      <div className="text-center text-gray-500 dark:text-gray-300 py-12">
        Loading...
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-red-500 py-12">{error}</div>;
  }

  const notesToDisplay = filterSelected === "all" ? list : filteredList;


  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-gray-900 flex flex-col">
      {/* Header */}
      <header className="w-full">
        <div className="container mx-auto px-4 md:px-12 lg:px-20 py-4">
          <GenericHeader
            logo={
              <div className="flex items-center gap-4 text-[#111418] dark:text-white">
                <NotepadText size={48} className="text-sky-600" />
                <h1 className="text-2xl font-bold tracking-tight">FlashNotes</h1>
              </div>
            }
            links={[
              { label: "Dashboard", href: "/dashboard" }
            ]}
          />
        </div>
      </header>


      {/* Main Section */}
      <main className="flex-1">
        <div className="container mx-auto px-4 md:px-12 lg:px-20 py-8 md:py-12">
          {/* Heading + Button */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-gray-900 dark:text-white text-3xl md:text-4xl font-black">
                All Notes & Summaries
              </h1>
              <p className="text-gray-500 dark:text-gray-400">
                Manage your lecture notes and AI-generated study materials.
              </p>
            </div>

            <button className="flex w-full md:w-auto items-center gap-2 rounded-lg h-10 px-4 bg-sky-600 text-white font-bold hover:bg-sky-500">
              <PlusCircle className="size-5" />
              <Link href={'/upload'}>New Notes</Link>
            </button>
          </div>

          {/* Search + Filters */}
          <div className="mb-6 rounded-xl border border-gray-200 bg-white dark:border-white/10 dark:bg-gray-800/50 p-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center bg-gray-100 dark:bg-gray-700/50 rounded-lg h-12">
                  <Search className="text-gray-400 mx-4" />
                  <input
                    className="flex-1 bg-transparent border-none focus:outline-none text-gray-800 dark:text-white"
                    placeholder="Search by lecture name or topic..."
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 overflow-x-auto pb-2">
                {["all", "month", "days", "today"].map((id) => (
                  <button
                    key={id}
                    id={id}
                    onClick={handleFilter}
                    className={`flex h-10 items-center justify-center rounded-lg px-4 text-sm font-medium ${
                      filterSelected === id
                        ? "bg-sky-600 text-white"
                        : "bg-gray-100 text-gray-700 dark:bg-gray-700/50 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                    }`}
                  >
                    {id === "all"
                      ? "All Time"
                      : id === "month"
                      ? "This Month"
                      : id === "days"
                      ? "Last 7 Days"
                      : "Today"}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Notes Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {notesToDisplay.length ? (
              notesToDisplay.map((note) => (
                <div
                  key={note.id}
                  className="group flex flex-col justify-between rounded-xl border border-gray-200 bg-neutral-50 p-6 transition-all dark:border-white/10 dark:bg-gray-800"
                >
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                      {note.title}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                      {note.createdAt instanceof Date
                        ? note.createdAt.toDateString()
                        : new Date(note.createdAt).toDateString()}
                    </p>
                  </div>

                  <div className="mt-6 flex flex-col gap-3">
                    <button className="flex justify-center items-center h-10 px-4 rounded-lg bg-sky-600 text-white font-bold hover:bg-sky-500">
                      <Link href={`/my-notes/${note.id}`} >
                      View Summary
                      </Link>
                    </button>

                    <div className="flex justify-center gap-4">
                      <button className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400 hover:text-sky-600 text-sm font-medium">
                        <Layers className="size-4" />
                        <Link href={`/flashcards/${note.id}`}>
                        Flashcards
                        </Link>
                      </button>

                      <button className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400 hover:text-sky-600 text-sm font-medium">
                        <HelpCircle className="size-4" />
                        <Link href={`/quiz/${note.id}`}>
                        Quiz
                        </Link>
                      </button>

                      <button className="flex items-center gap-1.5 cursor-pointer text-gray-500 dark:text-gray-400 hover:text-sky-600 text-sm font-medium"
                      onClick={() => handleDownloadPDF(note)}
                      >
                        <Download className="size-4" />
                        PDF
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center text-gray-500 dark:text-gray-400">
                No notes found for this filter.
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
