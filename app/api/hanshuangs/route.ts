"use server"
import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../lib/prisma";


//gameIDから全hanshuang情報を検索
export async function GET(request: NextRequest) {
  const gameId = Number(request.nextUrl.searchParams.get("gameId"));
  if(!gameId){
    return  new Response("Missing userId", { status: 400 });
  }
    const hanshuangs = await prisma.hanshuang.findMany({
        where: { gameId },
        include: {    
            scores: true,
        },
    });
    return NextResponse.json(hanshuangs);
}