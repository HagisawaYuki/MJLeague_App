import { redirect } from "next/navigation";
import { createHanshuang } from "./hanshuang";


//userID、nameからプレイヤー情報を新規作成する関数
export const createHanshuangScores = async (formData: FormData) => {
    console.log("score", formData.get('score1'), formData.get('score2'), formData.get('score3'), formData.get('score4'))
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
    console.log("score", scores[0], scores[1], scores[2], scores[3])
    console.log("chip", chips[0], chips[1], chips[2], chips[3])
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