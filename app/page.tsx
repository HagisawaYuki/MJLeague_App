"use client"

import { Box, Link } from "@chakra-ui/react";
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
