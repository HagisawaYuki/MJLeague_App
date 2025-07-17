"use client"
import { Box, Table, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { GameWithHanshuangsAndScores, searchGamesByUserID } from "../../api/game";
import { useSession } from "next-auth/react";
import { searchUserIDByName } from "../../api/user";
import { PlayerWithHanshuangScore, searchAllPlayersByUserID, searchPlayerByID } from "../../api/player";
import { HanshuangScore } from "@prisma/client";

const dataTableHeader1 = [
  {name: "1位"},
  {name: "2位"},
  {name: "3位"},
  {name: "4位"},
];

const dataTableHeader2 = [
  {name: "最高半荘スコア"},
  {name: "連対率1位"},
  {name: "ポイント1位"},
  {name: "チップ1位"}
];


type DataTable = {
  first: {name: string, score: number};
  second: {name: string, score: number};
  third: {name: string, score: number};
  fourth: {name: string, score: number};
  highestScore: {name: string, score: number};
  firstSecondPer: {name: string, per: number};
  highestPoint: {name: string, point: number};
  highestChip: {name: string, chip: number};
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
  const calSum = (_gamesTable: GamesTable) => {
    
    const _sumScores: {playerID: number; sumScore: number, point: number, chip: number}[] = [];
      
    for(const playerTable of _gamesTable){
      let sum = 0;
      let chip = 0;
      for(const score of playerTable.scores){
        sum = sum + score.score;
        chip = chip + score.chip;
      }
      _sumScores.push({playerID: playerTable.playerID, sumScore: sum + chip * 100, point: sum, chip: chip});
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
        playerFirstSecondPer.push({name: player.name, per: rankCount[0] + rankCount[1]});
    }
    playerFirstSecondPer.sort((a, b) => b.per - a.per);
    return playerFirstSecondPer[0];

  }
  
  
  useEffect(() => {
    const createDataTable = async (gamesTable: GamesTable, players: PlayerWithHanshuangScore[], games: GameWithHanshuangsAndScores[]) => {
        //スコア合計データをまとめる
        const sumData = calSum(gamesTable);
        //スコア合計データを降順でソートする
        sumData.sort((a, b) => b.sumScore - a.sumScore);
        //データのパラメータ値をまとめる
        const _first = {name: (await searchPlayerByID(sumData[0].playerID)).name, score: sumData[0].sumScore};
        const _second = {name: (await searchPlayerByID(sumData[1].playerID)).name, score: sumData[1].sumScore};
        const _third = {name: (await searchPlayerByID(sumData[2].playerID)).name, score: sumData[2].sumScore};
        const _fourth = {name: (await searchPlayerByID(sumData[3].playerID)).name, score: sumData[3].sumScore};

        //pointごとにソートする
        sumData.sort((a, b) => b.point - a.point);
        const _highestPoint = {name: (await searchPlayerByID(sumData[0].playerID)).name, point: sumData[0].point/50};

        //chipごとにソートする
        sumData.sort((a, b) => b.chip - a.chip);
        const _highestChip = {name: (await searchPlayerByID(sumData[0].playerID)).name, chip: sumData[0].chip}

        //プレイヤーごとの最高半荘スコアをまとめる
        const playerHighestScores = [];
        for(const player of players){
            const scores = player.scores.map(score => score);
            scores.sort((a, b) => b.score - a.score);
            playerHighestScores.push(scores[0]);
        }
        //プレイヤーごとの最高半荘スコアをソートする
        playerHighestScores.sort((a, b) => b.score - a.score);
        //データのパラメータ値をまとめる
        const _highestScore = {name: (await searchPlayerByID(playerHighestScores[0].playerId)).name, score: playerHighestScores[0].score};

        const _firstSecondPer = calFirstSecondPer(players, games)
        
        const _dataTable: DataTable = {
            first: _first,
            second: _second,
            third: _third,
            fourth: _fourth,
            highestScore: _highestScore,
            firstSecondPer: _firstSecondPer,
            highestPoint: _highestPoint,
            highestChip: _highestChip,
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
            <Text fontSize="2xl" as="b">リーグデータ</Text>
          </Box>
          <Box>
            <Table.Root variant="outline" showColumnBorder>
              <Table.Header>
                <Table.Row>
                  {dataTableHeader1.map((header) => (
                    <Table.ColumnHeader key={header.name}>{header.name}</Table.ColumnHeader>
                  ))}
                </Table.Row>
              </Table.Header>
              <Table.Body>
                <Table.Row>
                    <Table.Cell>
                        <Box textAlign="center">
                            <Text>{dataTable?.first.name}</Text>
                            <Text>{dataTable?.first.score}pt</Text>
                        </Box>
                        </Table.Cell>
                    <Table.Cell>
                        <Box textAlign="center">
                            <Text>{dataTable?.second.name}</Text>
                            <Text>{dataTable?.second.score}pt</Text>
                        </Box>    
                    </Table.Cell>
                    <Table.Cell>
                        <Box textAlign="center">
                            <Text>{dataTable?.third.name}</Text>
                            <Text>{dataTable?.third.score}pt</Text>
                        </Box>
                    </Table.Cell>
                    <Table.Cell>
                        <Box textAlign="center">
                            <Text>{dataTable?.fourth.name}</Text>
                            <Text>{dataTable?.fourth.score}pt</Text>
                        </Box>
                    </Table.Cell>
                </Table.Row>
              </Table.Body>
            </Table.Root>
          </Box>
          <Box>
            <Table.Root variant="outline" showColumnBorder>
              <Table.Header>
                <Table.Row>
                  {dataTableHeader2.map((header) => (
                    <Table.ColumnHeader key={header.name}>{header.name}</Table.ColumnHeader>
                  ))}
                </Table.Row>
              </Table.Header>
              <Table.Body>
                <Table.Row>
                    <Table.Cell>
                        <Box textAlign="center">
                            <Text>{dataTable?.highestScore.name}</Text>
                            <Text>{dataTable?.highestScore.score}pt</Text>
                        </Box>
                    </Table.Cell>
                    <Table.Cell>
                        <Box textAlign="center">
                            <Text>{dataTable?.firstSecondPer.name}</Text>
                            <Text>{dataTable?.firstSecondPer.per}%</Text>
                        </Box>
                    </Table.Cell>
                    <Table.Cell>
                        <Box textAlign="center">
                            <Text>{dataTable?.highestPoint.name}</Text>
                            <Text>{dataTable?.highestPoint.point}pt</Text>
                        </Box>
                    </Table.Cell>
                    <Table.Cell>
                        <Box textAlign="center">
                            <Text>{dataTable?.highestChip.name}</Text>
                            <Text>{dataTable?.highestChip.chip}枚</Text>
                        </Box>
                    </Table.Cell>
                </Table.Row>                
              </Table.Body>
            </Table.Root>
          </Box>
        </Box>
    </Box>
  );
}

