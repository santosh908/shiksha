import { useForm } from '@mantine/form';
import { Button, Checkbox, Grid, Group, Notification, Radio, TextInput } from '@mantine/core';
import { router, usePage } from '@inertiajs/react';
import { IconArrowLeft, IconArrowRight, IconCalendar, IconListCheck, IconSend } from '@tabler/icons-react';
import { useEffect, useState } from 'react';

interface HearingReadingProps {
  masterData: any;
  handleBack: () => void;
  handleNext: () => void;
  containerStyle: React.CSSProperties;
}

export default function Spritual_2({ masterData, handleNext, handleBack, containerStyle }: HearingReadingProps) {
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [notificationColor, setNotificationColor] = useState<'teal' | 'red'>('teal');

  const form = useForm({
    initialValues: {
      profileId: masterData.PersonalInfo?.id || masterData.PersonalInfo?.ProfilePrID || 0,
      userId: masterData.User?.id || masterData.PersonalInfo?.user_id || 0,
      MemorisedPrayers: masterData.DevoteeMemoriesPrayer.map((p: any) => p.id.toString()) || [],
      Seminar: masterData.DevoteeAttendedSeminar.map((p: any) => p.id.toString()) || [],
      ShastriDegree: masterData.PersonalInfo?.bakti_shastri_degree || '',
    },
  });

  const handleSubmit = () => {
    router.post('/Action/UpdateSpritualInfoTwo', form.values, {
      preserveScroll: true,
      onSuccess: () => {
        setNotificationMessage('Bakti Shastri Degree and spiritual info updated successfully.');
        setNotificationColor('teal');
        setShowNotification(true);
      },
      onError: () => {
        setNotificationMessage('Update failed. Please check required fields and try again.');
        setNotificationColor('red');
        setShowNotification(true);
      },
    });
  };

  const { errors } = usePage().props;
  useEffect(() => {
    if (Object.values(errors).length) {
      form.setErrors(errors);
    }
  }, [errors]);

  const [checkedValues, setCheckedValues] = useState<string[]>(form.values.MemorisedPrayers);
  const [seminarCheckedValue, setCheckedSeminar] = useState<string[]>(form.values.Seminar);

  useEffect(() => {
    form.setFieldValue('MemorisedPrayers', checkedValues);
  }, [checkedValues]);

  useEffect(() => {
    form.setFieldValue('Seminar', seminarCheckedValue);
  }, [seminarCheckedValue]);

  const handleCheckboxChange = (values: string[]) => {
    const noneChecked = masterData.Prayers.find((item: any) => item.prayer_name_english === 'None')?.id.toString();
    const updatedValues = values.includes(noneChecked) ? [noneChecked] : values.filter((value) => value !== noneChecked);
    setCheckedValues(updatedValues);
  };

  const handleSeminarCheckboxChange = (values: string[]) => {
    const noneChecked = masterData.Seminar.find((item: any) => item.seminar_name_english === 'None')?.id.toString();
    const updatedValues = values.includes(noneChecked) ? [noneChecked] : values.filter((value) => value !== noneChecked);
    setCheckedSeminar(updatedValues);
  };

  return (
    <>
      {showNotification && (
        <Notification color={notificationColor} mb="md" onClose={() => setShowNotification(false)}>
          {notificationMessage}
        </Notification>
      )}
      <Grid py={10}>
        <Grid.Col span={{ base: 12, md: 12, lg: 12 }}>
          <label style={containerStyle}>I have memorised following prayers - मैंने निम्नलिखित प्रार्थनाएँ याद कर ली हैं?</label>
          <Checkbox.Group withAsterisk value={checkedValues} onChange={handleCheckboxChange} error={errors.MemorisedPrayers}>
            <Group py="sm">
              {masterData.Prayers.sort((a: any, b: any) => (a.id === 12 ? 1 : b.id === 12 ? -1 : 0)).map((item: any) => (
                <Checkbox
                  key={item.id}
                  value={item.id.toString()}
                  label={
                    <>
                      <label>
                        {item.prayer_name_english}
                        <br />
                        {item.prayer_name_hindi}
                      </label>
                    </>
                  }
                />
              ))}
            </Group>
          </Checkbox.Group>
        </Grid.Col>
      </Grid>
      <Grid py={10}>
        <Grid.Col span={{ base: 12, md: 12, lg: 12 }}>
          <label style={containerStyle}>
            Which of the following seminars have you attended ? - निम्नलिखित में से आपने कौन से सेमिनार में भाग लिया है?
          </label>
          <Checkbox.Group withAsterisk value={seminarCheckedValue} onChange={handleSeminarCheckboxChange} error={errors.Seminar}>
            <Group py="sm">
              {masterData.Seminar.map((item: any) => (
                <Checkbox
                  key={item.id}
                  value={item.id.toString()}
                  label={
                    <>
                      <label>
                        {item.seminar_name_english}
                        <br />
                        {item.seminar_name_hindi}
                      </label>
                    </>
                  }
                />
              ))}
            </Group>
          </Checkbox.Group>
        </Grid.Col>
      </Grid>
      <Grid py={10}>
        <Grid.Col span={{ base: 12, md: 12, lg: 12 }}>
          <label style={containerStyle}>Have you completed Bhakti Shastri degree ? - क्या आपने भक्ति शास्त्री की डिग्री पूरी कर ली है ?</label>
          <Radio.Group
            py={5}
            {...form.getInputProps('ShastriDegree')}
            value={form.values.ShastriDegree} // Explicitly bind value to form state
            onChange={(value) => form.setFieldValue('ShastriDegree', value)}
            error={errors.ShastriDegree}
          >
            <Radio value="Yes" label="Yes - हाँ" />
            <Radio value="No" label="No - नहीं" />
            <Radio value="Pursuing" label="Pursuing" />
          </Radio.Group>
        </Grid.Col>
      </Grid>
      <Grid>
        <Grid.Col span={12}>
          <Group justify="center" mt="md">
            {masterData?.PersonalInfo?.status_code === 'S' ? (
              <Button type="submit" color="yellow" onClick={() => router.visit(`/SuperAdmin/devoteeList`)}>
                <IconListCheck size={20} /> Back To DevoteeList
              </Button>
            ) : null}
            <Button type="button" color="gray" onClick={handleBack}>
              <IconArrowLeft size={20} /> Back
            </Button>
            {masterData.PersonalInfo.hearing_reading === 'Y' ? (
              <Button type="submit" color="green" onClick={handleSubmit}>
                <IconSend size={20} /> Update
              </Button>
            ) : (
              <Button type="submit" color="green" onClick={handleSubmit}>
                <IconSend size={20} /> Save
              </Button>
            )}
            {masterData.PersonalInfo.hearing_reading === 'Y' ? (
              <Button type="button" color="orange" onClick={handleNext}>
                Next <IconArrowRight size={20} />
              </Button>
            ) : (
              <></>
            )}
          </Group>
        </Grid.Col>
      </Grid>
    </>
  );
}
