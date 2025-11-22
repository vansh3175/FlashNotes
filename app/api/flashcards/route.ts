import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { GoogleGenAI } from "@google/genai";

// Define type for flashcard structure
interface FlashcardData {
  question: string;
  answer: string;
  difficulty: "EASY" | "MEDIUM" | "HARD";
}

export async function GET(request: NextRequest) {
  try {
    // ✅ GET requests use query parameters, not body
    const lectureId = request.nextUrl.searchParams.get("lectureId");

    if (!lectureId) {
      return NextResponse.json(
        { message: "Missing 'lectureId' in query parameters." },
        { status: 400 }
      );
    }

    // 🔹 Check DB first
    const existingFlashcards = await prisma.flashcard.findMany({
      where: { lectureId },
    });

    if (existingFlashcards.length > 0) {
      return NextResponse.json(
        {
          message: "Flashcards fetched from database.",
          data: existingFlashcards,
        },
        { status: 200 }
      );
    }

    // 🔹 Fetch the lecture text for AI generation
    const lecture = await prisma.lecture.findUnique({
      where: { id: lectureId },
    });

    if (!lecture) {
      return NextResponse.json({ message: "Lecture not found." }, { status: 404 });
    }

    const rawText = lecture.raw_text?.trim();
    if (!rawText) {
      return NextResponse.json(
        { message: "Lecture text is empty or missing." },
        { status: 400 }
      );
    }

    // 🔹 Initialize Gemini
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    // 🔹 Create prompt
    const prompt = `
    Generate 10 flashcards in valid JSON array format from the following text.
    Each flashcard should have:
    - "question": a short, clear question suitable for studying.
    - "answer": a concise, accurate answer to the question.
    - "difficulty": one of ["EASY", "MEDIUM", "HARD"] based on complexity.

    Do NOT include any extra text, markdown, or code fences outside the JSON array.

    Text:
    ${rawText}
    `;

    // 🔹 Generate AI content
    const result = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
    })
    
    const text = result.text

    if (!text) {
      return NextResponse.json(
        { message: "AI did not return any content." },
        { status: 500 }
      );
    }

    // 🔹 Attempt to parse JSON safely
    let flashcardArray: FlashcardData[];

    try {
      flashcardArray = JSON.parse(text);
    } catch {
      try {
        const cleaned = text
          .replace(/```json/g, "")
          .replace(/```/g, "")
          .trim();
        flashcardArray = JSON.parse(cleaned);
      } catch (parseError: any) {
        console.error("❌ Failed to parse AI response:", parseError);
        console.error("AI Output:", text);
        return NextResponse.json(
          {
            message: "Failed to parse AI response into valid JSON.",
            error: parseError.message,
          },
          { status: 500 }
        );
      }
    }

    // 🔹 Validate the data
    if (!Array.isArray(flashcardArray)) {
      console.error("❌ AI response is not an array:", flashcardArray);
      return NextResponse.json(
        { message: "AI response was not a valid JSON array." },
        { status: 500 }
      );
    }

    // 🔹 Save generated flashcards
    const savedFlashcards = await prisma.$transaction(
      flashcardArray.map((fc) =>
        prisma.flashcard.create({
          data: {
            lectureId,
            question: fc.question,
            answer: fc.answer,
            difficulty: ["EASY", "MEDIUM", "HARD"].includes(fc.difficulty)
              ? fc.difficulty
              : "MEDIUM",
          },
        })
      )
    );

    return NextResponse.json(
      {
        message: "Flashcards generated using Gemini and saved to database.",
        data: savedFlashcards,
      },
      { status: 201 } // ✅ 201 Created
    );
  } catch (err: any) {
    console.error("❌ Error generating flashcards:", err);
    return NextResponse.json(
      {
        message: "An unexpected error occurred while generating flashcards.",
        error: err.message,
      },
      { status: 500 }
    );
  }
}
