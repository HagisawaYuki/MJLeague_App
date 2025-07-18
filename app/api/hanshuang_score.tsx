import { redirect } from "next/navigation";
import { createHanshuang } from "./hanshuang";
import { HanshuangScore } from "@prisma/client";


//IDから半荘スコア情報を取得する関数
export const searchHanshuangScoreByID = async (id: number): Promise<HanshuangScore> => {
    const res = await fetch(`/api/hanshuang_score?id=${id}`);
    const data: HanshuangScore = await res.json();
    return data;
};

//gameIDから全半荘情報を取得する関数
export const searchHanshuangScoresByHanshuangID = async (hanshuangID: number): Promise<HanshuangScore[]> => {
    const res = await fetch(`/api/hanshuang_scores?hanshuangId=${hanshuangID}`);
    const data: HanshuangScore[] = await res.json();
    return data;
};

//userID、nameからプレイヤー情報を新規作成する関数
export const createHanshuangScores = async (formData: FormData) => {
    //formDataからplayers・scores・chipsを取り出して配列に保管
    const players = [
        Number(formData.get('player1')), 
        Number(formData.get('player2')), 
        Number(formData.get('player3')), 
        Number(formData.get('player4'))
    ];
    const scores = [
        Number(formData.get('score1')), 
        Number(formData.get('score2')), 
        Number(formData.get('score3')), 
        Number(formData.get('score4'))
    ];
    const chips = [
        Number(formData.get('chip1')), 
        Number(formData.get('chip2')), 
        Number(formData.get('chip3')), 
        Number(formData.get('chip4'))
    ];
    const gameId = Number(formData.get('gameID'));
    const hanshuang = await createHanshuang(gameId);
    const hanshuangId = hanshuang.id;
    //4人ぶんの半荘スコア情報をループ文で新規作成
    for(let i = 0; i < 4; i++){
        const playerId = players[i];
        const score = scores[i];
        const chip = chips[i];
        await fetch('/api/hanshuang_score', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({playerId, hanshuangId, score, chip}),
        });
    }
    // /home/gameへ飛ぶ
    redirect("/home/game")
}


//半荘スコア情報の点数とチップを変更する関数
export const editHanshuangScore = async (formData: FormData) => {
    //formDataから入力された名前を取り出す
    const id = Number(formData.get('scoreID'));
    const score = Number(formData.get("score"));
    const chip = Number(formData.get('chip'));
    const _hanshuangScore = await searchHanshuangScoreByID(id);
    const playerId = _hanshuangScore.playerId;
    const hanshuangId = _hanshuangScore.hanshuangId;
    await fetch('/api/hanshuang_score', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, score, chip, playerId, hanshuangId }),
    });
    redirect("/home/game");
}

//gameのplayerを編集
export const editHanshuangScorePlayer = async (playerId: number, hanshuangScore: HanshuangScore) => {
    //formDataから入力された名前を取り出す
    const id = hanshuangScore.id
    const score = hanshuangScore.score
    const chip = hanshuangScore.chip
    const hanshuangId = hanshuangScore.hanshuangId;
    await fetch('/api/hanshuang_score', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, score, chip, playerId, hanshuangId }),
    });
    redirect("/home/game");
}

//HanshunagScoreを削除する関数
export const deleteHanshuangScoreByHanshuangID = async (hanshuangId: number) => {
    console.log("hanshuangID2: ", hanshuangId)
    await fetch('/api/hanahuang_scores', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ hanshuangId }),
    });
}