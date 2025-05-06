"use server"
import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../lib/prisma";

//userIDから全game情報を検索
export async function GET(request: NextRequest) {
  const userId = request.nextUrl.searchParams.get("userId");
  if(!userId){
    return  new Response("Missing userId", { status: 400 });
  }
    const games = await prisma.game.findMany({
        where: { userId },
        include: {
            hanshuangs: {
              include: {
                scores: true,
              },
            },
        },
    });
    return NextResponse.json(games);
}