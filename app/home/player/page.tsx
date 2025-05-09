"use client"
import { Box, Button, Table, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { PlayerWithHanshuangScore, searchPlayerByID } from "../../api/player";
import { GameWithHanshuangsAndScores, searchGamesByUserID } from "../../api/game";
import { useSession } from "next-auth/react";
import { searchUserIDByName } from "../../api/user";
import { HanshuangScore } from "@prisma/client";

const dataTableHeader1 = [
  {name: "総合ポイント"},
  {name: "総ポイント数"},
  {name: "総チップ数"},
  {name: "参加半荘数"},
];

const dataTableHeader2 = [
  {name: "1着率"},
  {name: "2着率"},
  {name: "3着率"},
  {name: "4着率"}
];

type DataTable = {
  totalPoint: number;
  pointCount: number;
  chipCount: number;
  gameConut: number;
  firstPer: number;
  secondPer: number;
  thirdPer: number;
  fourthPer: number;
}

export default function Home() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [playerName, setPlayerName] = useState<string>();
  // const [playerID, setPlayerID] = useState<number>();
  // const [player, setPlayer] = useState<PlayerWithHanshuangScore>();
  const [dataTable, setDataTable] = useState<DataTable>();
  const createDataTable = (games: GameWithHanshuangsAndScores[], player: PlayerWithHanshuangScore) => {
    let pointCount = 0;
    let chipCount = 0;
    player.scores.forEach((score) => {
      pointCount += score.score;
      chipCount += score.chip;
    })
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
    console.log(gameCount);
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
    const _dataTable: DataTable = {
      totalPoint: pointCount + chipCount * 100,
      pointCount: pointCount,
      chipCount: chipCount,
      gameConut: gameCount,
      firstPer: rankCount[0],
      secondPer: rankCount[1],
      thirdPer: rankCount[2],
      fourthPer: rankCount[3],
    }
    setDataTable(_dataTable);
  }
  useEffect(() => {
    const init = async () => {
      if(session && session.user && session.user.name){
        //ローカルストレージからプレイヤーID・nameを取り出す。
        const _playerName = localStorage.getItem("editPlayerName");
        const _playerID = Number(localStorage.getItem("editPlayerID"));
        if(_playerName) setPlayerName(JSON.parse(_playerName));
        // setPlayerID(localPlayerID);
        //playerIDからPlayer情報を取り出す。
        const _player = await searchPlayerByID(_playerID);
        // setPlayer(_player);
        const _userID = await searchUserIDByName(session.user.name);
        const _game = await searchGamesByUserID(_userID);
        createDataTable(_game, _player);
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
            <Text fontSize="2xl" as="b">{playerName}のデータ</Text>
            <Button colorPalette="orange" variant="subtle" onClick={() => {
              router.push("/edit/player")
            }}>
              <Text>名前を変更する</Text>
            </Button>
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
                  <Table.Cell>{dataTable?.totalPoint}</Table.Cell>
                  <Table.Cell>{dataTable?.pointCount}</Table.Cell>
                  <Table.Cell>{dataTable?.chipCount}</Table.Cell>
                  <Table.Cell>{dataTable?.gameConut}</Table.Cell>
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
                  <Table.Cell>{dataTable?.firstPer}%</Table.Cell>
                  <Table.Cell>{dataTable?.secondPer}%</Table.Cell>
                  <Table.Cell>{dataTable?.thirdPer}%</Table.Cell>
                  <Table.Cell>{dataTable?.fourthPer}%</Table.Cell>
                </Table.Row>
                
                
              </Table.Body>
            </Table.Root>
          </Box>
        </Box>
        
    </Box>
  );
}
