import { useEffect } from 'react';
import { usePage } from '@inertiajs/react';
import { Anchor, Breadcrumbs, Card, Container, Grid, Text, TextInput, Group } from '@mantine/core';

type User = {
  [key: string]: any;
};

type FieldConfigItem = {
  label: string;
  key: string;
  format?: (value: any) => string;
};

const fieldConfig: FieldConfigItem[] = [
  { label: 'Login ID', key: 'login_id' },
  { label: 'Name', key: 'name' },
  { label: 'Email Address', key: 'email' },
  { label: 'Initiated Name', key: 'Initiated_name' },
  { label: 'Mobile Number', key: 'contact_number' },
  { label: 'DOB', key: 'dob', format: (value: string) => new Date(value).toLocaleDateString('en-GB') },
  { label: 'Educational Qualification', key: 'eduction_name' },
  { label: 'Marital Status', key: 'merital_status_name' },
  { label: 'Profession', key: 'profession' },
  { label: 'Spiritual Master', key: 'spiritual_master' },
  { label: 'Join Iskcon Dwarka', key: 'join_askcon', format: (value: string) => new Date(value).toLocaleDateString('en-GB') },
  { label: 'Address', key: 'current_address' },
  { label: 'Pincode', key: 'pincode' },
  { label: 'State Code', key: 'state_code' },
  { label: 'District Code', key: 'district_code' },
  { label: 'Society Name', key: 'Socity_Name' },
  { label: 'Sector Area', key: 'Sector_Area' },
  { label: 'Rounds Chanted', key: 'how_many_rounds_you_chant' },
  { label: 'Chanting Since', key: 'when_are_you_chantin', format: (value: string) => new Date(value).toLocaleDateString('en-GB') },
  { label: 'Lecture Time Spent', key: 'spend_everyday_hearing_lectures' },
  { label: 'Bhakti Shastri Degree', key: 'bakti_shastri_degree' },
  { label: 'Ashray Leader', key: 'ashery_leader_name' },
];

const mappedFieldConfigs: { section: string; fields: FieldConfigItem[] }[] = [
  {
    section: 'Books',
    fields: [
      { label: 'Book Name (English)', key: 'book_name_english' },
      { label: 'Book Name (Hindi)', key: 'book_name_hindi' },
    ],
  },
  {
    section: 'Prayers',
    fields: [
      { label: 'Prayer Name (English)', key: 'prayer_name_english' },
      { label: 'Prayer Name (Hindi)', key: 'prayer_name_hindi' },
    ],
  },
  {
    section: 'Principles',
    fields: [
      { label: 'Principle Name (English)', key: 'principle_name_eglish' },
      { label: 'Principle Name (Hindi)', key: 'principle_name_hindi' },
    ],
  },
  {
    section: 'Seminars',
    fields: [
      { label: 'Seminar Name (English)', key: 'seminar_name_english' },
      { label: 'Seminar Name (Hindi)', key: 'seminar_name_hindi' },
    ],
  },
];

export default function PreviewComponent() {
  const { MatchedDevoteeSuperAdminList, Dbook, Dprayer, Dprincipal, Dseminar } = usePage<{
    MatchedDevoteeSuperAdminList: User[];
    Dbook: User[];
    Dprayer: User[];
    Dprincipal: User[];
    Dseminar: User[];
  }>().props;

  const validMatchedDevoteeSuperAdminList = Array.isArray(MatchedDevoteeSuperAdminList) ? MatchedDevoteeSuperAdminList : [];

  const items = [{ title: 'Dashboard', href: '/Devotee/dashboard' }].map((item, index) => (
    <Anchor href={item.href} key={index}>
      {item.title}
    </Anchor>
  ));

  const renderMappedFields = (section: string, data: User[], fields: FieldConfigItem[]) => (
    <Card shadow="sm" padding="lg" radius="md" withBorder mt="lg">
      <Text  size="lg" mb="md" color="blue">
        {section}
      </Text>
      <Grid gutter="md">
        {data.map((item, index) =>
          fields.map(({ label, key }) => (
            <Grid.Col span={6}  key={`${key}-${index}`}>
              <TextInput label={label} value={String(item[key] || '')} readOnly />
            </Grid.Col>
          ))
        )}
      </Grid>
    </Card>
  );

  return (
    <Container fluid py={20}>
      <Breadcrumbs>
        {items}
        <>Partially Filled Devotees</>
      </Breadcrumbs>

      <Grid mt="lg">
        {validMatchedDevoteeSuperAdminList.length > 0 ? (
          validMatchedDevoteeSuperAdminList.map((user, index) => (
            <Grid.Col span={12} key={index}>
              <Card shadow="sm" padding="lg" radius="md" withBorder>
                <Grid gutter="md">
                  {fieldConfig.map(({ label, key, format }) => (
                    <Grid.Col span={3} key={key}>
                      <TextInput label={label} value={format ? format(user[key]) : String(user[key] || '')} readOnly />
                    </Grid.Col>
                  ))}
                </Grid>
              </Card>
            </Grid.Col>
          ))
        ) : (
          <Text color="dimmed">No records found.</Text>
        )}
      </Grid>

      {renderMappedFields('Devotee Books', Dbook, mappedFieldConfigs[0].fields)}
      {renderMappedFields('Devotee Prayers', Dprayer, mappedFieldConfigs[1].fields)}
      {renderMappedFields('Devotee Principles', Dprincipal, mappedFieldConfigs[2].fields)}
      {renderMappedFields('DevoteeSeminars', Dseminar, mappedFieldConfigs[3].fields)}
    </Container>
  );
}
