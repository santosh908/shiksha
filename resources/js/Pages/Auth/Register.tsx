import GuestNonLandingLayout from '@/Layouts/guest/GuestNonLandingLayout';
import { Box, Button, Grid, MultiSelect, PasswordInput, Select, Text, TextInput, Title } from '@mantine/core';
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

function Register({ errors }: RegisterProps) {
  const { props }: any = usePage();
  const masterData: MasterData = props.masterData;

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
      JoinedSckon: '',
      CurrentAddress: '',
      Socity_Name: '',
      Sector_Area: '',
      Pincode: '',
      State: '',
      District: '',
      NoOfChant: '',
      ChantingStartDate: '',
      SpendTimeHearingLecture: '',
      ShastriDegree: '',
      since_when_you_attending_ashray_classes: '',
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
    router.post('/register', {
      ...form.values,
      dob: form.values.dob ? form.values.dob.toISOString().split('T')[0] : null,
    });
  };

  const educationOptions: Option[] = masterData.Education.map((i) => ({ value: String(i.id), label: i.eduction_name }));
  const maritalOptions: Option[] = masterData.MeritalStatus.map((i) => ({ value: String(i.id), label: i.merital_status_name }));
  const professionOptions: Option[] = masterData.Profession.map((i) => ({ value: String(i.id), label: i.profession_name }));
  const stateOptions: Option[] = masterData.State.map((i) => ({ value: i.lg_code, label: i.state_name }));
  const districtOptions: Option[] = masterData.District.filter((d) => !form.values.State || d.state_code === form.values.State).map((i) => ({ value: i.district_lg_code, label: i.district_name }));
  const leaderOptions: Option[] = masterData.AshreyLeader.map((i) => ({ value: String(i.code), label: i.ashery_leader_name }));
  const selectedLeader = masterData.AshreyLeader.find((l) => String(l.code) === form.values.ashray_leader_code);
  const bhaktiOptions: Option[] = (selectedLeader?.bhakti_bhikshuks || []).map((i) => ({ value: String(i.id), label: i.bhakti_bhikshuk_name }));

  return (
    <GuestNonLandingLayout pageTitle="Register">
      <Box p="md">
        <Title order={3} mb="md">One-time Complete Registration</Title>
        {!props.registrationIsOpen && <Text c="red" fw={700} mb="md">Registration is currently closed.</Text>}

        <Grid>
          <Grid.Col span={{ base: 12, md: 4 }}><Select label="Relation Type" data={[{ value: 'self', label: 'MySelf' }, { value: 'relative', label: 'Relative' }]} {...form.getInputProps('relation_type')} /></Grid.Col>
          {form.values.relation_type === 'relative' && <Grid.Col span={{ base: 12, md: 4 }}><TextInput label="Relative Login ID" {...form.getInputProps('relative_login_id')} /></Grid.Col>}
          <Grid.Col span={{ base: 12, md: 4 }}><TextInput label="Email" withAsterisk {...form.getInputProps('email')} /></Grid.Col>
          <Grid.Col span={{ base: 12, md: 4 }}><TextInput label="Name" withAsterisk {...form.getInputProps('name')} /></Grid.Col>
          <Grid.Col span={{ base: 12, md: 4 }}><TextInput label="Initiated Name" {...form.getInputProps('Initiated_name')} /></Grid.Col>
          <Grid.Col span={{ base: 12, md: 4 }}><DateInput label="DOB" withAsterisk maxDate={new Date()} {...form.getInputProps('dob')} /></Grid.Col>
          <Grid.Col span={{ base: 12, md: 4 }}><TextInput label="Contact Number" withAsterisk {...form.getInputProps('contact_number')} /></Grid.Col>
          <Grid.Col span={{ base: 12, md: 4 }}><PasswordInput label="Password" withAsterisk {...form.getInputProps('password')} /></Grid.Col>
          <Grid.Col span={{ base: 12, md: 4 }}><PasswordInput label="Confirm Password" withAsterisk {...form.getInputProps('password_confirmation')} /></Grid.Col>

          <Grid.Col span={{ base: 12, md: 4 }}><Select label="Education" withAsterisk data={educationOptions} {...form.getInputProps('Educational')} /></Grid.Col>
          <Grid.Col span={{ base: 12, md: 4 }}><Select label="Marital Status" withAsterisk data={maritalOptions} {...form.getInputProps('MaritalStatus')} /></Grid.Col>
          <Grid.Col span={{ base: 12, md: 4 }}><Select label="Profession" withAsterisk data={professionOptions} {...form.getInputProps('Profession')} /></Grid.Col>
          <Grid.Col span={{ base: 12, md: 4 }}><TextInput label="Spiritual Master Name" withAsterisk {...form.getInputProps('SpiritualMaster')} /></Grid.Col>
          <Grid.Col span={{ base: 12, md: 4 }}><TextInput label="Association with ISKCON (Since)" withAsterisk {...form.getInputProps('JoinedSckon')} /></Grid.Col>
          <Grid.Col span={{ base: 12, md: 4 }}><TextInput label="Address" withAsterisk {...form.getInputProps('CurrentAddress')} /></Grid.Col>
          <Grid.Col span={{ base: 12, md: 4 }}><TextInput label="Society" {...form.getInputProps('Socity_Name')} /></Grid.Col>
          <Grid.Col span={{ base: 12, md: 4 }}><TextInput label="Sector/Area" {...form.getInputProps('Sector_Area')} /></Grid.Col>
          <Grid.Col span={{ base: 12, md: 4 }}><TextInput label="Pincode" withAsterisk {...form.getInputProps('Pincode')} /></Grid.Col>
          <Grid.Col span={{ base: 12, md: 4 }}><Select label="State" withAsterisk data={stateOptions} {...form.getInputProps('State')} /></Grid.Col>
          <Grid.Col span={{ base: 12, md: 4 }}><Select label="District" withAsterisk data={districtOptions} {...form.getInputProps('District')} /></Grid.Col>

          <Grid.Col span={{ base: 12, md: 4 }}><Select label="Ashray Leader" withAsterisk data={leaderOptions} {...form.getInputProps('ashray_leader_code')} /></Grid.Col>
          <Grid.Col span={{ base: 12, md: 4 }}><Select label="Bhakti Vriksha Leader" data={bhaktiOptions} {...form.getInputProps('Bhakti_BhikshukId')} /></Grid.Col>
          <Grid.Col span={{ base: 12, md: 4 }}><TextInput label="No. of Chanting Rounds" {...form.getInputProps('NoOfChant')} /></Grid.Col>
          <Grid.Col span={{ base: 12, md: 4 }}><TextInput label="Chanting Since" {...form.getInputProps('ChantingStartDate')} /></Grid.Col>
          <Grid.Col span={{ base: 12, md: 4 }}><TextInput label="Hearing Lectures Daily" {...form.getInputProps('SpendTimeHearingLecture')} /></Grid.Col>
          <Grid.Col span={{ base: 12, md: 4 }}><TextInput label="Bhakti Shastri Status" {...form.getInputProps('ShastriDegree')} /></Grid.Col>
          <Grid.Col span={{ base: 12, md: 4 }}><TextInput label="Attending Ashray Classes Since" {...form.getInputProps('since_when_you_attending_ashray_classes')} /></Grid.Col>
          <Grid.Col span={{ base: 12, md: 4 }}><TextInput label="Aspiring Spiritual Master" {...form.getInputProps('spiritual_master_you_aspiring')} /></Grid.Col>

          <Grid.Col span={12}><MultiSelect label="Regulative Principles" data={masterData.Principle.map((i) => ({ value: String(i.id), label: i.principle_name_eglish }))} {...form.getInputProps('RegulativePrinciples')} /></Grid.Col>
          <Grid.Col span={12}><MultiSelect label="Books Read" data={masterData.Book.map((i) => ({ value: String(i.id), label: i.book_name_english }))} {...form.getInputProps('BooksRead')} /></Grid.Col>
          <Grid.Col span={12}><MultiSelect label="Prayers Memorized" data={masterData.Prayers.map((i) => ({ value: String(i.id), label: i.prayer_name_english }))} {...form.getInputProps('MemorisedPrayers')} /></Grid.Col>
          <Grid.Col span={12}><MultiSelect label="Seminars Attended" data={masterData.Seminar.map((i) => ({ value: String(i.id), label: i.seminar_name_english }))} {...form.getInputProps('Seminar')} /></Grid.Col>

          <Grid.Col span={12}>
            <Button fullWidth disabled={!props.registrationIsOpen} onClick={submit}>Submit Complete Registration</Button>
          </Grid.Col>
          <Grid.Col span={12}>
            <Text size="sm">Already have an account? <Link href="/login">Login</Link></Text>
          </Grid.Col>
        </Grid>
      </Box>
    </GuestNonLandingLayout>
  );
}

export default Register;
