"use client"
import { Box, Button, Input, Text } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { PlayerWithHanshuangScore, searchPlayerByID } from "../../api/player";
import { GameWithHanshuangsAndScores, searchGameByID } from "../../api/game";
import { createHanshuangScores } from "../../api/hanshuang_score";
export default function Create() {

    const router = useRouter();
    const [players, setPlayers] = useState<PlayerWithHanshuangScore[]>();
    const [game, setGame] = useState<GameWithHanshuangsAndScores>();

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
        hanshuangID: number,
        gameID: number
    }

    const {
        register,
        // formState: { errors },
    } = useForm<formData>();

    useEffect(() => {
        const createHanshuangInit = async () => {
            // const _userID = Number(localStorage.getItem("userID"));
            // if(_userID === 0){
            //     router.push("/")
            // }
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
    
    return(
        <Box>
            <Box>
                <Text fontSize="3xl">半荘情報を入力</Text>
            </Box>
            <Box display="flex">
                <Box>
                    <Text>プレイヤー名</Text>
                </Box>
                <Box>
                    <Text>スコア</Text>
                </Box>
                <Box>
                    <Text>チップ数</Text>
                </Box>
            </Box>
            {players && 
            /** form入力後半荘スコアモデルを作成する。 */
                <form action={createHanshuangScores}>
                    {/* <Box hidden> */}
                        <Input type="hidden" {...register('player1')} value={players[0].id}></Input>
                        <Input type="hidden" {...register('player2')} value={players[1].id}></Input>
                        <Input type="hidden" {...register('player3')} value={players[2].id}></Input>
                        <Input type="hidden" {...register('player4')} value={players[3].id}></Input>
                        {game && <Input type="hidden" {...register('gameID')} value={game.id}></Input>}
                    {/* </Box> */}
                    <Box display="flex">
                        <Box>
                            <Text>{players[0].name}</Text>
                        </Box>
                        <Box>
                            <Input 
                              type="number" 
                              placeholder=""
                              {...register('score1')}
                            ></Input>
                        </Box>
                        <Box>
                            <Input 
                              type="number" 
                              placeholder=""
                              {...register('chip1')}
                            ></Input>
                        </Box>
                    </Box>
                    <Box display="flex">
                        <Box>
                            <Text>{players[1].name}</Text>
                        </Box>
                        <Box>
                            <Input 
                              type="number" 
                              placeholder=""
                              {...register('score2')}
                            ></Input>
                        </Box>
                        <Box>
                            <Input 
                              type="number" 
                              placeholder=""
                              {...register('chip2')}
                            ></Input>
                        </Box>
                    </Box>
                    <Box display="flex">
                        <Box>
                            <Text>{players[2].name}</Text>
                        </Box>
                        <Box>
                            <Input 
                              type="number" 
                              placeholder=""
                              {...register('score3')}
                            ></Input>
                        </Box>
                        <Box>
                            <Input 
                              type="number" 
                              placeholder=""
                              {...register('chip3')}
                            ></Input>
                        </Box>
                    </Box>
                    <Box display="flex">
                        <Box>
                            <Text>{players[3].name}</Text>
                        </Box>
                        <Box>
                            <Input 
                              type="number" 
                              placeholder=""
                              {...register('score4')}
                            ></Input>
                        </Box>
                        <Box>
                            <Input 
                              type="number" 
                              placeholder=""
                              {...register('chip4')}
                            ></Input>
                        </Box>
                    </Box>
                    <Box>
                        <Button type="submit" colorPalette="orange" variant="subtle">
                            完了
                        </Button>
                    </Box>
                </form>
            }
            
        </Box>
    )
}