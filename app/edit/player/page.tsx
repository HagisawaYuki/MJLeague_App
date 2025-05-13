"use client"
import { Box, Button, Input, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import { useRouter } from "next/navigation";
import { editPlayerName } from "../../api/player";

export default function Home() {
    const router = useRouter();
    const [playerID, setPlayerID] = useState<number>(0);
    const [playerName, setPlayerName] = useState<string>("");
    const {
        register,
        // formState: { errors },
    } = useForm<{playerID: number; playerName: string; name: string}>();
    useEffect(() => {
        const init = () => {
            console.log("playerid: ", localStorage.getItem("editPlayerID"))
            setPlayerID(Number(localStorage.getItem("editPlayerID")));
            const localPlayerName = localStorage.getItem("editPlayerName")
            if(localPlayerName){
                setPlayerName(JSON.parse(localPlayerName));
            }
        }
        init();
    },[router]);
  return (
    <Box display="flex" justifyContent="center">
        <Box width="60%" bg="#EEE" marginTop="5%" padding="5%">
            <Box display="flex">
                <Text fontSize="2xl" as="b">{playerName}</Text>
                <Text fontSize="2xl" as="b">の名前を変更</Text>
            </Box>
            <Box>
                <form action={editPlayerName}>
                    <Input type="hidden" {...register('playerID')} value={playerID}></Input>
                    <Input
                        width="100%"
                        bg="white"
                        marginTop="2%"
                        autoFocus
                        placeholder="名前"
                        {...register('name')}
                        type="text"
                    ></Input>
                    <Box marginTop="5%">
                        <Button type="submit"  colorPalette="orange" variant="subtle">
                            変更
                        </Button>
                    </Box>
                </form>
            </Box>
        </Box>
    </Box>
  );
}
