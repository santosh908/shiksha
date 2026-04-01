import { useState, useEffect, useMemo } from 'react';
import { router, usePage } from '@inertiajs/react';
import { Container, Grid, Card, Text, Group, Button, Select, Notification, Checkbox, Modal, Stack, Breadcrumbs, Anchor, Table } from '@mantine/core';
import AddQuestionDataTable from '@/Components/molecules/MantineReactTable/AddQuestionDataTable';
import ViewQuestionModal from '@/Components/molecules/PopupModal/viewQuestionModal';
import { QuestionBank, shikshaLevel, Subject, Chapter, ExamList } from './question.types';
import useUserStore from '@/Store/User.store';

export default function AddQuestionComponent() {
  const [filteredQuestions, setFilteredQuestions] = useState<QuestionBank[]>([]);
  const [selectedExamLevel, setSelectedExamLevel] = useState<string | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [selectedExam, setSelectedExam] = useState<string | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(null);
  const [showNotification, setShowNotification] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedExamQuestions, setSelectedExamQuestions] = useState<QuestionBank[]>([]);
  const [TotalQuestions, setTotalQuestions] = useState<Number | null>(null);
  const [selectedExamName, setSelectedExamName] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { name: UserName, login_id: LoginID, roles: roleName } = useUserStore();
  const [filteredSubjects, setFilteredSubjects] = useState<Subject[]>([]);
  const [filteredChapters, setFilteredChapters] = useState<Chapter[]>([]);
  const [selectedChapter, setSelectedChapter] = useState<string | null>(null);

  const { QuestionBankList, subjectList, shikshalevel, examList, chapterList } = usePage<{
    QuestionBankList: QuestionBank[];
    subjectList: Subject[];
    shikshalevel: shikshaLevel[];
    examList: ExamList[];
    chapterList: Chapter[];
  }>().props;

  const validQuestionBankList = Array.isArray(QuestionBankList) ? QuestionBankList : [];

  useEffect(() => {
    setFilteredQuestions(validQuestionBankList);
  }, [validQuestionBankList]);

  const handleSearchQuestions = (examId: string) => {
    if (examId == null) {
      setErrorMessage('Please choose question  for correct shiksha level');
      setShowNotification(true);
      setSelectedExamQuestions([]);
      setTotalQuestions(null);
      setSelectedExam(null);
      setSelectedExamLevel(null);
      setShowNotification(false);
    } else {
      const selectedExam = examList.find((exam) => exam.id.toString() === examId);
      if (selectedExam) {
        setSelectedExamQuestions(selectedExam.questions);
        setTotalQuestions(selectedExam.no_of_question);
        setSelectedExamName(selectedExam.exam_name);
        setSelectedExam(examId);
        setSelectedExamLevel(selectedExam.ShikshaLevel?.toString() || null);
      }
    }

    try {
      router.post('/Action/filter-questions', {
        exam_level: selectedExamLevel,
        subject_level: selectedSubject,
        chapter_level: selectedChapter,
        difficulty_level: selectedDifficulty,
        exam_id: examId,
      });
    } catch (error) {
      console.error('Error fetching questions:', error);
    }
  };

  const handleReset = () => {
    setSelectedExamLevel(null);
    setSelectedSubject(null);
    setSelectedChapter(null); // Add this
    setSelectedDifficulty(null);
    setFilteredQuestions([]);
    setShowNotification(false);
    setSelectedExamQuestions([]);
  };

  const handleAddToExam = (selectedRows: QuestionBank[], examId: string) => {
    // Check if questions are selected
    const questionIds = selectedRows.map((row) => row.id);
    if (questionIds.length === 0) {
      alert('No questions selected');
      return;
    }
    // If all validations pass, proceed with the API call
    router.post(
      '/Action/add-questions-to-exams',
      {
        questionIds: questionIds,
        examId: selectedExam,
      },
      {
        onSuccess: (response) => {
         handleSearchQuestions(examId);
          alert('Questions successfully added to the exam!');
        },
        onError: () => {
          alert('Error adding questions to exam');
        },
      }
    );
  };

  const PAGE_SIZE = 1000;
  //@ts-ignore
  const columns = useMemo<MRT_ColumnDef<validExaminationList>[]>(
    () => [
      { accessorKey: 'exam_level', header: 'Exam Level' },
      { accessorKey: 'subject_name', header: 'Subject' },
      { accessorKey: 'chapter_name', header: 'Chapter' },
      { accessorKey: 'difficulty_label', header: 'Difficulty Level' },
      { accessorKey: 'question_english', header: 'Question (English)' },
      { accessorKey: 'question_hindi', header: 'Question (Hindi)' },
      { accessorKey: 'option1', header: 'Option 1' },
      { accessorKey: 'option2', header: 'Option 2' },
      { accessorKey: 'option3', header: 'Option 3' },
      { accessorKey: 'option4', header: 'Option 4' },
    ],
    [currentPage]
  );

  useEffect(() => {
    if (selectedExamLevel) {
      // Filter subjects based on shiksha_level_id matching the selected exam level
      const filtered = subjectList.filter((subject) => subject.shiksha_level_id === selectedExamLevel);
      setFilteredSubjects(filtered);
    } else {
      setFilteredSubjects([]);
    }
    setSelectedSubject(null);
  }, [selectedExamLevel, subjectList]);

  useEffect(() => {
    if (selectedSubject) {
      const filtered = chapterList.filter((chapter) => chapter.subject_id.toString() === selectedSubject);
      setFilteredChapters(filtered);
    } else {
      setFilteredChapters([]);
    }
    setSelectedChapter(null);
  }, [selectedSubject, chapterList]);

  const handleQuestionRemoved = (questionId: string) => {
    setSelectedExamQuestions(prevQuestions => 
      prevQuestions.filter(q => q.id !== questionId)
    );
    if (TotalQuestions !== null) {
      setTotalQuestions(Number(TotalQuestions) - 1);
    }
  };

  return (
    <Container fluid py={20}>
      <Breadcrumbs>
        <Anchor href={`/${roleName[0]}/dashboard`}>Dashboard</Anchor>
        <label>Add Question to Exam</label>
      </Breadcrumbs>

      <Card mt={25} shadow="sm" padding="lg" radius="md" withBorder>
        <Grid>
          <Grid.Col py={25} span={{ base: 12, md: 6, lg: 3 }}>
            <Select
              label="Select Exam"
              placeholder="Choose Exam"
              data={(examList || []).map((level) => ({
                value: level.id.toString(),
                label: level.exam_name || 'Unknown Exam', // Provide a default value
              }))}
              //@ts-ignore
              onChange={(value) => handleSearchQuestions(value)}
              clearable
            />
          </Grid.Col>
          <Grid.Col mt={20} span={{ base: 12, md: 6, lg: 6}}>
            {selectedExamQuestions?.length > 0 && selectedExam && (
              <>
                <h3 className="box-shadow">
                  Total Questions: <b>{TotalQuestions?.toString()} </b>&nbsp; Added Question: {selectedExamQuestions.length}
                </h3>
                <ViewQuestionModal
                  QuestionBank={selectedExamQuestions}
                  ExamId={selectedExam}
                  ExamName={selectedExamName?.toString() == null ? '' : selectedExamName?.toString()}
                  onQuestionRemoved={handleQuestionRemoved}
                />
              </>
            )}
          </Grid.Col>
        </Grid>
        <Grid mb="lg">
          <Grid.Col span={{ base: 12, md: 6, lg: 3 }}>
            <Select
              label="Select Siksha Level"
              placeholder="Choose Exam Level"
              data={(shikshalevel || []).map((level) => ({
                value: level.id.toString(),
                label: level.exam_level,
              }))}
              value={selectedExamLevel} // ✅ Must be a string or null
              onChange={(value) => {
                setSelectedExamLevel(value);
                // This will trigger useEffect to filter subjects
              }}
              clearable
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 6, lg: 3 }}>
            <Select
              label="Select Subject"
              placeholder="Select Subject"
              data={(filteredSubjects || []).map((subject) => ({
                value: subject.id.toString(),
                label: subject.subject_name,
              }))}
              value={selectedSubject}
              onChange={(value) => {
                setSelectedSubject(value);
                // This will trigger the useEffect to filter chapters
              }}
              clearable
              disabled={!selectedExamLevel}
            />
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 6, lg: 3 }}>
            <Select
              label="Select Chapter"
              placeholder="Select Chapter"
              data={(filteredChapters || []).map((chapter) => ({
                value: chapter.id.toString(),
                label: chapter.chapter_name,
              }))}
              value={selectedChapter}
              onChange={setSelectedChapter}
              clearable
              disabled={!selectedSubject}
            />
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 6, lg: 3 }}>
            <Select
              label="Difficulty Level"
              placeholder="Select difficulty"
              data={['Normal', 'Moderate', 'Difficult']}
              value={selectedDifficulty}
              onChange={setSelectedDifficulty}
              clearable
            />
          </Grid.Col>

          <Grid.Col span={12}>
            <Group>
              <Button
                //@ts-ignore
                onClick={() => handleSearchQuestions(selectedExam)}
              >
                Filter Questions
              </Button>
              <Button onClick={handleReset} variant="outline" color="gray">
                Reset
              </Button>
            </Group>
          </Grid.Col>
        </Grid>

        {showNotification && (
          <Notification title="No Questions Found" color="red" onClose={() => setShowNotification(false)}>
            {errorMessage}
          </Notification>
        )}
      </Card>

      <Grid mt={30}>
        <Grid.Col span={12}>
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Text size="lg">Question Bank List</Text>
            <AddQuestionDataTable
              data={filteredQuestions}
              columnsFields={columns}
              PageSize={PAGE_SIZE}
              onAddToExam={handleAddToExam}
              //@ts-ignore
              selectedExam={selectedExam}
            />
          </Card>
        </Grid.Col>
      </Grid>
    </Container>
  );
}
