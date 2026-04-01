import { Button, Container, Title } from '@mantine/core';
import { Link, router } from '@inertiajs/react';

function SelectUser({ users }: { users: any[] }) {
  const handleUserSelect = (userId: number) => {
    router.post('/set-session', { user_id: userId });
  };

  return (
    <Container>
      <Title order={3}>Select a User</Title>
      {users.map((user) => (
        <div key={user.id}>
          <span>{user.email}</span>
          <Button onClick={() => handleUserSelect(user.id)}>Select</Button>
        </div>
      ))}
    </Container>
  );
}

export default SelectUser;
