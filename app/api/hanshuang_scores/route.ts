"use server"
import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../lib/prisma";

//hanshuangIDから全hanshuang_score情報を検索
export async function GET(request: NextRequest) {
  const hanshuangId = Number(request.nextUrl.searchParams.get("hanshuangId"));
  if(!hanshuangId){
    return  new Response("Missing userId", { status: 400 });
  }
    const hanshuangScores = await prisma.hanshuangScore.findMany({
        where: { hanshuangId },
    });
    return NextResponse.json(hanshuangScores);
}

//HanshuangScore削除
export async function DELETE(req: NextRequest) {
  const { hanshuangId } = await req.json();
  await prisma.hanshuangScore.deleteMany({
      where: { hanshuangId },
  })
}