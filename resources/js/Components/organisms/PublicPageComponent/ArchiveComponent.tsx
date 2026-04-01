import React from 'react';
import { Box, Button, Table, Title, Card, Grid, Container } from '@mantine/core';
import { router, usePage } from '@inertiajs/react';
import { Announcement } from '../Dashboard/SuperAdminDashboard/Announcement/Announcement.types';
import CryptoJS from 'crypto-js';

function Archive() {
  const { oldAnnouncements } = usePage<{ oldAnnouncements: Announcement[] }>().props;

  const secretKey = 'your-secret-key'; // Use a strong key
  // Function to encrypt the ID
  const encryptId = (id: number) => {
    return CryptoJS.AES.encrypt(id.toString(), secretKey).toString();
  };

  // Function to decrypt the ID
  const decryptId = (encryptedId: string | CryptoJS.lib.CipherParams) => {
    const bytes = CryptoJS.AES.decrypt(encryptedId, secretKey);
    return bytes.toString(CryptoJS.enc.Utf8);
  };

  const handleView = (id: number) => {
    const encryptedId = encryptId(id); // Encrypt the ID before sending
    router.get(`/latest-announcement/${encryptedId}`);
  };

  return (
  <Box className='w-full'>
      <Title mb="md" order={3}>Archived Announcements</Title>
        <Table
        verticalSpacing="sm"
        className='table-container table-responsive'
          striped
          highlightOnHover
          withColumnBorders
          style={{
            border: '2px solid #ddd',
            width: '100%', // Ensure the table takes full width
          }}
        >
          <thead>
            <tr style={{ backgroundColor: '#f1f1f1' }}>
              <th style={{ padding: '10px', borderRight: '1px solid #ddd', textAlign:'left' }}>Title</th>
              <th style={{ padding: '10px', width: '25%',textAlign:'left'  }}>Published Date</th>
              <th style={{ padding: '10px', width: '25%' ,textAlign:'left' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {oldAnnouncements.map((announcement, index) => (
              <tr key={index} style={{ borderBottom: '1px solid #ddd' }}>
                <td style={{ padding: '10px', borderRight: '1px solid #ddd' }}>{announcement.title}</td>
                <td style={{ padding: '10px', borderRight: '1px solid #ddd' }}>{new Date(announcement.created_at).toLocaleDateString()}</td>
                <td style={{ padding: '10px' }}>
                  <Button variant="outline" color="blue" size="xs" onClick={() => handleView(announcement.id)}>
                    View
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>

  </Box>
  );
}

export default Archive;
