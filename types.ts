
export enum Role {
  PATIENT = 'PATIENT',
  DOCTOR = 'DOCTOR',
  FITNESS_COACH = 'FITNESS_COACH',
  ADMIN = 'ADMIN'
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  assignedDoctorId?: string;
  assignedCoachId?: string;
}

export interface PatientProfile {
  age: number;
  gender: string;
  height: number;
  weight: number;
  medication: string;
  dosage: string;
  conditions: string[];
}

export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: Role | 'AI';
  text: string;
  timestamp: string;
  status?: 'normal' | 'sos' | 'overridden';
}

export interface PatientData {
  userId: string;
  profile: PatientProfile;
  messages: Message[];
  sosActive: boolean;
  onboarded: boolean;
}

export interface AppConfig {
  aiSystemInstruction: string;
}
