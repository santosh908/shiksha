import { Button, Grid, Group, Select, TextInput } from '@mantine/core';
import { useEffect, useState } from 'react';
import { useForm } from '@mantine/form';
import { router, usePage } from '@inertiajs/react';
import { DateInput } from '@mantine/dates';
import { IconArrowRight, IconBackspace, IconCalendar, IconListCheck, IconSend } from '@tabler/icons-react';

interface PersonalInfoProps {
  masterData: any; // Or use a more specific type if you know the structure
  handleNext: () => void;
}
const formatDate = (dateString: any) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

export default function Devotee_PersonalInfo({ masterData, handleNext }: PersonalInfoProps) {
  const form = useForm({
    initialValues: {
      profileId: masterData.PersonalInfo?.id || 0,
      userId: masterData.User.id || 0,
      name: masterData.User?.name?.toString() || '',
      Initiated_name: masterData?.User?.Initiated_name?.toString() || '',
      email: masterData?.User?.email?.toString() || '',
      relation_type: masterData.User?.m_relation_type || 'self',
      relative_login_id: masterData.User?.relative_login_id || '',
      contact_number: masterData?.User?.contact_number?.toString() || '',
      dob: masterData?.User?.dob?.date || '',
      Educational: masterData.PersonalInfo?.education?.toString() || '',
      MaritalStatus: masterData.PersonalInfo?.marital_status?.toString() || '',
      Profession: masterData.PersonalInfo?.profession?.toString() || '',
      SpiritualMaster: masterData.PersonalInfo?.spiritual_master?.toString() || '',
      JoinedSckon: masterData.PersonalInfo?.join_askcon?.date || '',
      CurrentAddress: masterData.PersonalInfo?.current_address || '',
      Socity_Name: masterData.PersonalInfo?.Socity_Name || '',
      Sector_Area: masterData.PersonalInfo?.Sector_Area || '',
      PrmanentAddress: masterData.PersonalInfo?.permanent_address || '',
      Pincode: masterData.PersonalInfo?.pincode?.toString() || '',
      State: masterData.PersonalInfo?.state_code?.toString() || '',
      District: masterData.PersonalInfo?.district_code?.toString() || '',
      DOB: formatDate(masterData?.User?.dob), // Formatting the DOB
    },
  });

  const { errors } = usePage().props;

  useEffect(() => {
    if (Object.values(errors).length) {
      form.setErrors(errors);
    }
  }, [errors]);

  const handleSubmit = () => {
    router.post('/Action/UpdatePersonalInformation', form.values);
  };

  const [selectedState, setSelectedState] = useState<string | null>(null);
  const [districts, setDistricts] = useState<{ value: string; label: string }[]>([]);

  // Handle state change and filter districts
  const handleStateChange = (stateValue: string | null) => {
    setSelectedState(stateValue);
    form.setFieldValue('State', stateValue);

    if (stateValue) {
      const filteredDistricts = masterData?.District.filter((district: any) => district.state_code === stateValue).map((district: any) => ({
        value: district.district_lg_code.toString(), // Assuming district_code is a number, convert to string
        label: district.district_name,
      }));

      const uniqueDistricts = Array.from(new Set(filteredDistricts.map((d: any) => d.value))).map(
        (value) => filteredDistricts.find((d: any) => d.value === value)!
      );
      setDistricts(uniqueDistricts);
    } else {
      setDistricts([]);
    }
  };

  useEffect(() => {
    // Initialize districts based on the initial state selection
    if (selectedState) {
      handleStateChange(selectedState);
    }
  }, [selectedState]);

  useEffect(() => {
    const initialState = form.values.State;
    const initialDistrict = form.values.District;

    if (initialState) {
      setSelectedState(initialState);
      handleStateChange(initialState); // Load districts for the saved state

      // Set the saved district in the list after loading districts
      setTimeout(() => {
        form.setFieldValue('District', initialDistrict);
      }, 0); // Allow time for districts to populate before setting the district
    }
  }, [masterData]);

  const enabledFalse = {
    pointerEvents: 'none',
    userSelect: 'none',
    backgroundColor: '#f1f1f1',
  };

  const today = new Date();

  const handlePincodeChange = (event: any) => {
    const value = event.target.value;

    // Allow only numeric values and ensure the length is 6 or less
    if (/^\d{0,6}$/.test(value)) {
      form.setFieldValue('Pincode', value); // Update the form data for Pincode
    }
  };

  useEffect(() => {
    if (masterData.PersonalInfo?.join_askcon) {
      form.setFieldValue('JoinedSckon', new Date(masterData.PersonalInfo?.join_askcon));
      form.setFieldValue('dob', new Date(masterData?.User?.dob));
    }
  }, [masterData]);

  return (
    <div>
      <Grid py={10}>
        <Grid.Col span={{ base: 12, md: 6, lg: 3 }}>
          <TextInput label="Name (नाम)" {...form.getInputProps('name')} value={form.values.name} />
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 6, lg: 3 }}>
          <TextInput label="Initiated Name (दीक्षित नाम)" {...form.getInputProps('Initiated_name')} value={form.values.Initiated_name} />
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 6, lg: 3 }}>
          <TextInput label="Email Address (ईमेल आईडी)" {...form.getInputProps('email')} value={form.values.email} />
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 3, lg: 3 }}>
          <TextInput
            label="Mobile Number (मोबाइल नंबर)"
            {...form.getInputProps('contact_number')}
            value={form.values.contact_number}
          />
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 3, lg: 3 }}>
          <Select
            label="Given number is self/relative? (दिया नंबर स्वयं / संबंधी का है)"
            placeholder="Select Relation Type"
            data={[
              { value: 'self', label: 'MySelf' },
              { value: 'relative', label: 'Relative' },
            ]}
            withAsterisk
            {...form.getInputProps('relation_type')}
          />
        </Grid.Col>
        {form.values.relation_type === 'relative' && (
          <Grid.Col span={{ base: 12, md: 3, lg: 3 }}>
            <TextInput
              label="Enter Relative Login ID (रिश्तेदार लॉगिन आईडी दर्ज करें)"
              placeholder="Enter Relative Login ID"
              {...form.getInputProps('relative_login_id')}
            />
          </Grid.Col>
        )}
        <Grid.Col span={{ base: 12, md: 6, lg: 3 }}>
          <DateInput
            size="md"
            className="w-full"
            withAsterisk
            leftSection={<IconCalendar />}
            placeholder="Select D.O.B."
            label="D.O.B. (जन्म तिथि):"
            autoComplete="off"
            maxDate={today}
            {...form.getInputProps('dob')}
          />
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 6, lg: 3 }}>
          <Select
            label="Educational Qualification (शैक्षिक योग्यता)"
            placeholder="Educational Qualification"
            data={masterData.Education.map((education: any) => ({
              value: education.id.toString(), // Convert id to string
              label: education.eduction_name,
            }))}
            value={form.values.Educational}
            {...form.getInputProps('Educational')}
            clearable
            searchable
          />
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 6, lg: 3 }}>
          <Select
            label="Marital Status (वैवाहिक स्थिति)"
            placeholder="Marital Status"
            data={masterData.MeritalStatus.map((merital: any) => ({
              value: merital.id.toString(), // Convert id to string
              label: merital.merital_status_name,
            }))}
            {...form.getInputProps('MaritalStatus')}
            value={form.values.MaritalStatus}
            clearable
            searchable
          />
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 6, lg: 3 }}>
          <Select
            label="Profession व्यवसाय"
            placeholder="Profession व्यवसाय"
            data={masterData.Profession.map((profession: any) => ({
              value: profession.id.toString(), // Convert id to string
              label: profession.profession_name,
            }))}
            {...form.getInputProps('Profession')}
            value={form.values.Profession}
            clearable
            searchable
          />
        </Grid.Col>
      </Grid>
      <Grid py={10}>
        <Grid.Col span={{ base: 12, md: 6, lg: 4 }}>
          <TextInput
            label="If you initiated, mention name of your spiritual master? (यदि आपने दीक्षा ली है तो अपने आध्यात्मिक गुरु का नाम बताएं?)"
            placeholder="If you initiated, mention name of your spiritual master? (यदि आपने दीक्षा ली है तो अपने आध्यात्मिक गुरु का नाम बताएं?)"
            {...form.getInputProps('SpiritualMaster')}
            value={form.values.SpiritualMaster}
          />
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 6, lg: 4 }}>
          <DateInput
            size="sm"
            className="w-full"
            withAsterisk
            leftSection={<IconCalendar />}
            maxDate={today}
            placeholder="Since when you are joind to ISKCON Dwarka"
            label={
              <>
                Since when are you connected to ISKON Dwarka
                <br /> आप कब से इस्कॉन द्वारका से जुड़े हुए हैं?
              </>
            }
            {...form.getInputProps('JoinedSckon')}
            value={form.values.JoinedSckon}
          />
        </Grid.Col>
        <Grid.Col
          span={{
            base: 12,
            md: 6,
            lg: 4,
          }}
        >
          <TextInput
            mt={'3.9%'}
            label="Address (पता)"
            placeholder="Address"
            {...form.getInputProps('CurrentAddress')}
            value={form.values.CurrentAddress}
            withAsterisk
          />
        </Grid.Col>
      </Grid>
      <Grid py={10}>
        <Grid.Col
          span={{
            base: 12,
            md: 6,
            lg: 3,
          }}
        >
          <TextInput
            label="Socity Name (सोसाइटी का नाम)"
            placeholder="Socity Name"
            {...form.getInputProps('Socity_Name')}
            value={form.values.Socity_Name}
            withAsterisk
          />
        </Grid.Col>

        <Grid.Col
          span={{
            base: 12,
            md: 6,
            lg: 3,
          }}
        >
          <TextInput
            label="Sector/Area (सेक्टर/क्षेत्र)"
            placeholder="Sector/Area"
            {...form.getInputProps('Sector_Area')}
            value={form.values.Sector_Area}
            withAsterisk
          />
        </Grid.Col>

        <Grid.Col
          span={{
            base: 12,
            md: 6,
            lg: 3,
          }}
        >
          <TextInput
            label="Pincode (पिनकोड)"
            placeholder="Pincode"
            inputMode="numeric"
            maxLength={6}
            onChange={handlePincodeChange}
            //{...form.getInputProps('Pincode')}
            value={form.values.Pincode}
            withAsterisk
          />
        </Grid.Col>
        <Grid.Col
          span={{
            base: 12,
            md: 6,
            lg: 3,
          }}
        >
          <Select
            label="State (राज्य)"
            placeholder="State"
            data={masterData.State.map((state: any) => ({
              value: state.lg_code,
              label: state.state_name,
            }))}
            // value={selectedState}
            {...form.getInputProps('State')}
            onChange={handleStateChange}
            value={form.values.State}
            clearable
            searchable
            withAsterisk
          />
        </Grid.Col>
        <Grid.Col
          span={{
            base: 12,
            md: 6,
            lg: 3,
          }}
        >
          <Select
            label="District (जिला)"
            placeholder="District"
            data={districts}
            // disabled={!selectedState}
            {...form.getInputProps('District')}
            value={form.values.District || ''}
            clearable
            searchable
            withAsterisk
          />
        </Grid.Col>
      </Grid>
      <Grid>
        <Grid.Col span={12}>
          <Group justify="center" mt="md">
            {masterData?.PersonalInfo?.status_code === 'S' ? (
              <Button type="submit" color="yellow" onClick={() => router.visit(`/Action/devoteeList`)}>
                <IconListCheck size={20} /> Back To DevoteeList
              </Button>
            ) : (
              <Button type="submit" color="blue" onClick={() => router.visit('/Action/partiallydevoteeList')}>
                <IconListCheck size={20} /> Back to Partially Devotee List
              </Button>
            )}
            {masterData?.PersonalInfo?.personal_info === 'Y' ? (
              <Button type="submit" color="green" onClick={handleSubmit}>
                <IconSend size={20} /> Update
              </Button>
            ) : (
              <Button type="submit" color="green" onClick={handleSubmit}>
                <IconSend size={20} /> Save
              </Button>
            )}
            {masterData?.PersonalInfo?.personal_info === 'Y' ? (
              <Button type="button" color="orange" onClick={handleNext}>
                Next <IconArrowRight size={20} />
              </Button>
            ) : (
              <></>
            )}
          </Group>
        </Grid.Col>
      </Grid>
    </div>
  );
}
