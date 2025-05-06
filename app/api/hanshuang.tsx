import { Hanshuang, Prisma } from "@prisma/client"

export type HanshuangWithHanshuangScore = Prisma.HanshuangGetPayload<{
    include: { scores: true }
}>

//userID、nameからプレイヤー情報を新規作成する関数
export const createHanshuang = async (gameId: number) => {
    const newHanshuangRes = await fetch('/api/hanshuang', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ gameId }),
    });
    const newHanshuang: Hanshuang = await newHanshuangRes.json();
    return newHanshuang;
}