import { Title, Text, Button, Container, Group } from '@mantine/core';
import classes from './NotFoundTitle.module.css';
import { router } from '@inertiajs/react';

function Dashboard()
{
    return (
     <Container className={classes.root}>
      <div className={classes.label}>Session Ended</div>
      <Title className={classes.title}>You have not logout properly</Title>

      <Text c="dimmed" size="lg" ta="center" className={classes.description}>
        Your session has ended, possibly because you didn’t log out properly or it expired.  
        🔑 For your security, kindly click the button below and log in again..
      </Text>

      <Group justify="center" mt="md">
        <Button variant="subtle" onClick={() => router.get('/logout')} size="md">
          Click here to login
        </Button>
      </Group>
    </Container>
      );
}

export default Dashboard;