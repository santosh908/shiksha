
import CompleteRegistration from '@/Components/organisms/Dashboard/SuperAdminDashboard/DevoteeRegistrationDetails/CompleteRegistration';
import Dashboard from '@/Layouts/DashboardLayout/DashboardLayout1/Dashboard';

const PageHeaderProps = {
    title: "Update Devotee Details",
    withActions: false,
    breadcrumbItems: "<a>Home/Dashboard</a>",
    invoiceAction: true 
  }

function RegistrationDetails()
{
    return (
        <Dashboard>
          <CompleteRegistration /> 
       </Dashboard>
    )
}
export default RegistrationDetails;