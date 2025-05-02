"use client"

import { Box } from "@chakra-ui/react";
import { useSession } from "next-auth/react";



export default function Home() {
  
  const { data: session, status } = useSession();

  if (status === 'loading') return <p>Loading...</p>;
  if (!session) return <p>ログインしていません</p>;
  
  
  return (
    <Box>
      
      
    </Box>
  );
}