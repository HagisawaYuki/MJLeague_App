"use server"
import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../lib/prisma";


//半荘を新規作成
export async function POST(req: NextRequest) {
    const { gameId } = await req.json();
    //追加元のgameIDから半荘情報を新規作成
    const hanshuang = await prisma.hanshuang.create({
        data: {
            gameId
        }
    })
    return NextResponse.json(hanshuang);
}

//Hanshuang削除
export async function DELETE(req: NextRequest) {
    const { id } = await req.json();
    await prisma.hanshuangScore.deleteMany({
      where: { hanshuangId: id },
    });
    // 2. 次に Hanshuang を削除
    await prisma.hanshuang.deleteMany({
        where: { id },
    });
  
}