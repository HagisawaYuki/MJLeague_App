"use server"
import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../lib/prisma";

//userIDから全game情報を検索
export async function POST(req: NextRequest) {
    const { userId } = await req.json();
    const games = await prisma.game.findMany({
        where: { userId },
        include: {
            hanshuangs: {
              include: {
                scores: true, // ← ここが重要
              },
            },
          },
    });
    return NextResponse.json(games);
}