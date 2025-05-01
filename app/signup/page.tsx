"use client"
import { useEffect, useState } from "react";
import { searchAllUsers } from "../../pages/api/user";
import { Box, Text } from "@chakra-ui/react";

type User = {
  id: string;
  name: string;
  password: string;
}

export default function Home() {
  const [users, setUsers] = useState<User[]>();
  const init = async () => {
    const _users = await searchAllUsers();
    setUsers(_users);

  };

  useEffect(() => {
    init();
  },[]);
  
  return (
    <Box>
      {users && <Text fontSize="2xl" color="blue">{users[0].name}</Text>

      }
      
    </Box>
  );
}