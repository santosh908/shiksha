import ContactUsComponent from "@/Components/organisms/PublicPageComponent/ContactUsComponent";
import GuestNonLandingLayout from "@/Layouts/guest/GuestNonLandingLayout";

export default function ContactUs()
{
    return(
        <GuestNonLandingLayout pageTitle="Contact Us">
            <ContactUsComponent/>
        </GuestNonLandingLayout>
    );
}