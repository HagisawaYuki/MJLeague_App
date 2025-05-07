"use client"
import { Box, Button, Input, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { editHanshuangScore } from "../../../api/hanshuang_score";

export default function Home() {
    const router = useRouter();
    const [scoreID, setScoreID] = useState<number>(0);
    const [score, setScore] = useState<number>();
    const [chip, setChip] = useState<number>();
    

    const {
        register,
        // formState: { errors },
    } = useForm<{scoreID: number, score: number, chip: number, playerID: number, hanshuangID: number}>();
    
    useEffect(() => {
        const editGameScoreInit = async () => {
            //localStorageから試合するプレイヤーのidを取り出す
            const _score =  Number(localStorage.getItem("score"));
            const _chip =  Number(localStorage.getItem("chip"));
            setScore(_score);
            setChip(_chip);
            const _scoreID =  Number(localStorage.getItem("scoreID"));
            setScoreID(_scoreID);
            
        }
        editGameScoreInit();
    }, [router]);
    return (
        <Box display="flex" justifyContent="center">
            <Box width="60%" bg="#EEE" padding="5%" marginTop="5%">
                <Box>
                    <Text fontSize="xl" as="b">スコアを変更</Text>
                </Box>
                <Box display="flex" marginLeft="3%">
                    <Text>(変更前のスコア・・・ </Text>
                    <Text>score: {score}</Text>
                    <Text>chip: {chip})</Text>
                </Box>
                <Box marginTop="5%">
                    <form action={editHanshuangScore}>
                        <Input type="hidden" {...register('scoreID')} value={scoreID}></Input>
                        
                        <Box >
                            <Text as="b">変更後のスコアを入力</Text>
                            <Input type="number" bg="white" {...register('score')} placeholder=""></Input>
                        </Box>
                        <Box marginTop="5%">
                            <Text as="b">変更後のチップ数を入力</Text>
                            <Input type="number" bg="white" {...register('chip')} placeholder=""></Input>
                        </Box>
                        <Box marginTop="5%">
                            <Button type="submit" colorPalette="red" variant="subtle">
                                <Text>スコアを変更</Text>
                            </Button>
                        </Box>
                    </form>
                </Box>
            </Box>
        </Box>
    );
}
