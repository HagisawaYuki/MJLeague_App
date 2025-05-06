"use client"

import { Box, Button, Table, Text } from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { searchUserIDByName } from "../api/user";
import { PlayerWithHanshuangScore, searchAllPlayersByUserID } from "../api/player";
import { useRouter } from "next/navigation";

import { GameWithHanshuangsAndScores, searchGamesByUserID } from "../api/game";

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
        // console.log("player1", _players[0].name)
        const _Games: GameWithHanshuangsAndScores[] = await searchGamesByUserID(_userID);
        console.log("game1", _Games[0].id)
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
      }else{
        //session情報がなければログイン画面へ
        router.push("/login");
      }
    }
    initHome();
    
  },[session, router]);

  if (status === 'loading') return <Text>Loading...</Text>;
  if (!session) return <Text>ログインしていません</Text>;

  
  
  return (
    <Box>
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
                  <Text color="black" as="b">{player.name}</Text>
                </Button>
                
              </Table.ColumnHeader>
            ))}
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {t_gamesTable?.map((row, rowIndex) => (
            <Table.Row key={rowIndex} onClick={() => {
              localStorage.setItem("gameID", JSON.stringify(row[0].game.id));//仮でgameID:2を保存
              router.push("/home/game")
            }}>
              <Table.Cell textAlign="center">
                <Text as="b">{row[0].game.date}</Text>
              </Table.Cell>
              {row.map((score, colIndex) => (
                <Table.Cell key={colIndex} textAlign="center">
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
  );
}