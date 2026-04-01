import { useEffect, useState } from 'react';
import GuestNonLandingLayout from '@/Layouts/guest/GuestNonLandingLayout';
import { Box, Button, Flex, TextInput, Title,Text, useMantineTheme,Notification, PasswordInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { Link, router, usePage } from '@inertiajs/react';
import { IconCheck, IconX } from '@tabler/icons-react';

type PageProps = {
  token: string;
};

function ResetPassword(){

  const { token } = usePage<PageProps>().props;

  const theme = useMantineTheme();

  const form = useForm({
    initialValues: {
      password: '',
      password_confirmation: '',
      token: token === 'NA' ? '' : token,
    },
  });

  const { errors } = usePage().props;
  useEffect(() => {
    if(token=="NA" && passwordChanged==false)
    {
      setLinkExpire(true);
    }
    if (Object.values(errors).length) {
      form.setErrors(errors);
    }
  }, [errors]);

  const handleSubmit = () => {
    router.post('/reset-password', form.values, {
      onSuccess: () => {
        setNotificationMessage('Password has been changed!');
        setPasswordChanged(true);
        setLinkExpire(false)
        setNotificationColor('teal');
        setShowNotification(true);
        form.reset();
      },
      onError: () => {
        setNotificationMessage('Failed to change password.');
        setNotificationColor('red');
        setShowNotification(true);
      },
    });
  };
  
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [notificationColor, setNotificationColor] = useState('teal');
  const [passwordChanged, setPasswordChanged] = useState(false);
  const[linkExpire,setLinkExpire]=useState(false);

  return (
    <GuestNonLandingLayout pageTitle="Forgot Password">
      {token!="NA" &&
        <Box style={{ width: 'min(500px,90%)'}} className="overflow-hidden border rounded-lg ">
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
                Change Password
              </Title>

                <PasswordInput size="md" className="w-full" placeholder="Enter Password" label="Password:" {...form.getInputProps('password')} />

                <PasswordInput size="md" className="w-full" placeholder="Enter Confirm Password" label="Confirm Password:" {...form.getInputProps('password_confirmation')} />

                <Button mt="sm" size="md" variant="filled"  onClick={handleSubmit} style={{ width: '100%' }}>
                  Submit
                </Button>

                <Flex direction="column" justify="center" align="center" gap="sm">
                    <Text size="sm">Already have an account?</Text>
                    <Link href="/login" className="text-blue-500 hover:underline">
                      Login
                    </Link>
                </Flex>
          </Flex>
        </Box>
      }
      {linkExpire && (
        <Box style={{ width: 'min(500px,90%)',maxHeight:'210px'}} className="overflow-hidden border rounded-lg ">
          <Flex p="xl" style={{ background: "url('/flower.png')", backgroundPositionY: 'center' }} direction="column" gap="sm">
            <Title order={3} mb="sm" className="text-center underline" style={{ color: theme.colors.red[9] }}>
              Link has expired or is not a valid reset link
            </Title>
            <Flex direction="column" justify="center" align="center" gap="sm">
              <Text size="sm">Already have an account?</Text>
              <Link href="/login" className="text-blue-500 hover:underline">
                Login
              </Link>
          </Flex>
          </Flex>
        </Box>
      )}
      {passwordChanged && ( 
        <Box style={{ width: 'min(500px,90%)' ,maxHeight:'210px'}} className="overflow-hidden border rounded-lg ">
          <Flex p="xl" style={{ background: "url('/flower.png')", backgroundPositionY: 'center' }} direction="column" gap="sm">
            <Title order={3} mb="sm"  className="text-center underline" style={{ color: theme.colors.green[9] }}>
              Your password has been successfully changed!
            </Title>
              <Flex direction="column" justify="center" align="center" gap="sm">
                    <Text size="sm">Click here to login</Text>
                    <Link href="/login" className="text-blue-500 hover:underline">
                      Login
                    </Link>
                </Flex>
          </Flex>
        </Box>
      )}
    </GuestNonLandingLayout>
  );
};

export default ResetPassword;
