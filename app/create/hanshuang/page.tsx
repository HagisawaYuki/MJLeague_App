"use client"
import { Box, Button, Input, NumberInput, Table, Tabs, Text } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { PlayerWithHanshuangScore, searchPlayerByID } from "../../api/player";
import { GameWithHanshuangsAndScores, searchGameByID } from "../../api/game";
import { createHanshuangScores } from "../../api/hanshuang_score";

type formData = {
    player1: number,
    score1: number, 
    chip1: number, 
    player2: number,
    score2: number, 
    chip2: number, 
    player3: number,
    score3: number, 
    chip3: number, 
    player4: number,
    score4: number, 
    chip4: number,
    gameID: number
}

const registerName = {
    scores: ["score1", "score2", "score3", "score4"] as const,
    chips: ["chip1", "chip2", "chip3", "chip4"] as const,
    players: ["player1", "player2", "player3", "player4"] as const
}
export default function Create() {

    const router = useRouter();
    const [players, setPlayers] = useState<PlayerWithHanshuangScore[]>();
    const [game, setGame] = useState<GameWithHanshuangsAndScores>();
    const [scores, setScores] = useState<string[]>(["0","0","0","0"]);
    const [chips, setChips] = useState<string[]>(["0","0","0","0"]);
    const [points, setPoints] = useState<number[]>([0,0,0,0]);

    const {
        register,
        setValue
        // formState: { errors },
    } = useForm<formData>();

    useEffect(() => {
        const createHanshuangInit = async () => {
            //localStorageから試合するプレイヤーのidを取り出す
            const local_players =  localStorage.getItem("players");
            //player情報をplayerIDから取得し、保存
            if(local_players){
                const _playersID: number[] = JSON.parse(local_players);
                const searchedPlayer1 = await searchPlayerByID(_playersID[0]);
                const searchedPlayer2 = await searchPlayerByID(_playersID[1]);
                const searchedPlayer3 = await searchPlayerByID(_playersID[2]);
                const searchedPlayer4 = await searchPlayerByID(_playersID[3]);
                if(searchedPlayer1 && searchedPlayer2 && searchedPlayer3 && searchedPlayer4){
                 setPlayers([searchedPlayer1, searchedPlayer2, searchedPlayer3, searchedPlayer4]);
                }
            }
            
            //localStorageからgameIDを取り出す
            const _gameID = Number(localStorage.getItem("gameID"));
            const search_game = await searchGameByID(_gameID);
            if(search_game){
                setGame(search_game);
            }
        }
        createHanshuangInit();
    }, [router]);

    //ウマオカ、レートを計算
    useEffect(() => {
        //五捨六入する関数
        const roundToFiveSix = (value: number): number => {
            const integer = Math.floor(value);
            const decimal = value - integer;
          
            const tenth = Math.floor(decimal * 10);
          
            if (tenth <= 5) {
              return Math.floor(value);
            } else {
              return Math.ceil(value);
            }
        }
        //ウマオカ、レート定義
        const uma = [20000, 10000, -10000, -20000];
        const oka = [20000, 0, 0, 0];
        const rate = 50;
        //ここからウマオカ計算
        const indexed = scores.map((score, idx) => ({
            value: Number(score),
            index: idx,
        }));
          
        // 降順でソート
        indexed.sort((a, b) => b.value - a.value);
        // 数値の降順配列
        const sortedScores = indexed.map(item => item.value);
        // 元のインデックス順を表す配列
        const sortedIndices = indexed.map(item => item.index);

        const afterUmaOkaScores = sortedScores.map((score, i) => roundToFiveSix((score + uma[i] + oka[i] - 30000) / 1000) * rate);

        const originalOrderScores: number[] = [];

        sortedIndices.forEach((originalIndex, sortedIndex) => {
            originalOrderScores[originalIndex] = afterUmaOkaScores[sortedIndex];
        });
        setPoints(originalOrderScores);
        registerName.scores.forEach((regname, idx) => setValue(regname, originalOrderScores[idx]));
        registerName.chips.forEach((regname, idx) => setValue(regname, Number(chips[idx])));
        
    }, [scores, chips, setValue]);
    
    return(
        <Box display="flex" justifyContent="center">
            <Box width="70%" bg="#EEE" marginTop="5%" padding="5%">
                <Box>
                    <Text fontSize="3xl">半荘情報を入力</Text>
                </Box>
                <Tabs.Root defaultValue="score">
                    <Tabs.List>
                        <Tabs.Trigger value="score">
                            精算後から
                        </Tabs.Trigger>
                        <Tabs.Trigger value="point">
                            点数から
                        </Tabs.Trigger>
                    </Tabs.List>
                    <Tabs.Content value="score">
                        {players && 
                            <form action={createHanshuangScores}>
                                {registerName.players.map((regname, idx) => (
                                    <Input type="hidden" key={idx} {...register(regname)} value={players[idx].id}></Input>
                                ))}
                                {game && <Input type="hidden" {...register('gameID')} value={game.id}></Input>}
                                <Table.Root size="sm">
                                    <Table.Header>
                                        <Table.Row>
                                        <Table.ColumnHeader></Table.ColumnHeader>
                                            {players && players.map((player) => (
                                                <Table.ColumnHeader key={player.id}>{player.name}</Table.ColumnHeader>
                                            ))}
                                        </Table.Row>
                                    </Table.Header>
                                    <Table.Body>
                                    <Table.Row>
                                    <Table.Cell>
                                        <Text>スコア</Text>
                                    </Table.Cell>
                                    {registerName.scores.map((regname, idx) => (
                                        <Table.Cell key={idx}>
                                            <Input 
                                                type="number" 
                                                placeholder=""
                                                bg="white"
                                                {...register(regname)}
                                            ></Input>
                                        </Table.Cell>
                                    ))}
                                </Table.Row>
                                <Table.Row>
                                    <Table.Cell>
                                        <Text>チップ</Text>
                                    </Table.Cell>
                                    {registerName.chips.map((regname, idx) => (
                                        <Table.Cell key={idx}>
                                            <Input 
                                                type="number" 
                                                placeholder=""
                                                bg="white"
                                                {...register(regname)}
                                            ></Input>
                                        </Table.Cell>
                                    ))}
                                </Table.Row>
                                    </Table.Body>
                                </Table.Root>
                                <Box>
                                    <Button type="submit" colorPalette="orange" variant="subtle">
                                        完了
                                    </Button>
                                </Box>
                            </form>
                        }
                    </Tabs.Content>
                    <Tabs.Content value="point">
                        <Table.Root size="sm">
                            <Table.Header>
                                <Table.Row>
                                    <Table.ColumnHeader></Table.ColumnHeader>
                                    {players && players.map((player) => (
                                        <Table.ColumnHeader key={player.id}>{player.name}</Table.ColumnHeader>
                                    ))}
                                </Table.Row>
                            </Table.Header>
                            <Table.Body>
                                <Table.Row>
                                    <Table.Cell>
                                        <Text>スコア</Text>
                                    </Table.Cell>
                                    {scores.map((score, i) => (
                                        <Table.Cell key={i}>
                                            <NumberInput.Root
                                                value={score}
                                                onValueChange={(e) => {
                                                    const newScores = scores.map((score, j) => i === j ? e.value : score);
                                                    setScores(newScores);
                                                }}
                                            >
                                            <NumberInput.Control />
                                            <NumberInput.Input />
                                            </NumberInput.Root>
                                        </Table.Cell>
                                    ))}
                                </Table.Row>
                                <Table.Row>
                                    <Table.Cell>
                                        <Text>チップ</Text>
                                    </Table.Cell>
                                    {chips.map((chip, i) => (
                                        <Table.Cell key={i}>
                                            <NumberInput.Root
                                                value={chip}
                                                onValueChange={(e) => {
                                                    const newChips = chips.map((chip, j) => i === j ? e.value : chip);
                                                    setChips(newChips);
                                                }}
                                            >
                                            <NumberInput.Control />
                                            <NumberInput.Input />
                                            </NumberInput.Root>
                                        </Table.Cell>
                                    ))}
                                </Table.Row>
                                <Table.Row>
                                    <Table.Cell>
                                        <Text>ポイント</Text>
                                    </Table.Cell>
                                    {points.map((point, i) => (
                                        <Table.Cell key={i}>
                                            <Text>{point}</Text>
                                        </Table.Cell>
                                    ))}
                                </Table.Row>
                                
                            </Table.Body>
                        </Table.Root>
                        {players && 
                            <form action={createHanshuangScores}>
                                {registerName.players.map((regname, idx) => (
                                    <Input type="hidden" key={idx} {...register(regname)} value={players[idx].id}></Input>
                                ))}
                                {registerName.scores.map((regname, idx) => (
                                    <Input type="hidden" key={idx} {...register(regname)} value={points[idx]}></Input>
                                ))}
                                {registerName.chips.map((regname, idx) => (
                                    <Input type="hidden" key={idx} {...register(regname)} value={Number(chips[idx])}></Input>
                                ))}
                                {game && <Input type="hidden" {...register('gameID')} value={game.id}></Input>}
                                <Box>
                                    <Button type="submit" colorPalette="orange" variant="subtle">
                                        完了
                                    </Button>
                                </Box>
                            </form>
                        }
                    </Tabs.Content>
                </Tabs.Root>
            </Box>
        </Box>
    )
}