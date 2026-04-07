import { Button, Group, Modal, Table, Text } from "@mantine/core";
import { useState, useMemo, useEffect } from "react";
import DataTable from "../MantineReactTable/DataTable";
import { IconRecycle } from "@tabler/icons-react";
import { router } from "@inertiajs/react";

type QuestionBank = {
    question_id: string;
    question_english: string;
    question_hindi: string;
    subject: string;
    level: string;
    subject_id: number;
    level_id: number;
    difficulty_label: string;
    option1: string;
    option2: string;
    option3: string;
    option4: string;
    correctanswer: string;
    any_remark: string;
    is_active: string;
    exam_id?: string; // Adding exam_id to the type
    id:string;
};

interface ViewQuestionModalProps {
    QuestionBank: QuestionBank[]; 
    ExamName: string;
    ExamId: string; // Add ExamId prop
    onQuestionRemoved?: (questionId: string) => void;
}

export default function ViewQuestionModal({ QuestionBank, ExamName, ExamId,onQuestionRemoved  }: ViewQuestionModalProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [QuestionToDelete, setQuestionToDelete] = useState<QuestionBank | null>(null);
    const [openedDeleteModal, setOpenedDeleteModal] = useState(false);
    const [notificationMessage, setNotificationMessage] = useState('');
    const [notificationColor, setNotificationColor] = useState<'teal' | 'red'>('teal');
    const [showNotification, setShowNotification] = useState(false);
    const [validationError, setValidationError] = useState<string>('');
    const [localQuestionBank, setLocalQuestionBank] = useState<QuestionBank[]>([]);

    useEffect(() => {
        setLocalQuestionBank(QuestionBank);
    }, [QuestionBank]);

    const handleOpenModal = () => setIsModalOpen(true);
    const handleCloseModal = () => setIsModalOpen(false);

    const validateDeleteParams = (questionId: string | number, examId: string | number): boolean => {
      setValidationError('');
      
      // Convert to string if number and check if valid
      const questionIdStr = String(questionId);
      const examIdStr = String(examId);

      // Check if question_id is valid
      if (!questionIdStr || questionIdStr === 'undefined' || questionIdStr === 'null') {
          setValidationError('Question ID is required');
          setNotificationMessage('Invalid Question ID');
          setNotificationColor('red');
          setShowNotification(true);
          return false;
      }

      // Check if exam_id is valid
      if (!examIdStr || examIdStr === 'undefined' || examIdStr === 'null') {
          setValidationError('Exam ID is required');
          setNotificationMessage('Invalid Exam ID');
          setNotificationColor('red');
          setShowNotification(true);
          return false;
      }

      return true;
    };

    const openDeleteModal = (question: QuestionBank) => {
        setQuestionToDelete(question);
        setOpenedDeleteModal(true);
        setValidationError('');
    };

    const handleDelete = () => {
      if (QuestionToDelete) {
          const questionKey = String(QuestionToDelete.question_id || QuestionToDelete.id || '');
          if (!validateDeleteParams(questionKey, ExamId)) {
              return;
          }

          const queryParams = new URLSearchParams({
              exam_id: String(ExamId),  // Add relevant query parameters
              question_id: questionKey
          }).toString();
          try {
              router.delete(`/Action/remove-questions-from-exams/${questionKey}?${queryParams}`, {
                  onSuccess: () => {
                    setLocalQuestionBank(prevQuestions => 
                        prevQuestions.filter(q => String(q.question_id || q.id) !== questionKey)
                    );
                      setNotificationMessage('Question successfully removed from exam!');
                      setNotificationColor('teal');
                      setShowNotification(true);
                      setOpenedDeleteModal(false);
                      
                      if (onQuestionRemoved) {
                        onQuestionRemoved(questionKey);
                    }
                  },
                  onError: (errors) => {
                      setNotificationMessage('Failed to remove question from exam');
                      setNotificationColor('red');
                      setShowNotification(true);
                      setValidationError(errors.message || 'An error occurred');
                  }
              });
          } catch (error) {
              setNotificationMessage('An error occurred while processing your request');
              setNotificationColor('red');
              setShowNotification(true);
              setValidationError('Failed to process delete request');
          }
      }
  };

    const PAGE_SIZE = 10;
    //@ts-ignore 
    const columns = useMemo<MRT_ColumnDef<QuestionBank>[]>(
        () => [
            { accessorKey: 'question_english', header: 'Question (English)' },
            { accessorKey: 'question_hindi', header: 'Question (Hindi)' },
            { accessorKey: 'option1', header: 'Option 1' },
            { accessorKey: 'option2', header: 'Option 2' },
            { accessorKey: 'option3', header: 'Option 3' },
            { accessorKey: 'option4', header: 'Option 4' },
            {
                accessorKey: 'actions',
                header: 'Actions',
                size: 250,
                accessorFn: undefined,
                //@ts-ignore
                Cell: ({ row }) => (
                    <Group align="center">
                        <a
                            href="#"
                            onClick={() => openDeleteModal(row.original)}
                            style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'red', textDecoration: 'none' }}
                        >
                            <IconRecycle size={20} /> Delete
                        </a>
                    </Group>
                ),
            },
        ],
        [currentPage]
    );

    return (
        <>
            <Button size="sm" onClick={handleOpenModal}>View Question List</Button>
            
            <Modal
                opened={isModalOpen}
                onClose={handleCloseModal}
                title={`Question List for ${ExamName}`}
                size="xxl"
            >
                <DataTable 
                    data={localQuestionBank}
                    columnsFields={columns}
                    PageSize={PAGE_SIZE}
                />
            </Modal>

            <Modal opened={openedDeleteModal} onClose={() => setOpenedDeleteModal(false)} title="Confirm Delete">
                <Text>Are you sure you want to remove this question?</Text>
                {validationError && (
                    <Text color="red" size="sm" mt="xs">
                        {validationError}
                    </Text>
                )}
                <Group mt="md">
                    <Button onClick={() => setOpenedDeleteModal(false)}>Cancel</Button>
                    <Button color="red" onClick={handleDelete}>
                        Delete
                    </Button>
                </Group>
            </Modal>
        </>
    );
}