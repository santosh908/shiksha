import React, { useState, useEffect } from "react";
import questionsData from "./Questions.json";
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
} from "@mantine/core";
import { usePage } from "@inertiajs/react";
import { PageProps } from "@/types";

interface Question {
  question: string;
  options: string[];
}

interface QuestionList  {
  id: number;
  question_english: string;
  question_hindi: string;
  option1:string;
  option2:string;
  option3:string;
  option4:string;
}

interface QuestionsData {
  questions: Question[];
}

const StartExam: React.FC = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [selectedOptions, setSelectedOptions] = useState<Record<number, string>>({});
  const [answeredQuestions, setAnsweredQuestions] = useState<number[]>([]);
  const [remainingTime, setRemainingTime] = useState<number>(60);
  const [isTestSubmitted, setIsTestSubmitted] = useState<boolean>(false);

  const questions = (questionsData as QuestionsData).questions;
  const currentQuestion = questions[currentQuestionIndex];
  const { QuestionList } = usePage<{ QuestionList: QuestionList[] }>().props;
  const handleOptionChange = (option: string) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [currentQuestionIndex]: option,
    }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const handleFinalSubmit = () => {
    setIsTestSubmitted(true);
  };

  const handleQuestionClick = (index: number) => {
    setCurrentQuestionIndex(index);
  };

  return (
    <>
    <Container fluid>
      <Card shadow="sm"  style={{ marginBottom: 10, backgroundColor: "orangered" }}>
        <Flex justify="space-between" align="center" style={{ color: "white" }}>
          <Text size="lg">
            Online Screening Test
          </Text>
          <Text size="sm">
            Remaining Time:{" "}
            <Badge variant="filled" color="gray">
              {Math.floor(remainingTime / 60)}:{remainingTime % 60 < 10 ? `0${remainingTime % 60}` : remainingTime % 60}{" "}
              min left
            </Badge>
          </Text>
        </Flex>
      </Card>

      <Grid>
        <Grid.Col span={{ base: 12, md: 6, lg: 8 }}>
           <Card shadow="sm" padding="lg" style={{ marginBottom: 10 }}>
           <Box py={25} ml={25}>
              <Text size="lg"  mb="md">
                {currentQuestionIndex + 1}. {currentQuestion.question}
              </Text>
              <Box>
                {currentQuestion.options.map((option, index) => (
                  <Radio
                    key={index}
                    value={option}
                    label={option}
                    checked={selectedOptions[currentQuestionIndex] === option}
                    onChange={() => handleOptionChange(option)}
                    style={{ marginBottom: 10 }}
                  />
                ))}
              </Box>
              <Box mt="lg">
                 <Grid.Col span={{base:12, md:6, lg:12}} >
                 <Button
                 m={10}
                    color="red"
                    onClick={handlePrevious}
                    disabled={currentQuestionIndex === 0 || isTestSubmitted}
                  >
                    Previous
                  </Button>
                  <Button
                    m={10}
                    color="blue"
                    onClick={handleNext}
                    disabled={currentQuestionIndex === questions.length - 1 || isTestSubmitted}
                  >
                    Next
                  </Button>
                   <Button  
                    m={10}
                   color="green" onClick={handleFinalSubmit} disabled={isTestSubmitted}>
                    Final Submit
                  </Button>
                 </Grid.Col>
              </Box>
            </Box>
           </Card>
        </Grid.Col>
       <Grid.Col span={{ base: 12, md: 6, lg: 4 }}>
            <Card shadow="sm" padding="lg" style={{ marginBottom: 10 , height: "100vh" }}>
              <Text size="md" mb="sm">
                Total Questions: {questions.length}
              </Text>
              {/* <ScrollArea style={{ height: "80%" }}> */}
                  <Grid>
                    {questions.map((_, index) => {
                      let backgroundColor = "gray"; 

                      if (selectedOptions[index]) {
                        backgroundColor = "green"; 
                      } else if (index < currentQuestionIndex) {
                        backgroundColor = "red"; 
                      }

                      return (
                        <Grid.Col  span={{ base: 3, md: 3, lg: 3 }} key={index}>
                      
                        <Box
                            style={{
                              width: "50px",
                              backgroundColor,
                              color: "white",
                              textAlign: "center",
                              padding: "10px",
                              borderRadius: "5px",
                              cursor: "pointer",
                            }}
                            onClick={() => handleQuestionClick(index)}
                          >
                            {index + 1}
                          </Box>
                        </Grid.Col>
                      );
                    })}
                  </Grid>
                {/* </ScrollArea> */}
            </Card>
        </Grid.Col>
      </Grid>
    </Container>
    </>
  );
};

export default StartExam;
