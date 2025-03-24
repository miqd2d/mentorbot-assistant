
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
  roll_number: string; // Changed from rollNumber to match database
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
  due_date: string; // Changed from dueDate to match database
  created_at: string; // Changed from createdAt to match database
  professor_id: string; // Changed from professorId to match database
  submission_rate: number; // Changed from submissionRate to match database
  total_students: number;
  submitted_count: number;
}

export interface ClassSession {
  id: string;
  subject: string;
  time: string;
  duration: string;
  location: string;
  professor_id: string; // Changed from professorId to match database
  batch: string;
  is_ongoing?: boolean; // Changed from isOngoing to match database
  created_at?: string;
}

export interface AttendanceRecord {
  id: string;
  date: string;
  class_session_id: string; // Changed from classSessionId to match database
  professor_id: string; // Changed from professorId to match database
  present_count: number; // Changed from presentCount to match database
  absent_count: number; // Changed from absentCount to match database
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
  sent_at: string; // Changed from sentAt to match database
  professor_id: string; // Changed from professorId to match database
  status: 'sent' | 'failed' | 'pending';
  created_at?: string;
  // sentTo is calculated from notification_recipients table
  sentTo?: string[];
}
