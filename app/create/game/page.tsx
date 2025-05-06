"use client"
import { Box, Button, Checkbox, Input, Text } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { PlayerWithHanshuangScore, searchAllPlayersByUserID } from "../../api/player";
import { useSession } from "next-auth/react";
import { searchUserIDByName } from "../../api/user";
import { Player } from "@prisma/client";
import { createGame } from "../../api/game";


export default function Create() {

    const router = useRouter();
    const { data: session, status } = useSession();
    const [players, setPlayers] = useState<PlayerWithHanshuangScore[]>();
    const [selectedPlayers, setSelectedPlayers] = useState<number[]>();
    const [selectPlayersErrorMessage, setSelectPlayersErrorMessage] = useState<string>("");
    const [isSelectPlayer, setIsSelectPlayer] = useState<boolean>();
    const [userID, setUserID] = useState<string>("");

    const {
        register,
        // formState: { errors },
    } = useForm<{date: Date, isPlayers: number, userId: string}>();
    
    //全playerのデータを取得して、保存
    useEffect(() => {
        const createGameInit = async () => {
            if(session && session.user && session.user.name){
                const _userID = await searchUserIDByName(session.user.name);
                setUserID(_userID)
                //全プレイヤー情報を取得して保存
                const serchedPlayers = await searchAllPlayersByUserID(_userID);
                setPlayers(serchedPlayers);
            }
        }
        createGameInit();
        
    }, [router, session])

    if (status === 'loading') return <Text>Loading...</Text>;
    if (!session) return <Text>ログインしていません</Text>;

    return(
        <Box display="flex" justifyContent="center">
            <Box width="70%" bg="#EEE" marginTop="5%" padding="5%">
                <Box>
                    <Text fontSize="2xl" as="b">メンバーを4人選択</Text>
                </Box>
                <Box display="flex">
                    {players && players.map((player: Player, index: number) => {
                        return (
                            <Box key={player.id}
                                padding="1%"
                                marginTop="2%"
                                marginBottom="2%"
                                marginLeft="2%"
                            >
                                <Checkbox.Root 
                                colorPalette={index % 2 === 0 ? "blue" : "red"}
                                variant="subtle"
                                key={player.id}
                                onCheckedChange={(details) => {
                                    const isChecked = details.checked;
                                    if(isChecked){
                                        //すでにselectされていたら追加して保存
                                        if(selectedPlayers){
                                            setSelectedPlayers([...selectedPlayers, player.id])
                                        }
                                        //selecyされていなかったら新規追加して保存
                                        else{
                                            setSelectedPlayers([player.id]);
                                        }
                                    }
                                    //チェックがついていなかったら
                                    else{
                                        //selectされているか調べ、すでにselectされているものであったら、配列から削除
                                        if(selectedPlayers?.includes(player.id)){
                                            setSelectedPlayers(
                                                selectedPlayers.filter((selectedPlayer) => (selectedPlayer !== player.id))
                                            )
                                        }
                                    }
                                }}>
                                    <Checkbox.HiddenInput />
                                    <Checkbox.Control />
                                    <Checkbox.Label>
                                        <Box>
                                            <Text color={index % 2 === 0 ? "blue" : "red"}>{player.name}</Text>
                                        </Box>
                                    </Checkbox.Label>
                                </Checkbox.Root>
                            </Box>
                        );
                    })}
                </Box>
                <Box>
                    {!isSelectPlayer && <Text color="red">{selectPlayersErrorMessage}</Text>}
                </Box>
                <Box>
                    <Button
                    colorPalette="orange" 
                    variant="subtle"
                    onClick={() => {
                        //チェックされている数がちょうど４なら
                        if(selectedPlayers?.length == 4){
                            //ローカルストレージに試合するplayersを保存
                            localStorage.removeItem("players");
                            localStorage.setItem("players", JSON.stringify(selectedPlayers));
                            setSelectPlayersErrorMessage("");
                            setIsSelectPlayer(true);
                        }
                        // そうでないならエラーメッセージを表示
                        else{
                            setSelectPlayersErrorMessage("4人選択してください。");
                            setIsSelectPlayer(false);
                        }
                    }}
                    >
                        メンバー確定
                    </Button>
                </Box>
                <Box marginTop="4%">
                    <form action={createGame}>
                        {/* <Box hidden> */}
                            <Input type="hidden" {...register('isPlayers')} value={isSelectPlayer ? "1" : "0"}></Input>
                            <Input type="hidden" {...register('userId')} value={userID}></Input>
                        {/* </Box> */}
                        <Box>
                            <Text fontSize="2xl" as="b">日付を選択</Text>
                        </Box>
                        <Box marginLeft="5%">
                            <Input
                                autoFocus
                                placeholder="Date"
                                {...register('date')}
                                type="date"
                                width="40%"
                            ></Input>
                        </Box>
                        
                        <Box marginLeft="5%" marginTop="2%">
                            <Button type="submit"  colorPalette="orange" variant="subtle">
                                完了
                            </Button>
                        </Box>
                    </form>
                </Box>
            </Box>
        </Box>
    )
}