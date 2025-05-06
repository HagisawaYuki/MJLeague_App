/**Game情報関連 */

import { Prisma } from "@prisma/client"
import { redirect } from "next/navigation";
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


//userID、nameからプレイヤー情報を新規作成する関数
export const createGame = async (formData: FormData) => {
    
  //formDataから入力された名前を取り出す
  const userId = formData.get("userId") as string;
  const isPlayers = formData.get('isPlayers') as string;
  const date = formData.get('date') as string;
  console.log("date", date)
  console.log("userID", userId)
  await fetch('/api/game', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, isPlayers, date }),
  });
  redirect("/home");
}