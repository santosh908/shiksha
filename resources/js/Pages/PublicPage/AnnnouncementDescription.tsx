import AnnouncementComponent from '@/Components/organisms/PublicPageComponent/AnnouncementComponent';
import GuestNonLandingLayout from '@/Layouts/guest/GuestNonLandingLayout';

export default function AnnouncementDescription() {
  return (
    <GuestNonLandingLayout pageTitle="Announcement Description">
      <AnnouncementComponent />
    </GuestNonLandingLayout>
  );
}
