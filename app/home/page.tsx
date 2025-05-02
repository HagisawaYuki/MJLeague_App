"use client"

import { Box, Text } from "@chakra-ui/react";
import { useSession } from "next-auth/react";



export default function Home() {
  
  const { data: session, status } = useSession();

  if (status === 'loading') return <Text>Loading...</Text>;
  if (!session) return <Text>ログインしていません</Text>;
  
  return (
    <Box>
      
    </Box>
  );
}