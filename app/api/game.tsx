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
    const res = await fetch(`/api/games?userId=${userID}`);
    const data: GameWithHanshuangsAndScores[] = await res.json();
    return data;
};

//IDからゲーム情報を取得する関数
export const searchGameByID = async (id: number): Promise<GameWithHanshuangsAndScores> => {
    const res = await fetch(`/api/game?id=${id}`);
    const data: GameWithHanshuangsAndScores = await res.json();
    return data;
};


