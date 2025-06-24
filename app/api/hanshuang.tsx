import { Hanshuang, Prisma } from "@prisma/client"

export type HanshuangWithHanshuangScore = Prisma.HanshuangGetPayload<{
    include: { scores: true }
}>

//gameIDから全半荘情報を取得する関数
export const searchHanshuangsByGameID = async (gameID: number): Promise<HanshuangWithHanshuangScore[]> => {
    const res = await fetch(`/api/hanshuangs?gameId=${gameID}`);
    const data: HanshuangWithHanshuangScore[] = await res.json();
    return data;
};

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

//Hanshunagを削除する関数
export const deleteHanshuang = async (ids: number[]) => {
    
  for(const id of ids){
    await fetch('/api/hanshuang', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
    });
  }
  window.location.reload();
}