import React, { useEffect } from 'react'
import type { ShikshaLavel } from './ShikshaLavel.Type';
import { Blockquote, Card, Grid, Table,Text, Title,Image, Box } from '@mantine/core';
import { groupBy } from 'lodash';
import { IconCheck } from '@tabler/icons-react';
import Certificate from '@/Components/molecules/Certificate/Certificate';

interface Lavel1ComponentProps {
    ShikshaLavel: ShikshaLavel;
}

const Lavel1Component: React.FC<Lavel1ComponentProps> = ({ ShikshaLavel }) => {
    return (
        <Grid>
            <Grid.Col span={12} py={25} mt={20}>
                <Box>
                    <Title order={5} c="dimmed" ta="center" fz="lg">
                        ISKCON Temple Dwarka Delhi
                    </Title>
                    <Box ta="center">
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
                        {ShikshaLavel.name}
                    </Title>
                </Box>
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 12, lg: 6 }}>
                <Card padding={0}>
                    <Table>
                        <Table.Tbody>
                            <Table.Tr>
                                <Table.Th colSpan={3} style={{background:"#a0631f",color:"#fff"}} align='center'>Intrective Exam</Table.Th>
                            </Table.Tr>
                            <Table.Tr>
                                <Table.Td>Total Marks</Table.Td>
                                <Table.Th></Table.Th>
                                <Table.Td>Marks Obtained</Table.Td>
                            </Table.Tr>
                            <Table.Tr>
                                <Table.Td>{ShikshaLavel.total_questions}</Table.Td>
                                <Table.Td></Table.Td>
                                <Table.Td>
                                   
                            </Table.Td>
                            </Table.Tr>
                            <Table.Tr>
                                <Table.Th style={{background:"#a0631f",color:"#fff"}} align='center' colSpan={3}>Writen Exam</Table.Th>
                            </Table.Tr>
                            <Table.Tr>
                                <Table.Td>Total Question</Table.Td>
                                <Table.Td>Total Marks</Table.Td>
                                <Table.Td>Marks Obtained</Table.Td>
                            </Table.Tr>
                            <Table.Tr>
                                <Table.Td>{ShikshaLavel.total_questions}</Table.Td>
                                <Table.Td>{ShikshaLavel.total_marks}</Table.Td>
                                <Table.Td>
                                </Table.Td>
                            </Table.Tr>
                            <Table.Tr style={{background: "#fbf6f6"}}>
                                <Table.Td colSpan={2}  align='left'><b>Grand Total</b></Table.Td>
                                <Table.Td>
                                
                                </Table.Td>
                            </Table.Tr>
                        </Table.Tbody>
                    </Table>
                </Card>
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 12, lg: 6 }}>
                <Card p={0}>
                    <Table>
                        <Table.Tbody>
                            <Table.Tr>
                                <Table.Th colSpan={3} style={{background:"#a0631f",color:"#fff"}} align='center'>Result</Table.Th>
                            </Table.Tr>
                            <Table.Tr>
                                <Table.Th style={{width:"30%"}}>User ID</Table.Th>
                                <Table.Td>{ShikshaLavel.login_id}</Table.Td>
                            </Table.Tr>
                            <Table.Tr>
                                <Table.Th>Ashray Leader</Table.Th>
                                <Table.Td>{ShikshaLavel.ashery_leader_name}</Table.Td>
                            </Table.Tr>
                            <Table.Tr>
                                <Table.Th>Qualified</Table.Th>
                                <Table.Td style={{display: "flex"}}>
                                    {
                                        ShikshaLavel.is_promoted_by_ashray_leader === "Y" ? (
                                            <span>Promoted</span>
                                        ) : ShikshaLavel.is_qualified === "Y" ? (
                                            <>
                                            <IconCheck fontWeight="bold" color="green" size={20} /> <span>Qualified</span>
                                            </>
                                        ) : (
                                            <span>Not Qualified</span>
                                        )
                                    }
                                </Table.Td>
                            </Table.Tr>
                            <Table.Tr>
                                <Table.Th>Exam Date</Table.Th>
                                <Table.Td>{ShikshaLavel.exam_date}</Table.Td>
                            </Table.Tr>
                            <Table.Tr>
                                <Table.Th>Certificate Issued</Table.Th>
                                <Table.Td style={{display: "flex"}}>
                                    {
                                        ShikshaLavel.certificate_issued === "Y" ? (
                                            <>
                                            <IconCheck fontWeight="bold" color="green" size={20} /> <span>Yes</span>
                                            </>
                                        ) : (
                                            <span>Yet Not</span>
                                        )
                                    }
                                </Table.Td>
                            </Table.Tr>
                            <Table.Tr>
                                <Table.Td colSpan={2}>&nbsp;</Table.Td>
                            </Table.Tr>
                        </Table.Tbody>
                    </Table>
                </Card>
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 12, lg: 12 }}>
                <Card p={0}>
                    <Title order={4} style={{background:"#a0631f",color:"#fff",textAlign:"center",padding:"5px"}}>
                        CERTIFICATE
                    </Title>
                    {/* <Certificate name={"Shiksha Lavel"}/> */}
                </Card>
            </Grid.Col>
        </Grid>
    );
}


export default Lavel1Component