import DevoteeRegistrationList from '@/Components/organisms/Dashboard/AsheryLeader/DevoteeRegistrationList';
import Dashboard from '@/Layouts/DashboardLayout/DashboardLayout1/Dashboard';

const PageHeaderProps = {
  title: 'Ashrey Leader Dashboard',
  withActions: false,
  breadcrumbItems: '<a>Home/Dashboard</a>',
  invoiceAction: true,
};

function devoteeRegistrationList() {
  return (
    <Dashboard>
      <DevoteeRegistrationList />
    </Dashboard>
  );
}
export default devoteeRegistrationList;
