import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const {id:lectureId} = await context.params // ✅ route param
  const { searchParams } = new URL(request.url); // ✅ query params
  const userId = searchParams.get("userId");
  const emailVerified = searchParams.get("emailVerified");

  if(!userId || !emailVerified){
    return NextResponse.json({"message":"user not verified"},{status:401})
  }
  
  try{
    const resp = await prisma.lecture.findFirst({
        where:{
            id:lectureId,
            userId,
        }
    })
    console.log(resp);
    return NextResponse.json({"message":"Summary fetched","data":resp},{status:201})
  }
  catch(err:any){
    console.log(err);
    return NextResponse.json({"message":err.message},{status:500});
  }

  
}