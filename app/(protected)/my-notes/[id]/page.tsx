// app/summary/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useTheme } from "next-themes";
import {
  Download,
  Layers,
  HelpCircle,
  NotepadText,
  Sun,
  Moon,
} from "lucide-react";
import {jsPDF} from "jspdf";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import axios from "axios";
import { useSelector, UseSelector } from "react-redux";
import { RootState } from "@/lib/store";
import { title } from "process";
import GenericHeader from "@/components/layout/Header";
import Image from "next/image";

// ✅ TypeScript interface for lecture data
interface LectureData {
  title: string;
  date: string;
  summary: string;
  
}



const SummaryPage = () => {
  const { setTheme } = useTheme();
  const [lecture, setLecture] = useState<LectureData | null>(null);
  const [loading, setLoading] = useState(true);
  const params = useParams();
  const lectureId = params.id;

  const session = useSelector((state:RootState)=>state.auth.session);


  const handleDownloadPDF = (note:LectureData) => {
       const doc = new jsPDF();
  
    // Title
    doc.setFontSize(18);
    doc.text(note.title, 10, 20);
  
    // Optional: Add creation date
    doc.setFontSize(11);
    doc.text(`Created At: ${new Date(note.date).toLocaleDateString()}`, 10, 30);
  
    // Content placeholder (if your note has text or summary)
    doc.setFontSize(12);
    doc.text(`${note.summary}`, 10, 55, { maxWidth: 190 });
  
  
    // Save file
    doc.save(`${note.title}.pdf`);
    }
  

  useEffect(() => {
    const fetchLectureData = async () => {
      try {
       
        const res = await axios.get(`/api/summary/${lectureId}?userId=${session?.user.id}&emailVerified=${session?.user.emailVerified}`)
        
        const lec:LectureData = {
          title:res.data.data.title,
          summary:res.data.data.summary_text,
          date:res.data.data.createdAt
        }
        setLecture(lec);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchLectureData();
  }, []);


  

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-xl font-semibold">
        <div className="text-center text-gray-500 dark:text-gray-300 py-12">
                <Image src="/preloader.gif" alt="Loading..." width={40} height={40} className="mx-auto h-12 w-12" />
              </div>
      </div>
    );
  }

  if (!lecture) {
    return (
      <div className="flex items-center justify-center min-h-screen text-xl font-semibold text-red-500">
        Failed to load lecture data.
      </div>
    );
  }

  return (
    <div className="relative w-full flex min-h-screen  flex-col bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      {/* Header */}
      <header className="w-full lg:px-20 md:px-12 sm:p-4 p-4  ">
          <GenericHeader
            logo={
              <div className="flex items-center gap-4 text-[#111418] dark:text-white">
                <NotepadText size={48} className="text-sky-600" />
                <h1 className="text-2xl font-bold leading-tight tracking-[-0.015em]">
                  FlashNotes
                </h1>
              </div>
            }
            links={[
              { label: "Dashboard", href: "/dashboard" }
            ]}
          />
        </header>


      {/* Main Content */}
      <main className="flex-1 px-4 md:px-8 lg:px-16 py-10">
        <div className="max-w-4xl mx-auto">
          {/* Lecture Info */}
          <div className="flex flex-wrap justify-between items-start gap-4 mb-8">
            <div>
              <h1 className="text-4xl font-black leading-tight text-gray-900 dark:text-gray-100">
                Lecture Title: {lecture.title}
              </h1>
              <p className="text-gray-500 dark:text-gray-400 mt-2">
                Date: {lecture.date}
              </p>
            </div>

            <button className="cursor-pointer flex items-center justify-center rounded-lg h-12 px-5 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-200 font-bold transition"
            onClick={()=>{handleDownloadPDF(lecture)}}
            >
              <Download className="mr-2 size-5" />
              Download as PDF
            </button>
          </div>

          {/* Summary Box */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm flex flex-col max-h-[55vh]">
            <div className="p-8 pb-6">
              <h2 className="text-2xl font-bold">AI-Generated Summary</h2>
            </div>

            <div
              className="px-8 pb-8 flex-1 overflow-y-auto text-lg leading-relaxed text-gray-800 dark:text-gray-200 
              [&::-webkit-scrollbar]:w-2 
              [&::-webkit-scrollbar-thumb]:rounded-full 
              [&::-webkit-scrollbar-thumb]:bg-gray-400/70 
              dark:[&::-webkit-scrollbar-thumb]:bg-gray-500 
              [&::-webkit-scrollbar-track]:bg-transparent"
              dangerouslySetInnerHTML={{ __html: lecture.summary }}
            />

            {/* Footer Buttons */}
            <div className="flex flex-wrap gap-4 p-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                <Link href={`/flashcards/${lectureId}`}>
                  <button className="flex flex-1 cursor-pointer sm:flex-none items-center justify-center rounded-lg h-12 px-6 bg-blue-500 text-white font-bold hover:bg-blue-600 transition-transform transform hover:scale-105">
                    <Layers className="mr-2 size-5" />
                    Generate Flashcards
                  </button>
                </Link>
                <Link href={`/quiz/${lectureId}`}>
              <button className="flex flex-1 cursor-pointer sm:flex-none items-center justify-center rounded-lg h-12 px-6 bg-teal-500 text-white font-bold hover:bg-teal-600 transition-transform transform hover:scale-105">
                <HelpCircle className="mr-2 size-5" />
                Generate Quiz
              </button>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SummaryPage;
