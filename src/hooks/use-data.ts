
import { useQuery } from "@tanstack/react-query";
import { 
  AssignmentService, 
  ClassService, 
  AttendanceService,
  ProfessorService
} from "../services/api";

export function useCurrentProfessor() {
  return useQuery({
    queryKey: ["professor"],
    queryFn: ProfessorService.getCurrentProfessor,
  });
}

export function useAssignments() {
  return useQuery({
    queryKey: ["assignments"],
    queryFn: AssignmentService.getAssignments,
  });
}

export function useTodayClasses() {
  return useQuery({
    queryKey: ["todayClasses"],
    queryFn: ClassService.getTodayClasses,
  });
}

export function useAttendanceData() {
  return useQuery({
    queryKey: ["attendanceData"],
    queryFn: AttendanceService.getAttendanceChartData,
  });
}
