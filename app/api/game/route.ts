"use server"
import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../lib/prisma";

//IDからgame情報を検索
export async function POST(req: NextRequest) {
    const { id } = await req.json();
    const game = await prisma.game.findUnique({
        where: { id },
        include: {
            hanshuangs: {
              include: {
                scores: true, // ← ここが重要
              },
            },
          },
    });
    return NextResponse.json(game);
}