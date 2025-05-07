
import { Prisma } from "@prisma/client"
import { redirect } from "next/navigation";

//scores情報を含んだPlayerの型
export type PlayerWithHanshuangScore = Prisma.PlayerGetPayload<{
  include: { scores: true }
}>

//userIDから全プレイヤー情報を取得する関数
export const searchAllPlayersByUserID = async (userID: string): Promise<PlayerWithHanshuangScore[]> => {
    const res = await fetch(`/api/players?userId=${userID}`);
    const data: PlayerWithHanshuangScore[] = await res.json();
    return data;
};

//IDからプレイヤー情報を取得する関数
export const searchPlayerByID = async (id: number): Promise<PlayerWithHanshuangScore> => {
    const res = await fetch(`/api/player?id=${id}`);
    const data: PlayerWithHanshuangScore = await res.json();
    return data;
}

//userID、nameからプレイヤー情報を新規作成する関数
export const createPlayer = async (formData: FormData) => {
    
    //formDataから入力された名前を取り出す
    const name = formData.get('name') as string;
    const userId = formData.get("userId") as string;
    await fetch('/api/player', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, userId }),
    });
}

//player名を変更する関数
export const editPlayerName = async (formData: FormData) => {
    //formDataから入力された名前を取り出す
    const name = formData.get('name') as string;
    const id = Number(formData.get("playerID"));
    await fetch('/api/player', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, name }),
    });
    redirect("/home");
}


