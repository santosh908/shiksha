import { usePage, router } from '@inertiajs/react';
import {
  Container,
  Card,
  Breadcrumbs,
  Anchor,
  Grid,
  Button,
  Modal,
  Stack,
  Paper,
  Group,
  ScrollArea,
  Avatar,
  Text,
  ActionIcon,
  TextInput,
  Badge,
  Box,
  Divider,
} from '@mantine/core';
import { Message } from './message.types';
import { useState, useEffect } from 'react';
import React from 'react';
import { ChevronLeft, Send, Search, Star, StarOff, MessageCircle } from 'lucide-react';
import dayjs from 'dayjs';
import useUserStore from '@/Store/User.store';

interface ChatMessage {
  id: number;
  content: string;
  sender: string;
  senderId: string;
  timestamp: string;
  isOutgoing: boolean;
  query_id: string;
}

export default function MessageComponent() {
  const { messages, chatHistory: initialChatHistory } = usePage<{
    messages: Message[];
    chatHistory?: ChatMessage[];
  }>().props;

  const validMessages = Array.isArray(messages) ? messages : [];

  const [modalOpened, setModalOpened] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const chatEndRef = React.useRef<HTMLDivElement>(null);
  const { name: UserName, login_id: LoginID, roles: roleName } = useUserStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [starredMessages, setStarredMessages] = useState<Set<string>>(new Set());

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (selectedMessage) {
      // Load chat history through Inertia request
      router.get(
        '/SuperAdmin/message',
        { query_id: selectedMessage.query_id },
        {
          preserveState: true,
          preserveScroll: true,
          onSuccess: (page) => {
            const chatData = page.props.chatHistory as ChatMessage[];
            if (chatData) {
              setChatHistory(chatData);
            }
          },
        }
      );
    }
  }, [selectedMessage]);

  useEffect(() => {
    if (initialChatHistory) {
      setChatHistory(initialChatHistory);
    }
  }, [initialChatHistory]);

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory]);

  const handleSendMessage = () => {
    if (newMessage.trim() && selectedMessage) {
      const messageData = {
        description: newMessage,
        from_id: 'SuperAdmin', 
        to_id: selectedMessage.from_id,
        query_id: selectedMessage.query_id,
        subject: selectedMessage.subject,
      };

      router.post('/SuperAdmin/message', messageData, {
        preserveState: true,
        preserveScroll: true,
        onSuccess: (page) => {
          const updatedChatHistory = page.props.chatHistory as ChatMessage[];
          if (updatedChatHistory) {
            setChatHistory(updatedChatHistory);
          }
          setNewMessage('');
        },
      });
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Group messages by query_id
  const groupedMessages = validMessages.reduce((acc: { [key: string]: Message }, message: Message) => {
    if (!acc[message.query_id]) {
      acc[message.query_id] = message;
    }
    return acc;
  }, {});

  const messagesList = Object.values(groupedMessages);
  
  // Filter messages based on search query
  const filteredMessages = messagesList.filter(message => 
    message.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
    message.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    message.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleStarMessage = (queryId: string) => {
    setStarredMessages(prev => {
      const newStarred = new Set(prev);
      if (newStarred.has(queryId)) {
        newStarred.delete(queryId);
      } else {
        newStarred.add(queryId);
      }
      return newStarred;
    });
  };

  // Get devotee type badge color
  const getDevoteeTypeColor = (devoteeType: string) => {
    const colorMap: Record<string, string> = {
      'AU': 'blue',
      'SA': 'green',
      'CA': 'orange',
      'AL': 'purple',
      'BB': 'pink',
    };
    return colorMap[devoteeType] || 'gray';
  };

  return (
    <Container fluid py={20}>
      <Breadcrumbs>
        <Anchor href={`/${roleName[0]}/dashboard`}>Dashboard</Anchor>
        <label>Messages</label>
      </Breadcrumbs>

      <Card py={20} mt={20} shadow="sm" padding="lg" radius="md" withBorder>
        <Group  mb={20} style={{borderBottom:"1px solid #ddd"}}>
          <Text size="xl">Inbox</Text>
          <TextInput
            placeholder="Search Query..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.currentTarget.value)}
            style={{ width: '300px' }}
          />
        </Group>

        <ScrollArea h="calc(100vh - 150px)">
          <Stack>
            {filteredMessages.length > 0 ? (
              filteredMessages.map((message, index) => (
                <React.Fragment key={message.query_id}>
                  <Box style={{borderBottom:"1px solid #ddd", cursor:'pointer'}}
                    p="sm"
                    onClick={() => {
                      setSelectedMessage(message);
                      setModalOpened(true);
                    }}
                  >
                    <Group mb={8}>
                      <Group>
                        <Avatar radius="xl" size="md" color={getDevoteeTypeColor(message.devotee_type)}>
                          {message.name.charAt(0)}
                        </Avatar>
                        <div>
                          <Group>
                            <Text>{message.subject}</Text>
                            <Badge size="sm" radius="xl" variant="light">
                            <Group>
                              <MessageCircle size={14} />
                              <Text>{message.query_id}</Text>
                            </Group>
                          </Badge>
                          </Group>
                          <Text size="xs" color="dimmed">
                            {message.from_id}
                          </Text>
                        </div>
                      </Group>
                    </Group>
                  </Box>
                </React.Fragment>
              ))
            ) : (
              <Box p="xl" ta="center">
                <Text color="dimmed">No messages found</Text>
              </Box>
            )}
          </Stack>
        </ScrollArea>
      </Card>

      <Modal
        opened={modalOpened}
        onClose={() => {
          setModalOpened(false);
          setSelectedMessage(null);
          setChatHistory([]);
        }}
        size="lg"
        fullScreen
        styles={{
          header: {color: "#000", borderRadius: "8px 8px 0 0" },
          title: { color: "#000", width: "100%" }
        }}
        title={
          <Group style={{ width: "100%" }}>
            <ActionIcon onClick={() => setModalOpened(false)} color="black" variant="transparent">
              <ChevronLeft size={24} />
            </ActionIcon>
            <Group>
              <Avatar 
                radius="xl" 
                size="md" 
                color={selectedMessage ? getDevoteeTypeColor(selectedMessage.devotee_type) : "blue"}
              >
                {selectedMessage?.name.charAt(0)}
              </Avatar>
              <div>
                <Text size="sm" color="black">{selectedMessage?.name}</Text>
                <Text size="xs" color="black" opacity={0.8}>
                  {selectedMessage?.devotee_type}
                </Text>
              </div>
            </Group>
          </Group>
        }
      > 
        <Stack h="calc(100vh - 100px)">
          <Paper p="md" withBorder>
            <Group>
              <Text size="lg">
                <strong>Subject</strong> - {selectedMessage?.subject}
              </Text>
              <Text size="sm" color="dimmed">
                {selectedMessage && dayjs(selectedMessage.created_at).format('MMMM D, YYYY h:mm A')}
              </Text>
            </Group>
          </Paper>

          <ScrollArea h="calc(100vh - 250px)" p="md">
            <Stack>
              {chatHistory.map((msg) => (
                <Group key={msg.id} align="flex-end" style={{ maxWidth: '80%', marginLeft: msg.isOutgoing ? 'auto' : 0 }}>
                  {!msg.isOutgoing && (
                    <Avatar 
                      radius="xl" 
                      size="md"
                      color={selectedMessage ? getDevoteeTypeColor(selectedMessage.devotee_type) : "gray"}
                    >
                      {msg.sender.charAt(0)}
                    </Avatar>
                  )}
                  <Stack>
                    {!msg.isOutgoing && (
                      <Text size="xs" color="dimmed">
                        {msg.sender}
                      </Text>
                    )}
                    <Paper
                      p="md"
                      radius="lg"
                      style={{
                        backgroundColor: msg.isOutgoing ? '#e3f2fd' : '#f5f5f5',
                        marginLeft: msg.isOutgoing ? 'auto' : 0,
                      }}
                    >
                      <Text>{msg.content}</Text>
                    </Paper>
                    <Text size="xs" color="dimmed">
                      {dayjs(msg.timestamp).format('MMM D, YYYY h:mm A')}
                    </Text>
                  </Stack>
                  {msg.isOutgoing && (
                    <Avatar radius="xl" size="md" color="blue">
                      S
                    </Avatar>
                  )}
                </Group>
              ))}
              <div ref={chatEndRef} />
            </Stack>
          </ScrollArea>

          <Paper p="md" style={{ borderTop: '1px solid #eee' }}>
            <Group>
              <TextInput
                placeholder="Type a message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                style={{ flex: 1 }}
              />
              <ActionIcon 
                color="#bd6d19" 
                variant="filled" 
                size="lg" 
                onClick={handleSendMessage} 
                disabled={!newMessage.trim()}
              >
                <Send size={18} />
              </ActionIcon>
            </Group>
          </Paper>
        </Stack>
      </Modal>
    </Container>
  );
}