import useUserStore from '@/Store/User.store';
import { usePage } from '@inertiajs/react';
import {
  Card,
  Container,
  Grid,
  rem,
  Stack,
  Tabs,
  useMatches,
} from '@mantine/core';
import {
  IconCheck,
  IconPray,
  IconTimelineEventExclamation,
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

export default function CompleteRegistration() {
  const { masterData } = usePage<{ masterData: MasterData }>().props;

  const color = useMatches({
    base: 'blue.9',
    sm: 'orange.9',
    lg: 'red.9',
  });

  const { name: UserName, login_id: LoginID } = useUserStore();

  const iconStyle = { width: rem(12), height: rem(12), fontWeight: 'bold' };

  // State for tracking the active tab
  const [activeTab, setActiveTab] = useState('plInfo');

  const handleNext = () => {
    const nextTab = getNextTab(activeTab);
    if (nextTab) {
      setActiveTab(nextTab);
    }
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
        <DashboardBreadCrumb title="Registration" link="/Devotee/dashboard" message={UserName} linkTitle="Dashboard" />
        <Grid>
            <Grid.Col span={12}>
              <Card shadow="sm" padding="lg" radius="md" withBorder>
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
      </Stack>
    </Container>
  );
}
