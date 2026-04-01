import { useEffect } from "react";
import { modals } from "@mantine/modals";
import { usePage, router } from "@inertiajs/react";
import { Text } from "@mantine/core";

const openExamNotStartedModal = () => {
  modals.open({
    title: "Exam Status",
    size: "sm",
    radius: "md",
    withCloseButton: false,
    children: (
      <Text size="sm">
        Your exam has not started yet. Please wait for the scheduled time.
      </Text>
    ),
    onClose: () => {
      // Redirect to the desired URL
      router.get("/Devotee/PromotedLevel");
    },
  });
};
//@ts-ignore
const alertExaNotStarted = ({ ExamDetails, QuestionList }: { ExamDetails: any; QuestionList: any }) => {
  useEffect(() => {
    // Ensure ExamDetails and QuestionList are valid
    const isExamNotStarted =
      !ExamDetails ||
      !QuestionList ||
      (Array.isArray(QuestionList) && QuestionList.length === 0);

    if (isExamNotStarted) {
      openExamNotStartedModal();
    }
  }, [ExamDetails, QuestionList]);

  return null; // No UI rendering in this component
};


export default alertExaNotStarted;
