import React, { useState, useEffect, useRef } from "react";
import {
  Container,
  Flex,
  Box,
  Card,
  Grid,
  Radio,
  Button,
  Text,
  Badge,
  Paper,
  Divider,
} from "@mantine/core";
import { router, usePage } from "@inertiajs/react";
import { modals } from "@mantine/modals";

interface Question {
  question: string;
  options: string[];
}

interface QuestionList {
  id: number;
  question_english: string;
  question_hindi: string;
  option1: string;
  option2: string;
  option3: string;
  option4: string;
  selected_answer:string;
}

interface QuestionsData {
  questions: Question[];
}

type Examination = {
  id: string;
  exam_id: number;
  session_name: string;
  exam_session_id: number;
  exam_level: string;
  exam_level_id: number;
  remarks: string;
  date: string;
  start_time: string;
  duration: number;
  no_of_question: number;
  total_marks: number;
  qualifying_marks: number;
  is_active: string;
  questions: Question[];
};

const StartExam: React.FC = () => {
  const [selectedOptions, setSelectedOptions] = useState<Record<number, string>>({});
  const [isTestSubmitted, setIsTestSubmitted] = useState<boolean>(false);
  // Track submitted questions
  const [submittedQuestions, setSubmittedQuestions] = useState<Record<number, boolean>>({});
  // Track questions currently being submitted
  const [submittingQuestions, setSubmittingQuestions] = useState<Record<number, boolean>>({});
  
  // Create refs for each question to enable scrolling
  const questionRefs = useRef<(HTMLDivElement | null)[]>([]);

  const { QuestionList } = usePage<{ QuestionList: QuestionList[] }>().props;
  const { ExamDetails } = usePage<{ ExamDetails: Examination }>().props;
  const dataList = QuestionList[0];
  const questionsData = {
    //@ts-ignore
    questions: dataList.map((item: any) => ({
      questionId: item.id,
      question_english: item.question_english,
      question_hindi: item.question_hindi,
      options: [item.option1, item.option2, item.option3, item.option4],
      selected_answer: item.selected_answer
    })),
  };

  // Initialize the refs array based on the number of questions
  useEffect(() => {
    questionRefs.current = Array(questionsData.questions.length).fill(null);
  }, [questionsData.questions.length]);

  useEffect(() => {
    // Initialize selected options with any previously selected answers
    const initialSelections: Record<number, string> = {};
    questionsData.questions.forEach((question:any, index:any) => {
      if (question.selected_answer) {
        initialSelections[index] = question.selected_answer;
        // Also mark these questions as submitted since they have answers
        setSubmittedQuestions(prev => ({
          ...prev,
          [index]: true
        }));
      }
    });
    setSelectedOptions(initialSelections);
    
    // Initialize the refs array
    questionRefs.current = Array(questionsData.questions.length).fill(null);
  }, [questionsData.questions.length]);

  //@ts-ignore
  const [remainingTime, setRemainingTime] = useState(ExamDetails[0].duration * 60);
  useEffect(() => {
    const timer = setInterval(() => {
      setRemainingTime((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer);
          handleFinalSubmit(); // Auto-submit when time runs out
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (time: any) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
  };

  const questions = questionsData.questions;

  const handleOptionChange = (questionIndex: number, option: string) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [questionIndex]: option,
    }));
  };

  // Scroll to a specific question
  const scrollToQuestion = (index: number) => {
    if (questionRefs.current[index]) {
      const rect = questionRefs.current[index].getBoundingClientRect();
      window.scrollTo({
        top: rect.top + window.scrollY - 150, // Adjust this value as needed
        behavior: 'smooth',
      });
    }
  };

  const handleQuestionSubmit = (index: number) => {
    if (!selectedOptions[index]) {
      modals.open({
        title: "Select an Answer",
        size: "sm",
        radius: "md",
        withCloseButton: true,
        children: <Text size="sm">Please select an answer before submitting.</Text>,
        //@ts-ignore
        labels: { confirm: "OK" },
      });
      return;
    }
    //@ts-ignore
    const examId = ExamDetails[0]?.id;
    //@ts-ignore
    const examLevelId = ExamDetails[0]?.exam_level_id;
    //@ts-ignore
    const sessionId = ExamDetails[0]?.session_id;
  
    const questionSubmission = {
      examId: examId,
      examLevelId: examLevelId,
      sessionId: sessionId,
      questionId: questions[index].questionId,
      selectedAnswer: selectedOptions[index],
    };
  
    // Mark this question as being submitted (show loading state)
    setSubmittingQuestions(prev => ({
      ...prev,
      [index]: true
    }));
  
    // Use Inertia's router but with proper options to avoid full page reload
    router.post('/Devotee/SubmitQuestion', questionSubmission, {
      preserveScroll: true,  // Keep the scroll position
      preserveState: true,   // Don't refresh the page state
      replace: true,         // Replace the current history entry
      onSuccess: () => {
        // Update the local state to show the question as submitted
        questions[index].selected_answer = selectedOptions[index];
        
        // Mark this question as submitted
        setSubmittedQuestions(prev => ({
          ...prev,
          [index]: true
        }));
        
        // Scroll to the next question if available
        if (index < questions.length - 1) {
          scrollToQuestion(index + 1);
        }
  
        // Remove the submitting state
        setSubmittingQuestions(prev => {
          const updated = {...prev};
          delete updated[index];
          return updated;
        });
      },
      onError: (errors) => {
        console.error('Submission error:', errors);
        modals.open({
          title: "Submission Error",
          size: "sm",
          radius: "md",
          withCloseButton: true,
          children: <Text size="sm">Failed to submit your answer. Please try again.</Text>,
          //@ts-ignore
          labels: { confirm: "OK" },
        });
  
        // Remove the submitting state
        setSubmittingQuestions(prev => {
          const updated = {...prev};
          delete updated[index];
          return updated;
        });
      }
    });
  };

  const handleFinalSubmit = () => {
    //@ts-ignore
    const examId = ExamDetails[0]?.id;
    router.post('/Devotee/FinalizeExam', { examId }, {
      onSuccess: () => {
        setIsTestSubmitted(true);
        modals.open({
          title: "Exam Completed",
          size: "sm",
          radius: "md",
          withCloseButton: false,
          children: <Text size="sm">Your exam has been submitted successfully.</Text>,
          //@ts-ignore
          labels: { confirm: "OK" },
          onConfirm: () => {
            router.get("/Devotee/PromotedLavel");
          },
        });
      },
    });
  };

  const confirmFinalSubmit = () => {
    modals.openConfirmModal({
      title: "Submit Exam",
      children: (
        <Text size="sm">
          Are you sure you want to finalize and submit your exam? You won't be able to make any changes after submission.
        </Text>
      ),
      labels: { confirm: "Yes, Submit", cancel: "Cancel" },
      confirmProps: { color: "red" },
      onConfirm: handleFinalSubmit,
    });
  };

  return (
    <>
      <Container fluid>
        <Card
          shadow="sm"
          style={{
            marginBottom: 10,
            backgroundColor: "orangered",
            position: "sticky",
            top: 0,
            zIndex: 100,
            width: "100%",
            left: 0,
            right: 0,
          }}
        >
          <Flex justify="space-between" align="center" style={{ color: "white" }}>
            {
              //@ts-ignore
              ExamDetails.map((item: any, index: number) => (
                <Grid key={item.exam_level + item.session_name}>
                  <Grid.Col span={{ base: 12, md: 12, lg: 12 }}>
                    <Text size="lg">
                      Shiksha App Online Exam [{item.exam_level} - {item.session_name}]
                    </Text>
                  </Grid.Col>
                  <Grid.Col span={{ base: 12, md: 12, lg: 12 }}>
                    <Text size="sm">
                      {remainingTime > 0 ? (
                        <>
                          Remaining Time:{" "}
                          <Badge variant="filled" color="gray">
                            {formatTime(remainingTime)} min left
                          </Badge>
                        </>
                      ) : (
                        <Badge variant="filled" color="red">
                          Time Over
                        </Badge>
                      )}
                    </Text>
                  </Grid.Col>
                </Grid>
              ))
            }
          </Flex>
        </Card>

        <Card shadow="sm" padding="lg" style={{ marginBottom: 10 }}>
          {questions.map((question:any, index:any) => (
            <Paper 
              key={index} 
              shadow="xs" 
              p="md" 
              mb="lg" 
              withBorder
              ref={(el) => (questionRefs.current[index] = el)}
              id={`question-${index}`}
            >
              <Text size="lg" mb="md">
                {index + 1}. {question.question_english}<br />
                ({question.question_hindi})
              </Text>
              
              <Box mb="md">
                {question.options.map((option:any, optionIndex:any) => (
                  <Radio
                    key={optionIndex}
                    value={option}
                    label={option}
                    checked={selectedOptions[index] === option}
                    onChange={() => handleOptionChange(index, option)}
                    style={{ marginBottom: 10 }}
                    disabled={isTestSubmitted}
                  />
                ))}
              </Box>
              
              <Button
                color={question.selected_answer ? "purple" : "teal"}
                onClick={() => handleQuestionSubmit(index)}
                disabled={!selectedOptions[index] || isTestSubmitted || submittingQuestions[index]}
                loading={submittingQuestions[index]}
                mb="md"
              >
                {question.selected_answer ? "Update" : "Submit"}
              </Button>
              
              {index < questions.length - 1 && <Divider my="sm" />}
            </Paper>
          ))}
          
          <Grid mt="lg">
            <Grid.Col span={{ base: 12, md: 12, lg: 12 }}>
              <Grid mt="lg">
                <Grid.Col span={{ base: 12, md: 12, lg: 12 }}>
                    <Badge 
                    size="lg" 
                    variant="outline"
                  >
                    Total Questions: {questions.length} 
                  </Badge>
                </Grid.Col>
                <Grid.Col span={{ base: 12, md: 12, lg: 12 }}>
                      <Badge 
                      size="lg" 
                      variant="outline"
                    >
                      Answered: {Object.keys(selectedOptions).length} 
                    </Badge>
                </Grid.Col>
                <Grid.Col span={{ base: 12, md: 12, lg: 12 }}>
                  <Badge 
                    size="lg" 
                    variant="outline"
                  >
                    Submitted: {Object.keys(submittedQuestions).length}
                  </Badge>
                </Grid.Col>
              </Grid>
            </Grid.Col>
            <Grid.Col style={{textAlign:"center"}} span={{ base: 12, md: 12, lg: 12 }}>
              <Button 
                size="lg"
                color="green" 
                onClick={confirmFinalSubmit} 
                disabled={isTestSubmitted}
              >
                Final Submit Exam
              </Button>
            </Grid.Col>
          </Grid>
        </Card>
      </Container>
    </>
  );
};

export default StartExam;