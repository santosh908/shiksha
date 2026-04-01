import DashboardBreadCrumb from "@/Components/molecules/breadcrumb/DashboardBreadCrumb";
import { usePage } from "@inertiajs/react";
import { Card, Container, Grid, Stack, Tabs,Image, Center,Text } from "@mantine/core";
import { useEffect, useState } from "react";
import type { ShikshaLavel } from './ShikshaLavel.Type';
import LavelComponent from "./LavelComponent";
import { X } from "lucide-react";
import useUserStore from "@/Store/User.store";

function DevoteeShikshaLavelComponent() {
    const { ShikshaLavel } = usePage<{ ShikshaLavel: ShikshaLavel[] }>().props;
    const shikshaLavelArray = Array.isArray(ShikshaLavel)
        ? ShikshaLavel
        : Object.values(ShikshaLavel);
    const { name: UserName, login_id: LoginID } = useUserStore();
    const [activeTab, setActiveTab] = useState<string>('Interactive');

    const levelToTabValue = {
        1: 'Interactive',
        2: 'Shraddavan',
        3: 'KrishnaSevek',
        4: 'KrishnaSadhhak',
        5: 'PrabhupadaAshray',
        6: 'GurupadaAshray', // Merged level
        7: 'GurupadaAshray', // Merged level
        8: 'PostGurupadaAshray', // Merged level
        9: 'PostGurupadaAshray' // Merged level
    };

    const maxCompletedLevel = Math.max(
        //@ts-ignore
        ...shikshaLavelArray.map(item => item.shiksha_level)
    );

    const nextLevel = maxCompletedLevel;

    const visibleLevels = Object.entries(levelToTabValue)
        .filter(([level]) => parseInt(level) <= nextLevel)
        .map(([level, name]) => ({
            shiksha_level: parseInt(level),
            name
        }))
        .reduce((acc, curr) => {
            if (!acc.some(item => item.name === curr.name)) {
                acc.push(curr);
            }
            return acc;
        }, [] as { shiksha_level: number; name: string }[]);

    const isLevelCompleted = (level: number) => {
        //@ts-ignore
        return shikshaLavelArray.some(item => item.shiksha_level === level);
    };

    const getCombinedLevelData = (name: string) => {
        let combinedData = [];
    
        if (name === "GurupadaAshray") {
            combinedData = shikshaLavelArray.filter(
                //@ts-ignore
                item => item.shiksha_level === 6 || item.shiksha_level === 7
            );
        } else if (name === "PostGurupadaAshray") {
            combinedData = shikshaLavelArray.filter(
                //@ts-ignore
                item => item.shiksha_level === 8 || item.shiksha_level === 9
            );
        } else {
            combinedData = shikshaLavelArray.filter(
                //@ts-ignore
                item => levelToTabValue[item.shiksha_level] === name
            );
        }
    
        const totalObtain = combinedData.length
        //@ts-ignore
            ? combinedData.reduce((sum, level) => sum + parseInt(level.total_obtain || "0", 10), 0)
            : 0;
    
        return {
            data: combinedData,
            totalObtain: combinedData.length > 1 ? totalObtain : 0, // Pass total only for merged sections
        };
    };

    const IncompleteStateMessage = () => (
        <Center style={{ padding: '2rem' }}>
            <Stack>
                <Text size="lg"  color="red">
                    This level is not yet completed
                </Text>
                <Text>Please complete this level to proceed with the exam for the level.</Text>
            </Stack>
        </Center>
    );

    return (
        <Container fluid>
            <Stack gap="lg" py="20">
                <DashboardBreadCrumb
                    title="Shiksha Level"
                    link="/Devotee/dashboard"
                    message={LoginID}
                    linkTitle="Shiksha Level"
                />
                <Grid>
                    <Grid.Col span={12}>
                        <Card shadow="sm" padding="lg" radius="md" withBorder>
                            {Array.isArray(shikshaLavelArray) && (
                                <Tabs value={activeTab}
                                //@ts-ignore
                                onChange={setActiveTab}>
                                    <Tabs.List>
                                        {visibleLevels.map(({ shiksha_level, name }) => {
                                            const { data } = getCombinedLevelData(name); // Destructure the `data` property
                                            const completed = data.length > 0; // Check the length of `data`
                                            return (
                                                <Tabs.Tab
                                                    key={shiksha_level}
                                                    value={name}
                                                    leftSection={
                                                        completed ? (
                                                            <Image
                                                                src="/favicon-32x32.png"
                                                                alt={name}
                                                            />
                                                        ) : (
                                                            <X size={18} className="text-red-500" />
                                                        )
                                                    }
                                                    style={{
                                                        background: completed ? '#dddddd3d' : '#ffebeb',
                                                        borderRight: '2px solid #dddddd8a',
                                                        borderLeft: '1px solid #ddd',
                                                        color: completed ? 'inherit' : '#dc2626'
                                                    }}
                                                >
                                                    {name}
                                                </Tabs.Tab>
                                            );
                                        })}
                                    </Tabs.List>
                                    {visibleLevels.map(({ shiksha_level, name }) => (
                                        <Tabs.Panel key={name} value={name}>
                                            {getCombinedLevelData(name).data.length > 0 ? (
                                                <LavelComponent
                                                    //@ts-ignore
                                                    ShikshaLavel={getCombinedLevelData(name).data}
                                                    //@ts-ignore
                                                    totalObtain={getCombinedLevelData(name).totalObtain}
                                                />
                                            ) : (
                                                <IncompleteStateMessage />
                                            )}
                                        </Tabs.Panel>
                                    ))}
                                </Tabs>
                            )}
                        </Card>
                    </Grid.Col>
                </Grid>
            </Stack>
        </Container>
    );
}

export default DevoteeShikshaLavelComponent;