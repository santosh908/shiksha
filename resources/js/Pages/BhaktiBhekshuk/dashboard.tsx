import BhaktiBhekshukDashboard from "@/Components/organisms/Dashboard/BhaktiBhekshuk/dashboard";
import Dashboard from "@/Layouts/DashboardLayout/DashboardLayout1/Dashboard";

const PageHeaderProps = {
  title: "Devotee Dashboard",
  withActions: false,
  breadcrumbItems: "<a>Home/Dashboard</a>",
  invoiceAction: true 
}

function PageComponent(props:any) {
  return (
    <Dashboard>
      <BhaktiBhekshukDashboard />
    </Dashboard>
  )
}
export default PageComponent;