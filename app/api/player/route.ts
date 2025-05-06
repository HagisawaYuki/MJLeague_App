"use server"
import { NextRequest, NextResponse } from "next/server"
import prisma from "../../../lib/prisma"



//１playerを探索
export async function POST(req: NextRequest) {
    const { id } = await req.json();
    const player = await prisma.player.findUnique({
        where: { id },
        include: {
            scores: true,
        },
    });
    return NextResponse.json(player);
};