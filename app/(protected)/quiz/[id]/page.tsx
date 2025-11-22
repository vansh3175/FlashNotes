"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter, usePathname } from "next/navigation";
import GenericHeader from "@/components/layout/Header";
import { NotepadText } from "lucide-react";
import toast from "react-hot-toast";

/* ----------------------------------------------------
   GLOBAL Navigation Guard Hook
---------------------------------------------------- */
function useNavigationGuard(shouldBlock: boolean) {
  const pathname = usePathname();
  const prevPath = React.useRef(pathname);

  // Detect internal route change
  useEffect(() => {
    if (prevPath.current !== pathname) {
      if (shouldBlock) {
        toast.error("You haven't completed the quiz. Progress will be lost!");
      }
    }
    prevPath.current = pathname;
  }, [pathname, shouldBlock]);

  // Detect refresh / closing tab
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (!shouldBlock) return;
      toast.error("Your quiz progress will be lost!");
      e.preventDefault();
      e.returnValue = "";
      return "";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () =>
      window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [shouldBlock]);

  // Detect browser back
  useEffect(() => {
    const handlePop = () => {
      if (shouldBlock) {
        toast.error("Leaving now will discard your quiz progress.");
      }
    };

    window.addEventListener("popstate", handlePop);
    return () => window.removeEventListener("popstate", handlePop);
  }, [shouldBlock]);
}

/* ----------------------------------------------------
   TYPES
---------------------------------------------------- */
type QuizQuestion = {
  question: string;
  options: string[];
  correct_answer: string;
  difficulty: "EASY" | "MEDIUM" | "HARD";
  topic: string;
};

/* ----------------------------------------------------
   MAIN COMPONENT
---------------------------------------------------- */
export default function QuizPage() {
  const { id } = useParams();
  const router = useRouter();

  const [quiz, setQuiz] = useState<QuizQuestion[]>([]);
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [answered, setAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const [finished, setFinished] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const [quizId, setQuizId] = useState<string | null>(null);
  const [responses, setResponses] = useState<any[]>([]);
  

  // Enable guarding
  useNavigationGuard(!finished);

  /* ----------------------------------------------------
     Fetch quiz data
  ---------------------------------------------------- */
  useEffect(() => {
    if (!id) return;

    const fetchQuiz = async () => {
  try {
    const res = await fetch(`/api/quiz?lectureId=${id}`);
    const data = await res.json();

    if (!res.ok) throw new Error(data.message);

    setQuizId(data.data.id); // <-- STORE QUIZ ID

    const merged = data.data.questions.map((q: any, i: number) => ({
      question: q.question,
      options: q.options,
      difficulty: q.difficulty,
      topic: q.topic,                 // <-- topic added
      correct_answer: data.data.answers[i],
    }));

    setQuiz(merged);
  } catch (err) {
    toast.error("Failed to load quiz");
  } finally {
    setLoading(false);
  }
};


    fetchQuiz();
  }, [id]);

  /* ----------------------------------------------------
     Option select handler
  ---------------------------------------------------- */
  const handleSelect = async (option: string) => {
  if (answered) return;

  const currentQ = quiz[index];
  const isCorrect = option === currentQ.correct_answer;

  setSelected(option);
  setAnswered(true);

  if (isCorrect) setScore((prev) => prev + 1);

  // Store locally
  const newEntry = {
    question: currentQ.question,
    selected: option,
    correct: isCorrect,
    topic: currentQ.topic,
  };

  const updatedResponses = [...responses, newEntry];
  setResponses(updatedResponses);

  // Save to DB
  try {
    await fetch(`/api/quiz/save-progress`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        quizId,
        responses: updatedResponses,
        score: isCorrect ? score + 1 : score,
      }),
    });
  } catch {}

  // Move next
  setTimeout(() => {
    if (index === quiz.length - 1) {
      setFinished(true);
    } else {
      setIndex((prev) => prev + 1);
    }
    setSelected(null);
    setAnswered(false);
  }, 1300);
};


  /* ----------------------------------------------------
     Protected Dashboard click
  ---------------------------------------------------- */
  const askBeforeLeave = () => {
    if (!finished) {
      toast.error("Finish the quiz before leaving!");
      setShowWarning(true);
      return;
    }
    router.push("/dashboard");
  };

  /* ----------------------------------------------------
     Render states
  ---------------------------------------------------- */
  if (loading) return <LoadingScreen />;
  if (finished) return <ResultScreen score={score} total={quiz.length} />;

  const current = quiz[index];

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-gray-900">

      {/* HEADER */}
      <header className="w-full ">
        <div className="lg:px-20 md:px-12 sm:px-4 p-4">
          <GenericHeader
            logo={
              <div className="flex items-center gap-4 text-[#111418] dark:text-white cursor-pointer">
                <NotepadText size={48} className="text-sky-600" />
                <h1 className="text-2xl font-bold tracking-tight">FlashNotes</h1>
              </div>
            }
            links={[
              {
                label: "Dashboard",
                href: "/dashboard",
                onClick: () => askBeforeLeave(),
              },
            ]}
          />
        </div>
      </header>

      {/* MAIN CONTENT */}
      <div className="mt-10 flex flex-col items-center justify-center px-4">

        <header className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Quiz Time!
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Question {index + 1} of {quiz.length}
          </p>
        </header>

        {/* Question box */}
        <div className="w-full max-w-2xl p-6 rounded-xl shadow-lg bg-white dark:bg-gray-800 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-50 text-center">
            {current.question}
          </h2>
        </div>

        {/* Options */}
        <div className="grid gap-4 w-full max-w-lg">
          {current.options.map((opt, i) => {
            const isCorrect = opt === current.correct_answer;
            const isSelected = opt === selected;

            let optionStyle =
              "bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100";

            if (answered && isSelected && isCorrect)
              optionStyle =
                "bg-green-500 text-white animate-pulse shadow-lg scale-105";
            else if (answered && isSelected && !isCorrect)
              optionStyle =
                "bg-red-500 text-white animate-shake shadow-lg scale-105";
            else if (answered && isCorrect)
              optionStyle = "bg-green-400 text-white";

            return (
              <button
                key={i}
                onClick={() => handleSelect(opt)}
                className={`p-4 rounded-xl font-medium transition transform cursor-pointer ${optionStyle}`}
              >
                {opt}
              </button>
            );
          })}
        </div>

        {/* Shake effect */}
        <style>{`
          @keyframes shake {
            10%, 90% { transform: translateX(-1px); }
            20%, 80% { transform: translateX(2px); }
            30%, 50%, 70% { transform: translateX(-4px); }
            40%, 60% { transform: translateX(4px); }
          }
          .animate-shake { animation: shake 0.5s ease-in-out; }
        `}</style>

        {/* Navigation Warning Modal */}
        {showWarning && (
          <WarningModal
            onCancel={() => setShowWarning(false)}
            onLeave={() => router.push("/dashboard")}
          />
        )}

      </div>
    </div>
  );
}

