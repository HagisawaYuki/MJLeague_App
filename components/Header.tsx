'use client';

import { useSession, signOut } from 'next-auth/react';
import { Button, Flex, Text } from '@chakra-ui/react';
import Link from 'next/link';

export default function Header() {
  const { data: session, status } = useSession();

  return (
    <Flex justify="space-between" align="center" p={4} bg="gray.100">
        <Link href="/home">
            <Text fontSize="xl" fontWeight="bold">
                Home
            </Text>
        </Link>
      

      {status === 'loading' ? (
        <Text>Loading...</Text>
      ) : session ? (
        // ✅ ログイン後のヘッダー
        <Flex align="center" gap={4}>
          <Text>ユーザ：{session.user?.name}</Text>
          <Button onClick={() => signOut()}>ログアウト</Button>
        </Flex>
      ) : (
        // ✅ ログイン前のヘッダー
        <Flex gap={4}>
          <Link href="/login">
            <Button>ログイン</Button>
          </Link>
          <Link href="/signup">
            <Button>新規登録</Button>
          </Link>
        </Flex>
      )}
    </Flex>
  );
}
