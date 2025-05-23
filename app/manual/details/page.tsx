"use client"

import { Box } from "@chakra-ui/react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Manual from "../../../components/Manual/Manual";

export default function Home() {
    const searchParams = useSearchParams();
    const [name, setName] = useState<string>("");
    useEffect(() => {
        const _name = searchParams ? searchParams.get('name') : "";
        setName(_name ? _name : "")
    }, [searchParams])
  return (
    <Box display="flex" justifyContent="center">
      <Box width="80%" bg="#EEE" padding="3%" marginTop="5%">
        <Manual name={name}></Manual>
      </Box>
    </Box>
  );
}
