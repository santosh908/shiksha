import useUserStore from '@/Store/User.store';
import { router, usePage } from '@inertiajs/react';
import { StarterKit } from '@tiptap/starter-kit';
import '@mantine/tiptap/styles.css';
import RichText from '@/Components/molecules/RichText/RichText';
import {
  ActionIcon,
  Badge,
  Box,
  Text,
  Card,
  Container,
  Grid,
  Group,
  Menu,
  rem,
  Stack,
  Tabs,
  useMatches,
  Flex,
  Title,
  createTheme,
  Modal,
  Textarea,
  Button,
  TextInput,
} from '@mantine/core';
import {
  IconCheck,
  IconCrop,
  IconDots,
  IconEye,
  IconFileZip,
  IconMessageCircle,
  IconPolaroidFilled,
  IconPray,
  IconQuote,
  IconRosetteDiscountCheck,
  IconSectionSign,
  IconSettings,
  IconSquareRounded,
  IconTimelineEventExclamation,
  IconTrash,
  IconUserBolt,
  IconWorldCheck,
} from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import { MasterData } from './CompleteRegistration.types';
import PersonalInfo from './PersoanlInfo';
import ProfessionalInfo from './ProfessionalInfo';
import HearingReading from './HearingReading';
import Seminar from './Seminar';
import DashboardBreadCrumb from '@/Components/molecules/breadcrumb/DashboardBreadCrumb';
import { notifications } from '@mantine/notifications';

