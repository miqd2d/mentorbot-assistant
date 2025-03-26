
import { useQuery } from "@tanstack/react-query";

// Mock service for fetching student performance data
const fetchPerformanceData = async () => {
  // In a real app, this would be an API call
  return [
    { subject: "Mathematics", average: 78, highest: 94, lowest: 62 },
    { subject: "Physics", average: 72, highest: 89, lowest: 58 },
    { subject: "Chemistry", average: 75, highest: 92, lowest: 61 },
    { subject: "Biology", average: 81, highest: 96, lowest: 67 },
    { subject: "Computer Science", average: 85, highest: 98, lowest: 73 },
  ];
};

// Mock service for fetching student marks distribution
const fetchMarksDistribution = async () => {
  // In a real app, this would be an API call
  return [
    { grade: "A", count: 15, percentage: 15 },
    { grade: "B", count: 28, percentage: 28 },
    { grade: "C", count: 35, percentage: 35 },
    { grade: "D", count: 15, percentage: 15 },
    { grade: "F", count: 7, percentage: 7 },
  ];
};

// Mock service for fetching individual student marks
const fetchStudentMarks = async (studentId: string) => {
  // In a real app, this would use the studentId parameter
  return [
    { subject: "Mathematics", marks: 82, grade: "B", class_average: 78 },
    { subject: "Physics", marks: 78, grade: "C", class_average: 72 },
    { subject: "Chemistry", marks: 85, grade: "B", class_average: 75 },
    { subject: "Biology", marks: 90, grade: "A", class_average: 81 },
    { subject: "Computer Science", marks: 95, grade: "A", class_average: 85 },
  ];
};

export function usePerformanceData() {
  return useQuery({
    queryKey: ["performanceData"],
    queryFn: fetchPerformanceData,
  });
}

export function useMarksDistribution() {
  return useQuery({
    queryKey: ["marksDistribution"],
    queryFn: fetchMarksDistribution,
  });
}

export function useStudentMarks(studentId: string) {
  return useQuery({
    queryKey: ["studentMarks", studentId],
    queryFn: () => fetchStudentMarks(studentId),
    enabled: !!studentId,
  });
}
