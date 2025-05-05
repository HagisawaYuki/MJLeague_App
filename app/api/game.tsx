/**Game情報関連 */

import { Prisma } from "@prisma/client"
//hanshuangs情報とscores情報を含んだGameの型
export type GameWithHanshuangsAndScores = Prisma.GameGetPayload<{
  include: {
    hanshuangs: {
      include: {
        scores: true,
      },
    },
  }
}>

//userIDから全ゲーム情報を取得する関数
export const searchGamesByUserID = async (userID: string): Promise<GameWithHanshuangsAndScores[]> => {
    const res = await fetch('/api/games', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userID }),
    });
    const data: GameWithHanshuangsAndScores[] = await res.json();
    return data;
};



//game情報を全検索
// export const searchGames = async (userId: string): Promise<GameWithHanshuangsAndScores[]> => {
//     const games = await prisma.game.findMany({
//         where: { userId },
//         include: {
//             hanshuangs: {
//               include: {
//                 scores: true, // ← ここが重要
//               },
//             },
//           },
//     });
//     return games;
// }
