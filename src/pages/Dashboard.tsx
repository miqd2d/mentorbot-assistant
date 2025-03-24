
import { Calendar, FileCheck, GraduationCap, Users } from "lucide-react";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { AssignmentProgress } from "@/components/dashboard/AssignmentProgress";
import { UpcomingClasses } from "@/components/dashboard/UpcomingClasses";
import { AIAssistant } from "@/components/dashboard/AIAssistant";
import { AttendanceChart } from "@/components/dashboard/AttendanceChart";

// Sample data
const statsData = [
  {
    title: "Total Students",
    value: 124,
    description: "Across 4 classes",
    icon: <Users size={18} />,
    trend: {
      value: 12,
      isPositive: true
    }
  },
  {
    title: "Assignments",
    value: 16,
    description: "5 pending reviews",
    icon: <FileCheck size={18} />,
    trend: {
      value: 8,
      isPositive: true
    }
  },
  {
    title: "Classes Today",
    value: 4,
    description: "2 labs, 2 lectures",
    icon: <Calendar size={18} />,
  },
  {
    title: "Average Attendance",
    value: "87%",
    description: "Last 7 days",
    icon: <GraduationCap size={18} />,
    trend: {
      value: 3,
      isPositive: true
    }
  }
];

const assignmentsData = [
  {
    id: "1",
    name: "Database Normalization",
    subject: "Database Management",
    dueDate: "Tomorrow, 11:59 PM",
    submissionRate: 68
  },
  {
    id: "2",
    name: "Neural Networks Implementation",
    subject: "Machine Learning",
    dueDate: "Oct 25, 11:59 PM",
    submissionRate: 45
  },
  {
    id: "3",
    name: "Software Testing Report",
    subject: "Software Engineering",
    dueDate: "Oct 28, 11:59 PM",
    submissionRate: 92
  }
];

const classesData = [
  {
    id: "1",
    subject: "Database Management",
    time: "9:00 AM",
    duration: "1 hour",
    location: "Room 301",
    isOngoing: true
  },
  {
    id: "2",
    subject: "Machine Learning Lab",
    time: "11:00 AM",
    duration: "2 hours",
    location: "Lab 204"
  },
  {
    id: "3",
    subject: "Software Engineering",
    time: "2:00 PM",
    duration: "1 hour",
    location: "Room 105"
  },
  {
    id: "4",
    subject: "Algorithms",
    time: "4:00 PM",
    duration: "1 hour",
    location: "Room 302"
  }
];

const attendanceData = [
  { name: "Monday", present: 112, absent: 12 },
  { name: "Tuesday", present: 108, absent: 16 },
  { name: "Wednesday", present: 115, absent: 9 },
  { name: "Thursday", present: 104, absent: 20 },
  { name: "Friday", present: 98, absent: 26 }
];

export default function Dashboard() {
  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back, Professor Sharma!</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsData.map((stat, index) => (
          <StatsCard
            key={index}
            title={stat.title}
            value={stat.value}
            description={stat.description}
            icon={stat.icon}
            trend={stat.trend}
            className="animate-scale-in"
            style={{ animationDelay: `${index * 50}ms` }}
          />
        ))}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <AssignmentProgress assignments={assignmentsData} />
        <UpcomingClasses classes={classesData} />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <AttendanceChart data={attendanceData} />
        <AIAssistant />
      </div>
    </div>
  );
}
