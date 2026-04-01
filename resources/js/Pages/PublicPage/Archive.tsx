import ArchiveComponent from '@/Components/organisms/PublicPageComponent/ArchiveComponent';
import GuestNonLandingLayout from '@/Layouts/guest/GuestNonLandingLayout';

export default function Archive() {
  return (
    <GuestNonLandingLayout  pageTitle="Announcement Description">
      <ArchiveComponent />
    </GuestNonLandingLayout>
  );
}
