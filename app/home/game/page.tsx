"use client"

import { Box, Button, Table, Text } from "@chakra-ui/react";
import { HanshuangWithHanshuangScore } from "../../api/hanshuang";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { GameWithHanshuangsAndScores, searchGameByID } from "../../api/game";
import { PlayerWithHanshuangScore, searchPlayerByID } from "../../api/player";

type HanshuangsTable = {
    name: string;
    scores: {
      scoreID: number;
      score: number;
      chip: number;
    }[];
}[];

export default function Home() {
    const router = useRouter();
    const [game, setGame] = useState<GameWithHanshuangsAndScores>();
    const [hanshuangsTable, setHanshuangsTable] = useState<HanshuangsTable>();
    const [t_hanshuangsTable, setT_HanshuangsTable] = useState<{scoreID: number, score: number, chip: number}[][]>();
    const [sumScores, setSumScores] = useState<{name: string; sumScore: number; chip: number}[]>();

    //各プレイヤーの通算を計算する関数
    const calSum = (_hanshuangsTable: HanshuangsTable) => {
        const _sumScores: {name: string; sumScore: number, chip: number}[] = [];
        for(const playerTable of _hanshuangsTable){
        let sum = 0;
        let chip = 0;
        for(const score of playerTable.scores){
            sum = sum + score.score;
            chip = chip + score.chip;
        }
        _sumScores.push({name: playerTable.name, sumScore: sum, chip: chip});
        }
        setSumScores(_sumScores);
    }

    //Hanshuang情報からプレイヤーごとにテーブル形式で配列にまとめる関数
    const createHanshuangTable = (hanshuangs: HanshuangWithHanshuangScore[], players: PlayerWithHanshuangScore[]) => {
        //playerごとにループ
        return players.map(player => {
            //1playerの全スコアの配列
            const scores: {scoreID: number; score: number, chip: number}[] = [];
            //gameごとにループ
            for (const hanshuang of hanshuangs) {
                // 1つのゲームに含まれるすべての半荘
                const scoreEntry = hanshuang.scores.find(score => score.playerId === player.id);
                if (scoreEntry) {
                scores.push({scoreID: scoreEntry.id, score: scoreEntry.score, chip: scoreEntry.chip});
                }
            }
            return {
                name: player.name,
                scores,
            };
        });
    }

    const onSubmit = (hanshuangScoreID: number, score: number, chip: number) => {
        localStorage.setItem("scoreID", JSON.stringify(hanshuangScoreID));
        localStorage.setItem("score", JSON.stringify(score));
        localStorage.setItem("chip", JSON.stringify(chip));
        router.push("/edit/game/score");
    }

    useEffect(() => {
        const homeGameInit = async () => {
            
            //ローカルストレージからgameID取得
            const gameID = Number(localStorage.getItem("gameID"));
            //gameIDからgame情報を取得
            const _game = await searchGameByID(gameID);
            if(_game)setGame(_game);
            //gameから半荘データを取得
            if(_game){
                const _hanshuangs = _game.hanshuangs.map(hanshuang => hanshuang);
                if(_hanshuangs && _hanshuangs.length > 0){
                    //gameIDから4プレイヤーIDを検索
                    const _playersID = _hanshuangs && _hanshuangs[0].scores.map(score => score.playerId);
                    //4playerIDから4player情報を取得
                    const _players = [];
                    if(_playersID){
                        for(const playerID of _playersID){
                            const _player = await searchPlayerByID(playerID);
                            if(_player){
                                _players.push(_player)
                            }
                        }
                    }
            
                    const _hanshuangsTable = createHanshuangTable(_hanshuangs, _players);
                    setHanshuangsTable(_hanshuangsTable);
                    _hanshuangsTable.forEach((player, idx) => {
                        console.log("index", idx);
                        console.log("name", player.name);
                        player.scores.forEach((score) => {
                            console.log("score", score.score);
                            console.log("chip", score.chip);
                        })
                    })
                    //scoresの長さを計算（ゲーム数）
                    const numRows = _hanshuangsTable[0]?.scores.length || 0;
                    // 縦横反転して保存
                    const transposed = Array.from({ length: numRows }, (_, rowIndex) =>
                        _hanshuangsTable.map(player => player.scores[rowIndex] ?? '')
                    );
                    setT_HanshuangsTable(transposed);
                    //各プレイヤーの通算を計算する
                    calSum(_hanshuangsTable);
                    //4プレイヤーのidをローカルストレージに保存
                    localStorage.setItem("players", JSON.stringify(_playersID));
                }     
            }
        }
        homeGameInit();
    },[router]);
  
    return (
        <Box>
            <Box>
                <Button
                    colorPalette="orange" variant="subtle"
                    onClick={() => {
                        router.push("/create/hanshuang");
                    }}
                >
                    半荘を追加
                </Button>
                <Button
                    colorPalette="orange" variant="subtle"
                    onClick={() => {
                    localStorage.setItem("gameID", JSON.stringify(game?.id));
                    router.push("/edit/game/player");
                    }}
                >
                    プレイヤーを変更
                </Button>
            </Box>
            <Box>
                <Table.Root size="sm" striped showColumnBorder>
                    <Table.Header>
                        <Table.Row>
                            <Table.ColumnHeader textAlign="center">
                            </Table.ColumnHeader>
                            {hanshuangsTable?.map((player, idx) => (
                                <Table.ColumnHeader key={idx} textAlign="center">
                                    <Text as="b">{player.name}</Text>
                                </Table.ColumnHeader>
                            ))}
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {t_hanshuangsTable?.map((row, rowIndex) => (
                            <Table.Row key={rowIndex}>
                                <Table.Cell textAlign="center">
                                    <Text as="b">{rowIndex + 1}</Text>
                                </Table.Cell>
                                {row.map((score, colIndex) => (
                                    <Table.Cell key={colIndex} textAlign="center" onClick={() => {onSubmit(score.scoreID, score.score, score.chip)}}>
                                        <Box textAlign="center">
                                        <Text color={score.score < 0 ? "red" : score.score === 0 ? "black" : "blue"}>{score.score}</Text>
                                        <Text color={score.chip < 0 ? "red" : score.chip === 0 ? "black" : "blue"}>{score.chip}</Text>
                                        <Text color={score.score + score.chip*100 < 0 ? "red" : score.score + score.chip*100 === 0 ? "black" : "blue"} as="b">{score.score + score.chip*100}</Text>
                                        </Box>
                                    </Table.Cell>
                                ))}
                            </Table.Row>
                        ))}
                        <Table.Row>
                            <Table.Cell textAlign="center">
                                <Text as="b">合計値</Text>
                            </Table.Cell>
                            {sumScores && sumScores.map((score, colIndex) => (
                                <Table.Cell key={colIndex} textAlign="center">
                                    <Box textAlign="center">
                                        <Text color={score.sumScore < 0 ? "red" : score.sumScore === 0 ? "black" : "blue"}>{score.sumScore}</Text>
                                        <Text color={score.chip < 0 ? "red" : score.chip === 0 ? "black" : "blue"}>{score.chip}</Text>
                                        <Text color={score.sumScore + score.chip*100 < 0 ? "red" : score.sumScore + score.chip*100 === 0 ? "black" : "blue"} as="b">{score.sumScore + score.chip*100}</Text>
                                    </Box>
                                </Table.Cell>
                            ))}
                        </Table.Row>
                    </Table.Body>
                </Table.Root>
            </Box>
        </Box>
    );
}
