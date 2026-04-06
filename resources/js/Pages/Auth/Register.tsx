import GuestNonLandingLayout from '@/Layouts/guest/GuestNonLandingLayout';
import {
  Anchor,
  Box,
  Button,
  Card,
  Divider,
  Grid,
  Group,
  MultiSelect,
  NumberInput,
  PasswordInput,
  Select,
  Stack,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { DateInput } from '@mantine/dates';
import { Link, router, usePage } from '@inertiajs/react';
import { useEffect } from 'react';

type Option = { value: string; label: string };
type MasterData = {
  Education: Array<{ id: number; eduction_name: string }>;
  MeritalStatus: Array<{ id: number; merital_status_name: string }>;
  Profession: Array<{ id: number; profession_name: string }>;
  State: Array<{ lg_code: string; state_name: string }>;
  District: Array<{ district_lg_code: string; district_name: string; state_code: string }>;
  Principle: Array<{ id: number; principle_name_eglish: string }>;
  Book: Array<{ id: number; book_name_english: string }>;
  Prayers: Array<{ id: number; prayer_name_english: string }>;
  Seminar: Array<{ id: number; seminar_name_english: string }>;
  AshreyLeader: Array<{ code: number; ashery_leader_name: string; bhakti_bhikshuks: Array<{ id: number; bhakti_bhikshuk_name: string }> }>;
};

type RegisterProps = {
  errors: Record<string, string>;
};

function SectionHeading({ title, description }: { title: string; description?: string }) {
  return (
    <Box>
      <Text fw={600} size="sm" c="dark.7">
        {title}
      </Text>
      {description ? (
        <Text size="xs" c="dimmed" mt={4}>
          {description}
        </Text>
      ) : null}
    </Box>
  );
}

function Register({ errors }: RegisterProps) {
  const { props }: any = usePage();
  const masterData: MasterData = props.masterData;
  const NONE_VALUE = '__none__';

  const form = useForm({
    initialValues: {
      relation_type: 'self',
      relative_login_id: '',
      email: '',
      name: '',
      Initiated_name: '',
      dob: null as Date | null,
      contact_number: '',
      devotee_type: 'AD',
      have_you_applied_before: 'N',
      password: '',
      password_confirmation: '',
      unique_user_check: 1,
      Educational: '',
      MaritalStatus: '',
      Profession: '',
      SpiritualMaster: '',
      JoinedSckon: null as Date | null,
      CurrentAddress: '',
      Socity_Name: '',
      Sector_Area: '',
      Pincode: '',
      State: '',
      District: '',
      NoOfChant: null as number | null,
      ChantingStartDate: null as Date | null,
      SpendTimeHearingLecture: '',
      ShastriDegree: '',
      since_when_you_attending_ashray_classes: null as Date | null,
      spiritual_master_you_aspiring: '',
      ashray_leader_code: '',
      Bhakti_BhikshukId: '',
      RegulativePrinciples: [] as string[],
      BooksRead: [] as string[],
      MemorisedPrayers: [] as string[],
      Seminar: [] as string[],
    },
  });

  useEffect(() => {
    if (Object.keys(errors || {}).length > 0) {
      form.setErrors(errors);
    }
  }, [errors]); // eslint-disable-line

  const submit = () => {
    const stripNone = (arr: string[]) => (arr.includes(NONE_VALUE) ? [] : arr);
    router.post('/register', {
      ...form.values,
      attend_shray_classes_in_temple: '0',
      RegulativePrinciples: stripNone(form.values.RegulativePrinciples),
      BooksRead: stripNone(form.values.BooksRead),
      MemorisedPrayers: stripNone(form.values.MemorisedPrayers),
      Seminar: stripNone(form.values.Seminar),
      dob: form.values.dob ? form.values.dob.toISOString().split('T')[0] : null,
      JoinedSckon: form.values.JoinedSckon ? form.values.JoinedSckon.toISOString().split('T')[0] : null,
      ChantingStartDate: form.values.ChantingStartDate ? form.values.ChantingStartDate.toISOString().split('T')[0] : null,
      since_when_you_attending_ashray_classes: form.values.since_when_you_attending_ashray_classes
        ? form.values.since_when_you_attending_ashray_classes.toISOString().split('T')[0]
        : null,
    });
  };

  const educationOptions: Option[] = masterData.Education.map((i) => ({ value: String(i.id), label: i.eduction_name }));
  const maritalOptions: Option[] = masterData.MeritalStatus.map((i) => ({ value: String(i.id), label: i.merital_status_name }));
  const professionOptions: Option[] = masterData.Profession.map((i) => ({ value: String(i.id), label: i.profession_name }));
  const stateOptions: Option[] = masterData.State.map((i) => ({ value: i.lg_code, label: i.state_name }));
  const districtOptions: Option[] = masterData.District.filter((d) => !form.values.State || d.state_code === form.values.State).map((i) => ({
    value: i.district_lg_code,
    label: i.district_name,
  }));
  const leaderOptions: Option[] = masterData.AshreyLeader.map((i) => ({ value: String(i.code), label: i.ashery_leader_name }));
  const selectedLeader = masterData.AshreyLeader.find((l) => String(l.code) === form.values.ashray_leader_code);
  const bhaktiOptions: Option[] = (selectedLeader?.bhakti_bhikshuks || []).map((i) => ({ value: String(i.id), label: i.bhakti_bhikshuk_name }));

  const withNoneAtBottom = (options: Option[]): Option[] => {
    const cleaned = options.filter((o) => o.value !== NONE_VALUE && o.label.toLowerCase() !== 'none');
    return [...cleaned, { value: NONE_VALUE, label: 'None' }];
  };

  const normalizeMulti = (values: string[]): string[] => {
    if (values.includes(NONE_VALUE)) return [NONE_VALUE];
    return values.filter((v) => v !== NONE_VALUE);
  };

  const normalizeContactNumber = (value: string) => value.replace(/\D/g, '').slice(0, 10);
  const normalizePincode = (value: string) => value.replace(/\D/g, '').slice(0, 6);

  const handleMultiOptionSubmit =
    (field: 'RegulativePrinciples' | 'BooksRead' | 'MemorisedPrayers' | 'Seminar') => (value: string) => {
      const current = (form.values as any)[field] as string[];
      if (value === NONE_VALUE) {
        form.setFieldValue(field, [NONE_VALUE]);
        return;
      }
      if ((current || []).includes(NONE_VALUE)) {
        form.setFieldValue(field, [value]);
      }
    };

  useEffect(() => {
    const v = form.values.BooksRead || [];
    if (v.length > 1 && v.includes(NONE_VALUE)) {
      form.setFieldValue('BooksRead', [NONE_VALUE]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(form.values.BooksRead)]);

  useEffect(() => {
    const v = form.values.MemorisedPrayers || [];
    if (v.length > 1 && v.includes(NONE_VALUE)) {
      form.setFieldValue('MemorisedPrayers', [NONE_VALUE]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(form.values.MemorisedPrayers)]);

  const gridSpan = { base: 12, sm: 6, lg: 4 } as const;

  return (
    <GuestNonLandingLayout pageTitle="Register">
      <Box w="100%" maw={1100} mx="auto" px={{ base: 'xs', sm: 'md' }} py={{ base: 'md', sm: 'xl' }}>
        <Card shadow="md" radius="lg" padding={{ base: 'md', sm: 'xl' }} withBorder>
          <Stack gap="xl">
            <Box>
              <Title order={2} size="h3">
                Devotee Registration
              </Title>
              <Text size="sm" c="dimmed" mt={6}>
                Complete all sections below. Fields marked with an asterisk (*) are required.
              </Text>
            </Box>

            {!props.registrationIsOpen && (
              <Text c="red" fw={600} p="sm" bg="red.0" style={{ borderRadius: 8 }}>
                Registration is currently closed.
              </Text>
            )}

            <Stack gap="md">
              <SectionHeading title="Account & relation" description="How you relate to this registration and your login details." />
              <Grid gutter={{ base: 'sm', md: 'md' }}>
                <Grid.Col span={gridSpan}>
                  <Select label="Relation Type" data={[{ value: 'self', label: 'MySelf' }, { value: 'relative', label: 'Relative' }]} {...form.getInputProps('relation_type')} />
                </Grid.Col>
                {form.values.relation_type === 'relative' && (
                  <Grid.Col span={gridSpan}>
                    <TextInput label="Relative Login ID" {...form.getInputProps('relative_login_id')} />
                  </Grid.Col>
                )}
                <Grid.Col span={gridSpan}>
                  <TextInput label="Email" withAsterisk {...form.getInputProps('email')} />
                </Grid.Col>
                <Grid.Col span={gridSpan}>
                  <TextInput label="Name" withAsterisk {...form.getInputProps('name')} />
                </Grid.Col>
                <Grid.Col span={gridSpan}>
                  <TextInput label="Initiated Name" {...form.getInputProps('Initiated_name')} />
                </Grid.Col>
                <Grid.Col span={gridSpan}>
                  <DateInput label="DOB" withAsterisk maxDate={new Date()} {...form.getInputProps('dob')} />
                </Grid.Col>
                <Grid.Col span={gridSpan}>
                  <TextInput
                    label="Contact Number"
                    withAsterisk
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={10}
                    value={form.values.contact_number}
                    onChange={(e) => form.setFieldValue('contact_number', normalizeContactNumber(e.currentTarget.value))}
                    error={form.errors.contact_number}
                  />
                </Grid.Col>
                <Grid.Col span={gridSpan}>
                  <PasswordInput label="Password" withAsterisk {...form.getInputProps('password')} />
                </Grid.Col>
                <Grid.Col span={gridSpan}>
                  <PasswordInput label="Confirm Password" withAsterisk {...form.getInputProps('password_confirmation')} />
                </Grid.Col>
              </Grid>
            </Stack>

            <Divider />

            <Stack gap="md">
              <SectionHeading title="Education, work & address" description="Your background and where you stay." />
              <Grid gutter={{ base: 'sm', md: 'md' }}>
                <Grid.Col span={gridSpan}>
                  <Select searchable limit={200} nothingFoundMessage="No options" label="Education" withAsterisk data={educationOptions} {...form.getInputProps('Educational')} />
                </Grid.Col>
                <Grid.Col span={gridSpan}>
                  <Select searchable limit={200} nothingFoundMessage="No options" label="Marital Status" withAsterisk data={maritalOptions} {...form.getInputProps('MaritalStatus')} />
                </Grid.Col>
                <Grid.Col span={gridSpan}>
                  <Select searchable limit={200} nothingFoundMessage="No options" label="Profession" withAsterisk data={professionOptions} {...form.getInputProps('Profession')} />
                </Grid.Col>
                <Grid.Col span={gridSpan}>
                  <TextInput label="Spiritual Master Name" withAsterisk {...form.getInputProps('SpiritualMaster')} />
                </Grid.Col>
                <Grid.Col span={gridSpan}>
                  <DateInput label="Association with ISKCON (Since)" withAsterisk maxDate={new Date()} {...form.getInputProps('JoinedSckon')} />
                </Grid.Col>
                <Grid.Col span={{ base: 12, sm: 12, lg: 8 }}>
                  <TextInput label="Address" withAsterisk {...form.getInputProps('CurrentAddress')} />
                </Grid.Col>
                <Grid.Col span={gridSpan}>
                  <TextInput label="Society" {...form.getInputProps('Socity_Name')} />
                </Grid.Col>
                <Grid.Col span={gridSpan}>
                  <TextInput label="Sector/Area" {...form.getInputProps('Sector_Area')} />
                </Grid.Col>
                <Grid.Col span={gridSpan}>
                  <TextInput
                    label="Pincode"
                    withAsterisk
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={6}
                    value={form.values.Pincode}
                    onChange={(e) => form.setFieldValue('Pincode', normalizePincode(e.currentTarget.value))}
                    error={form.errors.Pincode}
                  />
                </Grid.Col>
                <Grid.Col span={gridSpan}>
                  <Select searchable limit={200} nothingFoundMessage="No options" label="State" withAsterisk data={stateOptions} {...form.getInputProps('State')} />
                </Grid.Col>
                <Grid.Col span={gridSpan}>
                  <Select searchable limit={200} nothingFoundMessage="No options" label="District" withAsterisk data={districtOptions} {...form.getInputProps('District')} />
                </Grid.Col>
              </Grid>
            </Stack>

            <Divider />

            <Stack gap="md">
              <SectionHeading title="Ashray & spiritual practice" description="Leaders you follow and your devotional routine." />
              <Grid gutter={{ base: 'sm', md: 'md' }}>
                <Grid.Col span={gridSpan}>
                  <Select searchable limit={200} nothingFoundMessage="No options" label="Ashray Leader" withAsterisk data={leaderOptions} {...form.getInputProps('ashray_leader_code')} />
                </Grid.Col>
                <Grid.Col span={gridSpan}>
                  <Select searchable limit={200} nothingFoundMessage="No options" label="Bhakti Vriksha Leader" data={bhaktiOptions} {...form.getInputProps('Bhakti_BhikshukId')} />
                </Grid.Col>
                <Grid.Col span={gridSpan}>
                  <NumberInput
                    label="No. of Chanting Rounds"
                    min={0}
                    max={999}
                    clampBehavior="strict"
                    hideControls
                    allowNegative={false}
                    {...form.getInputProps('NoOfChant')}
                  />
                </Grid.Col>
                <Grid.Col span={gridSpan}>
                  <DateInput label="Chanting Since" maxDate={new Date()} {...form.getInputProps('ChantingStartDate')} />
                </Grid.Col>
                <Grid.Col span={gridSpan}>
                  <Select
                    searchable={false}
                    label="Hearing Lectures Daily"
                    data={[
                      { value: 'Less than half an hour', label: 'Less than half an hour' },
                      { value: 'Between 30 minutes and 60 minutes', label: 'Between 30 minutes and 60 minutes' },
                      { value: 'More than 60 minutes', label: 'More than 60 minutes' },
                    ]}
                    {...form.getInputProps('SpendTimeHearingLecture')}
                  />
                </Grid.Col>
                <Grid.Col span={gridSpan}>
                  <Select
                    searchable={false}
                    label="Have you completed Bhakti Shastri degree"
                    data={[
                      { value: 'Yes', label: 'Yes' },
                      { value: 'No', label: 'No' },
                      { value: 'pursuing', label: 'pursuing' },
                    ]}
                    {...form.getInputProps('ShastriDegree')}
                  />
                </Grid.Col>
                <Grid.Col span={gridSpan}>
                  <DateInput label="Attending Ashray Classes Since" maxDate={new Date()} {...form.getInputProps('since_when_you_attending_ashray_classes')} />
                </Grid.Col>
                <Grid.Col span={{ base: 12, sm: 12, lg: 8 }}>
                  <TextInput label="Aspiring Spiritual Master" {...form.getInputProps('spiritual_master_you_aspiring')} />
                </Grid.Col>
              </Grid>
            </Stack>

            <Divider />

            <Stack gap="md">
              <SectionHeading title="Books, principles & seminars" description="Select all that apply, or choose None where offered." />
              <Grid gutter={{ base: 'sm', md: 'md' }}>
                <Grid.Col span={12}>
                  <MultiSelect
                    searchable
                    limit={200}
                    nothingFoundMessage="No options"
                    label="Regulative Principles"
                    data={withNoneAtBottom(masterData.Principle.map((i) => ({ value: String(i.id), label: i.principle_name_eglish })))}
                    value={form.values.RegulativePrinciples}
                    onChange={(values) => form.setFieldValue('RegulativePrinciples', normalizeMulti(values))}
                    onOptionSubmit={handleMultiOptionSubmit('RegulativePrinciples')}
                  />
                </Grid.Col>
                <Grid.Col span={12}>
                  <MultiSelect
                    searchable
                    limit={200}
                    nothingFoundMessage="No options"
                    label="Books Read"
                    data={withNoneAtBottom(masterData.Book.map((i) => ({ value: String(i.id), label: i.book_name_english })))}
                    value={form.values.BooksRead}
                    onChange={(values) => form.setFieldValue('BooksRead', normalizeMulti(values))}
                    onOptionSubmit={handleMultiOptionSubmit('BooksRead')}
                  />
                </Grid.Col>
                <Grid.Col span={12}>
                  <MultiSelect
                    searchable
                    limit={200}
                    nothingFoundMessage="No options"
                    label="Prayers Memorized"
                    data={withNoneAtBottom(masterData.Prayers.map((i) => ({ value: String(i.id), label: i.prayer_name_english })))}
                    value={form.values.MemorisedPrayers}
                    onChange={(values) => form.setFieldValue('MemorisedPrayers', normalizeMulti(values))}
                    onOptionSubmit={handleMultiOptionSubmit('MemorisedPrayers')}
                  />
                </Grid.Col>
                <Grid.Col span={12}>
                  <MultiSelect
                    searchable
                    limit={200}
                    nothingFoundMessage="No options"
                    label="Seminars Attended"
                    data={withNoneAtBottom(masterData.Seminar.map((i) => ({ value: String(i.id), label: i.seminar_name_english })))}
                    value={form.values.Seminar}
                    onChange={(values) => form.setFieldValue('Seminar', normalizeMulti(values))}
                    onOptionSubmit={handleMultiOptionSubmit('Seminar')}
                  />
                </Grid.Col>
              </Grid>
            </Stack>

            <Stack gap="sm" mt="md">
              <Group justify="center" wrap="wrap" gap="md">
                <Button size="md" radius="md" disabled={!props.registrationIsOpen} onClick={submit}>
                  Submit complete registration
                </Button>
              </Group>
              <Text size="sm" c="dimmed" ta="center">
                Already have an account?{' '}
                <Anchor component={Link} href="/login" fw={600} underline="always">
                  Login
                </Anchor>
              </Text>
            </Stack>
          </Stack>
        </Card>
      </Box>
    </GuestNonLandingLayout>
  );
}

export default Register;
