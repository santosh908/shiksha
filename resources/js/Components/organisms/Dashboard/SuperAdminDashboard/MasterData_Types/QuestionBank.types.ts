// QuestionBank.types.ts
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

export type QuestionBank = {
  id: string;
  question_english: string;
  question_hindi: string;
  subject: number;
  chapter: number;
  level: number;
  difficulty_label: string;
  option1: string;
  option2: string;
  option3: string;
  option4: string;
  correctanswer: string;
  any_remark: string;
  is_active: string;
  subject_id: number;
  level_id: number;
  subject_name: string;
  chapter_name: string;
  chapter_id: number;
  exam_level: string;
};
