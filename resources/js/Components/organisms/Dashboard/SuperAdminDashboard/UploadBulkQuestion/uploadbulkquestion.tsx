import React, { useState } from 'react';
import { Container, Card, Group, Button, Text, Breadcrumbs, Anchor, Notification, Progress, List } from '@mantine/core';
import { IconUpload, IconCheck, IconX, IconDownload } from '@tabler/icons-react';
import { router } from '@inertiajs/react';
import useUserStore from '@/Store/User.store';

const UploadBulkQuestionComponent = () => {
  const [file, setFile] = useState<File | null>(null);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [notificationColor, setNotificationColor] = useState('teal');
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [errors, setErrors] = useState<string[]>([]);
  const { name: UserName, login_id: LoginID, roles: roleName } = useUserStore();

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
      }
    }
  };

  const handleUpload = () => {
    if (!file) {
      setNotificationMessage('Please select a file first');
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

    router.post('/Action/bulkquestionupload', formData, {
      onProgress: (progress) => {
        //@ts-ignore
        setUploadProgress(Math.round((progress.loaded * 100) / progress.total));
      },
      onSuccess: () => {
        // The redirect will happen automatically through Inertia
        setUploading(false);
      },
      onError: (errors: any) => {
        const errorMessage = errors?.error || 'Error uploading questions';
        const errorList = Array.isArray(errorMessage) ? errorMessage : [errorMessage];
        setErrors(errorList);
        setNotificationMessage('Error uploading questions. Please check the details below.');
        setNotificationColor('red');
        setShowNotification(true);
        setUploading(false);
      },
      preserveScroll: true,
    });
  };
  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = '/BulkQuestionBank/BulkQuestionBank.xlsx';
    link.setAttribute('download', 'BulkQuestionBank.xlsx');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  return (
    <Container fluid py={20}>
      <Breadcrumbs>
        <Anchor href={`/${roleName[0]}/dashboard`}>Dashboard</Anchor>
        <Anchor href="/Action/questionbank">Question Bank</Anchor>
        <label>Upload Questions</label>
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

        {errors.length > 0 && (
          <Card mt="md" padding="sm" radius="md" withBorder color="red">
            <Text size="sm" mb="xs">
              Validation Errors:
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

        <Group justify="center" mt="xl">
          <input id="file-input" type="file" accept=".xls,.xlsx" onChange={handleFileChange} style={{ display: 'none' }} />
          <Button
            onClick={() => document.getElementById('file-input')?.click()}
            leftSection={<IconUpload size={20} />}
            variant="outline"
            disabled={uploading}
          >
            Select Excel File
          </Button>
          <Button onClick={handleUpload} color="teal" loading={uploading} disabled={!file || uploading}>
            {uploading ? 'Uploading...' : 'Upload Questions'}
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

export default UploadBulkQuestionComponent;
