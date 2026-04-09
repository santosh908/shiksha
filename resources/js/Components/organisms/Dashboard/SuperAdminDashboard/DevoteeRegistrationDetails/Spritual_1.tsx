import { useForm } from '@mantine/form';
import { Button, Checkbox, Grid, Group, NumberInput, Select, TextInput, Notification } from '@mantine/core';
import { router, usePage } from '@inertiajs/react';
import { DateInput } from '@mantine/dates';
import { IconArrowLeft, IconArrowRight, IconCalendar, IconListCheck, IconSend } from '@tabler/icons-react';
import { useEffect, useState } from 'react';

interface ProfessionalInfoPropos {
  masterData: any;
  handleBack: () => void;
  handleNext: () => void;
  containerStyle: React.CSSProperties;
}

export default function Spritual_1({ masterData, handleBack, handleNext, containerStyle }: ProfessionalInfoPropos) {
  const { isSelfProfile } = usePage<{ isSelfProfile?: boolean }>().props;
  const [value, setValue] = useState('');
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [notificationColor, setNotificationColor] = useState<'teal' | 'red'>('teal');
  const normalizeHearingLectureValue = (value: string | null | undefined): string => {
    const raw = (value || '').toString().trim();
    const map: Record<string, string> = {
      less_than_half_hour: 'Less than half an hour',
      between_30_minutes_and_60_minutes: 'Between 30 minutes and 60 minutes',
      more_than_60_minutes: 'More than 60 minutes',
      'Less than half an hour': 'Less than half an hour',
      'Between 30 minutes and 60 minutes': 'Between 30 minutes and 60 minutes',
      'More than 60 minutes': 'More than 60 minutes',
    };
    return map[raw] ?? raw;
  };

  const form = useForm({
    initialValues: {
      profileId: masterData.PersonalInfo?.id || masterData.PersonalInfo?.ProfilePrID || 0,
      userId: masterData.User?.id || masterData.PersonalInfo?.user_id || 0,
      NoOfChant: masterData.PersonalInfo?.how_many_rounds_you_chant || '',
      ChantingStartDate: masterData.PersonalInfo?.when_are_you_chantin?.date || '',
      RegulativePrinciples: masterData.DevoteePrinciple.map((p: any) => p.id.toString()) || [],
      BooksRead: masterData.DevoteeBookRead.map((p: any) => p.id.toString()) || [],
      SpendTimeHearingLecture: normalizeHearingLectureValue(masterData.PersonalInfo?.spend_everyday_hearing_lectures || ''),
    },
  });

  const handleSubmit = () => {
    router.post(isSelfProfile ? '/Devotee/UpdateSpritualInfoOne' : '/Action/UpdateSpritualInfoOne', form.values, {
      preserveScroll: true,
      onSuccess: () => {
        setNotificationMessage('Devotee spiritual information updated successfully.');
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

  const today = new Date();

  const { errors } = usePage().props;

  useEffect(() => {
    if (Object.values(errors).length) {
      form.setErrors(errors);
    }
  }, [errors]);

  const [checkedValues, setCheckedValues] = useState<string[]>(form.values.BooksRead);
  useEffect(() => {
    form.setFieldValue('BooksRead', checkedValues);
  }, [checkedValues, form.values]);

  useEffect(() => {
    if (masterData.PersonalInfo?.when_are_you_chantin) {
      form.setFieldValue('ChantingStartDate', new Date(masterData.PersonalInfo?.when_are_you_chantin));
    }
    form.setFieldValue(
      'SpendTimeHearingLecture',
      normalizeHearingLectureValue(masterData.PersonalInfo?.spend_everyday_hearing_lectures || '')
    );
  }, [masterData]);

  const handleCheckboxChange = (values: string[]) => {
    const noneChecked = masterData.Book.find((item: any) => item.book_name_english === 'None')?.id.toString();
    if (values.includes(noneChecked)) {
      setCheckedValues([noneChecked]);
    } else {
      setCheckedValues(values.filter((value) => value !== noneChecked));
    }
  };

  const handleNumberChange = (value: string | number) => {
    // Convert value to a number if it's a string, or handle as needed
    const numericValue = typeof value === 'string' ? parseInt(value) : value;

    // You can also add any additional logic here if needed
    form.setFieldValue('NoOfChant', numericValue);
  };

  return (
    <>
      {showNotification && (
        <Notification color={notificationColor} mb="md" onClose={() => setShowNotification(false)}>
          {notificationMessage}
        </Notification>
      )}
      <Grid py={10}>
        <Grid.Col
          span={{
            base: 12,
            md: 6,
            lg: 3,
          }}
        >
          <NumberInput
            placeholder="Currently how many rounds do you chant"
            label={
              <>
                Currently how many rounds do you chant <br />
                (वर्तमान में आप कितनी माला जाप करते हैं)
              </>
            }
            {...form.getInputProps('NoOfChant')}
            value={form.values.NoOfChant}
            onChange={handleNumberChange}
            max={100}
            min={0}
          />
        </Grid.Col>
        <Grid.Col
          span={{
            base: 12,
            md: 6,
            lg: 3,
          }}
        >
          <DateInput
            size="sm"
            className="w-full"
            withAsterisk
            leftSection={<IconCalendar />}
            maxDate={today}
            placeholder="Since when are you chanting above rounds"
            label={
              <>
                Since when are you chanting above rounds
                <br /> उपरोक्त माला का जाप कब से कर रहे हो
              </>
            }
            {...form.getInputProps('ChantingStartDate')}
            value={form.values.ChantingStartDate}
          />
        </Grid.Col>
      </Grid>
      <Grid py={10}>
        <Grid.Col
          span={{
            base: 12,
            md: 12,
            lg: 12,
          }}
        >
          <label style={containerStyle}>
            Please check the regulaterly principle you are following? कृपया वह नियमित सिद्धांत चुनें जिसे आप मान रहे हैं?
          </label>
          <Checkbox.Group
            withAsterisk
            value={form.values.RegulativePrinciples}
            onChange={(value) => form.setFieldValue('RegulativePrinciples', value)}
            error={errors.RegulativePrinciples}
          >
            <Group py="sm">
              {masterData.Principle.map((item: any) => (
                <Checkbox
                  key={item.id}
                  value={item.id.toString()}
                  label={
                    <>
                      <label>
                        {item.principle_name_eglish}
                        <br />
                        {item.principle_name_hindi}
                      </label>
                    </>
                  }
                />
              ))}
            </Group>
          </Checkbox.Group>
        </Grid.Col>
        <Grid.Col
          span={{
            base: 12,
            md: 12,
            lg: 12,
          }}
        >
          <label style={containerStyle}>
            Please check the Srila Prabhupads's books that you have readm - कृपया श्रील प्रभुपाद की किताबें चेक करें जिन्हें आपने पढ़ा है
          </label>
          <Checkbox.Group withAsterisk value={checkedValues} onChange={handleCheckboxChange} error={errors.BooksRead}>
            <Group py="sm">
              {masterData.Book
                // Sort books to place items with null/empty `book_name_english` at the end
                .sort((a: any, b: any) => (a.id === 12 ? 1 : b.id === 12 ? -1 : 0))
                .map((item: any) => (
                  <Checkbox
                    key={item.id}
                    value={item.id.toString()}
                    label={
                      <>
                        <label>
                          {item.book_name_english}
                          <br />
                          {item.book_name_hindi}
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
        <Grid.Col span={12}>
          <label>
            How much time do you spend everyday in hearing lectures? <br />
            आप प्रतिदिन व्याख्यान सुनने में कितना समय व्यतीत करते हैं
          </label>
        </Grid.Col>
        <Grid.Col span={12}>
          <Select
            placeholder="Select time spent"
            label="Time Spent Hearing Lectures"
            {...form.getInputProps('SpendTimeHearingLecture')}
            data={[
              { value: 'Less than half an hour', label: 'Less than half an hour' },
              { value: 'Between 30 minutes and 60 minutes', label: 'Between 30 minutes and 60 minutes' },
              { value: 'More than 60 minutes', label: 'More than 60 minutes' },
            ]}
            searchable
          />
        </Grid.Col>
      </Grid>
      <Grid>
        <Grid.Col span={12}>
          <Group justify="center" mt="md">
            {!isSelfProfile && masterData?.PersonalInfo?.status_code === 'S' ? (
              <Button type="submit" color="yellow" onClick={() => router.visit(`/Action/devoteeList`)}>
                <IconListCheck size={20} /> Back To DevoteeList
              </Button>
            ) : null}
            <Button type="button" color="gray" onClick={handleBack}>
              <IconArrowLeft size={20} /> Back
            </Button>
            {masterData.PersonalInfo.professional_info === 'Y' ? (
              <Button type="submit" color="green" onClick={handleSubmit}>
                <IconSend size={20} /> Update
              </Button>
            ) : (
              <Button type="submit" color="green" onClick={handleSubmit}>
                <IconSend size={20} /> Save
              </Button>
            )}
            {masterData.PersonalInfo.professional_info === 'Y' ? (
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
