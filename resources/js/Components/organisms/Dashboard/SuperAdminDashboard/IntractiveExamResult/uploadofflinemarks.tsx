import React, { useState, useEffect } from 'react';
import { Container, Card, Group, Button, Text, Breadcrumbs, Anchor, Notification, Progress, List, Select } from '@mantine/core';
import { IconUpload, IconCheck, IconX, IconDownload } from '@tabler/icons-react';
import { router, usePage } from '@inertiajs/react';
import useUserStore from '@/Store/User.store';

interface Examination {
  id: number;
  exam_session_name: string;
  exam_level: string;
}

interface ShikshaLevel {
  id: number;
  exam_level: string;
  is_active: string;
}

type FlashInfo = {
  uploaded?: number;
  failed?: number;
  failed_login_ids?: string[];
};

const UploadOfflineMarksComponent = () => {
  const [file, setFile] = useState<File | null>(null);
  const [selectedExam, setSelectedExam] = useState<string | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [notificationColor, setNotificationColor] = useState('teal');
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [errors, setErrors] = useState<string[]>([]);
  const { name: UserName, login_id: LoginID, roles: roleName } = useUserStore();
  const [filteredExams, setFilteredExams] = useState<Examination[]>([]);

  // Get props from the page
  const page = usePage<{
    examList: Examination[];
    levelList: ShikshaLevel[];
    flash?: { success?: string; error?: string; info?: FlashInfo };
    errors?: { error?: string[] | string };
  }>();
  const { examList, levelList, flash, errors: serverErrors } = page.props;

  useEffect(() => {
    const errorMessage = serverErrors?.error;
    const errorList = Array.isArray(errorMessage) ? errorMessage : errorMessage ? [errorMessage] : [];
    if (errorList.length > 0) {
      setErrors(errorList);
      setNotificationMessage('Some rows were skipped due to validation. Please check the details below.');
      setNotificationColor('red');
      setShowNotification(true);
      return;
    }

    if (flash?.success) {
      setErrors([]);
      setNotificationMessage(flash.success);
      setNotificationColor('teal');
      setShowNotification(true);
      return;
    }

    if (flash?.error) {
      setErrors([]);
      setNotificationMessage(flash.error);
      setNotificationColor('red');
      setShowNotification(true);
    }
  }, [flash?.success, flash?.error, serverErrors?.error]);

  // Reset file when dropdown selections change
  useEffect(() => {
    if (file) {
      setFile(null);
      resetFileInput();
    }
  }, [selectedExam, selectedLevel]);

  // Filter exams based on selected shiksha level
  useEffect(() => {
    if (selectedLevel) {
      const filtered = examList
        .filter((exam) => String(exam.exam_level) === String(selectedLevel))
        .sort((a, b) => Number(b.id) - Number(a.id));
      setFilteredExams(filtered);

      // Clear selected exam if it's not in the filtered list
      if (selectedExam && !filtered.some((exam) => exam.id.toString() === selectedExam)) {
        setSelectedExam(null);
      }
    } else {
      setFilteredExams([]);
      setSelectedExam(null);
    }
  }, [selectedLevel, examList]);

  const resetFileInput = () => {
    const fileInput = document.getElementById('file-input') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const selectedFile = event.target.files[0];
      if (
        selectedFile.type === 'application/vnd.ms-excel' ||
        selectedFile.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      ) {
        setFile(selectedFile);
        setShowNotification(false);
        setErrors([]);
      } else {
        setNotificationMessage('Please upload only Excel files (.xls or .xlsx)');
        setNotificationColor('red');
        setShowNotification(true);
        setFile(null);
        resetFileInput();
      }
    }
  };

  const handleExamChange = (value: string | null) => {
    setSelectedExam(value);
    if (file) {
      setFile(null);
      resetFileInput();
      setErrors([]);
    }
  };

  const handleLevelChange = (value: string | null) => {
    setSelectedLevel(value);
    if (file) {
      setFile(null);
      resetFileInput();
      setErrors([]);
    }
  };

  const resetForm = () => {
    setFile(null);
    setSelectedExam(null);
    setSelectedLevel(null);
    setUploading(false);
    setUploadProgress(0);
    setErrors([]);
    setShowNotification(false);
    resetFileInput();
  };

  const handleUpload = () => {
    if (!file) {
      setNotificationMessage('Please select a file first');
      setNotificationColor('red');
      setShowNotification(true);
      return;
    }

    if (!selectedExam) {
      setNotificationMessage('Please select an examination');
      setNotificationColor('red');
      setShowNotification(true);
      return;
    }

    if (!selectedLevel) {
      setNotificationMessage('Please select a Shiksha level');
      setNotificationColor('red');
      setShowNotification(true);
      return;
    }

    setUploading(true);
    setUploadProgress(0);
    setErrors([]);
    setShowNotification(false);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('examination_id', selectedExam);
    formData.append('shiksha_level_id', selectedLevel);

    router.post('/Action/uploadofflinemarks', formData, {
      onProgress: (progress) => {
        //@ts-ignore
        setUploadProgress(Math.round((progress.loaded * 100) / progress.total));
      },
      onSuccess: () => {
        setUploading(false);
        // Notification + errors are driven by flash + server validation after redirect.
      },
      onError: (errors: any) => {
        const errorMessage = errors?.error || 'Error uploading exam results';
        const errorList = Array.isArray(errorMessage) ? errorMessage : [errorMessage];

        // Check if errors contain Shiksha Level or Exam ID mismatch
        const hasMismatchError = errorList.some((error) => error.includes('Shiksha Level ID in file') || error.includes('Exam ID in file'));

        if (hasMismatchError) {
          setNotificationMessage('The selected Shiksha Level or Examination does not match with the file content. Please check the details below.');
        } else {
          setNotificationMessage('Error uploading exam results. Please check the details below.');
        }

        setErrors(errorList);
        setNotificationColor('red');
        setShowNotification(true);
        setUploading(false);
      },
      preserveScroll: true,
    });
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = '/Result/SampleOfflineResult.xlsx';
    link.setAttribute('download', 'SampleOfflineResult.xlsx');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Container fluid py={20}>
      <Breadcrumbs>
        <Anchor href={`/${roleName[0]}/dashboard`}>Dashboard</Anchor>
        <label>Upload Offline Exam Results</label>
      </Breadcrumbs>

      <Card py={30} mt={20} shadow="sm" padding="lg" radius="md" withBorder style={{ position: 'relative', paddingBottom: '60px' }}>
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

        {(flash?.info?.uploaded !== undefined || flash?.info?.failed !== undefined) && (
          <Card mt="md" padding="sm" radius="md" withBorder>
            <Group justify="space-between">
              <Text size="sm">
                Uploaded: <b>{flash?.info?.uploaded ?? 0}</b>
              </Text>
              <Text size="sm" c={flash?.info?.failed ? 'red' : undefined}>
                Failed: <b>{flash?.info?.failed ?? 0}</b>
              </Text>
            </Group>
            {(flash?.info?.failed_login_ids?.length ?? 0) > 0 && (
              <Text size="sm" mt="xs">
                Not uploaded Login IDs: <b>{flash?.info?.failed_login_ids?.join(', ')}</b>
              </Text>
            )}
          </Card>
        )}

        {errors.length > 0 && (
          <Card mt="md" padding="sm" radius="md" withBorder color="red">
            <Text size="sm" mb="xs">
              Errors:
            </Text>
            <List size="sm" spacing="xs" type="ordered">
              {errors.map((error, index) => (
                <List.Item key={index} color="red">
                  {error}
                </List.Item>
              ))}
            </List>
          </Card>
        )}

        <Group grow mt="md">
          <Select
            label="Shiksha Level"
            placeholder="Select Shiksha Level"
            data={
              levelList?.map((level) => ({
                value: level.id.toString(),
                label: level.exam_level,
              })) || []
            }
            value={selectedLevel}
            onChange={handleLevelChange}
            required
            clearable
          />
          <Select
            label="Select Session"
            placeholder="Select Session"
            data={
              filteredExams.map((exam) => ({
                value: exam.id.toString(),
                label: exam.exam_session_name,
              })) || []
            }
            value={selectedExam}
            onChange={handleExamChange}
            required
            clearable
            disabled={!selectedLevel}
          />
        </Group>

        <Group justify="center" mt="xl">
          <input id="file-input" type="file" accept=".xls,.xlsx" onChange={handleFileChange} style={{ display: 'none' }} />
          <Button
            onClick={() => document.getElementById('file-input')?.click()}
            leftSection={<IconUpload size={20} />}
            variant="outline"
            disabled={uploading || !selectedExam || !selectedLevel}
          >
            Select Excel File
          </Button>
          <Button onClick={handleUpload} color="teal" loading={uploading} disabled={!file || !selectedExam || !selectedLevel || uploading}>
            {uploading ? 'Uploading...' : 'Upload Result'}
          </Button>
        </Group>

        {file && (
          <Text mt="md" size="sm" c="dimmed" ta="center">
            Selected file: {file.name}
          </Text>
        )}

        {uploading && <Progress value={uploadProgress} mt="md" size="xl" radius="xl" color="teal" striped animated />}
        <div style={{ position: 'absolute', bottom: '20px', right: '20px' }}>
          <Button onClick={handleDownload} leftSection={<IconDownload size={20} />} variant="outline" color="blue">
            Download Sample Format
          </Button>
        </div>
      </Card>
    </Container>
  );
};

export default UploadOfflineMarksComponent;
