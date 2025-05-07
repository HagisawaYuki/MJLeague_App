"use server"
/**HanshuangScore情報関連 */

import prisma from "../../../lib/prisma";
import { NextRequest, NextResponse } from "next/server";

//1半荘の4人分のHanshuangScore作成
export async function POST(req: NextRequest) {
    const {playerId, hanshuangId, score, chip} = await req.json();
    const hanshuangScore = await prisma.hanshuangScore.create({
        data: {
            playerId,
            hanshuangId,
            score,
            chip
        }
    })
    return NextResponse.json(hanshuangScore);
}