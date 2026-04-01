import Dashboard from '@/Layouts/DashboardLayout/DashboardLayout1/Dashboard';
import PartiallyDevoteeListComponent from '@/Components/organisms/Dashboard/SuperAdminDashboard/Partially_Devotee_List/PartiallyDevoteeListComponent';
// export default function partiallyfilledList() {
//   return;
//   <Dashboard>
//     {/* <PartiallyDevoteeListComponent /> */}
//     <>
//       <label>this is test</label>
//     </>
//   </Dashboard>;
// }

function PageComponent() {
  return (
    <Dashboard>
      <PartiallyDevoteeListComponent />
    </Dashboard>
  );
}
export default PageComponent;
