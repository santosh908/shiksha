export type MasterData = {
  Profession: Profession[];
  AshreyLeader: AshreyLeader[];
  Education: Education[];
  MeritalStatus: MeritalStatus[];
  Seminar: Seminar[];
  State: State[];
  District: District[];
  User: User[];
  Principle: Principle[];
  Book: Book[];
  Prayers: Prayers[];
  PersonalInfo: PersonalInfo;
  ProfessionalInfo: ProfessionalInfo;
  DevoteePrincipe: DevoteePrinciple[];
  DevoteeBookRead: DevoteeBookRead[];
  DevoteeMemoriesPrayer: DevoteeMemoriesPrayer[];
  DevoteeAttendedSeminar: DevoteeAttendedSeminar[];
};

export type User = {
  Name: string;
  InitiatedName: string;
  Email: string;
  Mobile: string;
  DOB: string;
};

export type Profession = {
  id: number;
  profession_name: string;
  is_active: string;
  created_at: string;
  updated_at: string;
};

export type AshreyLeader = {
  id: number;
  ashery_leader_name: string;
  code: string;
  user_id: number;
  is_active: string;
  remember_token: string | null;
  created_at: string;
  updated_at: string;
};

export type Education = {
  id: number;
  eduction_name: string;
  is_active: string;
  remember_token: string | null;
  created_at: string;
  updated_at: string;
};

export type MeritalStatus = {
  id: number;
  merital_status_name: string;
  is_active: string;
  created_at: string;
  updated_at: string;
};

export type Seminar = {
  id: number;
  seminar_name_english: string;
  seminar_name_hindi: string;
  is_active: string;
  remember_token: string | null;
  created_at: string;
  updated_at: string;
};

export type State = {
  id: number;
  lg_code: string;
  state_code: string;
  state_name: string;
  is_active: string;
  created_at: string;
  updated_at: string;
};

export type District = {
  id: number;
  state_code: string;
  district_lg_code: string;
  district_name: string;
};

export type Principle = {
  id: number;
  principle_name_eglish: string;
  principle_name_hindi: string;
};

export type Book = {
  id: number;
  book_name_english: string;
  book_name_hindi: string;
};

export type Prayers = {
  id: number;
  prayer_name_english: string;
  prayer_name_hindi: string;
};

export type PersonalInfo = {
  user_id: number;
  education: number;
  marital_status: number;
  profession: number;
  spiritual_master: string;
  join_askcon: string;
  current_address: string;
  permanent_address: string;
  pincode: number;
  state_code: number;
  district_cod: number;
  how_many_rounds_you_chant: string;
  when_are_you_chantin: string;
  spend_everyday_hearing_lectures: string;
  bakti_shastri_degree: number;
  ashray_leader: number;
  other_ashry_leader_name: string;
  since_when_you_attending_ashray_classes: string;
  spiritual_master_you_aspiring: string;
  attend_shray_classes_in_temple: string;
  personal_info: string;
  professional_info: string;
  hearing_reading: string;
  seminar: string;
  status_code: string;
};

export type DevoteePrinciple = {
  id: string;
};

export type DevoteeBookRead = {
  id: string;
};

export type DevoteeMemoriesPrayer = {
  id: string;
};

export type DevoteeAttendedSeminar = {
  id: string;
};

export type ProfessionalInfo = {
  ChantCount: number;
  ChantingStartDate: string;
  RegulativePrinciples: [];
  BooksRead: [];
  SpendTimeHearingLecture: string;
};
