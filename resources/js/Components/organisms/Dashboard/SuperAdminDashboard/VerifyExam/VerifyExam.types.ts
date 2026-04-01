export type VerifyExam = {
  id: string;
  user_id: string;
  question_id: string;
  session_name: string;
  this_is_correct_answer: string;
  this_is_selected_answer: string;
  correctanswer: string;
  selected_answer: string;
  question_english: string;
  question_hindi: string;
  exam_level: string;
  login_id: string;
  level: string;
  exam_id: string;
  ashray_leader_code: string;
  published_status: number;
  is_published?: boolean;
};
