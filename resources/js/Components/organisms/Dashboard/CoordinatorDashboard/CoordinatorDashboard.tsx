import { useState } from "react";
import {
    Button,
    Text,
    Container,
    Grid,
    Group,
    Paper,
    PaperProps,
    Stack,
    
} from "@mantine/core";
import {
    PageHeader,
  } from '@/Components/molecules/DashboardComponents';

import { PATH_TASKS } from '@/routes';
import { useFetchData } from '@/hooks';
import { IconChevronRight } from "@tabler/icons-react";
import { Link, usePage } from "@inertiajs/react";

const PAPER_PROPS: PaperProps = {
    p: 'md',
    shadow: 'md',
    radius: 'md',
    style: { height: '100%' },
  };
  

export default function CoordinatorDashboard() {
    const {
        data: projectsData,
        error: projectsError,
        loading: projectsLoading,
      } = useFetchData('/mocks/Projects.json');
      const {
        data: statsData,
        error: statsError,
        loading: statsLoading,
      } = useFetchData('/mocks/StatsGrid.json');

    return (
        <Container fluid>
        <Stack gap="lg"  py={'20'}>

          <PageHeader title="Dashboard" withActions={true} />

          
        </Stack>
      </Container>
    );
}
