import React, { FormEvent, useEffect, useState } from 'react';
import GuestNonLandingLayout from '@/Layouts/guest/GuestNonLandingLayout';
import { Box, Button, Flex, TextInput, Title,Text, useMantineTheme,Notification } from '@mantine/core';
import { useForm } from '@mantine/form';
import { Link, router, usePage } from '@inertiajs/react';
import { IconCheck, IconX } from '@tabler/icons-react';


function ForgotPassword(){

  const theme = useMantineTheme();

  const form = useForm({
    initialValues: {
      email: '',
    },
  });

  const { errors } = usePage().props;
  useEffect(() => {
    if (Object.values(errors).length) {
      form.setErrors(errors);
    }
  }, [errors]);

  const handleSubmit = () => {
    router.post('/forgotPassword', form.values, {
      onSuccess: () => {
        setNotificationMessage('Reset password link has been send to your Email Id!');
        setNotificationColor('teal');
        setShowNotification(true);
        form.reset();
      },
      onError: () => {
        setNotificationMessage('Failed to send password reset link.');
        setNotificationColor('red');
        setShowNotification(true);
      },
    });
  };
  
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [notificationColor, setNotificationColor] = useState('teal');
  

  return (
    <GuestNonLandingLayout pageTitle="Forgot Password">
      <Box mx="auto" style={{ width: 'min(500px,90%)', height:'290px'}} className="overflow-hidden border rounded-lg ">
      <Box>
        {showNotification && (
          <Notification
            icon={notificationColor === 'teal' ? <IconCheck size={18} /> : <IconX size={18} />}
            color={notificationColor}
            title={notificationColor === 'teal' ? 'Success' : 'Error'}
            onClose={() => setShowNotification(false)}
          >
            {notificationMessage}
          </Notification>
        )}
      </Box>
        <Flex p="xl" style={{ background: "url('/flower.png')", backgroundPositionY: 'center' }} direction="column" gap="sm">
            <Title order={3} mb="sm" className="text-center underline" style={{ color: theme.colors.gray[9] }}>
              Forgot Password
            </Title>
            {status && <div>{status}</div>}
            <TextInput
                    type="email"
                    name="email"
                    //value={data.email}
                    {...form.getInputProps('email')}
                    placeholder="Email"
                    required
                  />
            <Button mt="sm" size="md" variant="filled"  onClick={handleSubmit} style={{ width: '100%' }}>
              Send Password Reset Link
            </Button>
            <Flex direction="column" justify="center" align="center" gap="sm">
                <Text size="sm">Already have an account?</Text>
                <Link href="/login" className="text-blue-500 hover:underline">
                  Login
                </Link>
            </Flex>
        </Flex>
      </Box>
    </GuestNonLandingLayout>
  );
};

export default ForgotPassword;
