import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { GoogleGenAI } from "@google/genai";

export async function GET(request: NextRequest) {
  try {
    const lectureId = request.nextUrl.searchParams.get("lectureId");

    if (!lectureId) {
      return NextResponse.json(
        { message: "Missing 'lectureId' in query parameters." },
        { status: 400 }
      );
    }

    // 🟦 Fetch existing quiz
    const existingQuiz = await prisma.quiz.findFirst({
      where: { lectureId },
    });

    if (existingQuiz) {
      return NextResponse.json(
        { message: "Quiz fetched from DB", data: existingQuiz },
        { status: 200 }
      );
    }

    // 🟧 Fetch lecture
    const lecture = await prisma.lecture.findUnique({
      where: { id: lectureId },
    });

    if (!lecture) {
      return NextResponse.json(
        { message: "Lecture not found" },
        { status: 404 }
      );
    }

    const rawText = lecture.raw_text?.trim();
    if (!rawText) {
      return NextResponse.json(
        { message: "Lecture text is empty" },
        { status: 400 }
      );
    }

    // 🧠 Initialize Gemini
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    // 🟩 UPDATED PROMPT to include topic
    const prompt = `
    Generate a quiz in valid JSON array format.

    Each quiz question MUST include:
    - "question"
    - "options"
    - "correct_answer"
    - "difficulty": one of ["EASY", "MEDIUM", "HARD"]
    - "topic": A single broad concept/category extracted from the text 
               (Example: "DCMotors", "InductionMotor", "Transformers")

    Rules:
    - Generate exactly 10 questions.
    - Output ONLY a JSON array (no markdown, no explanations).
    - Every question must have exactly 4 options.

    Text:
    ${rawText}
    `;

    // 🧠 AI call
    const result = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    let text = result.text;

    if (!text) {
      return NextResponse.json(
        { message: "AI returned empty content" },
        { status: 500 }
      );
    }

    // Try parsing JSON
    let quizArray;
    try {
      quizArray = JSON.parse(text);
    } catch {
      try {
        quizArray = JSON.parse(
          text.replace(/```json/g, "").replace(/```/g, "").trim()
        );
      } catch (err: any) {
        console.error("JSON parse failure:", err);
        return NextResponse.json(
          { message: "Failed to parse AI JSON", error: err.message },
          { status: 500 }
        );
      }
    }

    // Validate array
    if (!Array.isArray(quizArray)) {
      return NextResponse.json(
        { message: "AI output is not a JSON array" },
        { status: 500 }
      );
    }

    // 🟦 Save quiz
    const savedQuiz = await prisma.quiz.create({
      data: {
        lectureId,
        questions: quizArray.map((q) => ({
          question: q.question,
          options: q.options,
          difficulty: q.difficulty,
          topic: q.topic, // NEW
        })),
        answers: quizArray.map((q) => q.correct_answer),
        user_responses: [], // EMPTY initially
      },
    });

    return NextResponse.json(
      { message: "Quiz generated successfully", data: savedQuiz },
      { status: 201 }
    );
  } catch (err: any) {
    console.error("Quiz Error:", err);
    return NextResponse.json(
      { message: "Unexpected server error", error: err.message },
      { status: 500 }
    );
  }
}
