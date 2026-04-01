export type Examination = {
  id: string;
  exam_id: number;
  session_name: string;
  exam_session_id: number;
  exam_level: string;
  exam_level_id: number;
  remarks: string;
  date: string;
  start_time: string;
  duration: number;
  no_of_question: number;
  total_marks: number;
  qualifying_marks: number;
  is_active: string;
  examination_code: number;
};

export type shikshaLevel = {
  id: string;
  exam_level: string;
};

export type ExamSession = {
  id: string;
  session_name: string;
};
