import AboutUsComponent from "@/Components/organisms/PublicPageComponent/AboutUsComponent";
import OnlineExamComponent from "@/Components/organisms/PublicPageComponent/OnlineExamComponent";
import GuestNonLandingLayout from "@/Layouts/guest/GuestNonLandingLayout";

export default function OnlineExam()
{
    return(
        <GuestNonLandingLayout pageTitle="Online Exam">
          <OnlineExamComponent/>
        </GuestNonLandingLayout>
    );
}