'use client';

import { useSession, signOut } from 'next-auth/react';
import { Button, Flex, Menu, Portal, Text, Link } from '@chakra-ui/react';
import { useRouter } from 'next/navigation';


export default function Header() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const menus = [
    {text: "プレイヤー追加", href: "/create/player"},
    {text: "ゲーム作成", href: "/create/game"},
    {text: "点数表", href: "/mjscore"},
    {text: "スコア計算", href: "/calscore"},
    {text: "符計算", href: "/calhu"},
    {text: "スコア検索", href: "/searchscore"},
    {text: "マニュアル", href: "/manual"},
  ]

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
          <Menu.Root>
            <Menu.Trigger asChild>
              <Button variant="outline" size="sm">
                メニュー
              </Button>
            </Menu.Trigger>
            <Portal>
              <Menu.Positioner>
                <Menu.Content>
                  {menus.map((menu, idx) => {
                    return(
                      <Menu.Item key={idx} value={menu.href} bg="white">
                        <Link href={menu.href}>
                          {menu.text}
                        </Link>
                      </Menu.Item>
                    )
                  })}
                  <Menu.Item value="signout">
                    <Button variant="outline" onClick={() => {
                      router.push("/");
                      signOut();
                      
                    }}>ログアウト</Button>
                  </Menu.Item>
                </Menu.Content>
              </Menu.Positioner>
            </Portal>
          </Menu.Root>
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
