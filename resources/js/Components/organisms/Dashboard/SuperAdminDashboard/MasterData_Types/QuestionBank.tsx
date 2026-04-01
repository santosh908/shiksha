import { useForm } from '@mantine/form';
import React, { useEffect, useState, useMemo } from 'react';
import { router, usePage } from '@inertiajs/react';
import { IconEdit, IconEye, IconRecycle, IconCheck, IconX, IconUpload } from '@tabler/icons-react';
import DataTable from '@/Components/molecules/MantineReactTable/DataTable';
import { QuestionBank, shikshaLevel, Subject, Chapter } from './QuestionBank.types';
import {
  Container,
  Grid,
  TextInput,
  Breadcrumbs,
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
} from '@mantine/core';

export default function QuestionBankComponent() {
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [notificationColor, setNotificationColor] = useState('teal');
  const [isEditing, setIsEditing] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState<QuestionBank | null>(null);
  const [viewedQuestion, setViewedQuestion] = useState<QuestionBank | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredSubjects, setFilteredSubjects] = useState<Subject[]>([]);
  const [filteredChapters, setFilteredChapters] = useState<Chapter[]>([]);

  const items = [{ title: 'Dashboard', href: '/SuperAdmin/dashboard' }].map((item, index) => (
    <Anchor href={item.href} key={index}>
      {item.title}
    </Anchor>
  ));

  const form = useForm({
    initialValues: {
      id: '',
      question_english: '',
      question_hindi: '',
      subject_id: null,
      level_id: null,
      difficulty_label: null,
      chapter_id: null,
      option1: '',
      option2: '',
      option3: '',
      option4: '',
      correctanswer: null,
      any_remark: '',
      is_active: '', // Default value
    },
  });

  const resetDropdowns = () => {
    form.setFieldValue('subject_id', null);
    form.setFieldValue('level_id', null);
    form.setFieldValue('difficulty_label', null);
    form.setFieldValue('correctanswer', null);
    form.setFieldValue('chapter_id', null);
  };

  useEffect(() => {
    if (currentQuestion) {
      form.setValues({
        id: currentQuestion.id,
        question_english: currentQuestion.question_english,
        question_hindi: currentQuestion.question_hindi,
        //@ts-ignore
        subject_id: currentQuestion.subject_id.toString(),
        //@ts-ignore
        chapter_id: currentQuestion.chapter_id?.toString(),
        //@ts-ignore
        level_id: currentQuestion.level_id.toString(),
        //@ts-ignore
        difficulty_label: currentQuestion.difficulty_label,
        option1: currentQuestion.option1,
        option2: currentQuestion.option2,
        option3: currentQuestion.option3,
        option4: currentQuestion.option4,
        //@ts-ignore
        correctanswer: currentQuestion.correctanswer,
        any_remark: currentQuestion.any_remark,
        is_active: currentQuestion.is_active,
      });
    }
  }, [currentQuestion]);

  const { errors } = usePage().props;
  useEffect(() => {
    if (Object.values(errors).length) {
      form.setErrors(errors);
    }
  }, [errors]);

  const handleSubmit = () => {
    if (isEditing && currentQuestion) {
      router.put(`/Action/questionbank/${currentQuestion.id}`, form.values, {
        onSuccess: () => {
          setNotificationMessage('Question updated successfully!');
          setNotificationColor('teal');
          setShowNotification(true);
          setIsEditing(false);
          setCurrentQuestion(null);
          form.reset();
          resetDropdowns();
        },
      });
    } else {
      router.post('/Action/questionbank', form.values, {
        onSuccess: () => {
          setNotificationMessage('Question created successfully!');
          setNotificationColor('teal');
          setShowNotification(true);
          form.reset();
          resetDropdowns();
        },
      });
    }
  };

  const handleEdit = (question: QuestionBank) => {
    setIsEditing(true);
    setCurrentQuestion(question);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleView = (question: QuestionBank) => {
    setViewedQuestion(question);
  };

  const handleBulkUploadNavigation = () => {
    router.get('/Action/bulkquestionupload');
  };

  const { QuestionBank, subjectList, shikshalevel, chapterList } = usePage<{
    QuestionBank: { QuestionBankList: { QuestionBankList: QuestionBank[] } };
    subjectList: Subject[];
    shikshalevel: shikshaLevel[];
    chapterList: Chapter[];
  }>().props;
  const QuestionBankList = QuestionBank.QuestionBankList.QuestionBankList;
  const PAGE_SIZE = 10;
  // Filter subjects when level changes
  useEffect(() => {
    if (form.values.level_id) {
      const filtered = subjectList.filter((subject) => subject.shiksha_level_id === form.values.level_id);
      setFilteredSubjects(filtered);

      if (!filtered.find((subject) => subject.id.toString() === form.values.subject_id)) {
        form.setFieldValue('subject_id', null);
        form.setFieldValue('chapter_id', null); // Clear chapter when subject is cleared
      }
    } else {
      setFilteredSubjects([]);
      form.setFieldValue('subject_id', null);
      form.setFieldValue('chapter_id', null); // Clear chapter when level is cleared
    }
  }, [form.values.level_id, subjectList]);

  // Filter chapters based on selected subject
  useEffect(() => {
    if (form.values.subject_id) {
      const filtered = chapterList.filter((chapter) => chapter.subject_id.toString() === form.values.subject_id);
      setFilteredChapters(filtered);

      if (!filtered.find((chapter) => chapter.id.toString() === form.values.chapter_id)) {
        form.setFieldValue('chapter_id', null);
      }
    } else {
      setFilteredChapters([]);
      form.setFieldValue('chapter_id', null);
    }
  }, [form.values.subject_id, chapterList]);

  //@ts-ignore
  const columns = useMemo<MRT_ColumnDef<QuestionBank>[]>(
    () => [
      { accessorKey: 'exam_level', header: 'Shiksha Level' },
      { accessorKey: 'subject_name', header: 'Scripture/Book' },
      { accessorKey: 'chapter_name', header: 'Chapter/Section' },
      { accessorKey: 'question_english', header: 'Question (English)' },
      { accessorKey: 'question_hindi', header: 'Question (Hindi)' },
      { accessorKey: 'difficulty_label', header: 'Difficulty Label' },
      { accessorKey: 'option1', header: 'Option 1' },
      { accessorKey: 'option2', header: 'Option 2' },
      { accessorKey: 'option3', header: 'Option 3' },
      { accessorKey: 'option4', header: 'Option 4' },
      { accessorKey: 'correctanswer', header: 'Correct Answer' },
      { accessorKey: 'any_remark', header: 'Any Remark' },
      { accessorKey: 'is_active', header: 'Status' },
      {
        accessorKey: 'actions',
        header: 'Actions',
        size: 200,
        accessorFn: (question: QuestionBank) => (
          <Group>
            <Button color="blue" size="xs" onClick={() => handleEdit(question)}>
              <IconEdit size={20} /> Edit
            </Button>
            <Button color="gray" size="xs" onClick={() => handleView(question)}>
              <IconEye size={20} /> View
            </Button>
          </Group>
        ),
      },
    ],
    [currentPage]
  );

  return (
    <Container fluid py={20}>
      <Breadcrumbs>
        {items}
        <label>Question Bank</label>
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

        <Modal opened={!!viewedQuestion} onClose={() => setViewedQuestion(null)} title="Question Details">
          {viewedQuestion && (
            <Box>
              <Text>
                <strong>Question (English):</strong> {viewedQuestion.question_english}
              </Text>
              <Text>
                <strong>Question (Hindi):</strong> {viewedQuestion.question_hindi}
              </Text>
              <Text>
                <strong>Subject:</strong> {viewedQuestion.subject}
              </Text>
              <Text>
                <strong>Level:</strong> {viewedQuestion.level}
              </Text>
              <Text>
                <strong>Difficulty Label:</strong> {viewedQuestion.difficulty_label}
              </Text>
              <Text>
                <strong>Option 1:</strong> {viewedQuestion.option1}
              </Text>
              <Text>
                <strong>Option 2:</strong> {viewedQuestion.option2}
              </Text>
              <Text>
                <strong>Option 3:</strong> {viewedQuestion.option3}
              </Text>
              <Text>
                <strong>Option 4:</strong> {viewedQuestion.option4}
              </Text>
              <Text>
                <strong>Correct Answer:</strong> {viewedQuestion.correctanswer}
              </Text>
              <Text>
                <strong>Any Remark:</strong> {viewedQuestion.any_remark}
              </Text>
              <Text>
                <strong>Status:</strong> {viewedQuestion.is_active}
              </Text>
            </Box>
          )}
        </Modal>

        <Grid>
          <Grid.Col span={{ base: 12, md: 6, lg: 6 }}>
            <TextInput label="Question (English)" autoComplete="off" {...form.getInputProps('question_english')} />
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 6, lg: 6 }}>
            <TextInput label="Question (Hindi)" autoComplete="off" {...form.getInputProps('question_hindi')} />
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 6, lg: 3 }}>
            <TextInput label="Option 1" autoComplete="off" {...form.getInputProps('option1')} />
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 6, lg: 3 }}>
            <TextInput label="Option 2" autoComplete="off" {...form.getInputProps('option2')} />
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 6, lg: 3 }}>
            <TextInput label="Option 3" autoComplete="off" {...form.getInputProps('option3')} />
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 6, lg: 3 }}>
            <TextInput label="Option 4" autoComplete="off" {...form.getInputProps('option4')} />
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 6, lg: 3 }}>
            <Select
              label="Examination Level"
              placeholder="Choose Exam Level"
              data={(shikshalevel || []).map((level) => ({
                value: level.id.toString(),
                label: level.exam_level,
              }))}
              {...form.getInputProps('level_id')}
              clearable
              onChange={(value) => {
                //@ts-ignore
                form.setFieldValue('level_id', value);
                form.setFieldValue('subject_id', null);
                form.setFieldValue('chapter_id', null); // Clear chapter when level changes
              }}
            />
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 6, lg: 3 }}>
            <Select
              label="Choose Scripture/Book"
              placeholder={form.values.level_id ? 'Choose Your Scripture/Book' : 'Select Level First'}
              data={filteredSubjects.map((subject) => ({
                value: subject.id.toString(),
                label: subject.subject_name,
              }))}
              disabled={!form.values.level_id}
              clearable
              {...form.getInputProps('subject_id')}
              onChange={(value) => {
                //@ts-ignore
                form.setFieldValue('subject_id', value);
                form.setFieldValue('chapter_id', null); // Clear chapter when subject changes
              }}
            />
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 6, lg: 3 }}>
            <Select
              label="Choose Chapter/Section"
              placeholder={form.values.subject_id ? 'Choose Your Chapter/Section' : 'Select Subject First'}
              data={filteredChapters.map((chapter) => ({
                value: chapter.id.toString(),
                label: chapter.chapter_name,
              }))}
              disabled={!form.values.subject_id}
              clearable
              {...form.getInputProps('chapter_id')} // Fixed: was using subject_id instead of chapter_id
            />
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 6, lg: 3 }}>
            <Select
              label="Difficulty Level"
              placeholder="Choose Difficulty Level"
              data={['Normal', 'Moderate', 'Difficult']}
              {...form.getInputProps('difficulty_label')}
              clearable
            />
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 6, lg: 3 }}>
            <Select
              label="Choose Correct Answer"
              placeholder="Choose Your answer"
              data={['option1', 'option2', 'option3', 'option4']}
              {...form.getInputProps('correctanswer')}
              clearable
            />
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 6, lg: 6 }}>
            <TextInput label="Any Remark" autoComplete="off" {...form.getInputProps('any_remark')} />
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 6, lg: 3 }}>
            <label style={{ fontWeight: 'bold' }}>Active Status</label>
            <Radio.Group {...form.getInputProps('is_active')}>
              <div style={{ display: 'flex', gap: '10px' }}>
                <Radio value="Y" label="Active" />
                <Radio value="N" label="Inactive" />
              </div>
            </Radio.Group>
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 6, lg: 12 }}>
            <Group justify="center" mt="md">
              <Button type="button" onClick={handleSubmit} color="green">
                {isEditing ? 'Update' : 'Add Question'}
              </Button>
              <Button type="button" onClick={() => form.reset()} color="green">
                Reset
              </Button>
            </Group>
          </Grid.Col>
        </Grid>
        <Group justify="flex-end" mb="md">
          <Button color="blue" leftSection={<IconUpload size={14} />} onClick={handleBulkUploadNavigation}>
            Upload Bulk Questions
          </Button>
        </Group>

        <Grid py={20} mt={30} mb={10}>
          <Grid.Col span={12}>
            <Card shadow="sm" padding="lg" radius="md" withBorder>
              <CardSection>
                <Box>
                  <DataTable data={QuestionBankList} columnsFields={columns} PageSize={PAGE_SIZE} />
                </Box>
              </CardSection>
            </Card>
          </Grid.Col>
        </Grid>
      </Card>
    </Container>
  );
}
