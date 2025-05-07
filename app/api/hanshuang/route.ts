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