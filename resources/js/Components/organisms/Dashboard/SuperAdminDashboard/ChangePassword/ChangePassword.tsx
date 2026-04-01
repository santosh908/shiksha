import { useForm } from '@mantine/form';
import React, { useEffect, useState } from 'react';
import { router, usePage } from '@inertiajs/react';
import { Container, Grid, TextInput, Button, Group, Card, PasswordInput, Breadcrumbs, Anchor } from '@mantine/core';
import { IconMail, IconUser } from '@tabler/icons-react';
import useUserStore from '@/Store/User.store';

type ChangePassword = {
  id: string;
  email: string;
  loginid: string;
  password: string;
  confirm_password: string;
};

export default function ChangePassword() {
  const [isupdating, setIsUdating] = useState(false);
  const [currentPassword, setCurrentPassword] = useState<ChangePassword | null>(null);
  const [emailValid, setEmailValid] = useState<boolean | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const { name: UserName, login_id: LoginID,roles:roleName } = useUserStore();

  const form = useForm({
    initialValues: {
      id: '',
      email: '',
      loginid: '',
      password: '',
      confirm_password: '',
    },
  });

  useEffect(() => {
    if (currentPassword) {
      form.setValues({
        id: currentPassword.id || '',
        email: currentPassword.email || '',
        loginid: currentPassword.loginid || '',
        password: currentPassword.password || '',
        confirm_password: currentPassword.confirm_password || '',
      });
    }
  }, [currentPassword]);

  // Fetch login ID based on email input
  const handleEmailChange = async (email: string) => {
    form.setFieldValue('email', email);
    setEmailValid(null);
    setEmailError(null);
    if (email) {
      try {
        const response = await fetch(`/Action/get-login-id/${email}`);
        if (response.ok) {
          const data = await response.json();
          form.setFieldValue('loginid', data.login_id); // Set the login ID in the form
          setEmailValid(true);
        } else {
          form.setFieldValue('loginid', ''); // Clear the login ID if email is not found
          setEmailValid(false); // Mark email as invalid
          setEmailError('Email not found in our records.'); // Set error message
        }
      } catch (error) {
        console.error('Error fetching login ID:', error);
        form.setFieldValue('loginid', ''); // Clear login ID on error
        setEmailValid(false); // Mark email as invalid
        setEmailError('Error validating email. Please try again.'); // Set error message
      }
    }
  };

  const { errors } = usePage().props;
  useEffect(() => {
    if (Object.values(errors).length) {
      form.setErrors(errors);
    }
  }, [errors]);

  const handleSubmit = () => {
    if (isupdating && currentPassword) {
      router.put(`/Action/changepassword/${currentPassword.id}`, form.values, {
        onSuccess: () => {
          setIsUdating(false);
          form.reset();
        },
        onError: () => {
          // Handle error
        },
      });
    } else {
      router.post('/Action/changepassword', form.values, {
        onSuccess: () => {
          form.reset();
        },
        onError: () => {
          // Handle error
        },
      });
    }
  };

  return (
    <Container fluid  py={20}>
      <Breadcrumbs> 
          <Anchor href={`/${roleName[0]}/dashboard`}>Dashboard</Anchor>
          <label>Change Password</label>
      </Breadcrumbs>

      <Card py={30} mt={20} shadow="sm" padding="lg" radius="md" withBorder>
        <Grid>
            <Grid.Col span={{base:12, md: 6, lg: 6}}>
              <h6 style={{ textAlign: 'center', fontWeight: 'bold' }}>CHANGE PASSWORD</h6>
              <TextInput
                withAsterisk
                autoComplete="off"
                leftSection={<IconMail />}
                label="Gmail:"
                {...form.getInputProps('email')}
                onChange={(e) => handleEmailChange(e.target.value)} // Call handleEmailChange on email input change
              />
              {emailValid === false && <div style={{ color: 'red' }}>{emailError}</div>}
              {emailValid === true && <div style={{ color: 'green' }}>Email is valid.</div>}
            </Grid.Col>
            <Grid.Col py={28} span={{base:12, md: 6, lg: 6}}>
              <TextInput leftSection={<IconUser />} label="Login ID:" {...form.getInputProps('loginid')} readOnly />
            </Grid.Col>
            <Grid.Col span={{base:12, md: 6, lg: 6}}>
              <PasswordInput  className="w-full" placeholder="Enter New Password" label="Password:" {...form.getInputProps('password')} />
            </Grid.Col>
            <Grid.Col span={{base:12, md: 6, lg: 6}}>
              <PasswordInput
                className="w-full"
                placeholder="Enter Confirm Password"
                label="Password:"
                {...form.getInputProps('confirm_password')}
              />
            </Grid.Col>

            <Grid.Col span={{base:12, md: 6, lg: 6}}>
              <Group justify="center" mt="md">
                <Button type="button" onClick={handleSubmit} color="green" disabled={emailValid === false || emailValid === null}>
                  {isupdating ? 'Update' : 'Change Password'}
                </Button>
                <Button type="button" onClick={() => form.reset()} color="green">
                  Reset
                </Button>
              </Group>
            </Grid.Col>
        </Grid>
      </Card>
    </Container>
  );
}
function validatePasswordForm(values: { id: string; email: string; loginid: string; password: string; confirm_password: string }) {
  throw new Error('Function not implemented.');
}
