
import { Prisma } from "@prisma/client"

//scores情報を含んだPlayerの型
export type PlayerWithHanshuangScore = Prisma.PlayerGetPayload<{
  include: { scores: true }
}>

//userIDから全プレイヤー情報を取得する関数
export const searchAllPlayersByUserID = async (userID: string): Promise<PlayerWithHanshuangScore[]> => {
    const res = await fetch('/api/players', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userID }),
    });
    const data: PlayerWithHanshuangScore[] = await res.json();
    return data;
};

export const searchPlayerByID = async (id: number): Promise<PlayerWithHanshuangScore> => {
    const res = await fetch('/api/player', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      const data: PlayerWithHanshuangScore = await res.json();
      return data;
}



// export const searchAllPlayersByUserID = async (userId: string): Promise<PlayerWithHanshuangScore[]> => {
//     const players = await prisma.player.findMany({
//         where: {userId},
//         include: {
//             scores: true,
//         },
//     });
//     return players;
// }