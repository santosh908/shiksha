import React, { useEffect, useRef } from 'react';
import { Modal, Button, Text, Group, Grid, Divider, Badge, Card, ThemeIcon, Avatar, Paper, Stack, Box } from '@mantine/core';
import { jsPDF } from 'jspdf';
import { IconDownload, IconUser, IconPray, IconMapPin, IconSchool, IconBook, IconHeartHandshake } from '@tabler/icons-react';

interface DevoteeDetailsModalProps {
  opened: boolean;
  onClose: () => void;
  devotee: any; // Using any for flexibility to match the backend response
  examDetails?: any;
}

const DevoteeDetailsModal: React.FC<DevoteeDetailsModalProps> = ({ opened, onClose, devotee, examDetails }) => {
  const contentRef = useRef<HTMLDivElement>(null);


  if (!devotee) return null;

  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    try {
        return new Date(dateString).toLocaleDateString('en-GB', {
            day: '2-digit', month: 'short', year: 'numeric'
        });
    } catch (e) { return dateString; }
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(22);
    doc.setTextColor(255, 107, 0); // ISKCON Orangeish
    doc.text('ISKCON Devotee Profile', 105, 15, { align: 'center' });
    
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 105, 22, { align: 'center' });
    
    let yPos = 35;
    const lineHeight = 7;
    const leftCol = 14;
    const rightCol = 110;

    const addSectionTitle = (title: string) => {
        if (yPos > 270) { doc.addPage(); yPos = 20; }
        doc.setFontSize(14);
        doc.setTextColor(0);
        doc.setFont('helvetica', 'bold');
        doc.text(title, 14, yPos);
        doc.setDrawColor(200);
        doc.line(14, yPos + 2, 196, yPos + 2);
        yPos += 10;
    };

    const addField = (label: string, value: string, x: number) => {
        if (yPos > 280) { doc.addPage(); yPos = 20; }
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.text(`${label}:`, x, yPos);
        doc.setFont('helvetica', 'normal');
        doc.text(`${value || 'N/A'}`, x + 40, yPos);
    };

    const addFullWidthField = (label: string, value: string) => {
        if (yPos > 270) { doc.addPage(); yPos = 20; }
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.text(`${label}:`, leftCol, yPos);
        
        doc.setFont('helvetica', 'normal');
        const splitText = doc.splitTextToSize(value || 'None', 130);
        doc.text(splitText, leftCol + 40, yPos);
        yPos += (lineHeight * splitText.length) + 2;
    };

    // --- Personal Information ---
    addSectionTitle('Personal Information');
    addField('Name', devotee.name, leftCol);
    addField('Initiated Name', devotee.Initiated_name, rightCol);
    yPos += lineHeight;

    addField('Login ID', devotee.login_id, leftCol);
    addField('DOB', formatDate(devotee.dob), rightCol);
    yPos += lineHeight;

    addField('Contact', devotee.contact_number, leftCol);
    addField('Email', devotee.email, rightCol);
    yPos += lineHeight;

    addField('Devotee Type', devotee.devotee_type, leftCol);
    addField('Approved', devotee.account_approved === 'A' ? 'Yes' : 'No', rightCol);
    yPos += lineHeight;

    addField('Marital Status', devotee.merital_status_name, leftCol);
    addField('Applied Before', devotee.have_you_applied_before === 'Y' ? 'Yes' : 'No', rightCol);
    yPos += lineHeight;

    addField('Education', devotee.eduction_name, leftCol);
    yPos += lineHeight;

    addField('Profession', devotee.profession_name, leftCol);
    yPos += lineHeight;
    
    addField('Submitted On', devotee.SubmitedDate, leftCol);
    yPos += lineHeight * 1.5;

    // --- Spiritual Information ---
    addSectionTitle('Spiritual Profile');

    addField('Ashray Leader', devotee.ashray_leader_initiated_name || devotee.ashery_leader_name, leftCol);
    addField('Bhakti Vriksha', devotee.bhakti_leader_initiated_name || devotee.bhakti_bhikshuk_name, rightCol);
    yPos += lineHeight * 1.5;

    addField('Spiritual Master', devotee.spiritual_master, leftCol);
    yPos += lineHeight;
    addField('Aspiring Master', devotee.spiritual_master_you_aspiring, leftCol);
    yPos += lineHeight * 1.5;

    addField('Rounds / Day', devotee.how_many_rounds_you_chant, leftCol);
    addField('Started Chanting', formatDate(devotee.when_are_you_chantin), rightCol);
    yPos += lineHeight;

    addField('Joined Ashray', formatDate(devotee.since_when_you_attending_ashray_classes), leftCol);
    addField('Hearing Time', devotee.spend_everyday_hearing_lectures , rightCol);
    yPos += lineHeight;

    addField('Bhakti Shastri', devotee.bakti_shastri_degree, leftCol);
    yPos += lineHeight * 1.5;

    // --- Address & Principles ---
    addSectionTitle('Address & Practices');
    
    // Address
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('Address:', leftCol, yPos);
    const address = [devotee.current_address, devotee.Sector_Area, devotee.Socity_Name, devotee.district_name, devotee.state_name, devotee.pincode].filter(Boolean).join(', ');
    const splitAddress = doc.splitTextToSize(address, 130);
    doc.setFont('helvetica', 'normal');
    doc.text(splitAddress, leftCol + 40, yPos);
    yPos += (lineHeight * splitAddress.length) + 5;

    // Principles
    addFullWidthField('Principles', devotee.principle_names);
    yPos += 5;

    // --- Additional Info ---
    addSectionTitle('Additional Information');
    addFullWidthField('Books Read', devotee.book_names);
    addFullWidthField('Seminars', devotee.seminar_names);
    addFullWidthField('Prayers', devotee.prayer_names);
    yPos += 5;

    // --- Exam History ---
    if (examDetails) {
        addSectionTitle('Exam History');

        // Simple table header
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.text('Level', 14, yPos);
        doc.text('Marks', 80, yPos);
        doc.text('Status', 120, yPos);
        doc.text('Date', 160, yPos);
        yPos += 7;

        const processedLevels = new Set();
        
        // Handle Level 6 & 7 Combined (GAP)
        const l6Total = examDetails[`level_6_total_marks`];
        const l7Total = examDetails[`level_7_total_marks`];
        
        if (l6Total || l7Total) { // If we have data for either
            const l6Obtained = parseFloat(examDetails[`level_6_obtained_marks`] || '0');
            const l7Obtained = parseFloat(examDetails[`level_7_obtained_marks`] || '0');
            const combinedObtained = l6Obtained + l7Obtained;
            const isQualified = combinedObtained > 99;
            const status = isQualified ? 'Qualified' : 'Failed';
             
            // We need a date, let's pick the latest or just the 7th level date
            const date = examDetails[`level_7_exam_date`] || examDetails[`level_6_exam_date`];

            doc.setFont('helvetica', 'bold'); // Highlighted for GAP
            doc.text(`Gurupada Ashray & Assignment`, 14, yPos);
            doc.setFont('helvetica', 'normal');
            yPos += 5;
            
            doc.text(`GAP-Assignment: ${l6Obtained} / ${l6Total || 40}`, 14, yPos);
            yPos += 5;
            doc.text(`GAP Written: ${l7Obtained} / ${l7Total || 160}`, 14, yPos);
            yPos += 5;
            
             doc.setFont('helvetica', 'bold');
             doc.text(`Total: ${combinedObtained}`, 14, yPos);
             doc.setFont('helvetica', 'normal');
             doc.text(status, 120, yPos);
             doc.text(date || '-', 160, yPos);
             yPos += 10; // Extra spacing

             processedLevels.add('6');
             processedLevels.add('7');
        }

        Object.keys(examDetails).forEach((key) => {
             // Extract level number from key like 'level_1_total_marks'
             if(key.includes('_total_marks')) {
                 const levelNum = key.split('_')[1];
                 
                 if (processedLevels.has(levelNum)) return; // Skip if already handled

                 const total = examDetails[`level_${levelNum}_total_marks`];
                 const obtained = examDetails[`level_${levelNum}_obtained_marks`];
                 const qVal = examDetails[`level_${levelNum}_is_qualified`];
                 const qualified = qVal == '1' ? 'Passed' : (qVal == '0' ? 'Failed' : 'Pending');
                 const date = examDetails[`level_${levelNum}_exam_date`];

                  const levelName = examDetails[`level_${levelNum}_name`] || `Level ${levelNum}`;

                  if(total > 0) { // Only show levels with data
                     if (yPos > 280) { doc.addPage(); yPos = 20; }
                     doc.setFont('helvetica', 'normal');
                     doc.text(levelName, 14, yPos);
                     doc.text(`${obtained} / ${total}`, 80, yPos);
                     doc.text(qualified, 120, yPos);
                     doc.text(date || '-', 160, yPos);
                     yPos += 7;
                  }
             }
        });
    }

    doc.save(`${devotee.name}_profile.pdf`);
  };

  const InfoRow = ({ label, value }: { label: string, value: any }) => (
    <Group justify="space-between" mb={3} align="flex-start">
      <Text size="sm" c="dimmed" fw={500} style={{ minWidth: 120 }}>{label}</Text>
      <Text size="sm" fw={600} style={{ textAlign: 'right', maxWidth: '60%', wordBreak: 'break-word' }}>{value || '-'}</Text>
    </Group>
  );

  const SectionTitle = ({ icon: Icon, title, color }: any) => (
      <Group mb="md">
        <ThemeIcon size="lg" radius="md" variant="light" color={color}>
            <Icon size={20} />
        </ThemeIcon>
        <Text fw={700} size="lg">{title}</Text>
      </Group>
  );

  return (
    <Modal 
      opened={opened} 
      onClose={onClose} 
      title={<Text fw={700} size="lg">Devotee Profile</Text>} 
      size="90%" // Increased size for better layout
      styles={{
        header: { backgroundColor: '#f8f9fa' },
        body: { backgroundColor: '#f8f9fa' }
      }}
    >
      <div ref={contentRef}>
        {/* Header Section */}
        <Paper p="md" radius="md" withBorder mb="md" style={{ background: 'linear-gradient(45deg, #FF6B00 0%, #FF9E42 100%)', color: 'white' }}>
            <Group justify="space-between" align="center">
                <Group>
                    <Avatar size="lg" radius="xl" color="white" bg="rgba(0,0,0,0.2)">
                        {devotee.name?.charAt(0)}
                    </Avatar>
                    <div>
                        <Text size="xl" fw={900}>{devotee.name}</Text>
                        <Text size="sm" style={{ opacity: 0.9 }}>
                           Initiated: {devotee.Initiated_name || 'N/A'} • ID: {devotee.login_id}
                        </Text>
                        <Group gap="xs" mt={5}>
                            <Badge color="yellow" variant="light" bg="rgba(255,255,255,0.2)" c="white">
                                 {devotee.devotee_type}
                            </Badge>
                             <Badge color={devotee.account_approved === 'A' ? 'green' : 'red'} variant="light" bg="rgba(255,255,255,0.2)" c="white">
                                 {devotee.account_approved === 'A' ? 'Approved' : 'Pending'}
                            </Badge>
                        </Group>
                    </div>
                </Group>
                <Button 
                    variant="white" 
                    color="orange" 
                    leftSection={<IconDownload size={18} />} 
                    onClick={generatePDF}
                >
                    Download Profile
                </Button>
            </Group>
        </Paper>

        <Grid gutter="md">
            {/* Personal Info Column */}
            <Grid.Col span={{ base: 12, md: 4 }}>
                <Card shadow="sm" padding="lg" radius="md" withBorder h="100%">
                    <SectionTitle icon={IconUser} title="Personal Information" color="blue" />
                    <Stack gap="xs">
                        <InfoRow label="Login ID" value={devotee.login_id} />
                        <InfoRow label="Date of Birth" value={formatDate(devotee.dob)} />
                        <InfoRow label="Contact" value={devotee.contact_number} />
                        <InfoRow label="Email" value={devotee.email} />
                        <InfoRow label="Marital Status" value={devotee.merital_status_name} />
                        <InfoRow label="Education" value={devotee.eduction_name} />
                        <InfoRow label="Profession" value={devotee.profession_name} />
                        <InfoRow label="Applied Before" value={devotee.have_you_applied_before === 'Y' ? 'Yes' : 'No'} />
                        <Text size="xs" c="dimmed" mt="md" ta="center">Submitted on: {devotee.SubmitedDate}</Text>
                    </Stack>
                </Card>
            </Grid.Col>

            {/* Spiritual Info Column */}
            <Grid.Col span={{ base: 12, md: 4 }}>
                <Card shadow="sm" padding="lg" radius="md" withBorder h="100%">
                    <SectionTitle icon={IconPray} title="Spiritual Profile" color="grape" />
                    <Stack gap="xs">
                        <InfoRow label="Ashray Leader" value={devotee.ashray_leader_initiated_name || devotee.ashery_leader_name} />
                        <InfoRow label="Bhakti Vriksha" value={devotee.bhakti_leader_initiated_name || devotee.bhakti_bhikshuk_name} />
                        <Divider my="xs" label="Masters" labelPosition="center" />
                        <InfoRow label="Spiritual Master" value={devotee.spiritual_master} />
                        <InfoRow label="Aspiring Master" value={devotee.spiritual_master_you_aspiring} />
                        <Divider my="xs" label="Practice" labelPosition="center" />
                        <InfoRow label="Rounds / Day" value={devotee.how_many_rounds_you_chant} />
                        <InfoRow label="Started Chanting" value={formatDate(devotee.when_are_you_chantin)} />
                        <InfoRow label="Joined Ashray" value={formatDate(devotee.since_when_you_attending_ashray_classes)} />
                        <InfoRow label="Hearing Time" value={devotee.spend_everyday_hearing_lectures} />
                         <InfoRow label="Bhakti Shastri" value={devotee.bakti_shastri_degree} />
                    </Stack>
                </Card>
            </Grid.Col>
            
             {/* Address Column */}
            <Grid.Col span={{ base: 12, md: 4 }}>
                 <Stack gap="md" h="100%">
                    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ flex: 1 }}>
                        <SectionTitle icon={IconMapPin} title="Address" color="teal" />
                        <Stack gap={5}>
                             <Text fw={600}>{devotee.current_address}</Text>
                             <Text size="sm">{devotee.Socity_Name}, {devotee.Sector_Area}</Text>
                             <Text size="sm">{devotee.district_name}, {devotee.state_name} - {devotee.pincode}</Text>
                        </Stack>
                    </Card>

                    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ flex: 2 }}>
                         <SectionTitle icon={IconHeartHandshake} title="Principles" color="red" />
                         <Text size="sm" c="dimmed" lh={1.6}>
                            {devotee.principle_names ? devotee.principle_names.split(',').map((p: string) => `• ${p.trim()}`).join('\n') : 'No principles recorded'}
                         </Text>
                    </Card>
                 </Stack>
            </Grid.Col>

            {/* Additional Info (Books, Prayers, Seminars) */}
            <Grid.Col span={12}>
                <Card shadow="sm" padding="lg" radius="md" withBorder>
                    <Grid>
                        <Grid.Col span={{ base: 12, md: 4 }}>
                            <Group mb="xs">
                                <ThemeIcon size="md" radius="md" variant="light" color="indigo">
                                    <IconBook size={18} />
                                </ThemeIcon>
                                <Text fw={600}>Books Read</Text>
                            </Group>
                            <Text size="sm" c="dimmed" lh={1.4}>
                                {devotee.book_names || 'None'}
                            </Text>
                        </Grid.Col>
                        <Grid.Col span={{ base: 12, md: 4 }}>
                           <Group mb="xs">
                                <ThemeIcon size="md" radius="md" variant="light" color="cyan">
                                    <IconSchool size={18} />
                                </ThemeIcon>
                                <Text fw={600}>Seminars Attended</Text>
                            </Group>
                            <Text size="sm" c="dimmed" lh={1.4}>
                                {devotee.seminar_names || 'None'}
                            </Text>
                        </Grid.Col>
                        <Grid.Col span={{ base: 12, md: 4 }}>
                            <Group mb="xs">
                                <ThemeIcon size="md" radius="md" variant="light" color="pink">
                                    <IconPray size={18} />
                                </ThemeIcon>
                                <Text fw={600}>Prayers Memorized</Text>
                            </Group>
                            <Text size="sm" c="dimmed" lh={1.4}>
                                {devotee.prayer_names || 'None'}
                            </Text>
                        </Grid.Col>
                    </Grid>
                </Card>
            </Grid.Col>

            {/* Exam History */}
            {examDetails && (
                <Grid.Col span={12}>
                    <Text fw={700} size="lg" mb="sm" mt="md">Exam History</Text>
                    <Grid>
                      {[1,2,3,4,5,6,7].map(level => { // Include 7 explicitly
                          if (level === 7) return null; // We handle 7 with 6
                          
                          if (level === 6) {
                                // Combined Logic for 6 & 7
                                const l6Total = examDetails[`level_6_total_marks`];
                                const l7Total = examDetails[`level_7_total_marks`];
                                const l6Status = examDetails[`level_6_status`];
                                
                                // Render if marks exist OR if it is the Next level to attempt
                                if ((!l6Total && !l7Total) && l6Status !== 'Next') return null;

                                const l6Obtained = parseFloat(examDetails[`level_6_obtained_marks`] || '0');
                                const l7Obtained = parseFloat(examDetails[`level_7_obtained_marks`] || '0');
                                const combinedObtained = l6Obtained + l7Obtained;
                                
                                // Custom Qualification Rule: Total > 99
                                const isQualified = combinedObtained > 99;
                                const date = examDetails[`level_7_exam_date`] || examDetails[`level_6_exam_date`];
                                
                                const isNext = l6Status === 'Next';
                                const badgeColor = isNext ? 'yellow' : (isQualified ? 'green' : (combinedObtained > 0 ? 'red' : 'yellow')); 
                                const badgeText = isNext ? 'Pending' : (isQualified ? 'Qualified' : (combinedObtained > 0 ? 'Failed' : 'Pending'));
                                // Note: Simplified red/yellow logic slightly based on previous request "is_qualified=0 -> Failed"

                                return (
                                    <Grid.Col span={{ base: 12, sm: 6, md: 6 }} key="combined-6-7">
                                        <Paper withBorder p="sm" radius="md" style={{ 
                                            borderLeft: `5px solid ${isNext ? '#fab005' : (isQualified ? '#40c057' : '#fa5252')}` 
                                        }}>
                                            <Text size="sm" fw={700} mb={5}>Gurupada Ashray & Assignment (GAP)</Text>
                                            
                                            <Stack gap={2}>
                                                 <Group justify="space-between">
                                                    <Text size="xs" c="dimmed">Assignment-GPA</Text>
                                                    <Text size="xs" fw={500}>{l6Obtained} / {l6Total || 40}</Text>
                                                </Group>
                                                <Group justify="space-between">
                                                    <Text size="xs" c="dimmed">Written</Text>
                                                    <Text size="xs" fw={500}>{l7Obtained} / {l7Total || 160}</Text>
                                                </Group>
                                                <Divider my={4} />
                                                 <Group justify="space-between" align="center">
                                                    <Text size="sm" fw={700}>Total: {combinedObtained}</Text>
                                                    <Badge size="sm" color={badgeColor} variant="light">
                                                        {badgeText}
                                                    </Badge>
                                                </Group>
                                            </Stack>
                                            <Text size="xs" c="dimmed" mt={5} ta="right">Date: {date || 'N/A'}</Text>
                                        </Paper>
                                    </Grid.Col>
                                );
                          }

                          const total = examDetails[`level_${level}_total_marks`];
                          const obtained = examDetails[`level_${level}_obtained_marks`];
                          const qualified = examDetails[`level_${level}_is_qualified`];
                          const date = examDetails[`level_${level}_exam_date`];
                          const status = examDetails[`level_${level}_status`]; // 'Next' or undefined
                          
                          const levelName = examDetails[`level_${level}_name`] || `Level ${level}`;
                          
                          if ((!total && !obtained) && status !== 'Next') return null;

                          // Logic for badge
                          let badgeColor = 'yellow';
                          let badgeText = 'Pending';
                          
                          if (status === 'Next') {
                              badgeColor = 'yellow';
                              badgeText = 'Pending';
                          } else if (qualified == '1') {
                              badgeColor = 'green';
                              badgeText = 'Passed';
                          } else if (qualified == '0') {
                              badgeColor = 'red';
                              badgeText = 'Failed';
                          }

                          return (
                              <Grid.Col span={{ base: 12, sm: 4, md: 3 }} key={level}>
                                <Paper withBorder p="sm" radius="md" style={{ 
                                    borderLeft: `5px solid ${badgeColor === 'green' ? '#40c057' : (badgeColor === 'red' ? '#fa5252' : '#fab005')}` 
                                }}>
                                    <Text size="xs" c="dimmed" tt="uppercase" fw={700}>{levelName}</Text>
                                    <Group justify="space-between" align="flex-end">
                                        <Text size="xl" fw={700}>{obtained || 0}<Text span size="sm" c="dimmed">/{total || 0}</Text></Text>
                                        <Badge size="sm" color={badgeColor} variant="light">
                                            {badgeText}
                                        </Badge>
                                    </Group>
                                    <Text size="xs" c="dimmed" mt={5}>Exam Date: {date || 'N/A'}</Text>
                                </Paper>
                              </Grid.Col>
                          )
                      })}
                    </Grid>
                </Grid.Col>
            )}
        </Grid>

      </div>
    </Modal>
  );
};

export default DevoteeDetailsModal;
