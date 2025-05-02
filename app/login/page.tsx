"use client"

import { Box, Button, Input, Text } from "@chakra-ui/react";
import { useState } from "react";
import { signIn } from 'next-auth/react';
import { useRouter } from "next/navigation";

export default function Home() {
    const [name, setName] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const router = useRouter();
    // const {
    //     register,
    //     handleSubmit
    //     // formState: { errors },
    // } = useForm<{name: string, password: string}>();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
    
        const res = await signIn('credentials', {
          redirect: false,
          username: name,
          password,
        });

        if (!res?.ok) {
            alert('ログイン失敗');
          } else {
            router.push('/home');
          }
      };
  
  return (
    <Box display="flex" justifyContent='center'>
        <Box bg="#EEE" w="40%" marginTop="5%" padding="5%" paddingTop="3%" paddingBottom="5%">
            <Box>
                <Text as="b" fontSize="2xl">ログイン</Text>
            </Box>
            <Box>
                <form onSubmit={handleSubmit}>
                    <Text as="b" fontSize="xl">ユーザ名</Text>
                    <Input 
                        type="text" 
                        bg="white" 
                        placeholder="Email"
                        value={name}
                        onChange={(e) => {
                            setName(e.target.value);
                        }}>
                    </Input>
                    <Text as="b" fontSize="xl">パスワード</Text>
                    <Input 
                        type="password"
                        bg="white" 
                        placeholder="Password"
                        value={password}
                        onChange={(e) => {
                            setPassword(e.target.value);
                        }}>
                    </Input>
                    <Box marginTop="3%">
                        <Button type="submit" colorPalette="orange" variant="subtle">
                            ログイン
                        </Button>
                    </Box>
                </form>
            </Box>
        </Box>
    </Box>
  );
}