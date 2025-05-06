"use server"
import { NextResponse } from "next/server";
import prisma from "../../../lib/prisma";

//IDからgame情報を検索
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = parseInt(searchParams.get("id") || "0");
    const game = await prisma.game.findUnique({
        where: { id },
        include: {
            hanshuangs: {
              include: {
                scores: true,
              },
            },
          },
    });
    return NextResponse.json(game);
}