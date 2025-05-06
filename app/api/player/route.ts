"use server"
import { NextRequest, NextResponse } from "next/server"
import prisma from "../../../lib/prisma"



//１playerを探索
export async function GET(request: NextRequest) {
    const id = Number(request.nextUrl.searchParams.get("id"));
    const player = await prisma.player.findUnique({
        where: { id },
        include: {
            scores: true,
        },
    });
    return NextResponse.json(player);
};

//Playerを新規作成
export async function POST(req: NextRequest) {
    //reqから入力された名前、userIDを取り出す
    const { name, userId } = await req.json();
    //名前が入力されていたらplayer情報を新規作成
    if(name && userId){
        const player = await prisma.player.create({
            data: {
                name: name,
                userId: userId
            }
        });
        return NextResponse.json(player);
    }
}