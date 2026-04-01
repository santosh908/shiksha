import React, { useEffect } from 'react'
import type { ShikshaLavel } from './ShikshaLavel.Type';
import { Blockquote, Card, Grid, Table,Text, Title,Image, Box } from '@mantine/core';
import Certificate from '@/Components/molecules/Certificate/Certificate';

interface LavelComponentProps {
    ShikshaLavel: ShikshaLavel[];
    totalObtain: number;
}
const LavelComponent: React.FC<LavelComponentProps> = ({ ShikshaLavel,totalObtain  }) => {

    const getMissingLevels = () => {
        const existingLevels = ShikshaLavel.map(level => level.shiksha_level);
        const missingLevels = [];

        if (ShikshaLavel.some(level => level.shiksha_level === 6 || level.shiksha_level === 7)) {
            if (!existingLevels.includes(6)) missingLevels.push(6);
            if (!existingLevels.includes(7)) missingLevels.push(7);
        }

        if (ShikshaLavel.some(level => level.shiksha_level === 8 || level.shiksha_level === 9)) {
            if (!existingLevels.includes(8)) missingLevels.push(8);
            if (!existingLevels.includes(9)) missingLevels.push(9);
        }

        return missingLevels;
    };

    const getLevelName = (level: number) => {
        switch (level) {
            case 6:
            case 7:
                return 'Gurupada Ashray';
            case 8:
            case 9:
                return 'Post Gurupada Ashray';
            default:
                return '';
        }
    };

    const renderTableRows = () => {
        const missingLevels = getMissingLevels();
        //@ts-ignore
        const allRows = [];

        // Add existing levels
        ShikshaLavel.forEach(level => {
            allRows.push(
                <Table.Tr key={level.shiksha_level}>
                    <Table.Td>{level.exam_level}</Table.Td>
                    <Table.Td>{level.total_marks}</Table.Td>
                    <Table.Td>{level.total_obtain}</Table.Td>
                </Table.Tr>
            );
        });

        // Add missing levels
        missingLevels.forEach(level => {
            allRows.push(
                <Table.Tr key={`missing-${level}`}>
                    <Table.Td color='red'>{getLevelName(level)}</Table.Td>
                    <Table.Td></Table.Td>
                    <Table.Td>
                        <Text color="red" size="sm">Not Attended</Text>
                    </Table.Td>
                </Table.Tr>
            );
        });
        //@ts-ignore
        return allRows;
    };


    return (
        <Grid>
            <Grid.Col span={12} py={25} mt={20}>
                <Box>
                    <Title order={5} c="dimmed" ta="center" fz="lg">
                        ISKCON Temple Dwarka Delhi
                    </Title>
                    <Box ta="center" py={25}>
                        <Image
                        src="/award-512x512.png"
                        style={{
                            width: '5%',
                            borderRadius: '50%', 
                            border: '3px solid #e47500',
                        }}
                        mx="auto" 
                        display="block"
                        alt="Award Icon"
                        />
                    </Box>
                    <Title order={5} c="dimmed" ta="center" fz="lg">
                        {ShikshaLavel[0].exam_level}
                    </Title>
                </Box>
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 12, lg: 6 }}>
                <Card padding={0}>
                    <Table>
                        <Table.Thead>
                            <Table.Tr>
                                <Table.Th colSpan={3} style={{background:"#a0631f",color:"#fff"}} align='center'>Final Result</Table.Th>
                            </Table.Tr>
                            <Table.Tr>
                                <Table.Th>Exam Name</Table.Th>
                                <Table.Th>Total Marks</Table.Th>
                                <Table.Th>Marks Obtained</Table.Th>
                            </Table.Tr>
                        </Table.Thead>
                        <Table.Tbody>
                            {renderTableRows()}
                            {totalObtain !== 0 ? (
                                <>
                                    <Table.Tr>
                                        <Table.Td><b>Grand Total</b></Table.Td>
                                        <Table.Td></Table.Td>
                                        <Table.Td><b>{totalObtain}</b></Table.Td>
                                    </Table.Tr>
                                    <Table.Tr>
                                        <Table.Td><b>Result </b></Table.Td>
                                        <Table.Td></Table.Td>
                                        <Table.Td>
                                            <Text color={ShikshaLavel[1].is_qualified=="1" ? 'green' : 'red'}>
                                                {ShikshaLavel[1].is_qualified=="1" ? 'Qualified' : 'Disqualified'}
                                            </Text>
                                        </Table.Td>
                                    </Table.Tr>
                                </>
                            ) : (
                                <>
                                    <Table.Tr>
                                        <Table.Td><b>Result</b></Table.Td>
                                        <Table.Td></Table.Td>
                                        <Table.Td>
                                            <Text color={ShikshaLavel[0].is_qualified=="1" ? 'green' : 'red'}>
                                                {ShikshaLavel[0].is_qualified=="1" ? 'Qualified' : 'Disqualified'}
                                            </Text>
                                        </Table.Td>
                                    </Table.Tr>
                                    <Table.Tr>
                                        <Table.Td colSpan={3}>&nbsp;</Table.Td>
                                    </Table.Tr>
                                </>
                            )}
                        </Table.Tbody>
                    </Table>
                </Card>
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 12, lg: 6 }}>
                <Card p={0}>
                    <Table>
                        <Table.Tbody>
                            <Table.Tr>
                                <Table.Th colSpan={3} style={{background:"#a0631f",color:"#fff"}} align='center'>Devotee Details</Table.Th>
                            </Table.Tr>
                            <Table.Tr>
                                <Table.Th style={{width:"30%"}}>User ID</Table.Th>
                                <Table.Td>{ShikshaLavel[0].login_id}</Table.Td>
                            </Table.Tr>
                            <Table.Tr>
                                <Table.Th>Leader Name</Table.Th>
                                <Table.Td>
                                    {
                                    ShikshaLavel[0].bhakti_bhekshuk_name == null ? 
                                    ShikshaLavel[0].ashery_leader_name : 
                                    ShikshaLavel[0].bhakti_bhekshuk_name
                                    }
                                </Table.Td>
                                </Table.Tr>
                            <Table.Tr>
                                <Table.Th>Exam Date</Table.Th>
                                <Table.Td>{ShikshaLavel[0].ExamDate}</Table.Td>
                            </Table.Tr>
                            <Table.Tr>
                                <Table.Th>Exam Session</Table.Th>
                                <Table.Td>{ShikshaLavel[0].SessionName} ( {ShikshaLavel[0].ShikshaLevel} )</Table.Td>
                            </Table.Tr>
                        </Table.Tbody>
                    </Table>
                </Card>
            </Grid.Col>
            {ShikshaLavel[0].certificate_issued === "1" ? (
                <Grid.Col span={{ base: 12, md: 12, lg: 12 }}>
                    <Card p={0}>
                        <Title order={4} style={{background:"#a0631f",color:"#fff",textAlign:"center",padding:"5px"}}>
                            CERTIFICATE
                        </Title>
                        <Certificate certificateNo={ShikshaLavel[0].certificate_number} name={ShikshaLavel[0].name} shiksha_level={ShikshaLavel[0].shiksha_level}/>
                    </Card>
                </Grid.Col>
            ) : (
                <></>
            )}
        </Grid>
    );
}
export default LavelComponent