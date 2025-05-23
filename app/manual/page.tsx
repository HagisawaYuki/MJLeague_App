"use client"

import { Box, Link, List, Text } from "@chakra-ui/react";
import { RiArrowRightLine } from "react-icons/ri";

export default function Home() {
  return (
    <Box display="flex" justifyContent="center">
      <Box width="30%" bg="#EEE" padding="5%" marginTop="5%">
        <List.Root>
            <List.Item>
                <Text>作成系</Text>
                <List.Root ps="5">
                    <List.Item>
                        <Link href="/manual/details?name=create_game">
                            <Text display="flex">ゲーム・半荘作成<RiArrowRightLine /></Text>
                        </Link>
                    </List.Item>
                    <List.Item>
                        <Link href="/manual/details?name=create_player">
                            <Text display="flex">プレイヤー追加<RiArrowRightLine /></Text>
                        </Link>
                    </List.Item>
                </List.Root>
            </List.Item>
            {/* <List.Item>
                <Text>データ閲覧系</Text>
                <List.Root ps="5">
                    <List.Item>
                        <Link>
                            <Text display="flex">半荘戦績<RiArrowRightLine /></Text>
                        </Link>
                    </List.Item>
                    <List.Item>
                        <Link>
                            <Text display="flex">個人戦績<RiArrowRightLine /></Text>
                        </Link>
                    </List.Item>
                </List.Root>
            </List.Item>
            <List.Item>
                <Text>編集系</Text>
                <List.Root ps="5">
                    <List.Item>
                        <Link>
                            <Text display="flex">スコア編集<RiArrowRightLine /></Text>
                        </Link>
                    </List.Item>
                    <List.Item>
                        <Link>
                            <Text display="flex">プレイヤー名変更<RiArrowRightLine /></Text>
                        </Link>
                    </List.Item>
                </List.Root>
            </List.Item>
            <List.Item>
                <Text>その他</Text>
                <List.Root ps="5">
                    <List.Item>
                        <Link>
                            <Text display="flex">精算計算<RiArrowRightLine /></Text>
                        </Link>
                        
                    </List.Item>
                    <List.Item>
                        <Link>
                            <Text display="flex">スコア計算<RiArrowRightLine /></Text>
                        </Link>
                    </List.Item>
                </List.Root>
            </List.Item> */}
        </List.Root>
      </Box>
    </Box>
  );
}
