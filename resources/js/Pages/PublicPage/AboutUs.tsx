import AboutUsComponent from "@/Components/organisms/PublicPageComponent/AboutUsComponent";
import GuestNonLandingLayout from "@/Layouts/guest/GuestNonLandingLayout";

export default function AboutUs()
{
    return(
        <GuestNonLandingLayout pageTitle="About Us">
           <AboutUsComponent/>
        </GuestNonLandingLayout>
    );
}