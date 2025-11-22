"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import GenericHeader from "@/components/layout/Header";
import { NotepadText } from "lucide-react";
import Link from "next/link";
import { useTheme } from "next-themes";

type Flashcard = {
  question: string;
  answer: string;
  difficulty: "EASY" | "MEDIUM" | "HARD";
};

export default function FlashcardsPage() {
  const { id } = useParams(); // lectureId
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const { setTheme } = useTheme();

  // 🎨 Random Color Generator
  const getRandomColor = () => {
    const colors = [
      "bg-red-100 border-red-300",
      "bg-orange-100 border-orange-300",
      "bg-amber-100 border-amber-300",
      "bg-lime-100 border-lime-300",
      "bg-green-100 border-green-300",
      "bg-teal-100 border-teal-300",
      "bg-cyan-100 border-cyan-300",
      "bg-blue-100 border-blue-300",
      "bg-indigo-100 border-indigo-300",
      "bg-violet-100 border-violet-300",
      "bg-purple-100 border-purple-300",
      "bg-pink-100 border-pink-300",
      "bg-rose-100 border-rose-300",
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  // 🎨 Color states for front/back
  const [frontColor, setFrontColor] = useState(getRandomColor());
  const [backColor, setBackColor] = useState(getRandomColor());

  // Fetch flashcards
  useEffect(() => {
    if (!id) return;

    const fetchFlashcards = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/flashcards?lectureId=${id}`);
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || "Failed to fetch flashcards");
        }

        setFlashcards(data.data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFlashcards();
  }, [id]);

  // Previous card
  const prevCard = () => {
    setFlipped(false);
    setTimeout(() => {
      setIndex((prev) => (prev === 0 ? flashcards.length - 1 : prev - 1));
    }, 200);
    setFrontColor(getRandomColor());
    setBackColor(getRandomColor());
  };

  // Next card
  const nextCard = () => {
    setFlipped(false);
    setTimeout(() => {
      setIndex((prev) => (prev === flashcards.length - 1 ? 0 : prev + 1));
    }, 200);
    setFrontColor(getRandomColor());
    setBackColor(getRandomColor());
  };

  // 🔄 Flip card + randomize colors
  const flipCard = () => {
    setFlipped(!flipped);
    setFrontColor(getRandomColor());
    setBackColor(getRandomColor());
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50 dark:bg-gray-900 text-gray-700 dark:text-gray-200">
        Loading flashcards...
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50 dark:bg-gray-900 text-red-500">
        {error}
      </div>
    );
  }

  // Empty flashcards
  if (flashcards.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-neutral-50 dark:bg-gray-900 text-gray-700 dark:text-gray-200">
        <h2 className="text-2xl font-semibold mb-2">No flashcards found</h2>
        <p>Try regenerating them in your dashboard or check lecture content.</p>
      </div>
    );
  }

  const current = flashcards[index];

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-gray-900">
      {/* ---------------- HEADER ---------------- */}
      <header className="w-full ">
        <div className="lg:px-20 md:px-12 sm:px-4 p-4">
          <GenericHeader
            logo={
              <div className="flex items-center gap-4 text-[#111418] dark:text-white">
                <NotepadText size={48} className="text-sky-600" />
                <h1 className="text-2xl font-bold leading-tight tracking-[-0.015em]">
                  FlashNotes
                </h1>
              </div>
            }
            links={[{ label: "Dashboard", href: "/dashboard" }]}
          />
        </div>
      </header>

      {/* ---------------- MAIN CONTENT ---------------- */}
      <div className="flex flex-col items-center justify-center px-4 mt-10">
        <header className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-neutral-50">
            Flashcards for the Lecture
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            Review your knowledge with these AI-generated flashcards.
          </p>
        </header>

        {/* Flashcard */}
        <div
          onClick={flipCard}
          className="relative w-80 h-48 sm:w-[28rem] sm:h-60 cursor-pointer [perspective:1000px]"
        >
          <div
            className={`relative w-full h-full transition-transform duration-500 [transform-style:preserve-3d] ${
              flipped ? "[transform:rotateY(180deg)]" : ""
            }`}
          >
            {/* Front */}
            <div
              className={`absolute inset-0 flex flex-col items-center justify-center 
                rounded-2xl shadow-xl backface-hidden 
                ${frontColor} 
                 dark:border-gray-700`}
            >
              <p className="text-sm text-gray-600 mb-2">
                Question
              </p>
              <h2 className="text-xl font-semibold text-gray-900  text-center px-4">
                {current.question}
              </h2>
            </div>

            {/* Back */}
            <div
              className={`absolute inset-0 flex flex-col items-center justify-center 
                rounded-2xl shadow-xl [transform:rotateY(180deg)] backface-hidden 
                ${backColor} 
                dark:border-gray-700`}
            >
              <p className="text-sm text-gray-600  mb-2">
                Answer
              </p>
              <h2 className="text-xl font-semibold text-gray-900  text-center px-4">
                {current.answer}
              </h2>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex justify-between items-center w-full max-w-xs sm:max-w-md mt-8">
          <button
            onClick={prevCard}
            className="px-4 py-2 cursor-pointer rounded-lg 
              bg-teal-500 text-white 
              hover:bg-teal-600 
              dark:bg-teal-600 dark:hover:bg-teal-700 
              transition-colors shadow-md"
          >
            ← Previous
          </button>

          <span className="text-gray-600 dark:text-gray-300 text-sm">
            Card {index + 1} of {flashcards.length}
          </span>

          <button
            onClick={nextCard}
            className="px-4 py-2 cursor-pointer rounded-lg 
              bg-teal-500 text-white 
              hover:bg-teal-600 
              dark:bg-teal-600 dark:hover:bg-teal-700 
              transition-colors shadow-md"
          >
            Next →
          </button>
        </div>

        
      </div>
    </div>
  );
}
