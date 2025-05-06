"use server"
import { NextRequest, NextResponse } from "next/server"
import prisma from "../../../lib/prisma"


export async function POST(req: NextRequest) {
    const { userId } = await req.json();
    const players = await prisma.player.findMany({
        where: {userId},
        include: {
            scores: true,
        },
    });
    return NextResponse.json(players);
}