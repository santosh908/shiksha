import AsheryLeaderDashboard from "@/Components/organisms/Dashboard/AsheryLeader/AsheryLeaderDashboard";
import Dashboard from "@/Layouts/DashboardLayout/DashboardLayout1/Dashboard";

const PageHeaderProps = {
  title: "Ashrey Leader Dashboard",
  withActions: false,
  breadcrumbItems: "<a>Home/Dashboard</a>",
  invoiceAction: true
}

function PageComponent() {
  return (
    <Dashboard>
      <AsheryLeaderDashboard  />
    </Dashboard>
  )
}
export default PageComponent;
