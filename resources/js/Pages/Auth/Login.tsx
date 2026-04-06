import GuestNonLandingLayout from '@/Layouts/guest/GuestNonLandingLayout';
import { Anchor, Box, Button, Container, Flex, PasswordInput, TextInput, Title, useMantineTheme } from '@mantine/core';
import React, { useEffect } from 'react';
import { useForm } from '@mantine/form';
import { IconMail, IconUser } from '@tabler/icons-react';
import { Link, router } from '@inertiajs/react';

function Login({ errors }: any) {
  const form = useForm({
    initialValues: {
      login_id: '',
      password: '',
    },
  });

  useEffect(() => {
    if (Object.entries(errors).length > 0) {
      form.setErrors(errors);
    }
  }, [errors]);

  const handleSubmit = () => {
    router.post('/login', form.values);
  };
  const theme = useMantineTheme();

  return (
    <GuestNonLandingLayout pageTitle="Login">
      <Box mx="auto" style={{ width: 'min(500px,90%)' }} className="overflow-hidden border rounded-lg ">
        {/* login page  */}
        <Flex p="xl" style={{ background: "url('/flower.png')", backgroundPositionY: 'center' }} direction="column" gap="sm">
          <Title order={3} mb="sm" className="text-center underline" style={{ color: theme.colors.gray[9] }}>
            Login to your account
          </Title>

          <TextInput
            size="md"
            leftSection={<IconUser />}
            className="w-full"
            placeholder="Enter Email Id or Login Id"
            label="Login Id or Email Id:"
            {...form.getInputProps('login_id')}
          />
          <PasswordInput size="md" className="w-full" placeholder="Enter Password" label="Password:" {...form.getInputProps('password')} />

          <Button mt="sm" size="md" variant="filled" onClick={handleSubmit} style={{ width: '100%' }}>
            Login
          </Button>

          <Flex direction="column" justify="center" align="center" gap="sm">
            <a href="/forgotPassword" className="text-blue-500">
              Forgot Password?
            </a>
            <Button onClick={() => router.get('/register')} variant="subtle" className="w-full underline ">
              Register
            </Button>
          </Flex>
        </Flex>
      </Box>
    </GuestNonLandingLayout>
  );
}

export default Login;
