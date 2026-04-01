import { PageHeader } from "@/Components/molecules/DashboardComponents";
import DevoteeDashboard from "@/Components/organisms/Dashboard/DevoteeDashboard/DevoteeDashboard";
import Dashboard from "@/Layouts/DashboardLayout/DashboardLayout1/Dashboard";
import useUserStore from "@/Store/User.store";
import { usePage } from "@inertiajs/react";
import { ActionIcon, Avatar, Badge, Card, CardSection ,Flex,Group,Text} from "@mantine/core";
import { IconCheck, IconUpload } from "@tabler/icons-react";
import { useEffect } from "react";


const PageHeaderProps = {
  title: "Devotee Dashboard",
  withActions: false,
  breadcrumbItems: "<a>Home/Dashboard</a>",
  invoiceAction: true 
}

function AfterExamSubmission(props: any) {
  const { props: pageProps } = usePage();
  //@ts-ignore
  const successMessage = pageProps?.flash?.success;

  return (
    <Dashboard>
      <Flex justify="center" align="center" style={{ height: '250px' }}>
        <Card withBorder padding="lg" radius="md">
          <Group justify="flex-center" align="center">
            <Badge color="green" leftSection={<IconCheck size={14} />}>
              Successfully Submitted
            </Badge>
          </Group>
          <Text fz="lg" fw={500} mt="md">
            {/* Render the success message if it's a string */}
            You have submitted your exam successfully.
          </Text>
          <Text fz="sm" c="dimmed" mt={5}>
            Thank you for completing the exam!
          </Text>
        </Card>
      </Flex>
    </Dashboard>
  );
}

export default AfterExamSubmission;