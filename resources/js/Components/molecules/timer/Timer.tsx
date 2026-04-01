import { Box, Flex, rem, rgba, useMantineTheme } from '@mantine/core';
import { useEffect, useState } from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';

const Timer = ({ time = 5 }) => {
  const [timeLeft, setTimeLeft] = useState(time * 10);
  const theme = useMantineTheme();

  useEffect(() => {
    if (!timeLeft) return;

    const intervalId = setInterval(() => {
      setTimeLeft(timeLeft - 1);
    }, 100);

    return () => clearInterval(intervalId);
  }, [timeLeft]);

  return (
    <Flex justify="center">
      <Box style={{ width: 100 }}>
        <CircularProgressbar
          strokeWidth={20}
          styles={{
            ...buildStyles({
              strokeLinecap: 'butt',
              trailColor: rgba(theme.colors.primary[1], 0.5),
              pathColor: theme.colors.primary[6],
              textColor: theme.colors.primary[6],
              textSize: rem(28),
            }),
          }}
          value={(timeLeft / (time * 10)) * 100}
          text={`${(timeLeft / 10) | 0}`}
        />
      </Box>
    </Flex>
  );
};

export default Timer;
