"use client";
import Link from "next/link";
import { Moon, Sun, NotepadText, BookOpenText, ChartArea, TextQuoteIcon, Star, Menu } from "lucide-react"
import { useTheme } from "next-themes"
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import GenericHeader from "@/components/layout/Header";


export default function Home() {
  const {setTheme} = useTheme();


  return (
    <div className="bg-neutral-50 dark:bg-gray-900 font-display text-[#111418] dark:text-white pl-4 pr-4 md:pl-8 md:pr-8 lg:pl-20 lg:pr-20 sm:pl-6 sm:pr-6 pt-5">
      <div className="relative flex h-auto min-h-screen w-full flex-col overflow-x-hidden">
        {/* Navbar */}
        <GenericHeader
          logo={
    <>
      <NotepadText size={48} className="text-sky-600" />
      <h1 className="text-2xl font-bold">FlashNotes</h1>
    </>
  }
  links={[
    { label: "Features", href: "#features" },
    { label: "Testimonials", href: "#testimonials" },
  ]}
  extra={
    <div className="flex gap-3">
      <Link href="/upload">
        <button className="px-4 py-2 cursor-pointer bg-blue-500 text-white rounded-lg hover:scale-105 duration-200">
          Create
        </button>
      </Link>
      <Link href="/dashboard">
        <button className="px-4 py-2 cursor-pointer bg-gray-200 dark:bg-gray-700 rounded-lg hover:scale-105 duration-200">
          My Notes
        </button>
      </Link>
    </div>
  }
  mobileItems={
    <>
      <DropdownMenuItem>
        <Link href="#features" className="text-lg">Features</Link>
      </DropdownMenuItem>
      <DropdownMenuItem>
        <Link href="#testimonials" className="text-lg">Testimonials</Link>
      </DropdownMenuItem>
      <DropdownMenuItem>
        <Link href="/upload" className="w-full text-left">Create</Link>
      </DropdownMenuItem>
      <DropdownMenuItem>
        <Link href="/dashboard" className="w-full text-left">My Notes</Link>
      </DropdownMenuItem>
    </>
  }
  />

        {/* Main Content */}
        <main>
          {/* Hero Section */}
          <section className="py-10 px-4 sm:px-6 md:px-10">
            <div className="flex flex-col-reverse lg:flex-row gap-10 items-center">
              <div className="flex flex-col gap-6 w-full lg:w-1/2 text-left">
                <div className="flex flex-col gap-2">
                  <h1 className="text-4xl font-black leading-tight tracking-[-0.033em] sm:text-5xl">
                    AI-powered lecture summaries & flashcards
                  </h1>
                  <h2 className="text-base sm:text-lg">
                    FlashNotes helps you learn smarter, not harder. Upload your lectures and get instant summaries, flashcards, and quizzes.
                  </h2>
                </div>
                <div className="flex flex-wrap gap-3">
                  <button className="flex cursor-pointer items-center justify-center h-12 px-5 rounded-lg bg-teal-400 text-white text-base font-bold transition-transform duration-200 hover:scale-105">
                    <Link href={'upload'}>
                    Upload Lecture
                    </Link>
                  </button>
                  <button className="flex cursor-pointer items-center justify-center h-12 px-5 rounded-lg bg-[#e0e0e0] dark:bg-[#2e3a47] text-[#111418] dark:text-white text-base font-bold transition-transform duration-200 hover:scale-105">
                    <Link href={'dashboard'}>
                    Explore Notes</Link>
                  </button>
                </div>
              </div>

              
              <DotLottieReact
                src="https://lottie.host/50235c33-98f4-43d4-8d2f-34ef1f2182ec/xX7FYqrInS.lottie"
                loop
                autoplay
              />
            </div>
          </section>

          {/* Features */}
          <section className="flex flex-col gap-10 px-4 py-10 sm:px-6 md:px-10" id="features">
            <div className="flex flex-col gap-4 text-center items-center">
              <h1 className="text-[32px] font-bold leading-tight max-w-[720px]">
                Unlock Your Learning Potential
              </h1>
              <p className="text-[#617589] dark:text-[#aebccb] max-w-[720px]">
                FlashNotes offers a suite of tools designed to help you excel in your studies.
              </p>
            </div>

            <div className="grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-6">
              {[
                {
                  icon: BookOpenText,
                  title: "Summarization",
                  desc: "Get concise summaries of your lectures in seconds, saving you hours of manual note-taking.",
                },
                {
                  icon: TextQuoteIcon,
                  title: "Flashcards & Quizzes",
                  desc: "Reinforce your learning with automatically generated flashcards and quizzes based on your lecture content.",
                },
                {
                  icon: ChartArea,
                  title: "Analytics Dashboard",
                  desc: "Track your progress and identify areas for improvement with our insightful analytics dashboard.",
                },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.title}
                    className="flex flex-col gap-4 rounded-xl border border-[#dbe0e6] dark:border-[#2e3a47] bg-white dark:bg-gray-800 p-12 transition-transform duration-300 hover:-translate-y-2"
                  >
                    <div className="text-primary ">
                      <Icon className="h-12 w-12 text-blue-600" />
                    </div>
                    <div className="flex flex-col gap-2">
                      <h2 className="text-xl font-bold">{item.title}</h2>
                      <p className="text-[#617589] dark:text-[#aebccb] text-lg">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            
          </section>
          
          {/*testimonials */}

          <section className="sm:px-6 md:px-10 flex flex-col gap-10 px-4 py-10 " id="testimonials"> 

            <h1 className="text-center text-[32px] font-bold leading-tight ">
              What Our Students Say
            </h1>


            <div className="grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-6">
          {[
            {
              name: "Aarav Sharma",
              role: "Engineering Student",
              feedback:
                "FlashNotes completely changed how I study! The summarization tool saves me hours every week.",
              img: "https://randomuser.me/api/portraits/men/32.jpg",
              rating: 5,
            },
            {
              name: "Sneha Patel",
              role: "Medical Student",
              feedback:
                "The flashcards are a game-changer. I can revise anytime, anywhere — and my scores have improved drastically!",
              img: "https://randomuser.me/api/portraits/women/44.jpg",
              rating: 5,
            },
            {
              name: "Rohan Mehta",
              role: "Business Management",
              feedback:
                "The analytics dashboard helped me focus on weak areas and prepare smarter before exams.",
              img: "https://randomuser.me/api/portraits/men/56.jpg",
              rating: 4,
            },
          ].map((item) => (
            <div
              key={item.name}
              className="flex flex-col gap-4 rounded-xl border border-[#dbe0e6] dark:border-[#2e3a47] bg-white dark:bg-gray-800 p-6 transition-transform duration-300 hover:-translate-y-2"
            >
              <div className="flex items-center gap-4">
                <img
                  src={item.img}
                  alt={item.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <h2 className="text-xl font-semibold text-[#111418] dark:text-white">
                    {item.name}
                  </h2>
                  <p className="text-[#617589] dark:text-[#aebccb] text-sm">{item.role}</p>
                  <div className="flex gap-1 mt-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={i < item.rating ? "text-teal-500" : "text-gray-300"}
                        size={16}
                      />
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-[#617589] dark:text-[#aebccb] text-lg italic leading-relaxed mt-2">
                “{item.feedback}”
              </p>
            </div>
          ))}
        </div>
          </section>


          {/* Call to Action */}
          <section className="px-4 py-10 sm:px-10 md:px-20 text-center bg-white dark:bg-gray-800 rounded-xl my-10">
            <div className="flex flex-col justify-center items-center gap-6">
              <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold leading-tight sm:text-4xl">
                  Ready to supercharge your studies?
                </h1>
                <p className="text-base text-[#617589] dark:text-[#aebccb] max-w-2xl mx-auto">
                  Sign up for FlashNotes today and experience the future of learning.
                </p>
              </div>
              <button className="flex items-center justify-center h-12 px-5 rounded-lg bg-teal-400 text-white text-base font-bold transition-transform duration-200 hover:scale-105">
                <Link href={'dashboard'}>
                Get Started for Free</Link>
              </button>
            </div>
          </section>
        </main>

        {/* Footer */}
        <footer className="border-t border-solid border-[#dbe0e6] dark:border-[#2e3a47] mt-10 py-8 px-4 sm:px-6 md:px-10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-sm text-[#617589] dark:text-[#aebccb]">
              © 2025 FlashNotes. All rights reserved.
            </div>
            <div className="flex gap-6">
              <Link className="text-sm font-medium hover:text-primary" href="#">
                About Us
              </Link>
              <Link className="text-sm font-medium hover:text-primary" href="#">
                Contact
              </Link>
              <Link className="text-sm font-medium hover:text-primary" href="#">
                Privacy Policy
              </Link>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