export default function CompleteRegistration() {
  const { masterData } = usePage<{ masterData: MasterData }>().props;
  const { name: UserName, login_id: LoginID } = useUserStore();

  useEffect(() => {
   // console.log('Master Data:', masterData);
  }, [masterData]);
  const color = useMatches({
    base: 'blue.9',
    sm: 'orange.9',
    lg: 'red.9',
  });

  const [isQueryModalOpen, setQueryModalOpen] = useState(false);
  const [queryText, setQueryText] = useState('');
  const [querySubject, setQuerySubject] = useState('');

  const iconStyle = { width: rem(12), height: rem(12), fontWeight: 'bold' };

  // State for tracking the active tab
  const [activeTab, setActiveTab] = useState('plInfo');

  const handleNext = () => {
    const nextTab = getNextTab(activeTab);
    if (nextTab) {
      setActiveTab(nextTab);
    }
  };

  // Handle Raise Query Modal
  const handleQuerySubmit = () => {
    const strippedText = queryText.replace(/<[^>]*>/g, '');
    router.post(
      '/Devotee/raisequery',
      {
        subject: querySubject, // Send the subject of the query
        description: strippedText, // Send the query text
        from_id: LoginID,
      },
      {
        onSuccess: () => {
          setQueryText(''); // Clear the input after successful submission
          setQuerySubject('');
          setQueryModalOpen(false); // Close the modal

          notifications.show({
            title: 'Success',
            message: 'Query raised successfully',
            color: 'green',
            icon: <IconCheck size={16} />,
            autoClose: 3000,
            position: 'top-right',
          });
        },
        onError: (errors) => {
          console.error('Error submitting query:', errors);

          notifications.show({
            title: 'Error',
            message: 'Failed to raise query. Please try again.',
            color: 'red',
            icon: <IconTimelineEventExclamation size={16} />,
            autoClose: 3000,
            position: 'top-right',
          });
        },
      }
    );
  };

  // Function to handle going to the previous tab
  const handleBack = () => {
    const previousTab = getPreviousTab(activeTab);
    if (previousTab) {
      setActiveTab(previousTab);
    }
  };

  const getNextTab = (currentTab: any) => {
    const tabOrder = ['plInfo', 'Profession', 'HeadReading', 'Seminars'];
    const currentIndex = tabOrder.indexOf(currentTab);
    return currentIndex < tabOrder.length - 1 ? tabOrder[currentIndex + 1] : null;
  };

  // Helper function to get the previous tab value
  const getPreviousTab = (currentTab: any) => {
    const tabOrder = ['plInfo', 'Profession', 'HeadReading', 'Seminars'];
    const currentIndex = tabOrder.indexOf(currentTab);
    return currentIndex > 0 ? tabOrder[currentIndex - 1] : null;
  };

  const containerStyle = {
    width: '100%',
    backgroundColor: 'rgb(222 226 230 / 69%)', // Background color
    padding: '7px', // Optional padding
    marginBottom: '5px',
    display: 'block',
  };

  return (
    <Container fluid>
      <Stack gap="lg" py={'20'}>
        <DashboardBreadCrumb title="Registration" link="/Devotee/dashboard" message={LoginID} linkTitle="Dashboard" />
        {masterData?.PersonalInfo?.status_code === 'N' ||
        masterData?.PersonalInfo?.status_code === 'A' ||
        masterData?.PersonalInfo?.status_code === null ||
        masterData?.PersonalInfo?.status_code === undefined ? (
          <Grid>
            <Grid.Col span={12}>
              <Card shadow="sm" padding="lg" radius="md" withBorder>
                <Group justify="space-between" mt="md" mb="xs">
                  <Badge color="pink">Fill Details</Badge>
                </Group>
                <Tabs
                  value={activeTab}
                  onChange={(event) => {
                    //console.log(event);
                  }}
                >
                  <Tabs.List>
                    <Tabs.Tab
                      value="plInfo"
                      leftSection={
                        masterData?.PersonalInfo?.personal_info === 'Y' ? (
                          <IconCheck fontWeight={'bold'} color="green" size={20} />
                        ) : (
                          <IconUserBolt color="red" size={20} />
                        )
                      }
                    >
                      {'Personal Information'}
                    </Tabs.Tab>

                    <Tabs.Tab
                      value="Profession"
                      leftSection={
                        masterData?.PersonalInfo?.professional_info === 'Y' ? (
                          <IconCheck fontWeight={'bold'} color="green" size={20} />
                        ) : (
                          <IconWorldCheck color="red" size={20} />
                        )
                      }
                    >
                      Spritual Information 1
                    </Tabs.Tab>

                    <Tabs.Tab
                      value="HeadReading"
                      leftSection={
                        masterData?.PersonalInfo?.hearing_reading === 'Y' ? (
                          <IconCheck fontWeight={'bold'} color="green" size={20} />
                        ) : (
                          <IconPray color="red" size={20} />
                        )
                      }
                    >
                      Spritual Information 2
                    </Tabs.Tab>

                    <Tabs.Tab
                      value="Seminars"
                      leftSection={
                        masterData?.PersonalInfo?.seminar === 'Y' ? (
                          <IconCheck fontWeight={'bold'} color="green" size={20} />
                        ) : (
                          <IconTimelineEventExclamation color="red" size={20} />
                        )
                      }
                    >
                      Spritual Information 3
                    </Tabs.Tab>
                  </Tabs.List>

                  <Tabs.Panel value="plInfo" py={20}>
                    <PersonalInfo masterData={masterData} handleNext={handleNext} />
                  </Tabs.Panel>

                  <Tabs.Panel value="Profession" py={20}>
                    {masterData?.PersonalInfo?.personal_info === 'Y' ? (
                      <ProfessionalInfo masterData={masterData} handleNext={handleNext} handleBack={handleBack} containerStyle={containerStyle} />
                    ) : (
                      <></>
                    )}
                  </Tabs.Panel>

                  <Tabs.Panel value="HeadReading" py={20}>
                    {masterData?.PersonalInfo?.personal_info === 'Y' ? (
                      <HearingReading masterData={masterData} handleNext={handleNext} handleBack={handleBack} containerStyle={containerStyle} />
                    ) : (
                      <></>
                    )}
                  </Tabs.Panel>

                  <Tabs.Panel py={20} value="Seminars">
                    {masterData?.PersonalInfo?.personal_info === 'Y' ? (
                      <Seminar masterData={masterData} handleNext={handleNext} handleBack={handleBack} containerStyle={containerStyle} />
                    ) : (
                      <></>
                    )}
                    <></>
                  </Tabs.Panel>
                </Tabs>
              </Card>
            </Grid.Col>
          </Grid>
        ) : (
          <Grid>
            <Grid.Col __size="sm" py={20} offset={3} span={{ base: 12, md: 6, lg: 6 }}>
              <Card withBorder shadow="sm" radius="md">
                <Card.Section withBorder inheritPadding py="xs">
                  <Group justify="space-between">
                    <Text style={{ fontWeight: 'bold' }} fw={500}>
                      Registration Submission Status
                    </Text>
                    <Menu withinPortal position="bottom-end" shadow="sm">
                      <Menu.Target>
                        <ActionIcon variant="subtle" color="gray">
                          <IconDots style={{ width: rem(16), height: rem(16) }} />
                        </ActionIcon>
                      </Menu.Target>

                      <Menu.Dropdown>
                        <Menu.Item
                          leftSection={<IconEye style={{ width: rem(14), height: rem(14) }} />}
                          onClick={() => router.get('/Devotee/previewdata')}
                        >
                          Preview
                        </Menu.Item>
                         <Menu.Item
                          leftSection={<IconQuote style={{ width: rem(14), height: rem(14) }} />}
                          color="red"
                          onClick={() => setQueryModalOpen(true)}
                        >
                          Raise Query
                        </Menu.Item>
                      </Menu.Dropdown>
                    </Menu>
                  </Group>
                </Card.Section>
                {masterData?.PersonalInfo?.status_code === 'S' ? (
                  <>
                    <Box className="w-100 ">
                      <Flex justify="center" mt={30} direction="column" align="center">
                        <IconRosetteDiscountCheck style={{ color: 'green' }} size={50} />
                        <Title order={3} className="text-green-700">
                          <p style={{ color: 'green' }}> You have successfully submited your profile details.</p>
                        </Title>
                      </Flex>
                    </Box>
                    <Box className="w-100 " mb={25}>
                      <Flex justify="center" direction="column" align="center">
                        <h4>
                          Please wait. Once your Ashray Leader approves your account, you will receive an email and you can access your account.
                        </h4>
                      </Flex>
                    </Box>
                  </>
                ) : (
                  <>
                    <Box className="w-100 ">
                      <Flex justify="center" mt={30} direction="column" align="center">
                        <IconSquareRounded style={{ color: 'red' }} size={50} />
                        <Title order={3} className="text-red-700">
                          <p style={{ color: 'red' }}>Your Ashray Leader has raised a query.</p>
                        </Title>
                      </Flex>
                    </Box>
                    <Box className="w-100 " mb={25}>
                      <Flex justify="center" direction="column" align="center">
                        <h4>You request is pending with Super Admin.</h4>
                      </Flex>
                    </Box>
                  </>
                )}
              </Card>
            </Grid.Col>
          </Grid>
        )}
 
        {/* Raise Query Modal */}
        <Modal opened={isQueryModalOpen} onClose={() => setQueryModalOpen(false)} title="Raise a Query" centered size="xl">
          <TextInput
            label="Subject"
            placeholder="Enter the subject of your query"
            value={querySubject}
            onChange={(event) => setQuerySubject(event.currentTarget.value)}
            required
            mb="md"
          />
          <RichText value={queryText} onChange={(newContent) => setQueryText(newContent)} />
          <Group mt="md">
            <Button variant="outline" onClick={() => setQueryModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleQuerySubmit}>Submit</Button>
          </Group>
        </Modal>
      </Stack>
    </Container>
  );
}
