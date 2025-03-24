
// Define the main data models for the application

export interface Professor {
  id: string;
  name: string;
  email: string;
  department: string;
  avatar?: string;
}

export interface Student {
  id: string;
  name: string;
  email: string;
  rollNumber: string;
  batch: string;
  department: string;
  avatar?: string;
}

export interface Assignment {
  id: string;
  name: string;
  subject: string;
  description?: string;
  dueDate: string;
  createdAt: string;
  professorId: string;
  submissionRate: number;
  totalStudents: number;
  submittedCount: number;
}

export interface ClassSession {
  id: string;
  subject: string;
  time: string;
  duration: string;
  location: string;
  professorId: string;
  batch: string;
  isOngoing?: boolean;
}

export interface AttendanceRecord {
  id: string;
  date: string;
  classSessionId: string;
  professorId: string;
  presentCount: number;
  absentCount: number;
  students: {
    studentId: string;
    present: boolean;
  }[];
}

export interface Notification {
  id: string;
  type: 'email' | 'whatsapp';
  subject?: string;
  message: string;
  sentAt: string;
  sentTo: string[];
  professorId: string;
  status: 'sent' | 'failed' | 'pending';
}
