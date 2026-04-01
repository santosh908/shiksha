export type SessionResultList = {
  id: number;
  login_id: string;
  name: string;
  email: string;
  contact_number: string;
  ashery_leader_name: string;
  exam_date: string;
  shiksha_level: number;
  total_questions: number;
  total_marks: string;
  total_obtain: string;
  is_promoted_by_ashray_leader: string;
  exam_id: number | null;
  exam_level: string;
  is_qualified: string;
  session_name: string;
  exam_session: number;
};
