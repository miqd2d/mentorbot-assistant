
import { Calendar, FileCheck, GraduationCap, Users } from "lucide-react";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { AssignmentProgress } from "@/components/dashboard/AssignmentProgress";
import { UpcomingClasses } from "@/components/dashboard/UpcomingClasses";
import { AIAssistant } from "@/components/dashboard/AIAssistant";
import { AttendanceChart } from "@/components/dashboard/AttendanceChart";
import { 
  useAssignments, 
  useTodayClasses, 
  useAttendanceData,
  useCurrentProfessor
} from "@/hooks/use-data";

export default function Dashboard() {
  // Fetch data using our custom hooks
  const { data: professor, isLoading: isLoadingProfessor } = useCurrentProfessor();
  const { data: assignments, isLoading: isLoadingAssignments } = useAssignments();
  const { data: classes, isLoading: isLoadingClasses } = useTodayClasses();
  const { data: attendanceData, isLoading: isLoadingAttendance } = useAttendanceData();

  // Stats data based on fetched information
  const statsData = [
    {
      title: "Total Students",
      value: assignments?.[0]?.total_students || 0,
      description: `Across ${classes?.length || 0} classes`,
      icon: <Users size={18} />,
      trend: {
        value: 12,
        isPositive: true
      }
    },
    {
      title: "Assignments",
      value: assignments?.length || 0,
      description: "5 pending reviews",
      icon: <FileCheck size={18} />,
      trend: {
        value: 8,
        isPositive: true
      }
    },
    {
      title: "Classes Today",
      value: classes?.length || 0,
      description: "2 labs, 2 lectures",
      icon: <Calendar size={18} />,
    },
    {
      title: "Average Attendance",
      value: attendanceData ? 
        `${Math.round(attendanceData.reduce((sum, day) => 
          sum + (day.present / (day.present + day.absent)) * 100, 0
        ) / attendanceData.length)}%` : 
        "N/A",
      description: "Last 7 days",
      icon: <GraduationCap size={18} />,
      trend: {
        value: 3,
        isPositive: true
      }
    }
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back, {isLoadingProfessor ? 'Professor' : professor?.name || 'Professor'}!
        </p>
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
        <AssignmentProgress assignments={assignments || []} />
        <UpcomingClasses classes={classes || []} />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <AttendanceChart data={attendanceData || []} />
        <AIAssistant />
      </div>
    </div>
  );
}
