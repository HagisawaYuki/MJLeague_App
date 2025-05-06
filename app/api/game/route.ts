"use server"
import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../lib/prisma";

//IDからgame情報を検索
export async function GET(request: NextRequest) {
  const id = Number(request.nextUrl.searchParams.get("id"));
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

//Game作成
export async function POST(req: NextRequest) {
  const { userId, isPlayers, date } = await req.json();
  //4人選択されていたら"1"、されていなかったら"0"
  const _isPlayers = isPlayers === "1" ? true : false;
  //4人選択されていなかったらreturnして下の処理をしない
  if(!_isPlayers){
      return;
  }
  //gameを作成
  //日付が入力されていたらgame情報を新規作成
  if(date && userId){
    await prisma.game.create({
        data: {
          date: date,
          userId: userId
        }
    })
  }

  //新規作成だからqueryでcreate=trueをつけて/home/gameへ飛ぶ
  // redirect(`/home/game?create=${true}`);
  
}