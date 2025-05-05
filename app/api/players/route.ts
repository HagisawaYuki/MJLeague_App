"use server"
import { NextRequest, NextResponse } from "next/server"
// import { PlayerWithHanshuangScore } from "../../constant/typeConst";
import prisma from "../../../lib/prisma"
// import { Prisma } from "@prisma/client"
// export type PlayerWithHanshuangScore = Prisma.PlayerGetPayload<{
//   include: { scores: true }
// }>

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