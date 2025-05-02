"use client"
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Box, Button, Input, Text } from "@chakra-ui/react";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log("name",name)
    console.log("password",password)
    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, password }),
    });

    console.log(res.ok)
    if (res.ok) {
      alert("登録成功！ログインしてください");
      router.push("/login");
    } else {
      const data = await res.json();
      console.log("RRRRR")
      console.log("data", data)
      alert(`エラー: ${data.message}`);
    }
  };

  return (
    <Box display="flex" justifyContent='center'>
      <Box bg="#EEE" w="40%" mt="5%" p="5%">
        <Text fontSize="2xl" mb={4}>新規登録</Text>
        <form onSubmit={handleSignup}>
          <Text>ユーザー名</Text>
          <Input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <Text mt={4}>パスワード</Text>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Button mt={6} colorScheme="blue" type="submit">登録</Button>
        </form>
      </Box>
    </Box>
  );
}