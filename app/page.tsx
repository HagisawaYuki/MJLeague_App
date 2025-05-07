"use client"

import { Box, Link, Text } from "@chakra-ui/react";
// import { signOut, useSession } from "next-auth/react";
// import { useEffect } from "react";



export default function Home() {
  
  // const { status } = useSession();

  // useEffect(() => {
  //   if (status === 'authenticated') {
  //     // 既にログインしている場合はセッションをクリア
  //     signOut({ redirect: false });
  //   }
  // }, [status]);
  return (
    <Box display="flex" justifyContent="center">
      <Box width="30%" bg="#EEE" padding="5%" marginTop="5%">
        <Box>
          <Link href="/login"><Text as="b" fontSize="xl">ログイン</Text></Link>
        </Box>
        <Box>
          <Link href="/signup"><Text as="b" fontSize="xl">サインアップ</Text></Link>
        </Box>
      </Box>
    </Box>
  );
}
