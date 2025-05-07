"use client"
import { Box, Button, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const [playerName, setPlayerName] = useState<string>();
  useEffect(() => {
    const init = () => {
      const _userID = Number(localStorage.getItem("userID"));
      if(_userID === 0){
        router.push("/")
      }
      const localPlayerName = localStorage.getItem("editPlayerName")
      if(localPlayerName) setPlayerName(JSON.parse(localPlayerName));
    }
    init();
  },[router]);
  return (
    <Box>
        <Box>
            <Text fontSize="2xl" as="b">{playerName}のデータ</Text>
            <Button colorPalette="orange" variant="subtle" onClick={() => {
              router.push("/edit/player")
            }}>
              <Text>名前を変更する</Text>
            </Button>
        </Box>
        
    </Box>
  );
}
