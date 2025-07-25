"use client"
import { Box, Table, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { GameWithHanshuangsAndScores, searchGamesByUserID } from "../../api/game";
import { useSession } from "next-auth/react";
import { searchUserIDByName } from "../../api/user";
import { PlayerWithHanshuangScore, searchAllPlayersByUserID, searchPlayerByID } from "../../api/player";
import { HanshuangScore } from "@prisma/client";

const dataTableHeader = [
  {name: "総合順位", unit: "pt"},
  {name: "連対率順位", unit: "%"},
  {name: "半荘スコア順位", unit: "pt"},
  {name: "ポイント順位", unit: "pt"},
  {name: "チップ順位", unit: "枚"},
];

type DataTable = {
  total: {name: string, value: number}[];
  firstSecondPer: {name: string, value: number}[];
  hanshuangScore: {name: string, value: number}[];
  point: {name: string, value: number}[];
  chip: {name: string, value: number}[];
}

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
  const router = useRouter();
  const { data: session, status } = useSession();
//   const [sumScores, setSumScores] = useState<{name: string; sumScore: number; chip: number}[]>();
  const [dataTable, setDataTable] = useState<DataTable>();
  const [rankIdx, setRankIdx] = useState<string[]>([""]);

  const relateHeaderAndTable = (idx: number) => {
    if(idx === 0){
        return dataTable?.total;
    }
    else if(idx === 1){
        return dataTable?.firstSecondPer;
    }
    else if(idx === 2){
        return dataTable?.hanshuangScore;
    }
    else if(idx === 3){
        return dataTable?.point;
    }
    else if(idx === 4){
        return dataTable?.chip;
    }
    else{
        return;
    }
  }

    //Game情報からプレイヤーごとにテーブル形式で配列にまとめる関数
    const createGameTable = (games: GameWithHanshuangsAndScores[], players: PlayerWithHanshuangScore[]): GamesTable => {
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
  const calSum = async (_gamesTable: GamesTable) => {
    
    const _sumScores: {playerID: number; name: string; sumScore: number, point: number, chip: number}[] = [];
      
    for(const playerTable of _gamesTable){
      let sum = 0;
      let chip = 0;
      for(const score of playerTable.scores){
        sum = sum + score.score;
        chip = chip + score.chip;
      }
      const _name = (await searchPlayerByID(playerTable.playerID)).name;
      _sumScores.push({playerID: playerTable.playerID, name: _name, sumScore: sum + chip * 100, point: sum, chip: chip});
    }
    return _sumScores;
  }

  const calFirstSecondPer = (players: PlayerWithHanshuangScore[], games: GameWithHanshuangsAndScores[]) => {
    const playerFirstSecondPer = [];
    for(const player of players){
        //参加試合数を計算
        let gameCount = 0;
        for(const game of games){
            for(const hanshuang of game.hanshuangs){
            for(const score of hanshuang.scores){
                if(score.playerId === player.id){
                gameCount += 1;
                break;
                }
            }
            }
        }
        //配列に1,2,3,4位数を格納
        const _rankCount: number[] = [0,0,0,0];
        for(const game of games){
            for(const hanshuang of game.hanshuangs){
            if(hanshuang.scores.some(score => score.playerId === player.id)){
                const scores: HanshuangScore[] = [];
                for(const score of hanshuang.scores){
                scores.push(score);
                }
                scores.sort((a, b) => b.score - a.score);
                scores.forEach((score, idx) => {
                if(score.playerId === player.id){
                    _rankCount[idx] += 1;
                }
                })
            }
            }
        }
        const rankCount = _rankCount.map(count => Math.round(count / gameCount * 100 * 100) / 100);
        playerFirstSecondPer.push({name: player.name, value: Math.round(rankCount[0] + rankCount[1] * 100) / 100});
    }
    playerFirstSecondPer.sort((a, b) => b.value - a.value);
    return playerFirstSecondPer;

  }
  
  
  useEffect(() => {
    const createDataTable = async (gamesTable: GamesTable, players: PlayerWithHanshuangScore[], games: GameWithHanshuangsAndScores[]) => {
        const _rankIdx = players.map((_, i) => (i + 1).toString() + "位");
        setRankIdx(_rankIdx);
        //スコア合計データをまとめる

        const sumData = await calSum(gamesTable);
        //スコア合計データを降順でソートする
        sumData.sort((a, b) => b.sumScore - a.sumScore);
        //データのパラメータ値をまとめる
        const _total = sumData.map((data) => {return {name: data.name, value: data.sumScore}})

        //pointごとにソートする
        sumData.sort((a, b) => b.point - a.point);
        const _point = sumData.map((data) => {return {name: data.name, value: data.point / 50}})

        //chipごとにソートする
        sumData.sort((a, b) => b.chip - a.chip);
        const _chip = sumData.map((data) => {return {name: data.name, value: data.chip}})

        //プレイヤーごとの最高半荘スコアをまとめる
        const _hanshuangScore = [];
        for(const player of players){
            const scores = player.scores.map(score => score);
            scores.sort((a, b) => b.score - a.score);
            _hanshuangScore.push({name: (await searchPlayerByID(scores[0].playerId)).name, value: scores[0].score});
        }
        //プレイヤーごとの最高半荘スコアをソートする
        _hanshuangScore.sort((a, b) => b.value - a.value);
        //データのパラメータ値をまとめる
        const _firstSecondPer = calFirstSecondPer(players, games)
        
        const _dataTable: DataTable = {
            total: _total,
            firstSecondPer: _firstSecondPer,
            hanshuangScore: _hanshuangScore,
            point: _point,
            chip: _chip,
        }
        setDataTable(_dataTable);
    }
    const init = async () => {
      if(session && session.user && session.user.name){
        const _userID = await searchUserIDByName(session.user.name);
        const _players: PlayerWithHanshuangScore[] = await searchAllPlayersByUserID(_userID);
        const _games = await searchGamesByUserID(_userID);
        const _gamesTable = createGameTable(_games, _players);
        createDataTable(_gamesTable, _players, _games);
      }
    }
    init();
  },[router, session]);

  if (status === 'loading') return <Text>Loading...</Text>;
  if (!session) return <Text>ログインしていません</Text>;

  return (
    <Box>
        <Box>
          <Box>
            <Text fontSize="3xl" as="b">リーグデータ</Text>
          </Box>
          {dataTableHeader.map((header, idx) => (

          
            <Box key={header.name}>
                <Text as="b" fontSize="2xl">{header.name}</Text>
                <Table.ScrollArea borderWidth="1px" maxW="xl" width="90%">
                <Table.Root variant="outline" showColumnBorder>
                    <Table.Header>
                        <Table.Row>
                        {rankIdx.map((rank) => (
                            <Table.ColumnHeader key={rank}>{rank}</Table.ColumnHeader>
                        ))}
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        <Table.Row>
                            {relateHeaderAndTable(idx)?.map((data) => (
                                <Table.Cell key={data.name}>
                                    <Box textAlign="center">
                                        <Text>{data.name}</Text>
                                        <Text>{data.value + header.unit}</Text>
                                    </Box>
                                </Table.Cell>
                            ))}
                        </Table.Row>
                    </Table.Body>
                </Table.Root>
                </Table.ScrollArea>
            </Box>
          ))}
        </Box>
    </Box>
  );
}

