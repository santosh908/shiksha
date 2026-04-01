import { useForm } from '@mantine/form';
import React, { useEffect, useState, useMemo } from 'react';
import { router, usePage } from '@inertiajs/react';
import { IconEdit, IconEye, IconRecycle, IconCheck, IconX, IconPlus } from '@tabler/icons-react';
import DataTable from '@/Components/molecules/MantineReactTable/DataTable';
import { QuestionBank } from '@/Components/organisms/Dashboard/SuperAdminDashboard/AddQuestion/question.types';
import {
  Container,
  Grid,
  TextInput,
  Breadcrumbs,
  Title,
  Anchor,
  Card,
  Text,
  Group,
  Button,
  Radio,
  Notification,
  Modal,
  Box,
  Select,
  CardSection,
  Flex,
} from '@mantine/core';
import ViewQuestionModal from '@/Components/molecules/PopupModal/viewQuestionModal';
import useUserStore from '@/Store/User.store';


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
  questions: QuestionBank[];
  examination_code: number;
};

type shikshaLevel = {
  id: string;
  exam_level: string;
};

type ExamSession = {
  id: string;
  session_name: string;
};

export default function Examination() {
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [notificationColor, setNotificationColor] = useState('teal');
  const [isEditing, setIsEditing] = useState(false);
  const [currentExamination, setCurrentExamination] = useState<Examination | null>(null);
  const [viewedExamination, setViewedExamination] = useState<Examination | null>(null);
  const [addQuestionModalOpen, setAddQuestionModalOpen] = useState(false);
  const [selectedExamination, setSelectedExamination] = useState<Examination | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const { name: UserName, login_id: LoginID, roles: roleName } = useUserStore();
  const [filteredExamLevelIds, setFilteredExamLevelIds] = useState<string[]>([]);
  const [debugInfo, setDebugInfo] = useState({});

  const items = [{ title: 'Dashboard', href: `/${roleName[0]}/dashboard` }].map((item, index) => (
    <Anchor href={item.href} key={index}>
      {item.title}
    </Anchor>
  ));

  const form = useForm({
    initialValues: {
      id: '',
      exam_session_id: '',
      exam_level_id: '',
      remarks: '',
      date: '',
      start_time: '',
      duration: '',
      no_of_question: '',
      total_marks: '',
      qualifying_marks: '',
      is_active: 'Y',
    },
  });

  const questionForm = useForm({
    initialValues: {
      subject_level: '',
      difficulty_level: '',
      question_text: '',
    },
  });

  const {
    Examination = [],
    shikshalevel = [],
    ExamSession = [],
  } = usePage<{
    Examination: Examination[];
    shikshalevel: shikshaLevel[];
    ExamSession: ExamSession[];
  }>().props;

  // Debug logging
  // useEffect(() => {
  //   const debug = {
  //     ExamSessionCount: ExamSession?.length || 0,
  //     shikshalevelCount: shikshalevel?.length || 0,
  //     ExaminationCount: Examination?.length || 0,
  //     filteredExamLevelIdsCount: filteredExamLevelIds?.length || 0,
  //     formValues: form.values,
  //   };
  //   setDebugInfo(debug);
  // }, [ExamSession, shikshalevel, Examination, filteredExamLevelIds, form.values]);

  // IMPROVED: Ensure edit includes own level in Select options
useEffect(() => {
  if (!currentExamination) return;

  form.setValues({
    id: currentExamination.id,
    exam_session_id: currentExamination.exam_session_id?.toString() || '',
    exam_level_id: currentExamination.exam_level_id?.toString() || '',
    remarks: currentExamination.remarks || '',
    date: currentExamination.date || '',
    start_time: currentExamination.start_time?.substring(0, 5) || '',
    duration: currentExamination.duration?.toString() || '',
    no_of_question: currentExamination.no_of_question?.toString() || '',
    total_marks: currentExamination.total_marks?.toString() || '',
    qualifying_marks: currentExamination.qualifying_marks?.toString() || '',
    is_active: currentExamination.is_active === 'N' ? 'N' : 'Y',
  });

  const sessionId = Number(currentExamination.exam_session_id);
  const examsInSession = Examination.filter(
    (exam) => exam.exam_session_id === sessionId
  );

  const existingExamLevelIds = examsInSession.map(
    (exam) => exam.exam_level_id
  );

  const availableLevels = shikshalevel
    .filter((level) => {
      const levelId = Number(level.id);
      return (
        levelId &&
        (!existingExamLevelIds.includes(levelId) ||
          levelId === Number(currentExamination.exam_level_id))
      );
    })
    .map((level) => level.id);

  setFilteredExamLevelIds(availableLevels as string[]);
}, [currentExamination]); // ✅ ONLY THIS


  const { errors } = usePage().props;
  useEffect(() => {
    if (Object.values(errors).length) {
      form.setErrors(errors);
    }
  }, [errors]);

  const handleSubmit = () => {
    const resetAllStates = () => {
      setNotificationMessage('');
      setNotificationColor('');
      setShowNotification(false);
      setIsEditing(false);
      setCurrentExamination(null);
      setFilteredExamLevelIds([]);
      form.reset(); // Reset all form fields
    };

    const values = {
      ...form.values,
      duration: Number(form.values.duration) || 0, // Ensure it's a number
      no_of_question: Number(form.values.no_of_question) || 0,
      total_marks: Number(form.values.total_marks) || 0,
      qualifying_marks: Number(form.values.qualifying_marks) || 0,
      start_time: form.values.start_time,
      is_active: form.values.is_active, // No conversion needed here
    };

    if (isEditing && currentExamination) {
      router.put(`/Action/examination/${currentExamination.id}`, values, {
        onSuccess: () => {
          setNotificationMessage('Examination updated successfully!');
          setNotificationColor('teal');
          setShowNotification(true);
          resetAllStates();
        },
      });
    } else {
      router.post('/Action/examination', values, {
        onSuccess: () => {
          setNotificationMessage('Examination created successfully!');
          setNotificationColor('teal');
          setShowNotification(true);
          resetAllStates();
        },
      });
    }
  };

  const handleAddQuestion = () => {
    const values = {
      ...questionForm.values,
      exam_id: selectedExamination?.id,
    };
    setAddQuestionModalOpen(false);
    questionForm.reset();
  };

  const openAddQuestionModal = (examination: Examination) => {
    setSelectedExamination(examination);
    setAddQuestionModalOpen(true);
  };

  const handleEdit = (examination: Examination) => {
    setIsEditing(true);
    setCurrentExamination(examination);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleView = (examination: Examination) => {
    setViewedExamination(examination);
  };

  const handleExamSessionChange = (selectedSessionId: string | null) => {
    form.setFieldValue('exam_session_id', selectedSessionId || '');
    form.setFieldValue('exam_level_id', '');

    if (!selectedSessionId) {
      setFilteredExamLevelIds([]);
      return;
    }
    const sessionId = Number(selectedSessionId);
    if (!Examination || Examination.length === 0) {
      const allLevelIds = shikshalevel.map(level => level.id).filter(Boolean);
      setFilteredExamLevelIds(allLevelIds as string[]);
      return;
    }
    const examsInSession = Examination.filter(exam => exam.exam_session_id === sessionId);

    if (examsInSession.length === 0) {
      const allLevelIds = shikshalevel.map(level => level.id).filter(Boolean);
      setFilteredExamLevelIds(allLevelIds as string[]);
    } else {
      const existingExamLevelIds = examsInSession.map(exam => exam.exam_level_id);

      const availableLevels = shikshalevel
        .filter(level => {
          const levelId = level.id ? Number(level.id) : null;
          return levelId && !existingExamLevelIds.includes(levelId);
        })
        .map(level => level.id);

      setFilteredExamLevelIds(availableLevels as string[]);
    }
  };

  const PAGE_SIZE = 10;

  const columns = useMemo(
    () => [
      { accessorKey: 'exam_id', header: 'Exam Code' },
      { accessorKey: 'session_name', header: 'Exam Session Name' },
      { accessorKey: 'exam_level', header: 'Examination Level' },
      { accessorKey: 'date', header: 'Date' },
      { accessorKey: 'start_time', header: 'Start Time' },
      { accessorKey: 'duration', header: 'Duration' },
      { accessorKey: 'no_of_question', header: 'No_Of_Questions' },
      { accessorKey: 'total_marks', header: 'total_marks' },
      { accessorKey: 'qualifying_marks', header: 'qualifying_marks' },
      { accessorKey: 'is_active', header: 'Status' },
      {
        accessorKey: 'actions',
        header: 'Actions',
        size: 250,
        accessorFn: (examination: Examination) => (
          <Flex justify="space-between" align="center" gap="xs">
            <Button color="blue" size="sm" onClick={() => handleEdit(examination)}>
              <IconEdit size={20} /> Edit
            </Button>
            <ViewQuestionModal
              QuestionBank={examination.questions}
              ExamName={examination.session_name + ' (' + examination.exam_level + ')'}
              ExamId={examination.exam_id.toString()}
            />
            <Button color="green" size="xs" onClick={() => router.get(`/Action/addquestion/`)}>
              <IconPlus size={20} /> Add Question
            </Button>
          </Flex>
        ),
      },
    ],
    [currentPage]
  );

  return (
    <Container fluid py={20}>
      <Breadcrumbs>
        {items}
        <label>Examination</label>
      </Breadcrumbs>

      <Card py={30} mt={20} shadow="sm" padding="lg" radius="md" withBorder>
        {showNotification && (
          <Notification
            icon={notificationColor === 'teal' ? <IconCheck size={18} /> : <IconX size={18} />}
            color={notificationColor}
            title={notificationColor === 'teal' ? 'Success' : 'Error'}
            onClose={() => setShowNotification(false)}
          >
            {notificationMessage}
          </Notification>
        )}

        <Modal opened={!!viewedExamination} onClose={() => setViewedExamination(null)} title="Examination Details">
          {viewedExamination && (
            <Box>
              <Text>
                <strong>Examination Name:</strong> {viewedExamination.exam_level}
              </Text>
              <Text>
                <strong>Remarks:</strong> {viewedExamination.remarks}
              </Text>
              <Text>
                <strong>Date:</strong> {viewedExamination.date}
              </Text>
              <Text>
                <strong>Start Time:</strong> {viewedExamination.start_time}
              </Text>
              <Text>
                <strong>Duration:</strong> {viewedExamination.duration} minutes
              </Text>
              <Text>
                <strong>No_Of_Questions:</strong> {viewedExamination.no_of_question}
              </Text>
              <Text>
                <strong>Status:</strong> {viewedExamination.is_active === 'Y' ? 'Active' : 'Inactive'}
              </Text>
            </Box>
          )}
        </Modal>

        {/* Modal for Adding a Question */}
        <Modal
          opened={addQuestionModalOpen}
          onClose={() => setAddQuestionModalOpen(false)}
          title={<Title order={3}>Add Question for {selectedExamination?.exam_level}</Title>}
          size="lg"
        >
          <Text>
            <strong>Examination Level:</strong> {selectedExamination?.exam_level}
          </Text>
          <Grid mt="md">
            <Grid.Col span={6}>
              <Select
                label="Subject Level"
                placeholder="Select subject"
                data={['sanskriti', 'Bhakti', 'Math']}
                {...questionForm.getInputProps('subject_level')}
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <Select
                label="Difficulty Level"
                placeholder="Select difficulty"
                data={['Normal', 'Moderate', 'Difficult']}
                {...questionForm.getInputProps('difficulty_level')}
              />
            </Grid.Col>
            <Grid.Col span={12}>
              <TextInput label="Question Text" placeholder="Enter the question" {...questionForm.getInputProps('question_text')} />
            </Grid.Col>
          </Grid>
          <Group mt="md">
            <Button onClick={handleAddQuestion}>Add Question</Button>
            <Button variant="outline" color="gray" onClick={() => questionForm.reset()}>
              Reset
            </Button>
          </Group>
        </Modal>

        <Grid>
          <Grid.Col span={{ base: 12, md: 6, lg: 3 }}>
            <Select
              label="Select Exam Session"
              placeholder="Select Exam Session"
              value={form.values.exam_session_id}
              data={(ExamSession || []).map((session) => ({
                value: session.id?.toString() || '',
                label: session.session_name || '',
              }))}
              onChange={handleExamSessionChange}
              clearable
            />
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 6, lg: 3 }}>
            <Select
              label="Shiksha Level"
              placeholder="Choose Exam Level"
              value={form.values.exam_level_id}
              data={
                filteredExamLevelIds.length === 0
                  ? [{ value: '', label: 'Select Exam Session first' }]
                  : shikshalevel
                      ?.filter((level) => filteredExamLevelIds.includes(level.id))
                      .map((level) => ({
                        value: level.id?.toString() || '',
                        label: level.exam_level || '',
                      }))
              }
              {...form.getInputProps('exam_level_id')}
              clearable
              disabled={!form.values.exam_session_id || filteredExamLevelIds.length === 0}
            />
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 6, lg: 3 }}>
            <TextInput label="Exam Date:" type="date" autoComplete="off" {...form.getInputProps('date')} />
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 6, lg: 3 }}>
            <TextInput label="Exam Start Time:" type="time" autoComplete="off" {...form.getInputProps('start_time')} />
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 6, lg: 3 }}>
            <TextInput
              label="Exam Duration (in minutes):"
              inputMode="numeric"
              min={1}
              maxLength={3}
              autoComplete="off"
              {...form.getInputProps('duration')}
            />
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 6, lg: 3 }}>
            <TextInput
              label="No Of Questions:"
              inputMode="numeric"
              min={1}
              maxLength={3}
              autoComplete="off"
              {...form.getInputProps('no_of_question')}
            />
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 6, lg: 3 }}>
            <TextInput
              label="Total Marks:"
              inputMode="numeric"
              min={1}
              maxLength={3}
              autoComplete="off"
              {...form.getInputProps('total_marks')}
            />
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 6, lg: 3 }}>
            <TextInput
              label="Qualifying Marks:"
              inputMode="numeric"
              min={1}
              maxLength={3}
              autoComplete="off"
              {...form.getInputProps('qualifying_marks')}
            />
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 6, lg: 3 }}>
            <TextInput label="Remarks:" autoComplete="off" {...form.getInputProps('remarks')} />
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 6, lg: 3 }}>
            <label style={{ fontWeight: 'bold' }}>Examination Status</label>
<Radio.Group
  value={form.values.is_active}
  onChange={(value) => form.setFieldValue('is_active', value)}
>
  <Group mt="xs">
    <Radio value="Y" label="Active" />
    <Radio value="N" label="Inactive" />
  </Group>
</Radio.Group>
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 6, lg: 12 }}>
            <Group>
              <Button onClick={handleSubmit}>{isEditing ? 'Update Examination' : 'Add Examination'}</Button>
              <Button
                onClick={() => {
                  form.reset();
                  form.setFieldValue('is_active', 'Y');
                  setIsEditing(false);
                  setCurrentExamination(null);
                  setFilteredExamLevelIds([]);
                }}
                variant="outline"
                color="gray"
              >
                Reset
              </Button>
            </Group>
          </Grid.Col>
        </Grid>

        <Grid mt={30}>
          <Grid.Col span={{ base: 12, md: 12, lg: 12 }}>
            <Card shadow="sm" padding="lg" radius="md" withBorder>
              <CardSection>
                <Box>
                  <DataTable data={Examination} columnsFields={columns} PageSize={PAGE_SIZE} />
                </Box>
              </CardSection>
            </Card>
          </Grid.Col>
        </Grid>
      </Card>
    </Container>
  );
}
