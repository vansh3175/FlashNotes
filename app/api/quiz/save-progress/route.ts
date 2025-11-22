import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function PATCH(req: NextRequest) {
  try {
    const { quizId, responses, score } = await req.json();

    if (!quizId || !responses) {
      return NextResponse.json(
        { message: "Missing quizId or responses." },
        { status: 400 }
      );
    }

    const updatedQuiz = await prisma.quiz.update({
      where: { id: quizId },
      data: {
        user_responses: responses,
        scores: score ?? undefined,
      },
    });

    return NextResponse.json(
      { message: "Progress saved", data: updatedQuiz },
      { status: 200 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { message: "Failed to save quiz progress", error: err.message },
      { status: 500 }
    );
  }
}
