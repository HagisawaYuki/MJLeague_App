"use client"

import { Box, Table, Text } from "@chakra-ui/react";
import { hus, mj_scores } from "../../constant/mjConst";





export default function Home() {
    
  return (
    <Box display="flex" justifyContent="center">
        <Box marginTop="5%">
        {/* <Box bg="#EEE" padding="5%" marginTop="5%"> */}
            <Table.Root size="sm" variant="outline" showColumnBorder>
                <Table.Header>
                    <Table.Row>
                        <Table.ColumnHeader>
                            <Text>親</Text>
                        </Table.ColumnHeader>
                        {hus.map((hu) => (
                            <Table.ColumnHeader key={hu}>{hu}</Table.ColumnHeader>
                        ))}
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {mj_scores.parent.map((hanSores) => (
                        <Table.Row key={hanSores.han}>
                            <Table.Cell key={hanSores.han} bg="#EEE">{hanSores.han}</Table.Cell>
                            {hanSores.scores.map((score) => (
                                <Table.Cell key={score.hu}>
                                    <Box>
                                        <Text>{score.score.ron === 0 ? "-" : score.score.ron}</Text>
                                        <Text>{score.score.tumo === 0 ? "-" : score.score.tumo+"ALL"}</Text>                    
                                    </Box>
                                </Table.Cell>
                            ))}
                        </Table.Row>
                    ))}
                </Table.Body>
            </Table.Root>
            <Table.Root size="sm" variant="outline" showColumnBorder>
                <Table.Header>
                    <Table.Row>
                        <Table.ColumnHeader>
                            <Text>子</Text>
                        </Table.ColumnHeader>
                        {hus.map((hu) => (
                            <Table.ColumnHeader key={hu}>{hu}</Table.ColumnHeader>
                        ))}
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {mj_scores.child.map((hanSores) => (
                        <Table.Row key={hanSores.han}>
                            <Table.Cell key={hanSores.han} bg="#EEE">{hanSores.han}</Table.Cell>
                            {hanSores.scores.map((score) => (
                                <Table.Cell key={score.hu}>
                                    <Box>
                                        <Text>{score.score.ron === 0 ? "-" : score.score.ron}</Text>
                                        <Text>{score.score.tumo.child === 0 ? "-" : score.score.tumo.child + "-" + score.score.tumo.parent}</Text>                    
                                    </Box>
                                </Table.Cell>
                            ))}
                        </Table.Row>
                    ))}
                </Table.Body>
            </Table.Root>
        </Box>
    </Box>
  );
}