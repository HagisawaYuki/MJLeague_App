"use server"
/**HanshuangScore情報関連 */

import prisma from "../../../lib/prisma";
import { NextRequest, NextResponse } from "next/server";


//IDからgame情報を検索
export async function GET(request: NextRequest) {
    const id = Number(request.nextUrl.searchParams.get("id"));
      const score = await prisma.hanshuangScore.findUnique({
          where: { id },
      });
      return NextResponse.json(score);
  }

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


//半荘情報を編集
export async function PUT(req: NextRequest) {
    //reqから入力された名前、userIDを取り出す
    const { id, score, chip, playerId, hanshuangId } = await req.json();
    if (!id || score === undefined || chip === undefined || !playerId || !hanshuangId) {
        return new Response("Missing id or name", { status: 400 });
    }
    const updatedScore = await prisma.hanshuangScore.update({
        where: { id }, // 編集対象のID
        data: {
            id,
            score,
            chip,
            playerId,
            hanshuangId
        },
    });
    return NextResponse.json(updatedScore);
}

//HanshuangScore削除
export async function DELETE(req: NextRequest) {
  const { id } = await req.json();
  await prisma.hanshuangScore.delete({
      where: { id },
  })
}