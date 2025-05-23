'use client';

import { Text, Box, List } from '@chakra-ui/react';


export default function CreatePlayer() {
  
  return (
    <Box>
        <Text as="b" fontSize="2xl">ゲーム・半荘作成</Text>
        <List.Root as="ol" paddingLeft="5%">
            <List.Item>
                <Text>メニューバーを開き、「プレイヤー追加」をクリック</Text>  
            </List.Item>
            <List.Item>
                <Text>変更後の名前を入力する</Text>  
            </List.Item>
            <List.Item>
                <Text>「完了」ボタンをクリック</Text>  
            </List.Item>
        </List.Root>
    </Box>
  );
}
