"use server"
/**HanshuangScore情報関連 */

import prisma from "../../../lib/prisma";
import { NextRequest } from "next/server";

//1半荘の4人分のHanshuangScore作成
export async function POST(req: NextRequest) {
    const {playerId, hanshuangId, score, chip} = await req.json();
    await prisma.hanshuangScore.create({
        data: {
            playerId,
            hanshuangId,
            score,
            chip
        }
    })
}