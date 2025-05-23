'use client';

import { Box } from '@chakra-ui/react';
import CreateGame from './CreateGame';
import CreatePlayer from './CreatePlayer';

type ManualProps = {
    name: string;
};

const Manual = ({name}: ManualProps) => {
  
  return (
    <Box>
        {name === "create_game" && <CreateGame></CreateGame>}
        {name === "create_player" && <CreatePlayer></CreatePlayer>}
    </Box>
  );
}

export default Manual;