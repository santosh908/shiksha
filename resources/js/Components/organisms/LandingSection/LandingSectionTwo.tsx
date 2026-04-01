//import { Box, Container, Title } from '@mantine/core';
import { Badge, Box, Button, Container, Flex, Grid, Group, Image, List, rem, Text, ThemeIcon, Title } from '@mantine/core';
import { IconBolt, IconCheck } from '@tabler/icons-react';
import classes from './LandingActionSec.module.css';
import LandingGalaryCoursol from './Galary/LandingGalaryCoursol';
import NotificationCard from '@/Components/molecules/NotificationCard/NotificationCard';

const studyLink = [
  {
    url: '#',
    text: 'Study Link with title and shrot discription Study Link with title and shrot discription 1',
    date: '2023-09-11',
    isNew: true,
  },
  {
    url: '#',
    text: 'Study Link with title and shrot discription 1',
    date: '2023-09-10',
    isNew: false,
  },
  {
    url: '#',
    text: 'Study Link with title and shrot discription 1',
    date: '2023-09-09',
    isNew: false,
  },
];

function LandingSectionTwo() {
  return (
    <Container size="xl">
      <Group py={'30'} justify="center">
        <Badge className="text-center" variant="filled" size="lg">
          Study Links / Galary
        </Badge>
      </Group>
      <Grid>
        <Grid.Col span={6}>
          <div className={classes.content}>
            <NotificationCard title="Study Link" NotificationList={studyLink} />
          </div>
        </Grid.Col>
        <Grid.Col span={6}>
          <LandingGalaryCoursol />
        </Grid.Col>
      </Grid>
    </Container>
  );
}

export default LandingSectionTwo;
