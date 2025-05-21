"use client"
import { Box, NumberInput, Table, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";

export default function Create() {
    const [scores, setScores] = useState<string[]>(["0","0","0","0"]);
    const [chips, setChips] = useState<string[]>(["0","0","0","0"]);
    const [points, setPoints] = useState<number[]>([0,0,0,0]);

    

    const checkScores = (): boolean => {
        let sumScores = 0;
        for(const _score of scores){
            const score = Number(_score);
            sumScores += score;
        }
        return sumScores === 100000;
    }

    

    //ウマオカ、レートを計算
    useEffect(() => {
        //五捨六入する関数
        // const roundToFiveSix = (value: number): number => {
        //     const integer = Math.floor(value);
        //     const decimal = value - integer;
          
        //     const tenth = Math.floor(decimal * 10);
          
        //     if (tenth <= 5) {
        //       return Math.floor(value);
        //     } else {
        //       return Math.ceil(value);
        //     }
        // }
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

        // const afterUmaOkaScores = sortedScores.map((score, i) => roundToFiveSix((score + uma[i] + oka[i] - 30000) / 1000) * rate);
        const afterUmaOkaScores = sortedScores.map((score, i) => (score + uma[i] + oka[i] - 30000) / 1000 * rate);

        const originalOrderScores: number[] = [];

        sortedIndices.forEach((originalIndex, sortedIndex) => {
            originalOrderScores[originalIndex] = afterUmaOkaScores[sortedIndex];
        });
        setPoints(originalOrderScores);
        // registerName.scores.forEach((regname, idx) => setValue(regname, originalOrderScores[idx]));
        // registerName.chips.forEach((regname, idx) => setValue(regname, Number(chips[idx])));
        
    }, [scores, chips]);
    
    return(
        <Box display="flex" justifyContent="center">
            <Box width="70%" bg="#EEE" marginTop="5%" padding="5%">
                <Box>
                    <Text fontSize="3xl">スコア計算</Text>
                </Box>
                    <Table.Root size="sm">
                        <Table.Header>
                            <Table.Row>
                                <Table.ColumnHeader></Table.ColumnHeader>
                                <Table.ColumnHeader>player1</Table.ColumnHeader>
                                <Table.ColumnHeader>player2</Table.ColumnHeader>
                                <Table.ColumnHeader>player3</Table.ColumnHeader>
                                <Table.ColumnHeader>player4</Table.ColumnHeader>
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
                    {checkScores() === false && <Text color="red">点数が正しくないです</Text>}
            </Box>
        </Box>
    )
}