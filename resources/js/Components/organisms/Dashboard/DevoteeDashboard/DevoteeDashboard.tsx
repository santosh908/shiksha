
import {
    Container,
    PaperProps,
    Stack,
    
} from "@mantine/core";
import {
    PageHeader,
  } from '@/Components/molecules/DashboardComponents';
import { useFetchData } from '@/hooks';

const PAPER_PROPS: PaperProps = {
    p: 'md',
    shadow: 'md',
    radius: 'md',
    style: { height: '100%' },
  };
   

export default function DevoteeDashboard({ PageHeaderProps }:any) {
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

          <PageHeader {...PageHeaderProps} withActions={true} />

          {/* <StatsGrid
            data={statsData.data}
            loading={statsLoading}
            error={statsError}
            paperProps={PAPER_PROPS}
          />
          
          <Grid gutter={{ base: 5, xs: 'md', md: 'xl', xl: 50 }}>
            <Grid.Col span={8}>
              <RevenueChart {...PAPER_PROPS} />
            </Grid.Col>

            <Grid.Col span={4}>
              <SalesChart {...PAPER_PROPS} />
            </Grid.Col>

            <Grid.Col span={4}>
              <label>Chart View</label>
            </Grid.Col>

            <Grid.Col span={8}>
              <Paper {...PAPER_PROPS}>
                <Group justify="space-between" mb="md">
                  <Text size="lg" fw={600}>
                    Tasks
                  </Text>
                  <Button
                    variant="subtle"
                    component={Link}
                    href={PATH_TASKS.root}
                    rightSection={<IconChevronRight size={18} />}
                  >
                    View all
                  </Button>
                </Group>
                <ProjectsTable
                  data={projectsData.slice(0, 6)}
                  error={projectsError}
                  loading={projectsLoading}
                />
              </Paper>
            </Grid.Col>
          </Grid> */}
        </Stack>
      </Container>
    );
}
