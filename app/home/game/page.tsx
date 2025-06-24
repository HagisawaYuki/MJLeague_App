"use client"

import { Box, Button, Checkbox, Table, Text } from "@chakra-ui/react";
import { deleteHanshuang, HanshuangWithHanshuangScore } from "../../api/hanshuang";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { searchGameByID } from "../../api/game";
import { PlayerWithHanshuangScore, searchPlayerByID } from "../../api/player";

type HanshuangsTable = {
    name: string;
    scores: {
      scoreID: number;
      score: number;
      chip: number;
      hanshuangID: number;
    }[];
}[];

export default function Home() {
    const router = useRouter();
    const [hanshuangsTable, setHanshuangsTable] = useState<HanshuangsTable>();
    const [t_hanshuangsTable, setT_HanshuangsTable] = useState<{scoreID: number, score: number, chip: number, hanshuangID: number}[][]>();
    const [sumScores, setSumScores] = useState<{name: string; sumScore: number; chip: number}[]>();
    const [isDelete, setIsDelete] = useState<boolean>(false);
    const [deletingHanshuangsID, setDeletingHanshuangsID] = useState<number[]>();

    //ゲーム削除関数
      const deleteHanshuangButton = () => {
        if(deletingHanshuangsID){
          deleteHanshuang(deletingHanshuangsID);
        }
      }

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
            const scores: {scoreID: number; score: number, chip: number, hanshuangID: number}[] = [];
            //gameごとにループ
            for (const hanshuang of hanshuangs) {
                // 1つのゲームに含まれるすべての半荘
                const scoreEntry = hanshuang.scores.find(score => score.playerId === player.id);
                if (scoreEntry) {
                scores.push({scoreID: scoreEntry.id, score: scoreEntry.score, chip: scoreEntry.chip, hanshuangID: scoreEntry.hanshuangId});
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
            // if(_game)setGame(_game);
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
            <Box display="flex">
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
                        router.push("/edit/game/player");
                    }}
                >
                    プレイヤーを変更
                </Button>
                <Box>
                    <Button onClick={() => {if(isDelete){setIsDelete(false)}else{setIsDelete(true)}}}>
                        <Text>半荘削除</Text>
                    </Button>
                    <Text>{deletingHanshuangsID}</Text>
                </Box>
                {isDelete && 
                    <Box>
                        <Button bg="red" onClick={deleteHanshuangButton}>
                        <Text>削除</Text>
                        </Button>
                    </Box>
                }
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
                                    {isDelete && 
                                        <Checkbox.Root 
                                            variant="subtle"
                                            key={rowIndex}
                                            onCheckedChange={(details) => {
                                                const isChecked = details.checked;
                                                if(isChecked){
                                                    //すでにselectされていたら追加して保存
                                                    if(deletingHanshuangsID){
                                                        setDeletingHanshuangsID([...deletingHanshuangsID, row[0].hanshuangID])
                                                    }
                                                    //selecyされていなかったら新規追加して保存
                                                    else{
                                                        setDeletingHanshuangsID([row[0].hanshuangID]);
                                                    }
                                                }
                                                //チェックがついていなかったら
                                                else{
                                                    //selectされているか調べ、すでにselectされているものであったら、配列から削除
                                                    if(deletingHanshuangsID?.includes(row[0].hanshuangID)){
                                                        setDeletingHanshuangsID(
                                                            deletingHanshuangsID.filter((deletingHanshuangsID) => (deletingHanshuangsID !== row[0].hanshuangID))
                                                        )
                                                    }
                                                }
                                        }}>
                                            <Checkbox.HiddenInput />
                                            <Checkbox.Control />
                                            <Checkbox.Label>
                                                
                                            </Checkbox.Label>
                                        </Checkbox.Root>
                                    }
                                    <Text as="b">{rowIndex + 1}</Text>
                                </Table.Cell>
                                {row.map((score, colIndex) => (
                                    <Table.Cell key={colIndex} textAlign="center" onClick={() => {onSubmit(score.scoreID, score.score, score.chip)}}>
                                        <Box textAlign="center">
                                            <Text color={score.score < 0 ? "red" : score.score === 0 ? "black" : "blue"}>{score.score/50}pt</Text>
                                            {/* <Text color={score.chip < 0 ? "red" : score.chip === 0 ? "black" : "blue"}>{score.chip}枚</Text> */}
                                            <Text color={score.score < 0 ? "red" : score.score === 0 ? "black" : "blue"} as="b">{score.score}pt</Text>
                                            {/* <Text color={score.score + score.chip*100 < 0 ? "red" : score.score + score.chip*100 === 0 ? "black" : "blue"} as="b">{score.score + score.chip*100}pt</Text> */}
                                        </Box>
                                    </Table.Cell>
                                ))}
                            </Table.Row>
                        ))}
                        <Table.Row>
                            <Table.Cell textAlign="center">
                                <Text as="b">チップ数</Text>
                            </Table.Cell>
                            {t_hanshuangsTable && t_hanshuangsTable[t_hanshuangsTable.length-1].map((score, colIndex) => (
                                <Table.Cell key={colIndex} textAlign="center">
                                    <Box textAlign="center">
                                        <Text color={score.chip < 0 ? "red" : score.chip === 0 ? "black" : "blue"}>{score.chip}枚</Text>
                                    </Box>
                                </Table.Cell>
                            ))}
                        </Table.Row>
                        <Table.Row>
                            <Table.Cell textAlign="center">
                                <Text as="b">合計値</Text>
                            </Table.Cell>
                            {sumScores && sumScores.map((score, colIndex) => (
                                <Table.Cell key={colIndex} textAlign="center">
                                    <Box textAlign="center">
                                        <Text color={score.sumScore < 0 ? "red" : score.sumScore === 0 ? "black" : "blue"}>{score.sumScore/50}pt</Text>
                                        <Text color={score.chip < 0 ? "red" : score.chip === 0 ? "black" : "blue"}>{score.chip}枚</Text>
                                        <Text color={score.sumScore + score.chip*100 < 0 ? "red" : score.sumScore + score.chip*100 === 0 ? "black" : "blue"} as="b">{score.sumScore + score.chip*100}pt</Text>
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
