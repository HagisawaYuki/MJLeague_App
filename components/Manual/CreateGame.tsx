'use client';

import { Text, Box, List } from '@chakra-ui/react';


export default function CreateGame() {
  
  return (
    <Box>
        <Text as="b" fontSize="2xl">ゲーム・半荘作成</Text>
        <List.Root as="ol" paddingLeft="5%">
            <List.Item>
                <Text>メニューバーを開き、「ゲーム作成」をクリック</Text>  
            </List.Item>
            <List.Item>
                <Text>メンバーを4人選択し、「メンバー確定」ボタンをクリック</Text>  
            </List.Item>
            <List.Item>
                <Text>日付を選択し、「完了」ボタンをクリック</Text>  
            </List.Item>
            <List.Item>
                <Text>作成されたゲームをクリック</Text>  
            </List.Item>
            <List.Item>
                <Text>「半荘を追加」ボタンをクリック</Text>  
            </List.Item>
            <List.Item>
                <Text>半荘の成績を入力</Text>  
                <List.Root ps="5">
                    <List.Item>
                        <Text>精算後の場合</Text>
                        <List.Root as="ol" ps="5">
                            <List.Item>
                                <Text>名前ごとに精算後のスコアを入力</Text>
                            </List.Item>
                            <List.Item>
                                <Text>チップは最後の半荘のみ手持ちの枚数を入力。それ以外は0を入力。</Text>
                            </List.Item>
                            <List.Item>
                                <Text>「完了」ボタンをクリック</Text>
                            </List.Item>
                        </List.Root>
                    </List.Item>
                    <List.Item>
                        <Text>精算前の場合</Text>
                        <List.Root as="ol" ps="5">
                        <List.Item>
                                <Text>名前ごとに実際のスコアを入力</Text>
                                <Text>マイナスの場合、「▽」をクリックしたら「-」記号が出てくる</Text>
                                <Text>合計が100000点になってなかったらエラー</Text>
                            </List.Item>
                            <List.Item>
                                <Text>チップは最後の半荘のみ手持ちの枚数を入力。それ以外は0を入力。</Text>
                            </List.Item>
                            <List.Item>
                                <Text>「完了」ボタンをクリック</Text>
                            </List.Item>
                        </List.Root>
                    </List.Item>
                </List.Root>
            </List.Item>
            <List.Item>
                <Text>それ以降は上の5と6の操作を繰り返す</Text>  
            </List.Item>
        </List.Root>
    </Box>
  );
}
