"use client"

import { Box, HStack, NumberInput, RadioGroup, Switch, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";

export default function Home() {
    const [hu, setHu] = useState<number>(20);
    const [isMachi, setIsMachi] = useState(false)
    const [isAtama, setIsAtama] = useState(false)
    const [agari, setAgari] = useState<string>("0");
    const [yaoMentu, setYaoMentu] = useState<number[]>([0,0,0,0]);
    const [chunMentu, setChunMentu] = useState<number[]>([0,0,0,0]);

    const mentuName = ["明刻", "暗刻", "明槓", "暗槓"];

    useEffect(() => {
        let _hu = 20;
        //アガリ方
        _hu += Number(agari);
        //雀頭
        if(isAtama) _hu += 2;
        //待ち形
        if(isMachi) _hu += 2;
        //メンツ
        yaoMentu.forEach((count, idx) => {
            const para = 2 ** (idx + 1);
            _hu += count * para;
        })
        chunMentu.forEach((count, idx) => {
            const para = 2 ** (idx + 1) * 2;
            _hu += count * para;
        })
        setHu(_hu);
    }, [agari, isAtama, isMachi, chunMentu, yaoMentu])
  return (
    
    <Box display="flex" justifyContent="center">
        <Box marginTop="5%" width="100%">
            <Text as="b" fontSize="2xl">符計算</Text>
            <Box marginLeft="2%">
                <Box marginTop="2%">
                    <Text as="b" fontSize="xl">アガリ方</Text>
                    <RadioGroup.Root value={agari} onValueChange={(e) => setAgari(e.value ? e.value : "0")}>
                        <HStack gap="6">
                            <RadioGroup.Item value={"10"}>
                                <RadioGroup.ItemHiddenInput />
                                <RadioGroup.ItemIndicator />
                                <RadioGroup.ItemText>門前ロン</RadioGroup.ItemText>
                            </RadioGroup.Item>
                            <RadioGroup.Item value={"2"}>
                                <RadioGroup.ItemHiddenInput />
                                <RadioGroup.ItemIndicator />
                                <RadioGroup.ItemText>ツモ</RadioGroup.ItemText>
                            </RadioGroup.Item>
                            <RadioGroup.Item value={"0"}>
                                <RadioGroup.ItemHiddenInput />
                                <RadioGroup.ItemIndicator />
                                <RadioGroup.ItemText>ロン</RadioGroup.ItemText>
                            </RadioGroup.Item>
                        </HStack>
                    </RadioGroup.Root>
                </Box>
                <Box marginTop="2%">
                    <Text as="b" fontSize="xl">待ち形</Text>
                    <Box display="flex">
                        <Text>その他</Text>
                        <Switch.Root
                            checked={isMachi}
                            onCheckedChange={(e) => setIsMachi(e.checked)}
                        >
                            <Switch.HiddenInput />
                            <Switch.Control>
                                <Switch.Thumb />
                            </Switch.Control>
                            <Switch.Label />
                        </Switch.Root>
                        <Text>ペンチャン、カンチャン、単騎</Text>
                    </Box>
                </Box>
                <Box marginTop="2%">
                    <Text as="b" fontSize="xl">雀頭</Text>
                    <Box display="flex">
                        <Text>その他</Text>
                        <Switch.Root
                            checked={isAtama}
                            onCheckedChange={(e) => setIsAtama(e.checked)}
                        >
                            <Switch.HiddenInput />
                            <Switch.Control>
                                <Switch.Thumb />
                            </Switch.Control>
                            <Switch.Label />
                        </Switch.Root>
                        <Text>役牌</Text>
                    </Box>
                </Box>
                <Box marginTop="2%">
                    <Text as="b" fontSize="xl">幺九牌(メンツ数)</Text>
                    {yaoMentu.map((count, idx) => (
                        <Box key={idx}>
                            <Text>{mentuName[idx]}</Text>
                            <NumberInput.Root
                                value={JSON.stringify(count)}
                                onValueChange={(e) => {
                                    const newValue = yaoMentu.map((v, j) => idx === j ? Number(e.value) : v);
                                    setYaoMentu(newValue);
                                }}
                            >
                                <NumberInput.Control />
                                <NumberInput.Input />
                            </NumberInput.Root>
                        </Box>
                    ))}
                </Box>
                <Box marginTop="2%">
                    <Text as="b" fontSize="xl">中張牌(メンツ数)</Text>
                    {chunMentu.map((count, idx) => (
                        <Box key={idx}>
                            <Text>{mentuName[idx]}</Text>
                            <NumberInput.Root
                                value={JSON.stringify(count)}
                                onValueChange={(e) => {
                                    const newValue = chunMentu.map((v, j) => idx === j ? Number(e.value) : v);
                                    setChunMentu(newValue);
                                }}
                            >
                                <NumberInput.Control />
                                <NumberInput.Input />
                            </NumberInput.Root>
                        </Box>
                    ))}
                </Box>
            </Box>
            <Box bg="#EEE" width="40%" marginTop="2%" display="flex" justifyContent="flex-end" >
                <Text fontSize="xl" as="b" marginRight="5%">{hu}符</Text>
                <Text fontSize="xl" as="b" marginRight="5%">→</Text>
                <Text fontSize="xl" as="b" marginRight="5%">{Math.ceil(hu / 10) * 10}符</Text>
            </Box>
        </Box>
    </Box>
  );
}