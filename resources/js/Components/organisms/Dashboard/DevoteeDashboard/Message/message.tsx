import { usePage, router } from '@inertiajs/react';
import {
  Container,
  Stack,
  Group,
  Button,
  TextInput,
  ScrollArea,
  Avatar,
  Text,
  ActionIcon,
  Paper,
  Box,
  Card,
  Divider,
  Modal,
  Breadcrumbs,
  Anchor,
  Grid,
  Textarea,
  Flex,
} from '@mantine/core';
import { ChevronLeft, Send, Plus, Badge, MessageCircle } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Message, ChatMessage, MessagePageProps, GroupedMessages } from './message.types';
import useUserStore from '@/Store/User.store';
import { notifications } from '@mantine/notifications';
import { IconCheck, IconMinus, IconPlus, IconSend, IconTimelineEventExclamation } from '@tabler/icons-react';
import RichText from '@/Components/molecules/RichText/RichText';
import dayjs from 'dayjs';
import { Blob } from 'buffer';

export default function MessageComponent() {
  const { messages, chatHistory: initialChatHistory, user } = usePage<MessagePageProps>().props;
  const { name: UserName, login_id: LoginID, roles: roleName } = useUserStore();

  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  const [isNewQueryModalOpen, setNewQueryModalOpen] = useState(false);
  const [querySubject, setQuerySubject] = useState('');
  const [queryText, setQueryText] = useState('');

  const validMessages = Array.isArray(messages) ? messages : [];

  const groupedMessages = validMessages.reduce((acc: GroupedMessages, message: Message) => {
    if (!acc[message.query_id]) acc[message.query_id] = message;
    return acc;
  }, {});
  const tableMessages = Object.values(groupedMessages);

const toggleMessage = (msg: Message) => {
  if (selectedMessage?.query_id === msg.query_id) {
    setSelectedMessage(null); // If already selected, collapse it
  } else {
    setSelectedMessage(msg); // Otherwise, open it
  }
};
  const scrollToBottom = () => chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });

  useEffect(() => {
    if (initialChatHistory) setChatHistory(initialChatHistory);
  }, [initialChatHistory]);

  useEffect(() => {
    if (selectedMessage) {
      router.get(
        '/Devotee/message',
        { query_id: selectedMessage.query_id },
        {
          preserveState: true,
          preserveScroll: true,
          onSuccess: (page) => {
            const chatData = page.props.chatHistory as ChatMessage[];
            if (chatData) setChatHistory(chatData);
          },
        }
      );
    }
  }, [selectedMessage]);

  useEffect(scrollToBottom, [chatHistory]);

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedMessage) return;

    const messageData = {
      description: newMessage,
      from_id: user.login_id,
      to_id: 'SuperAdmin',
      query_id: selectedMessage.query_id,
      subject: selectedMessage.subject,
    };

    router.post(route('devotee.message'), messageData, {
      preserveState: true,
      preserveScroll: true,
      onSuccess: (page) => {
        const updatedChatHistory = page.props.chatHistory as ChatMessage[];
        if (updatedChatHistory) setChatHistory(updatedChatHistory);
        setNewMessage('');
      },
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleQuerySubmit = () => {
    const strippedText = queryText.replace(/<[^>]*>/g, '');
    router.post(
      route('devotee.message'),
      {
        subject: querySubject,
        description: strippedText,
        from_id: LoginID,
      },
      {
        onSuccess: () => {
          setQueryText('');
          setQuerySubject('');
          setNewQueryModalOpen(false);
          notifications.show({
            title: 'Success',
            message: 'Query raised successfully',
            color: 'green',
            icon: <IconCheck size={16} />,
          });
        },
        onError: () => {
          notifications.show({
            title: 'Error',
            message: 'Failed to raise query. Please try again.',
            color: 'red',
            icon: <IconTimelineEventExclamation size={16} />,
          });
        },
      }
    );
  };

  return (
    <Container fluid>
  <Stack>
    {/* Breadcrumbs */}
    <Breadcrumbs py={25}>
      <Anchor href={`/${roleName[0]}/dashboard`}>Dashboard</Anchor>
      <Text>Messages</Text>
    </Breadcrumbs>

    {/* Raise Query Button */}
    <Group  className="flex-wrap">
      <Button
        leftSection={<Plus size={18} />}
        onClick={() => setNewQueryModalOpen(true)}
        color="green"
        className="w-full sm:w-auto"
      >
        Raise New Query
      </Button>
    </Group>

    {/* Grid Layout */}
    <Grid gutter="md">
      <Grid.Col mx="auto">
        <Card>
          <Stack  p="xs">
            {tableMessages.map((msg) => {
              const isOpen = selectedMessage?.query_id === msg.query_id;

              return (
                <Box key={msg.query_id}>
                  <Group
                    onClick={() => toggleMessage(msg)}
                    className="border rounded-md hover:bg-gray-100 transition-colors duration-200 cursor-pointer"
                    style={{
                      backgroundColor: isOpen ? '#f1f5f9' : 'white',
                      padding: '10px',
                    }}
                    align="center"
                    wrap="wrap"
                  >
                    <Avatar>{msg.name.charAt(0)}</Avatar>

                    <Box className="min-w-0 flex-1">
                      <Text fw={600} truncate>
                        {msg.subject}
                      </Text>
                      <Text size="xs" color="dimmed" truncate>
                        {msg.name} • {dayjs(msg.created_at).format('YYYY-MM-DD')}
                      </Text>
                      <Text size="xs" color="dimmed">{msg.from_id}</Text>
                    </Box>

                    {isOpen ? (
                      <IconMinus size={18} stroke={1.5} />
                    ) : (
                      <IconPlus size={18} stroke={1.5} />
                    )}
                  </Group>

                  {/* Accordion Chat Content */}
                  {isOpen && (
                    <Box mt="xs" ml="md" mr="sm">
                      <Divider mb="sm" />
                      <ScrollArea h="40vh">
                        <Stack>
                          {chatHistory
                            .filter((chatMsg) => chatMsg.query_id === msg.query_id)
                            .map((chatMsg) => (
                              <Group
                                key={chatMsg.id}
                                align="flex-end"
                                style={{
                                  marginLeft: chatMsg.isOutgoing ? 'auto' : 0,
                                  maxWidth: '75%',
                                }}
                              >
                                <Paper
                                  p="sm"
                                  radius="md"
                                  style={{
                                    backgroundColor: chatMsg.isOutgoing
                                      ? '#e3f2fd'
                                      : '#f5f5f5',
                                  }}
                                >
                                  <Text>{chatMsg.content}</Text>
                                </Paper>
                                <Text size="xs" color="dimmed">
                                  {dayjs(chatMsg.created_at).format('YYYY-MM-DD')}
                                </Text>
                              </Group>
                            ))}
                          <div ref={chatEndRef} />
                        </Stack>
                      </ScrollArea>

                      {/* Message Input */}
                      <Flex
                        mt="md"
                        className="flex flex-col md:flex-row w-full gap-2"
                        align="flex-start"
                      >
                        <Textarea
                          placeholder="Type your message"
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          onKeyDown={handleKeyPress}
                          minRows={3}
                          autosize
                          className="w-full"
                        />
                        <ActionIcon
                          variant="filled"
                          color="blue"
                          onClick={handleSendMessage}
                          disabled={!newMessage.trim()}
                          className="self-end md:self-auto mt-2 md:mt-0"
                          size="lg"
                        >
                          <IconSend size={16} />
                        </ActionIcon>
                      </Flex>
                    </Box>
                  )}
                </Box>
              );
            })}
          </Stack>
        </Card>
      </Grid.Col>
    </Grid>
  </Stack>

  {/* Raise Query Modal */}
  <Modal
    opened={isNewQueryModalOpen}
    onClose={() => setNewQueryModalOpen(false)}
    title="Raise a Query"
    centered
    size="xl"
  >
    <Stack >
      <TextInput
        label="Subject"
        placeholder="Enter the subject of your query"
        value={querySubject}
        onChange={(event) => setQuerySubject(event.currentTarget.value)}
        required
      />
      <RichText value={queryText} onChange={setQueryText} />
      <Group justify="end">
        <Button variant="outline" onClick={() => setNewQueryModalOpen(false)}>
          Cancel
        </Button>
        <Button onClick={handleQuerySubmit}>Submit</Button>
      </Group>
    </Stack>
  </Modal>
</Container>

  );
}
