import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import officeParser from "officeparser";
import fs from "fs";
import path from "path";
import os from "os";
import crypto from "crypto";
import { PdfReader } from "pdfreader";
import { createClient } from "@deepgram/sdk";
import { GoogleGenAI } from "@google/genai";

// Types
type SummaryResponse = {
  title: string;
  summary: string;
};

// Deepgram
const deepgram = createClient(process.env.DEEPGRAM_API_KEY || "");

// Gemini
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const user = JSON.parse(formData.get("user") as string);
  const file = formData.get("file") as File | null;

  if (!user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  if (!file) {
    return NextResponse.json({ message: "No file provided" }, { status: 400 });
  }

  // Temp file save
  const tempFileName = `${crypto.randomUUID()}-${file.name}`;
  const tempFilePath = path.join(os.tmpdir(), tempFileName);
  const buffer = Buffer.from(await file.arrayBuffer());
  fs.writeFileSync(tempFilePath, buffer);

  let rawtext = "";
  let input_type = "";

  try {
    /** ----------- FILE TYPE HANDLING ----------- **/
    if (file.type === "application/pdf") {
      input_type = "pdf";
      rawtext = await new Promise((resolve, reject) => {
        let text = "";
        new PdfReader().parseFileItems(tempFilePath, (err, item) => {
          if (err) reject(err);
          else if (!item) resolve(text);
          else if (item.text) text += item.text + " ";
        });
      });
    } 
    
    else if (
      file.name.endsWith(".pptx") ||
      file.name.endsWith(".docx") ||
      file.type.includes("officedocument")
    ) {
      input_type = file.name.endsWith(".pptx")
        ? "pptx"
        : file.name.endsWith(".docx")
        ? "docx"
        : "officedocument";

      rawtext = await officeParser.parseOfficeAsync(tempFilePath);
    } 
    
    else if (file.type.startsWith("audio/")) {
      input_type = "audio";
      const audioBuf = fs.readFileSync(tempFilePath);
      const { result, error } = await deepgram.listen.prerecorded.transcribeFile(audioBuf, {
        model: "nova-2",
        smart_format: true,
      });

      if (error) throw new Error("Audio transcription failed");
      rawtext = result.results.channels[0].alternatives[0].transcript;
    } 
    
    else {
      return NextResponse.json({ message: "Unsupported file type" }, { status: 400 });
    }

    if (!rawtext.trim()) {
      return NextResponse.json({ message: "No text could be extracted" }, { status: 400 });
    }

    /** ----------- GEMINI SUMMARY ----------- **/
    async function createSummary(content: string): Promise<SummaryResponse | null> {
      const result = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `
You are a helpful AI that summarizes academic content.

Return ONLY JSON:
{
  "title": "short descriptive title",
  "summary": "clear concise paragraph"
}

Content:
${content}
        `,
      });

      const text = result.text;
      if(!text) return null;
      if (!text.trim()) return null;

      // Extract JSON safely
      const match = text.trim().match(/\{[\s\S]*\}/);
      if (!match) return null;

      try {
        return JSON.parse(match[0]);
      } catch {
        return null;
      }
    }

    const aiResult = await createSummary(rawtext);
    if (!aiResult) {
      return NextResponse.json(
        { message: "AI could not generate summary" },
        { status: 500 }
      );
    }

    const { title, summary } = aiResult;

    /** ----------- SAVE TO DB ----------- **/
    const lecture = await prisma.lecture.create({
      data: {
        raw_text: rawtext,
        title,
        userId: user.id,
        summary_text: summary,
        input_type,
      },
    });

    return NextResponse.json(
      {
        message: "Lecture processed successfully",
        data: lecture,
      },
      { status: 201 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { message: "Processing error", error: err.message },
      { status: 500 }
    );
  } finally {
    // Cleanup
    if (fs.existsSync(tempFilePath)) fs.unlinkSync(tempFilePath);
  }
}

/** ----------- GET USER LECTURES ----------- **/
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");
  const emailVerified = searchParams.get("emailVerified") === "true";

  if (!userId || !emailVerified) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const lectures = await prisma.lecture.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
  // console.log(lectures);
  return NextResponse.json({ data: lectures }, { status: 200 });
}
