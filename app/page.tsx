"use client"
import { useEffect, useState } from "react";
import { searchAllUser } from "./api/user";

type User = {
  id: string;
  name: string;
  password: string;
}

export default function Home() {
  const [users, setUsers] = useState<User[]>();
  const init = async () => {
    const _users = await searchAllUser();
    setUsers(_users);

  };

  useEffect(() => {
    init();
  },[]);
  
  return (
    <div>
      {users && <a>{users[0].name}</a>

      }
      
    </div>
  );
}
