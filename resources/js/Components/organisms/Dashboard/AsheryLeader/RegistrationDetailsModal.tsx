// src/components/DetailsModal.tsx
import React, { useEffect } from 'react';
import { Modal, Text, Group, Button, Card, CardSection, Table, Badge, Kbd, Box } from '@mantine/core';
import { IconFreeRights, IconX, IconXboxX } from '@tabler/icons-react';
import StatusBadge from '@/Components/molecules/Status/StatusBaged';

interface DetailsModalProps {
  opened: boolean;
  onClose: () => void;
  data: any; // Adjust the type based on your data structure
}

const DetailsModal: React.FC<DetailsModalProps> = ({ opened, onClose, data }) => {
  
  const dateFormate = (dateString: string) => {
    const dt = dateString; // The date string
    const cDt = new Date(dt);
    const cDate = cDt.toLocaleDateString('en-GB');
    return cDate;
  };
  
  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Devotee Information"
      closeButtonProps={{
        icon: <IconXboxX size={20} stroke={1.5} />,
      }}
      size="xl"
    >
      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <CardSection>
          <Table stickyHeader>
            <Table.Tbody>
              <Table.Tr>
                <Table.Td>
                  <strong>Name</strong>
                </Table.Td>
                <Table.Td>
                  {data.name} <Badge>{data?.devotee_type}</Badge>
                </Table.Td>
              </Table.Tr>
              <Table.Tr>
                <Table.Td>
                  <strong>Initiated Name</strong>
                </Table.Td>
                <Table.Td>{data?.Initiated_name}</Table.Td>
              </Table.Tr>
              <Table.Tr>
                <Table.Td>
                  <strong>Email:</strong>
                </Table.Td>
                <Table.Td>{data?.email}</Table.Td>
              </Table.Tr>
              <Table.Tr>
                <Table.Td>
                  <strong>Contact Number:</strong>
                </Table.Td>
                <Table.Td>{data?.contact_number}</Table.Td>
              </Table.Tr>
              <Table.Tr>
                <Table.Td>
                  <strong>D.O.B.</strong>
                </Table.Td>
                <Table.Td>{dateFormate(data?.dob)}</Table.Td>
              </Table.Tr>
              <Table.Tr>
                <Table.Td>
                  <strong>Educational Qualification</strong>
                </Table.Td>
                <Table.Td>{data?.eduction_name==null ? '' : data?.eduction_name}</Table.Td>
              </Table.Tr>
              <Table.Tr>
                <Table.Td>
                  <strong>Marital Status</strong>
                </Table.Td>
                <Table.Td>{data.merital_status_name==null ? '' : data?.merital_status_name}</Table.Td>
              </Table.Tr>
              <Table.Tr>
                <Table.Td>
                  <strong>Profession</strong>
                </Table.Td>
                <Table.Td>{data.profession_name==null ? '' : data?.profession_name}</Table.Td>
              </Table.Tr>
              <Table.Tr>
                <Table.Td>
                  <strong>Spiritual Master</strong>
                </Table.Td>
                <Table.Td>{data.spiritual_master==null ? '' : data?.spiritual_master}</Table.Td>
              </Table.Tr>
              <Table.Tr>
                <Table.Td>
                  <strong>Since when you are joind to ISKCON Dwarka</strong>
                </Table.Td>
                <Table.Td>{dateFormate(data?.join_askcon)}</Table.Td>
              </Table.Tr>
              <Table.Tr>
                <Table.Td>
                  <strong>Current Address</strong>
                </Table.Td>
                <Table.Td>{data.current_address ==null ? '' : data?.current_address}, {data.Socity_Name==null ? '' : data?.Socity_Name}, 
                  {data.Sector_Area==null ? '' : data?.Sector_Area},
                   {data.district_name==null ? '' : data?.district_name}, 
                   {data.state_name==null ? '' : data?.state_name} - {data.pincode==null ? '' : data?.pincode}</Table.Td>
              </Table.Tr>
              <Table.Tr>
                <Table.Td>
                  <strong>How Many Rounds You Chant</strong>
                </Table.Td>
                <Table.Td>{data.how_many_rounds_you_chant==null ? '' : data?.how_many_rounds_you_chant}</Table.Td>
              </Table.Tr>
              <Table.Tr>
                <Table.Td>
                  <strong>Since when are you chanting above rounds</strong>
                </Table.Td>
                <Table.Td>{dateFormate(data?.when_are_you_chantin)}</Table.Td>
              </Table.Tr>
              <Table.Tr>
                <Table.Td colSpan={2}>
                  <Box>
                    <h2>
                      <strong>Regulative Principles</strong>
                      <br />
                    </h2>
                    {data.regulative_principles &&  data.regulative_principles.length > 0 ? (
                      <Kbd>{data.regulative_principles==null ? '' : data?.regulative_principles}</Kbd>
                      ):(
                        <Kbd>No principles found</Kbd>
                      )
                    }
                  </Box>
                </Table.Td>
              </Table.Tr>
              <Table.Tr>
                <Table.Td colSpan={2}>
                  <Box>
                    <h2>
                      <strong>Srila Prabhupada's books have read</strong>
                      <br />
                    </h2>
                    {data.DevoteeBookRead && data.DevoteeBookRead.length > 0 ? (
                      <Kbd>{data.DevoteeBookRead==null ? '' : data?.DevoteeBookRead.join(', ')}</Kbd> // Join array elements with a comma and space
                    ) : (
                      <Kbd>No books found</Kbd>
                    )}
                  </Box>
                </Table.Td>
              </Table.Tr>
              <Table.Tr>
                <Table.Td colSpan={2}>
                  <Box>
                    <h2>
                      <strong>Memorised prayers</strong>
                      <br />
                    </h2>
                    {data.DevoteePrayers && data.DevoteePrayers.length > 0 ? (
                      <Kbd>{data.DevoteePrayers==null ? '' : data?.DevoteePrayers.join(', ')}</Kbd> // Join array elements with a comma and space
                    ) : (
                      <Kbd>No prayers found</Kbd>
                    )}
                  </Box>
                </Table.Td>
              </Table.Tr>
              <Table.Tr>
                <Table.Td colSpan={2}>
                  <Box>
                    <h2>
                      <strong>Seminars have attended</strong>
                      <br />
                    </h2>
                    {data.DevoteeSeminar && data.DevoteeSeminar.length > 0 ? (
                      <Kbd>{data.DevoteeSeminar==null ? '' : data?.DevoteeSeminar.join(', ')}</Kbd> // Join array elements with a comma and space
                    ) : (
                      <Kbd>No Seminars found</Kbd>
                    )}
                  </Box>
                </Table.Td>
              </Table.Tr>
              <Table.Tr>
                <Table.Td>
                  <strong>Spend Everyday Hearing Lectures</strong>
                </Table.Td>
                <Table.Td>{dateFormate(data.spend_everyday_hearing_lectures==null ? '' : data?.spend_everyday_hearing_lectures)}</Table.Td>
              </Table.Tr>
              <Table.Tr>
                <Table.Td>
                  <strong>Bakti Shastri Degree</strong>
                </Table.Td>
                <Table.Td>{data.bakti_shastri_degree==null ? '' : data?.bakti_shastri_degree}</Table.Td>
              </Table.Tr>
              <Table.Tr>
                <Table.Td>
                  <strong>Ashray Leader Name</strong>
                </Table.Td>
                <Table.Td>{data.ashery_leader_name==null ? '' : data?.ashery_leader_name}</Table.Td>
              </Table.Tr>
              <Table.Tr>
                <Table.Td>
                  <strong>Since When You Attending Ashray Class</strong>
                </Table.Td>
                <Table.Td>{dateFormate(data?.SkconJoinDate)}</Table.Td>
              </Table.Tr>
              <Table.Tr>
                <Table.Td>
                  <strong>Spiritual Master You Aspiring</strong>
                </Table.Td>
                <Table.Td>{data.spiritual_master_you_aspiring==null ? '' : data?.spiritual_master_you_aspiring}</Table.Td>
              </Table.Tr>
              <Table.Tr>
                <Table.Td>
                  <strong>Status Code</strong>
                </Table.Td>
                <Table.Td>
                  <StatusBadge status={data.status_code==null ? '' : data?.status_code} StatusRemarks={data.remarks==null ? '' : data?.remarks} />
                </Table.Td>
              </Table.Tr>
              <Table.Tr>
                <Table.Td>
                  <strong>Remarks</strong>
                </Table.Td>
                <Table.Td>
                {data.DevoteeRemarks && data.DevoteeRemarks.length > 0 ? (
                      <Kbd>{data.DevoteeRemarks==null ? '' : data?.DevoteeRemarks.join(', ')}</Kbd> // Join array elements with a comma and space
                    ) : (
                      <Kbd>No remarks</Kbd>
                    )}
                </Table.Td>
              </Table.Tr>
              <Table.Tr>
                <Table.Td>
                  <strong>Submited Date</strong>
                </Table.Td>
                <Table.Td>{dateFormate(data.created_at)}</Table.Td>
              </Table.Tr>
            </Table.Tbody>
          </Table>
        </CardSection>
      </Card>
    </Modal>
  );
};

export default DetailsModal;
