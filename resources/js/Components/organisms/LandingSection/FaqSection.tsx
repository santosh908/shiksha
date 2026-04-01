import { Title, Container } from '@mantine/core';
import classes from './FaqSection.module.css';

export default function FaqSection() {
  return (
    <Container mb="lg" size="xl" p="0" className="overflow-hidden border border-orange-200 shadow rounded-2xl">
      <div className={classes.wrapper}>
        <Container size="md">
          <Title ta="center" className={`${classes.title} text-orange-500 `}>
            Frequently Asked Questions
          </Title>
{/* <Accordion
            chevronPosition="right"
            defaultValue="reset-password"
            chevronSize={26}
            variant="separated"
            disableChevronRotation
            styles={{ label: { color: 'var(--mantine-color-black)' }, item: { border: 0 } }}
            chevron={
              <ThemeIcon radius="xl" className={classes.gradient} size={26}>
                <IconPlus style={{ width: rem(18), height: rem(18) }} stroke={1.5} />
              </ThemeIcon>
            }>
            <Accordion.Item className={classes.item} value="reset-password">
              <Accordion.Control>What is the significance of the Hare Krishna mantra?</Accordion.Control>
              <Accordion.Panel>{placeholder}</Accordion.Panel>
            </Accordion.Item>

            <Accordion.Item className={classes.item} value="another-account">
              <Accordion.Control>Who is Lord Krishna?</Accordion.Control>
              <Accordion.Panel>{placeholder}</Accordion.Panel>
            </Accordion.Item>

            <Accordion.Item className={classes.item} value="newsletter">
              <Accordion.Control>What are the main activities in a Hare Krishna temple?</Accordion.Control>
              <Accordion.Panel>{placeholder}</Accordion.Panel>
            </Accordion.Item>

            <Accordion.Item className={classes.item} value="credit-card">
              <Accordion.Control>How can I participate in temple services?</Accordion.Control>
              <Accordion.Panel>{placeholder}</Accordion.Panel>
            </Accordion.Item>

            <Accordion.Item className={classes.item} value="payment">
              <Accordion.Control>What is the philosophy behind Krishna Consciousness?</Accordion.Control>
              <Accordion.Panel>{placeholder}</Accordion.Panel>
            </Accordion.Item>
          </Accordion> */}
          <div className="text-center mt-8">
            <p className="text-lg text-gray-600 animate-pulse">
              Frequently Asked Questions will be coming soon!
            </p>
          </div>
        </Container>
      </div>
    </Container>
  );
}
