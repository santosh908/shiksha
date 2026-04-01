import DashboardBreadCrumb from '@/Components/molecules/breadcrumb/DashboardBreadCrumb';
import useUserStore from '@/Store/User.store';
import { PageProps } from '@/types';
import { router, usePage } from '@inertiajs/react';
import { Card, Container, Stack, Text, Badge, Group, Title, Collapse, Button, Box, ThemeIcon } from '@mantine/core';
import { IconAlertCircle, IconCircleCheck, IconTrophy } from '@tabler/icons-react';
import { useEffect } from 'react';

function DevoteePromotedLevelComponent() {
  const { promotedLevels, examination,ShikshaLevel} = usePage<PageProps>().props;
  const shikshaLavelArray = Array.isArray(promotedLevels)
    ? promotedLevels
    //@ts-ignore
    : Object.values(promotedLevels);

  
  const { name: UserName, login_id: LoginID } = useUserStore();

  //@ts-ignore
  const levelToTabValue = ShikshaLevel?.reduce((acc:any, level:any) => {
    acc[level.id] = level.exam_level;
    return acc;
  }, {} as Record<number, string>);

  //@ts-ignore
  const completedLevels = shikshaLavelArray.filter(item => item?.is_promoted_by_ashray_leader !== "1").map(item => item?.shiksha_level);
  // Function to get the next level based on the highest completed level
  const getNextLevel = (completedLevels: number[]): number | null => {
    // Get all available levels from the map keys, convert to numbers, and sort them
    const allLevels = Object.keys(levelToTabValue)
      .map(Number)
      .sort((a, b) => a - b);

    if (allLevels.length === 0) return null;

    // If no levels are completed, return the first available level
    if (completedLevels.length === 0) {
        return allLevels[0];
    }

    const maxCompletedLevel = Math.max(...completedLevels);

    // Find the index of the highest completed level in the allLevels array
    const currentIndex = allLevels.indexOf(maxCompletedLevel);
    
    // If the max completed level is not in our list (weird case), or it's the last one
    if (currentIndex === -1) {
        // If the user has completed a level that isn't in the list (maybe old data), 
        // find the first level greater than maxCompletedLevel
        const next = allLevels.find(l => l > maxCompletedLevel);
        return next || null;
    }

    // If there is a next level available
    if (currentIndex < allLevels.length - 1) {
      return allLevels[currentIndex + 1];
    }
    
    // If we are at the end of the list, return null (all completed)
    return null;
  };
  // Find relevant exam for a given level
  //@ts-ignore
  const findExamForLevel = (level: number): ExaminationData | undefined => {
    //@ts-ignore
    const levelName = levelToTabValue[level];
    //@ts-ignore
    return examination.find(examination => examination.level_name === levelName);
  };

  const nextLevel = getNextLevel(completedLevels);

  // Find missing levels (only consider levels up to the highest completed one)
  const missingLevels = Object.keys(levelToTabValue)
    .map(level => parseInt(level))
    .filter(level => {
      const maxCompleted = Math.max(...completedLevels);
      return level < maxCompleted && !completedLevels.includes(level);
    });
    
    const formatDate = (dateString: string): string => {
      try {
        // Handle format with '/'
        if (dateString.includes('/')) {
          const parts = dateString.split('/');
          if (parts.length === 3) {
            // Reformat to dd/MM/yyyy
            return `${parts[0].padStart(2, '0')}/${parts[1].padStart(2, '0')}/${parts[2]}`;
          }
        }
        // Handle format with '-'
        if (dateString.includes('-')) {
          const date = new Date(dateString);
          if (!isNaN(date.getTime())) {
            // Extract dd, MM, yyyy
            const day = date.getDate().toString().padStart(2, '0');
            const month = (date.getMonth() + 1).toString().padStart(2, '0');
            const year = date.getFullYear().toString();
            return `${day}/${month}/${year}`;
          }
        }
        return dateString;
      } catch {
        return dateString;
      }
    };

  const formatTime = (timeString: string): string => {
    try {
      const [hours, minutes] = timeString.split(':');
      const time = new Date();
      time.setHours(parseInt(hours), parseInt(minutes));
      return time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return timeString;
    }
  };

   const handleSubmit = (id: string) => {
    const encodedId = btoa(id); 
      router.visit(`/Devotee/TakeExam/${encodedId}`);
    };

    const allLevelsCompleted =missingLevels.length === 0 && nextLevel === null;

  return (
    <Container fluid>
      <Stack gap="lg" py="20">
        <DashboardBreadCrumb 
          title="Promoted Level" 
          link="/Devotee/dashboard" 
          message={LoginID} 
          linkTitle="Dashboard" 
        />

        {/* Missing Levels Section */}
        {missingLevels.length > 0 && (
          <>
            <Title order={3} c="blue.8" mt="lg">
              Missing Level Examinations
            </Title>
            {missingLevels.map(level => {
              const examForLevel = findExamForLevel(level);
              <Text>{examForLevel}</Text>
              return (
                <Card key={`missing-${level}`} shadow="sm" padding="lg" radius="md" withBorder>
                  <Group justify="space-between" align="center">
                    <Stack gap={4}>
                      <Title order={4} c="orange.7">
                        { //@ts-ignore 
                        levelToTabValue[level]}
                      </Title>
                      <Text size="sm" c="gray.6">
                        Missing Level
                      </Text>
                    </Stack>
                    <Badge color="orange" leftSection={<IconAlertCircle size={14} />}>
                      Pending
                    </Badge>
                  </Group>
                  {examForLevel ? (
                    <Collapse in={true}>
                      <Card>
                        <Card.Section>
                          <Text>
                            <b>{examForLevel.session_name}&nbsp;({examForLevel.level_name})</b>
                          </Text>
                          <Group>
                            <Text fw={500}>Total Questions:</Text>
                            <Text>{examForLevel.no_of_question}</Text>
                          </Group>
                          <Group>
                            <Text fw={500}>Total Marks:</Text>
                            <Text>{examForLevel.total_marks}</Text>
                          </Group>
                          <Group>
                            <Text fw={500}>Exam Date:</Text>
                            <Text>{formatDate(examForLevel.date)}  {formatTime(examForLevel.start_time)}</Text>
                            <Button onClick={() => handleSubmit(examForLevel.id)}>Start Exam</Button>
                          </Group>
                        </Card.Section>
                      </Card>
                    </Collapse>
                  ):(
                    <div>
                      <p>You will be notified when the exam is scheduled.</p>
                    </div>
                  )}
                </Card>
              );
            })}
          </>
        )}

        {/* Next Level Section */}
        {nextLevel ? (
           nextLevel <= Math.max(...Object.keys(levelToTabValue).map(l => parseInt(l))) && (
          <>
            <Title order={3} c="blue.8" mt="lg">
              Next Promoted Level Examination
            </Title>
            <Card shadow="sm" padding="lg" radius="md" withBorder>
              <Group justify="space-between" align="center">
                <Stack gap={4}>
                  <Title order={4} c="blue.7">
                    {
                    //@ts-ignore
                    levelToTabValue[nextLevel]
                    }
                  </Title>
                </Stack>
                <Badge color="blue">Upcoming</Badge>
              </Group>
              {findExamForLevel(nextLevel) ? (
                <Collapse in={true}>
                  <Card>
                    <Card.Section>
                      <Text>
                        <b>{findExamForLevel(nextLevel)!.session_name}&nbsp;({findExamForLevel(nextLevel)!.level_name})</b>
                      </Text>
                      <Group>
                        <Text fw={500}>Total Questions:</Text>
                        <Text>{findExamForLevel(nextLevel)!.no_of_question}</Text>
                      </Group>
                      <Group>
                        <Text fw={500}>Total Marks:</Text>
                        <Text>{findExamForLevel(nextLevel)!.total_marks}</Text>
                      </Group>
                      <Box>
                        <Group>
                          <Text fw={500}>Exam Date:</Text>
                          <Text>{formatDate(findExamForLevel(nextLevel)!.date)}  {formatTime(findExamForLevel(nextLevel)!.start_time)}</Text>
                        </Group>
                        {
                        //@ts-ignore
                        promotedLevels?.some((level: any) => level.is_promoted_by_ashray_leader === "1") ? (
                          <>
                            <Button  onClick={() => handleSubmit(findExamForLevel(nextLevel)!.id)} >Start Exam</Button>
                          </>
                          ) : (
                                missingLevels && missingLevels.length > 0 ? (
                                  <>
                                    <Group py={25}>
                                      <br/><Text color="orange">Please complete your previous level exam first</Text>
                                    </Group>
                                  </>
                                ) : (
                                  <>
                                    <Button onClick={() => handleSubmit(findExamForLevel(nextLevel)!.id)}>
                                      Start Exam
                                    </Button>
                                  </>
                                )
                          )}
                      </Box>
                    </Card.Section>
                  </Card>
                </Collapse>
              ):(
                <div>
                    <p>You will be notified when the exam is scheduled.</p>
                  </div>
                )
              }
            </Card>
          </>
           )
        ) : ( allLevelsCompleted && (  
            <Card shadow="sm" padding="xl" radius="md" withBorder mt="xl" style={{ backgroundColor: '#fffbeb', borderColor: '#fcd34d' }}>
              <Stack align="center" gap="xs">
                <ThemeIcon size={80} radius="100%" variant="light" color="yellow" style={{ backgroundColor: '#fff7ed' }}>
                  <IconTrophy size={48} color="#d97706" />
                </ThemeIcon>
                <Title order={2} ta="center" mt="md" style={{ color: '#b45309' }}>
                  Congratulations!
                </Title>
                <Text size="lg" ta="center" style={{ maxWidth: 600, color: '#92400e' }}>
                  After qualifying for Gurupada Ashray, no further level is planned.
                </Text>
              </Stack>
            </Card>)
        )}
      </Stack>
    </Container>
  );
}

export default DevoteePromotedLevelComponent;