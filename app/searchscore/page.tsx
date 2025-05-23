"use client"

import { Box, NumberInput, Switch, Text } from "@chakra-ui/react";
import { mj_scores } from "../../constant/mjConst";
import { useEffect, useState } from "react";

export default function Home() {
    const [han, setHan] = useState<number>(1);
    const [hu, setHu] = useState<number>(20);
    const [honba, setHonba] = useState<number>(0);
    const [score, setScore] = useState<string>("");
    const [isParent, setIsParent] = useState(true)
    const [isRon, setIsRon] = useState(true)

    useEffect(() => {
        if(isParent){
            mj_scores.parent.forEach((parent) => {
                if(parent.han === han){
                    parent.scores.forEach((hu_score) => {
                        if(hu_score.hu === hu){
                            if(isRon){
                                setScore(JSON.stringify(hu_score.score.ron + honba*300))
                            }else{
                                setScore(JSON.stringify(hu_score.score.tumo + honba*100)+"all")
                            }
                        }
                    })
                }else if(han >= 5){
                    let _score: number = 0;
                    if(han === 5){
                        if(isRon){
                            _score = 12000;
                        }else{
                            _score = 4000;
                        }
                    }else if(han === 6 || han === 7){
                        if(isRon){
                            _score = 18000;
                        }else{
                            _score = 6000;
                        }
                    }else if(han === 8 || han === 9 || han === 10){
                        if(isRon){
                            _score = 24000;
                        }else{
                            _score = 8000;
                        }
                    }else if(han === 11 || han === 12){
                        if(isRon){
                            _score = 36000;
                        }else{
                            _score = 12000;
                        }
                    }else if(han >= 13){
                        if(isRon){
                            _score = 48000;
                        }else{
                            _score = 16000;
                        }
                    }
                    if(isRon){
                        setScore(JSON.stringify(_score + honba*300))
                    }else{
                        setScore(JSON.stringify(_score + honba*100)+"all")
                    }
                }
            })
        }else{
            mj_scores.child.forEach((child) => {
                if(child.han === han){
                    child.scores.forEach((hu_score) => {
                        if(hu_score.hu === hu){
                            if(isRon){
                                setScore(JSON.stringify(hu_score.score.ron + honba*300))
                            }else{
                                setScore(JSON.stringify(hu_score.score.tumo.child + honba*100)+"-"+JSON.stringify(hu_score.score.tumo.parent + honba*100))
                            }
                        }
                    })
                }else if(han >= 5){
                    let _score: number = 0;
                    if(han === 5){
                        if(isRon){
                            _score = 8000;
                        }else{
                            _score = 2000;
                        }
                    }else if(han === 6 || han === 7){
                        if(isRon){
                            _score = 12000;
                        }else{
                            _score = 3000;
                        }
                    }else if(han === 8 || han === 9 || han === 10){
                        if(isRon){
                            _score = 16000;
                        }else{
                            _score = 4000;
                        }
                    }else if(han === 11 || han === 12){
                        if(isRon){
                            _score = 24000;
                        }else{
                            _score = 6000;
                        }
                    }else if(han >= 13){
                        if(isRon){
                            _score = 32000;
                        }else{
                            _score = 8000;
                        }
                    }
                    if(isRon){
                        setScore(JSON.stringify(_score + honba*300))
                    }else{
                        setScore(JSON.stringify(_score + honba*100)+"-"+JSON.stringify(_score * 2 + honba*100))
                    }
                }
            })
        }

    }, [han, hu, honba, isParent, isRon])
  return (
    <Box display="flex" justifyContent="center">
        <Box marginTop="5%" width="100%">
            <Text as="b" fontSize="2xl">スコアを検索</Text>
            <Box>
                <Box display="flex">
                    <Text>子</Text>
                    <Switch.Root
                        checked={isParent}
                        onCheckedChange={(e) => setIsParent(e.checked)}
                    >
                        <Switch.HiddenInput />
                        <Switch.Control>
                            <Switch.Thumb />
                        </Switch.Control>
                        <Switch.Label />
                    </Switch.Root>
                    <Text>親</Text>
                </Box>
                <Box display="flex">
                    <Text>ツモ</Text>
                    <Switch.Root
                        checked={isRon}
                        onCheckedChange={(e) => setIsRon(e.checked)}
                    >
                        <Switch.HiddenInput />
                        <Switch.Control>
                            <Switch.Thumb />
                        </Switch.Control>
                        <Switch.Label />
                    </Switch.Root>
                    <Text>ロン</Text>
                </Box>
                <Text>飜数</Text>
                <NumberInput.Root
                    value={JSON.stringify(han)}
                    onValueChange={(e) => {
                        const newHan = Number(e.value);
                        setHan(newHan);
                    }}
                >
                <NumberInput.Control />
                <NumberInput.Input />
                </NumberInput.Root>
                <Text>符数</Text>
                <NumberInput.Root
                    value={JSON.stringify(hu)}
                    onValueChange={(e) => {
                        const newHu = Number(e.value);
                        setHu(newHu);
                    }}
                >
                <NumberInput.Control />
                <NumberInput.Input />
                </NumberInput.Root>
                <Text>本場数</Text>
                <NumberInput.Root
                    value={JSON.stringify(honba)}
                    onValueChange={(e) => {
                        const newHonba = Number(e.value);
                        setHonba(newHonba);
                    }}
                >
                <NumberInput.Control />
                <NumberInput.Input />
                </NumberInput.Root>
            </Box>
            <Box bg="#EEE" width={!isRon && !isParent ? "40%" : "20%"} marginTop="2%" display="flex" justifyContent="flex-end" >
                <Text fontSize="xl" as="b" marginRight="5%">{score}</Text>
            </Box>
        </Box>
    </Box>
  );
}