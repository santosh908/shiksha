import FAQComponent from "@/Components/organisms/PublicPageComponent/FAQComponent";
import GuestNonLandingLayout from "@/Layouts/guest/GuestNonLandingLayout";

export default function faq()
{
    return(
        <GuestNonLandingLayout pageTitle="FAQ">
           <FAQComponent/>
        </GuestNonLandingLayout>
    );
}