export type Message = {
  id: number;
  name: string;
  subject: string;
  description: string;
  from_id: string;
  to_id: string;
  devotee_type: string;
  query_id: string;
  is_viewed: number;
  created_at: string;
  user_type: 'SuperAdmin' | 'Devotee';
};
