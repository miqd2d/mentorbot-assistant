
import { supabase } from '@/integrations/supabase/client';
import { 
  Professor, 
  Student, 
  Assignment, 
  ClassSession, 
  AttendanceRecord,
  Notification 
} from '../types/models';

// API Services using Supabase
export const ProfessorService = {
  getCurrentProfessor: async (): Promise<Professor> => {
    const { data, error } = await supabase
      .from('professors')
      .select('*')
      .limit(1)
      .single();
    
    if (error) {
      console.error('Error fetching professor:', error);
      throw error;
    }
    
    return data;
  }
};

export const AssignmentService = {
  getAssignments: async (): Promise<Assignment[]> => {
    const { data, error } = await supabase
      .from('assignments')
      .select('*')
      .order('due_date', { ascending: true });
    
    if (error) {
      console.error('Error fetching assignments:', error);
      throw error;
    }
    
    return data || [];
  },
  
  getAssignment: async (id: string): Promise<Assignment | null> => {
    const { data, error } = await supabase
      .from('assignments')
      .select('*')
      .eq('id', id)
      .maybeSingle();
    
    if (error) {
      console.error('Error fetching assignment:', error);
      throw error;
    }
    
    return data;
  }
};

export const ClassService = {
  getClasses: async (): Promise<ClassSession[]> => {
    const { data, error } = await supabase
      .from('class_sessions')
      .select('*')
      .order('time', { ascending: true });
    
    if (error) {
      console.error('Error fetching classes:', error);
      throw error;
    }
    
    return data || [];
  },
  
  getTodayClasses: async (): Promise<ClassSession[]> => {
    const { data, error } = await supabase
      .from('class_sessions')
      .select('*')
      .order('time', { ascending: true });
    
    if (error) {
      console.error('Error fetching today classes:', error);
      throw error;
    }
    
    // In a real app, you would filter by date
    // For now, return all classes as "today"
    return data || [];
  }
};

export const AttendanceService = {
  getWeeklyAttendance: async (): Promise<AttendanceRecord[]> => {
    const { data, error } = await supabase
      .from('attendance_records')
      .select('*')
      .order('date', { ascending: false })
      .limit(7);
    
    if (error) {
      console.error('Error fetching weekly attendance:', error);
      throw error;
    }
    
    return data || [];
  },
  
  getAttendanceChartData: async (): Promise<{ name: string; present: number; absent: number }[]> => {
    const { data, error } = await supabase
      .from('attendance_records')
      .select('*')
      .order('date', { ascending: false })
      .limit(7);
    
    if (error) {
      console.error('Error fetching attendance chart data:', error);
      throw error;
    }
    
    // Transform the data into the format expected by the chart
    const chartData = (data || []).map(record => ({
      name: new Date(record.date).toLocaleDateString('en-IN', { weekday: 'short' }),
      present: record.present_count,
      absent: record.absent_count
    }));
    
    return chartData;
  }
};

export const NotificationService = {
  getNotifications: async (): Promise<Notification[]> => {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .order('sent_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching notifications:', error);
      throw error;
    }
    
    // In a real app, we would fetch recipients from notification_recipients table
    // For simplicity, we're not including sentTo property for now
    return data || [];
  }
};

export const StudentService = {
  getStudents: async (): Promise<Student[]> => {
    const { data, error } = await supabase
      .from('students')
      .select('*')
      .order('roll_number', { ascending: true });
    
    if (error) {
      console.error('Error fetching students:', error);
      throw error;
    }
    
    return data || [];
  },
  
  getStudent: async (id: string): Promise<Student | null> => {
    const { data, error } = await supabase
      .from('students')
      .select('*')
      .eq('id', id)
      .maybeSingle();
    
    if (error) {
      console.error('Error fetching student:', error);
      throw error;
    }
    
    return data;
  }
};
