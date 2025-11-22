"use client";

import React, { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { CloudUpload, NotepadText, Sun, Moon, FileUp } from "lucide-react";
import Link from "next/link";
import { useTheme } from "next-themes";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import GenericHeader from "@/components/layout/Header";

export default function UploadPage() {
  const { setTheme } = useTheme();
  const router = useRouter();
  const session = useSelector((state: RootState) => state.auth.session);
  const user = session.user;

  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = (files: FileList | null) => {
    if (files && files.length > 0) {
      const file = files[0];
      setError(null);
      uploadFile(file);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(false);
    handleFileChange(e.dataTransfer.files);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFileChange(e.target.files);
  };

  const uploadFile = async (file: File) => {
    setIsUploading(true);
    setUploadProgress(0);

    if (!user?.id || !user?.emailVerified) {
      setError("You must be logged in to upload a file.");
      setIsUploading(false);
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("user", JSON.stringify(user));

    try {
      const response = await axios.post("/api/summary", formData, {
        onUploadProgress: (progressEvent) => {
          const total = progressEvent.total || file.size;
          setUploadProgress(Math.round((progressEvent.loaded * 100) / total));
        },
      });

      setIsUploading(false);
      setIsSummarizing(true);
      await new Promise((r) => setTimeout(r, 1000));
      setIsSummarizing(false);

      const data = response.data;
      if (data?.data?.id) router.push(`/my-notes/${data.data.id}`);
      else router.push("/dashboard");
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || "An error occurred during upload.");
      setIsUploading(false);
      setIsSummarizing(false);
    }
  };

  return (
    <>
      <div
        className="flex flex-col min-h-screen items-center justify-start px-6 py-6 bg-neutral-50 dark:bg-gray-900 font-display"
      >
        {/* Header */}
        <div className="w-full lg:px-20 md:px-12 sm:px-4">
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
        </div>


        {/* Main */}
        <main className="flex flex-col items-center w-full max-w-2xl text-center mt-8">
          <div className="mb-8">
            <h1 className="text-4xl font-black leading-tight tracking-[-0.033em] text-gray-900 dark:text-white">
              Upload Your Lecture
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-base mt-2">
              Get Started with FlashNotes
            </p>
          </div>

          {/* Drag-and-drop zone */}
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragging(true);
            }}
            onDragLeave={(e) => {
              e.preventDefault();
              setDragging(false);
            }}
            onDrop={handleDrop}
            className={`w-5/6 flex flex-col items-center gap-4 rounded-xl border-2 border-dashed px-6 py-8 transition-colors 
              ${dragging
                ? "border-sky-500 bg-sky-100 dark:bg-sky-900/40"
                : "border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900/50"
              }`}
          >
            <CloudUpload className="w-12 h-12 text-sky-500 mb-2" />
            <p className="text-gray-900 dark:text-white text-lg font-bold">
              Drag & drop files here
            </p>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              or click to browse
            </p>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleInputChange}
              style={{ display: "none" }}
              accept=".pdf,.pptx,.docx,.mp3,.wav"
            />
            <Button
              className="hover:bg-teal-600 hover:scale-105 bg-teal-500 text-white font-bold text-lg p-6 cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading || isSummarizing}
            >
              Select Files
            </Button>
          </div>

          <p className="text-gray-500 dark:text-gray-400 text-sm pb-3 pt-4 text-center">
            Accepted formats: PDF, PPTX, MP3, WAV. Max file size: 100MB
          </p>

          {error && (
            <p className="text-red-500 text-sm font-medium mt-4 text-center">
              {error}
            </p>
          )}

          {(isUploading || isSummarizing) && (
            <div className="mt-8 w-full">
              <div className="flex flex-col gap-3 p-4">
                <div className="flex justify-between">
                  <p className="text-gray-900 dark:text-white font-medium">
                    {isUploading ? "Uploading..." : "AI is summarizing..."}
                  </p>
                  {isUploading && (
                    <p className="text-gray-900 dark:text-white text-sm">
                      {uploadProgress}%
                    </p>
                  )}
                </div>

                <div className="rounded-full bg-gray-200 dark:bg-gray-700 h-2.5">
                  <div
                    className="h-2.5 rounded-full transition-all"
                    style={{
                      width: isUploading ? `${uploadProgress}%` : "100%",
                      backgroundColor: isSummarizing ? "#f59e0b" : "#3b82f6",
                    }}
                  ></div>
                </div>

                {isSummarizing && (
                  <div className="flex items-center justify-center gap-2 text-gray-500 dark:text-gray-400 text-sm mt-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                    <p>Processing your lecture...</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </main>

        {/* Footer */}
        <Separator className="my-8 max-w-3xl" />
        <footer className="text-center text-gray-500 dark:text-gray-400 text-sm">
          © 2025 FlashNotes. All rights reserved. |{" "}
          <Link className="hover:text-primary" href="#">
            About
          </Link>{" "}
          |{" "}
          <Link className="hover:text-primary" href="#">
            Contact
          </Link>
        </footer>
      </div>
    </>
  );
}
