interface PageProps {
  [key: string]: any;
}
// Base message properties that are common
interface BaseMessage {
  id: number;
  query_id: string;
  description?: string;
  content?: string;
  created_at?: string;
  timestamp?: string;
}
// List view message type
export interface Message extends BaseMessage {
  name: string;
  subject: string;
  description: string;
  from_id: string;
  devotee_type: string;
  is_viewed: number;
  created_at: string;
}
// Chat view message type
export interface ChatMessage extends BaseMessage {
  content: string;
  sender: string;
  senderId: string;
  timestamp: string;
  isOutgoing: boolean;
}
// Type for sending new messages
export interface MessagePayload {
  description: string;
  from_id: string;
  to_id: string;
  query_id: string;
  subject: string;
}
// Helper type for grouped messages
export interface GroupedMessages {
  [key: string]: Message;
}
// Type for the page props
export interface MessagePageProps extends PageProps {
  messages: Message[];
  chatHistory?: ChatMessage[];
  user: {
    login_id: string;
  };
}
