
import { 
  Professor, 
  Student, 
  Assignment, 
  ClassSession, 
  AttendanceRecord,
  Notification 
} from '../types/models';

// Mock professor data - to be replaced with actual API calls
const CURRENT_PROFESSOR: Professor = {
  id: 'prof-001',
  name: 'Professor Sharma',
  email: 'sharma@example.edu',
  department: 'Computer Science',
  avatar: '/images/avatar.png'
};

// Mock data for assignments
const MOCK_ASSIGNMENTS: Assignment[] = [
  {
    id: "assign-001",
    name: "Database Normalization",
    subject: "Database Management",
    description: "Normalize the provided database schema to 3NF",
    dueDate: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
    createdAt: new Date().toISOString(),
    professorId: CURRENT_PROFESSOR.id,
    submissionRate: 68,
    totalStudents: 124,
    submittedCount: 84
  },
  {
    id: "assign-002",
    name: "Neural Networks Implementation",
    subject: "Machine Learning",
    description: "Implement a simple neural network using TensorFlow",
    dueDate: new Date(Date.now() + 7 * 86400000).toISOString(), // 7 days later
    createdAt: new Date().toISOString(),
    professorId: CURRENT_PROFESSOR.id,
    submissionRate: 45,
    totalStudents: 124,
    submittedCount: 56
  },
  {
    id: "assign-003",
    name: "Software Testing Report",
    subject: "Software Engineering",
    description: "Complete the unit testing for the provided codebase",
    dueDate: new Date(Date.now() + 10 * 86400000).toISOString(), // 10 days later
    createdAt: new Date().toISOString(),
    professorId: CURRENT_PROFESSOR.id,
    submissionRate: 92,
    totalStudents: 124,
    submittedCount: 114
  }
];

// Mock data for classes
const MOCK_CLASSES: ClassSession[] = [
  {
    id: "class-001",
    subject: "Database Management",
    time: "9:00 AM",
    duration: "1 hour",
    location: "Room 301",
    professorId: CURRENT_PROFESSOR.id,
    batch: "CSE 2022",
    isOngoing: true
  },
  {
    id: "class-002",
    subject: "Machine Learning Lab",
    time: "11:00 AM",
    duration: "2 hours",
    location: "Lab 204",
    professorId: CURRENT_PROFESSOR.id,
    batch: "CSE 2022"
  },
  {
    id: "class-003",
    subject: "Software Engineering",
    time: "2:00 PM",
    duration: "1 hour",
    location: "Room 105",
    professorId: CURRENT_PROFESSOR.id,
    batch: "CSE 2022"
  },
  {
    id: "class-004",
    subject: "Algorithms",
    time: "4:00 PM",
    duration: "1 hour",
    location: "Room 302",
    professorId: CURRENT_PROFESSOR.id,
    batch: "CSE 2022"
  }
];

// Mock attendance data
const MOCK_ATTENDANCE: AttendanceRecord[] = [
  { 
    id: "att-001", 
    date: "2023-10-16", 
    classSessionId: "class-001", 
    professorId: CURRENT_PROFESSOR.id,
    presentCount: 112,
    absentCount: 12,
    students: []
  },
  { 
    id: "att-002", 
    date: "2023-10-17", 
    classSessionId: "class-002", 
    professorId: CURRENT_PROFESSOR.id,
    presentCount: 108,
    absentCount: 16,
    students: []
  },
  { 
    id: "att-003", 
    date: "2023-10-18", 
    classSessionId: "class-003", 
    professorId: CURRENT_PROFESSOR.id,
    presentCount: 115,
    absentCount: 9,
    students: []
  },
  { 
    id: "att-004", 
    date: "2023-10-19", 
    classSessionId: "class-004", 
    professorId: CURRENT_PROFESSOR.id,
    presentCount: 104,
    absentCount: 20,
    students: []
  },
  { 
    id: "att-005", 
    date: "2023-10-20", 
    classSessionId: "class-001", 
    professorId: CURRENT_PROFESSOR.id,
    presentCount: 98,
    absentCount: 26,
    students: []
  }
];

// API Services
export const ProfessorService = {
  getCurrentProfessor: async (): Promise<Professor> => {
    // In a real implementation, this would make an API call
    return new Promise((resolve) => {
      setTimeout(() => resolve(CURRENT_PROFESSOR), 300);
    });
  }
};

export const AssignmentService = {
  getAssignments: async (): Promise<Assignment[]> => {
    // In a real implementation, this would make an API call
    return new Promise((resolve) => {
      setTimeout(() => resolve(MOCK_ASSIGNMENTS), 500);
    });
  },
  
  getAssignment: async (id: string): Promise<Assignment | null> => {
    const assignment = MOCK_ASSIGNMENTS.find(a => a.id === id);
    return new Promise((resolve) => {
      setTimeout(() => resolve(assignment || null), 300);
    });
  }
};

export const ClassService = {
  getClasses: async (): Promise<ClassSession[]> => {
    // In a real implementation, this would make an API call
    return new Promise((resolve) => {
      setTimeout(() => resolve(MOCK_CLASSES), 500);
    });
  },
  
  getTodayClasses: async (): Promise<ClassSession[]> => {
    // In a real implementation, this would filter by today's date
    return new Promise((resolve) => {
      setTimeout(() => resolve(MOCK_CLASSES), 500);
    });
  }
};

export const AttendanceService = {
  getWeeklyAttendance: async (): Promise<AttendanceRecord[]> => {
    // In a real implementation, this would filter by last 7 days
    return new Promise((resolve) => {
      setTimeout(() => resolve(MOCK_ATTENDANCE), 500);
    });
  },
  
  getAttendanceChartData: async (): Promise<{ name: string; present: number; absent: number }[]> => {
    // Transform the mock data into the format expected by the chart
    const chartData = MOCK_ATTENDANCE.map(record => ({
      name: new Date(record.date).toLocaleDateString('en-US', { weekday: 'short' }),
      present: record.presentCount,
      absent: record.absentCount
    }));
    
    return new Promise((resolve) => {
      setTimeout(() => resolve(chartData), 400);
    });
  }
};
