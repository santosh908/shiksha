import { router } from '@inertiajs/react';
import { Box, Container, Flex } from '@mantine/core';

type BreadcrumbProps = {
  titile: string;
};

function Breadcrumb({ titile }: BreadcrumbProps) {
  return (
    <Container className="p-5 mt-4 rounded-lg bg-slate-100" size="xl">
      <Flex gap="sm">
        <Box className="text-lg font-bold cursor-pointer hover:underline" onClick={() => router.get('/')}>
          Home
        </Box>
        <Box className="text-lg ">/</Box>
        <Box className="text-lg ">{titile}</Box>
      </Flex>
    </Container>
  );
}

export default Breadcrumb;
