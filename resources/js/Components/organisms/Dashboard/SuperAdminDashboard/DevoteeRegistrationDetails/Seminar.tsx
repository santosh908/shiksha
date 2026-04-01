import { useForm } from '@mantine/form';
import { Button, Checkbox, Grid, Group, Radio, TextInput } from '@mantine/core';
import { router, usePage } from '@inertiajs/react';
import { MonthPickerInput } from '@mantine/dates';
import { IconArrowLeft, IconCalendar, IconSend } from '@tabler/icons-react';
import { useEffect } from 'react';

interface SeminarPropos {
  masterData: any;
  handleBack: () => void;
  handleNext: () => void;
  containerStyle: React.CSSProperties;
}

const today = new Date();

export default function ({ masterData, handleNext, handleBack, containerStyle }: SeminarPropos) {
  const form = useForm({
    initialValues: {
      ashray_leader_code: masterData?.DevoteeLeader?.code || '',
      other_ashry_leader_name: masterData?.PersonalInfo?.other_ashry_leader_name || '',
      since_when_you_attending_ashray_classes: masterData?.PersonalInfo?.since_when_you_attending_ashray_classes?.date || today,
      spiritual_master_you_aspiring: masterData?.PersonalInfo?.spiritual_master_you_aspiring || '',
      attend_shray_classes_in_temple: masterData?.PersonalInfo?.attend_shray_classes_in_temple || '',
    },
  });
  const handleSubmit = () => {
    router.post('/Devotee/DevoteeSeminar', form.values);
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
  return (
    <>
      <Grid py={10}>
        <Grid.Col span={{ base: 12, md: 12, lg: 12 }}>
          <label style={containerStyle}> Your Ashray Leader's name (आपके आश्रय लीडर का नाम?)</label>
          <Radio.Group
            py={5}
            {...form.getInputProps('ashray_leader_code')}
            value={form.values.ashray_leader_code.toString()}
            onChange={(value) => form.setFieldValue('ashray_leader_code', value)}
            error={errors.ashray_leader_code}
          >
            {masterData.AshreyLeader.map((leader: any) => (
              <Radio key={leader.code.toString()} value={leader.code.toString()} label={leader.ashery_leader_name} />
            ))}
          </Radio.Group>
        </Grid.Col>
      </Grid>
      <Grid py={10}>
        {/* <Grid.Col span={{ base: 12, md: 12, lg: 12 }}>
          <label> If others, kindly share his/her name? यदि अन्य हों तो कृपया अपना नाम साझा करें? </label>
          <TextInput
            placeholder="How much time do you spend everyday in hearing lecturesIf others, kindly share his/her name? (यदि अन्य हों तो कृपया अपना नाम साझा करें?)"
            {...form.getInputProps('other_ashry_leader_name')}
            value={form.values.other_ashry_leader_name}
          />
        </Grid.Col> */}
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
        {/* <Grid.Col span={{ base: 12, md: 12, lg: 12 }}>
          <label>
            How regularly do you attend̥̥̥̥̥ Ashray classes in the temple? आप मंदिर में आश्रय कक्षाओं में कितने नियमित रूप से उपस्थित होते हैं?
          </label>
          <TextInput
            placeholder="How regularly do you attend Ashray classes in the temple? (आप मंदिर में आश्रय कक्षाओं में कितने नियमित रूप से उपस्थित होते हैं?)"
            {...form.getInputProps('attend_shray_classes_in_temple')}
            value={form.values.attend_shray_classes_in_temple} // Explicitly bind value to form state
          />
        </Grid.Col> */}
      </Grid>
      <Grid>
        <Grid.Col span={12}>
          <Group justify="center" mt="md">
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
