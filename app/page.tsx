"use client"

import { Box, Link } from "@chakra-ui/react";



export default function Home() {
  
  
  return (
    <Box>
      <Box>
        <Box>
          <Link href="/login">ログイン</Link>
        </Box>
        <Box>
          <Link href="/signup">サインアップ</Link>
        </Box>
      </Box>
    </Box>
  );
}