/* ----------------------------------------------------
   Loading Screen
---------------------------------------------------- */
function LoadingScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50 dark:bg-gray-900">
      Loading quiz...
    </div>
  );
}

/* ----------------------------------------------------
   Result Screen
---------------------------------------------------- */
function ResultScreen({ score, total }: { score: number; total: number }) {
  const percent = Math.round((score / total) * 100);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-neutral-50 dark:bg-gray-900 px-4">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl text-center max-w-md">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-50">
          Quiz Completed!
        </h1>

        <p className="text-xl mt-4 text-gray-700 dark:text-gray-300">
          You scored:
        </p>

        <p className="text-5xl font-extrabold mt-2 text-blue-600 dark:text-blue-400">
          {score}/{total}
        </p>

        <p className="mt-4 text-gray-600 dark:text-gray-400 text-lg">
          ({percent}% correct)
        </p>

        <button
          onClick={() => {
            toast.error("Quiz progress lost!");
            setTimeout(() => location.reload(), 600);
          }}
          className="mt-6 w-full py-3 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition"
        >
          Retry Quiz
        </button>
      </div>
    </div>
  );
}

/* ----------------------------------------------------
   Warning Modal
---------------------------------------------------- */
function WarningModal({
  onCancel,
  onLeave,
}: {
  onCancel: () => void;
  onLeave: () => void;
}) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-xl max-w-sm w-full">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
          Leave Quiz?
        </h2>
        <p className="text-gray-600 dark:text-gray-300">
          Your progress will not be saved. Do you still want to leave?
        </p>

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-lg bg-gray-300 dark:bg-gray-700"
          >
            Stay
          </button>

          <button
            onClick={onLeave}
            className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
          >
            Leave
          </button>
        </div>
      </div>
    </div>
  );
}
