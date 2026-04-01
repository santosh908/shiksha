import { useForm } from '@mantine/form';
import { Badge, Box, Button, Checkbox, Grid, Group, Paper, Stack, Text, Radio, TextInput } from '@mantine/core';
import { router, usePage } from '@inertiajs/react';
import { MonthPickerInput } from '@mantine/dates';
import { IconArrowLeft, IconCalendar, IconListCheck, IconSend } from '@tabler/icons-react';
import { useEffect, useState } from 'react';

interface SeminarPropos {
  masterData: any;
  handleBack: () => void;
  handleNext: () => void;
  containerStyle: React.CSSProperties;
}

const today = new Date();

export default function Spritual_3({ masterData, handleNext, handleBack, containerStyle }: SeminarPropos) {
  const form = useForm({
    initialValues: {
      profileId: masterData.PersonalInfo.id || 0,
      userId: masterData.User.id || 0,
      ashray_leader_code: masterData?.DevoteeLeader?.code || '',
      Bhakti_BhikshukId: masterData?.BhaktiBhikshuk?.Bhakti_Bhekshuk || '',
      other_ashry_leader_name: masterData?.PersonalInfo?.other_ashry_leader_name || '',
      since_when_you_attending_ashray_classes: masterData?.PersonalInfo?.since_when_you_attending_ashray_classes?.date || today,
      spiritual_master_you_aspiring: masterData?.PersonalInfo?.spiritual_master_you_aspiring || '',
      attend_shray_classes_in_temple: masterData?.PersonalInfo?.attend_shray_classes_in_temple || '',
    },
  });
  const handleSubmit = () => {
    router.post('/Action/UpdateSpritualInfoThree', form.values);
  };

  useEffect(() => {
    if (masterData?.PersonalInfo?.since_when_you_attending_ashray_classes) {
      form.setFieldValue('since_when_you_attending_ashray_classes', new Date(masterData?.PersonalInfo?.since_when_you_attending_ashray_classes));
    }
  }, [masterData]);

  const { errors } = usePage().props;
  useEffect(() => {
    if (Object.values(errors).length) {
      form.setErrors(errors);
    }
  }, [errors]);

  const currentDate = new Date();

  const [selectedLeader, setSelectedLeader] = useState<string | null>(form.values.ashray_leader_code.toString());
  const [selectedBhakti, setSelectedBhakti] = useState<string | null>(form.values.Bhakti_BhikshukId.toString());

  const handleLeaderChange = (value: string) => {
    setSelectedLeader(value);
    form.setFieldValue('ashray_leader_code', value);
    setSelectedBhakti(null); // Reset Bhakti selection when leader changes
    form.setFieldValue('Bhakti_BhikshukId', 0);
  };

  const handleBhaktiChange = (leaderCode: string, bhaktiId: string) => {
    setSelectedLeader(leaderCode);                   // update parent leader
    setSelectedBhakti(bhaktiId);                     // update child bhikshuk
    form.setFieldValue("ashray_leader_code", leaderCode);  // sync to form
    form.setFieldValue("Bhakti_BhikshukId", bhaktiId);     // sync to form
  };


  return (
    <>
      <Grid py={10}>
        <Grid.Col span={{ base: 12, md: 12, lg: 12 }}>
          <label style={containerStyle}> Your Ashray Leader's name (आपके आश्रय लीडर का नाम?)</label>
           <Radio.Group
            py={5}
            {...form.getInputProps('ashray_leader_code')}
            value={selectedLeader?.toString()}
            onChange={(value) => {
              handleLeaderChange(value);
            }}
            error={errors.ashray_leader_code}
          >
            <Stack gap="sm">
              {masterData.AshreyLeader.map((leader: any) => (
                <Paper
                  key={leader.code.toString()}
                  shadow="xs"
                  radius="md"
                  p="xs"
                  withBorder
                  style={{ 
                    backgroundColor: selectedLeader === leader.code.toString() ? '#e6fcf5' : '#f9fafb',
                    borderColor: selectedLeader === leader.code.toString() ? '#0ca678' : undefined
                  }}
                >
                  <Radio
                    value={leader.code.toString()}
                    label={
                      <Text fw={500} size="sm">
                       Ashray Leader : {leader?.user?.initiated_name || leader.ashery_leader_name}
                      </Text>
                    }
                  />
                </Paper>
              ))}
            </Stack>
          </Radio.Group>
        </Grid.Col>

        <Grid.Col span={12}>
          <Radio.Group
            value={selectedBhakti}
            onChange={(val) => {
               // Find the leader for this bhakti bhikshuk
               let foundLeaderCode = null;
               for (const leader of masterData.AshreyLeader) {
                  if (leader.bhakti_bhikshuks?.some((b: any) => b.BhaktiBhikshukId.toString() === val)) {
                      foundLeaderCode = leader.code.toString();
                      break;
                  }
               }
               if (foundLeaderCode) {
                   handleBhaktiChange(foundLeaderCode, val);
               }
            }}
            error={errors.Bhakti_BhikshukId}
          >
            <Stack gap="xs">
               {masterData.AshreyLeader.map((leader: any) => {
                  if (!leader.bhakti_bhikshuks || leader.bhakti_bhikshuks.length === 0) return null;
                  
                  return (
                    <Box key={leader.code} mb="sm">
                      <Text size="xs" fw={700} c="dimmed" mb={4} ml={4}>
                        Under {leader.ashery_leader_name}
                      </Text>
                      {leader.bhakti_bhikshuks.map((bhakti: any) => (
                         <Paper
                            key={bhakti.BhaktiBhikshukId.toString()}
                            shadow="xs" 
                            radius="md" 
                            p="xs" 
                            mb={4}
                            withBorder
                            style={{
                                backgroundColor: selectedBhakti === bhakti.BhaktiBhikshukId.toString() ? '#fff9db' : '#fff',
                            }}
                         >
                            <Radio
                              value={bhakti.BhaktiBhikshukId.toString()}
                              label={
                                <Text fw={500} size="sm">
                                Bhakti Vriksha Leader : {
                                  bhakti.bhakti_bhikshuk_name === 'NA'
                                  ? bhakti.bhakti_bhikshuk_name
                                  : (bhakti?.user?.initiated_name || bhakti.bhakti_bhikshuk_name)
                                }
                                </Text>
                              }
                            />
                         </Paper>
                      ))}
                    </Box>
                  );
               })}
            </Stack>
          </Radio.Group>
        </Grid.Col>
      </Grid>
      <Grid py={10}>
        <Grid.Col span={{ base: 12, md: 12, lg: 12 }}>
          <label> Since when are you attending ashray classes, Month/Year? आप कब से आश्रय कक्षाओं में भाग ले रहे हैं, माह/वर्ष?</label>
          <MonthPickerInput
            size="sm"
            className="w-full"
            withAsterisk
            placeholder="Select Month/Year"
            leftSection={<IconCalendar />}
            {...form.getInputProps('since_when_you_attending_ashray_classes')}
            onChange={(date) => form.setFieldValue('since_when_you_attending_ashray_classes', date)} // Handle date change
            maxDate={new Date(currentDate.getFullYear(), currentDate.getMonth())}
            error={form.errors.since_when_you_attending_ashray_classes}
          />
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 12, lg: 12 }}>
          <label>
            If you are not initiated, mention name of spiritual master you are aspiring from? यदि आपने दीक्षा नहीं ली है, तो उस आध्यात्मिक गुरु का नाम
            बताएं जिसकी आप आकांक्षा कर रहे हैं?
          </label>
          <TextInput
            placeholder="If you are not initiated, mention name of spiritual master you are aspiring for? (यदि आपने दीक्षा नहीं ली है, तो उस आध्यात्मिक गुरु का नाम बताएं जिसकी आप आकांक्षा कर रहे हैं?)"
            {...form.getInputProps('spiritual_master_you_aspiring')}
            value={form.values.spiritual_master_you_aspiring}
          />
        </Grid.Col>
      </Grid>
      <Grid>
        <Grid.Col span={12}>
          <Group justify="center" mt="md">
            <Button type="submit" color="yellow" onClick={() => router.visit(`/Action/devoteeList`)}>
              <IconListCheck size={20} /> Back To DevoteeList
            </Button>

            <Button type="submit" color="blue" onClick={() => router.visit('/Action/partiallydevoteeList')}>
              <IconListCheck size={20} /> Back to Partially Devotee List
            </Button>

            <Button type="button" color="gray" onClick={handleBack}>
              <IconArrowLeft size={20} /> Back
            </Button>
            {masterData?.PersonalInfo?.seminar === 'Y' ? (
              <Button type="submit" color="green" onClick={handleSubmit}>
                <IconSend size={20} /> Update
              </Button>
            ) : (
              <Button type="submit" color="green" onClick={handleSubmit}>
                <IconSend size={20} /> Final Save
              </Button>
            )}
          </Group>
        </Grid.Col>
      </Grid>
    </>
  );
}
