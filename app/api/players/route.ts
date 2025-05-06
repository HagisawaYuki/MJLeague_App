"use server"
import {  NextRequest, NextResponse } from "next/server"
import prisma from "../../../lib/prisma"

//userIDから全プレイヤー情報を取得する関数
export async function GET(request: NextRequest) {
    const userId = request.nextUrl.searchParams.get("userId");
    if(!userId){
        return  new Response("Missing userId", { status: 400 });
      }
    const players = await prisma.player.findMany({
        where: {userId},
        include: {
            scores: true,
        },
    });
    
    return NextResponse.json(players);
}