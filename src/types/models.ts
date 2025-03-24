
// Define the main data models for the application

export interface Professor {
  id: string;
  name: string;
  email: string;
  department: string;
  avatar?: string;
  created_at?: string;
}

export interface Student {
  id: string;
  name: string;
  email: string;
  roll_number: string; 
  batch: string;
  department: string;
  avatar?: string;
  created_at?: string;
}

export interface Assignment {
  id: string;
  name: string;
  subject: string;
  description?: string;
  due_date: string;
  created_at: string;
  professor_id: string;
  submission_rate: number;
  total_students: number;
  submitted_count: number;
}

export interface ClassSession {
  id: string;
  subject: string;
  time: string;
  duration: string;
  location: string;
  professor_id: string;
  batch: string;
  is_ongoing?: boolean;
  created_at?: string;
}

export interface AttendanceRecord {
  id: string;
  date: string;
  class_session_id: string;
  professor_id: string;
  present_count: number;
  absent_count: number;
  created_at?: string;
  students?: {
    studentId: string;
    present: boolean;
  }[];
}

export interface Notification {
  id: string;
  type: 'email' | 'whatsapp' | 'sms';
  subject?: string;
  message: string;
  sent_at: string;
  professor_id: string;
  status: 'sent' | 'failed' | 'pending';
  created_at?: string;
  // sentTo is calculated from notification_recipients table
  sentTo?: string[];
}
