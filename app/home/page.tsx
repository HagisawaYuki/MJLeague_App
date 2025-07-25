"use client"

import { Box, Button, Checkbox, Table, Text } from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { searchUserIDByName } from "../api/user";
import { PlayerWithHanshuangScore, searchAllPlayersByUserID } from "../api/player";
import { useRouter } from "next/navigation";
import { deleteGame, GameWithHanshuangsAndScores, searchGamesByUserID } from "../api/game";
import { RiArrowRightLine } from "react-icons/ri";

type GamesTable = {
  playerID: number;
  name: string;
  scores: {
    game: GameWithHanshuangsAndScores;
    score: number;
    chip: number;
  }[];
}[];

export default function Home() {
  
  const { data: session, status } = useSession();
  const router = useRouter();
  const [gamesTable, setGamesTable] = useState<GamesTable>();
  const [t_gamesTable, setT_GamesTable] = useState<{game: GameWithHanshuangsAndScores, score: number, chip: number}[][]>();
  const [sumScores, setSumScores] = useState<{name: string; sumScore: number; chip: number}[]>();
  const [scoreCheckMessage, setScoreCheckMessage] = useState<string>("");
  const [isDelete, setIsDelete] = useState<boolean>(false);
  const [deletingGamesID, setDeletingGamesID] = useState<number[]>();

  //スコアチェック
  const checkScores = () => {
    let sumScore = 0;
    let sumChip = 0;
    if(sumScores){
      for(const score of sumScores){
        sumScore += score.sumScore;
        sumChip += score.chip;
      }
    }
    if(sumScore !== 0 && sumChip !== 0){
      setScoreCheckMessage(`スコアに${sumScore}pt, チップに${sumChip}枚ズレがあります`);
    }
    else if(sumScore !== 0){
      setScoreCheckMessage(`スコアに${sumScore}ptズレがあります`);
    }
    else if(sumChip !== 0){
      setScoreCheckMessage(`チップに${sumChip}枚ズレがあります`);
    }
    else{
      setScoreCheckMessage(`問題ありません`);
    }
  }

  //ゲーム削除関数
  const deleteGameButton = () => {
    if(deletingGamesID){
      deleteGame(deletingGamesID);
    }
  }

  //Game情報からプレイヤーごとにテーブル形式で配列にまとめる関数
  const createGameTable = (games: GameWithHanshuangsAndScores[], players: PlayerWithHanshuangScore[]) => {
    //playerごとにループ
    return players.map(player => {
      //1playerの全スコアの配列
      const scores: {game: GameWithHanshuangsAndScores; score: number, chip: number}[] = [];
      //gameごとにループ
      for (const game of games) {
        // 1つのゲームに含まれるすべての半荘
        let sum_score = 0;
        let final_chip = 0;
        for (const hanshuang of game.hanshuangs) {
          const scoreEntry = hanshuang.scores.find(score => score.playerId === player.id);
          if (scoreEntry) {
            sum_score = sum_score + scoreEntry.score; 
            final_chip = scoreEntry.chip;
          }
        }
        scores.push({game: game, score: sum_score, chip: final_chip});
      }
      return {
        playerID: player.id,
        name: player.name,
        scores,
      };
    });
  }

  //各プレイヤーの通算を計算する関数
  const calSum = (_gamesTable: GamesTable) => {
    
    const _sumScores: {name: string; sumScore: number, chip: number}[] = [];
      
    for(const playerTable of _gamesTable){
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

  useEffect(() => {
    const initHome = async () => {
      if(session && session.user && session.user.name){
        const _userID = await searchUserIDByName(session.user.name);
        //全player・gameを取得して保存
        const _players: PlayerWithHanshuangScore[] = await searchAllPlayersByUserID(_userID);
        const _Games: GameWithHanshuangsAndScores[] = await searchGamesByUserID(_userID);
        //gamesTableを作成して保存
        const _gamesTable = createGameTable(_Games, _players);
        setGamesTable(_gamesTable);
        //scoresの長さを計算（ゲーム数）
        const numRows = _gamesTable[0]?.scores.length || 0;
        // 縦横反転して保存
        const transposed = Array.from({ length: numRows }, (_, rowIndex) =>
          _gamesTable.map(player => player.scores[rowIndex] ?? '')
        );
        setT_GamesTable(transposed);
        //各プレイヤーの通算を計算する
        calSum(_gamesTable);
      }
    }
    initHome();
    
  },[session, router]);

  if (status === 'loading') return <Text>Loading...</Text>;
  if (!session) return <Text>ログインしていません</Text>;

  
  
  return (
    <Box>
      <Box display="flex">
        <Box>
          <Button onClick={checkScores}>
            <Text>スコアチェック</Text>
          </Button>
          <Text>{scoreCheckMessage}</Text>
        </Box>
        <Box>
          <Button onClick={() => {router.push("/home/league_v2")}}>
            <Text>リーグ成績</Text>
          </Button>
        </Box>
        <Box>
          <Button onClick={() => {if(isDelete){setIsDelete(false)}else{setIsDelete(true)}}}>
            <Text>ゲーム削除</Text>
          </Button>
          <Text>{deletingGamesID}</Text>
        </Box>
        {isDelete && 
          <Box>
            <Button bg="red" onClick={deleteGameButton}>
              <Text>削除</Text>
            </Button>
          </Box>
        }
        
      </Box>
      <Table.Root size="sm" striped showColumnBorder>
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeader textAlign="center">
            </Table.ColumnHeader>
            {gamesTable?.map((player, idx) => (
              <Table.ColumnHeader key={idx} textAlign="center">
                <Button bg="white" onClick={() => {
                  localStorage.setItem("editPlayerID", JSON.stringify(player.playerID));
                  localStorage.setItem("editPlayerName", JSON.stringify(player.name));
                  router.push("/home/player")
                }}>
                  <Text display="flex" color="black" as="b" >{player.name}<RiArrowRightLine /></Text>
                </Button>
                
              </Table.ColumnHeader>
            ))}
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {t_gamesTable?.map((row, rowIndex) => (
            <Table.Row key={rowIndex} onClick={() => {
              if(!isDelete){
                localStorage.setItem("gameID", JSON.stringify(row[0].game.id));
                router.push("/home/game")
              }
              
            }}>
              <Table.Cell textAlign="center">
                {isDelete && 
                <Checkbox.Root 
                  variant="subtle"
                  key={rowIndex}
                  onCheckedChange={(details) => {
                      const isChecked = details.checked;
                      if(isChecked){
                          //すでにselectされていたら追加して保存
                          if(deletingGamesID){
                              setDeletingGamesID([...deletingGamesID, row[0].game.id])
                          }
                          //selecyされていなかったら新規追加して保存
                          else{
                              setDeletingGamesID([row[0].game.id]);
                          }
                      }
                      //チェックがついていなかったら
                      else{
                          //selectされているか調べ、すでにselectされているものであったら、配列から削除
                          if(deletingGamesID?.includes(row[0].game.id)){
                              setDeletingGamesID(
                                  deletingGamesID.filter((deletingGameID) => (deletingGameID !== row[0].game.id))
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
                <Text as="b">{row[0].game.date}</Text>
              </Table.Cell>
              {row.map((score, colIndex) => (
                <Table.Cell key={colIndex} textAlign="center">
                  <Box textAlign="center">
                    <Text color={score.score < 0 ? "red" : score.score === 0 ? "black" : "blue"}>{score.score === 0 ? "-" : score.score/50 + "pt"}</Text>
                    <Text color={score.chip < 0 ? "red" : score.chip === 0 ? "black" : "blue"}>{score.score === 0 ? "-" : score.chip + "枚"}</Text>
                    <Text color={score.score + score.chip*100 < 0 ? "red" : score.score + score.chip*100 === 0 ? "black" : "blue"} as="b">{score.score === 0 ? "-" : score.score + score.chip*100 + "pt"}</Text>
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
  );
}