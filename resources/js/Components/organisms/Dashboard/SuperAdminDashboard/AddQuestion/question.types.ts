export type QuestionBank = {
  question_id: string;
  question_english: string;
  question_hindi: string;
  subject: string;
  level: string;
  subject_id: number;
  level_id: number;
  difficulty_label: string;
  option1: string;
  option2: string;
  option3: string;
  option4: string;
  correctanswer: string;
  any_remark: string;
  is_active: string;
  id: string;
  chapter: string;
  chapter_name: string;
};

export type shikshaLevel = {
  id: number;
  exam_level: string;
};

export type Subject = {
  id: number;
  subject_name: string;
  level_id: number;
  shiksha_level_id: string;
};

export type Chapter = {
  id: number;
  chapter_name: string;
  subject_id: number;
};

export type ExamList = {
  id: number;
  exam_name: string;
  ShikshaLevel:string;
  no_of_question: number;
  questions: QuestionBank[];
};
