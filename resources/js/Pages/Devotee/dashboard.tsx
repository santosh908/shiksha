import { PageHeader } from "@/Components/molecules/DashboardComponents";
import DevoteeDashboard from "@/Components/organisms/Dashboard/DevoteeDashboard/DevoteeDashboard";
import Dashboard from "@/Layouts/DashboardLayout/DashboardLayout1/Dashboard";
import useUserStore from "@/Store/User.store";
import { useEffect } from "react";

const PageHeaderProps = {
  title: "Devotee Dashboard",
  withActions: false,
  breadcrumbItems: "<a>Home/Dashboard</a>",
  invoiceAction: true 
}

function PageComponent(props:any) {
  return (
    <Dashboard>
      <DevoteeDashboard PageHeaderProps={PageHeaderProps} />
    </Dashboard>
  )
}
export default PageComponent;
