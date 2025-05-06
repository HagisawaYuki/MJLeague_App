"use client"
import { Box, Button, Input, Text } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { createPlayer } from "../../api/player";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { searchUserIDByName } from "../../api/user";

export default function Create() {

    const router = useRouter();
    const { data: session, status } = useSession();
    const [userID, setUserID] = useState<string>("");

    const {
        register,
        // formState: { errors },
    } = useForm<{userId: number, name: string}>();

    useEffect(() => {
        const initUserID = async () => {
            if(session && session.user && session.user.name){
                const _userID = await searchUserIDByName(session.user.name);
                setUserID(_userID)
            }
        }
        initUserID();
    }, [router, session]);

    if (status === 'loading') return <Text>Loading...</Text>;
    if (!session) return <Text>ログインしていません</Text>;

    return(
        <Box display="flex" justifyContent="center">
            <Box display="flex" justifyContent="center" width="60%" bg="#EEE" padding="5%" marginTop="5%">
                <form action={createPlayer}>    
                    <Input type="hidden"  {...register('userId')} name="userId" value={userID}></Input>
                    <Text fontSize="xl" as="b">追加するプレイヤーの名前を入力してください</Text>
                    <Input
                        width="100%"
                        bg="white"
                        marginTop="2%"
                        autoFocus
                        placeholder="名前"
                        {...register('name')}
                        type="text"
                    ></Input>
                    <Box marginTop="5%">
                        <Button type="submit"  colorPalette="orange" variant="subtle">
                            追加
                        </Button>
                    </Box>
                </form>
            </Box>
        </Box>
    )
}