
import AdminDevoteeRegistrationTabContainer from '@/Components/organisms/Dashboard/SuperAdminDashboard/DevoteeRegistrationDetails/AdminDevoteeRegistrationTabContainer';
import Dashboard from '@/Layouts/DashboardLayout/DashboardLayout1/Dashboard';

const PageHeaderProps = {
    title: "Update Devotee Details",
    withActions: false,
    breadcrumbItems: "<a>Home/Dashboard</a>",
    invoiceAction: true 
  }

function DevoteeRegisrationPage()
{
    return (
        <Dashboard>
          <AdminDevoteeRegistrationTabContainer /> 
        </Dashboard>
    )
}
export default DevoteeRegisrationPage;