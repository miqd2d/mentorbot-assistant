
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Student } from "@/types/models";

// Mock student data - will be replaced with API call
const MOCK_STUDENTS: Student[] = Array.from({ length: 35 }).map((_, index) => ({
  id: `student-${index + 1}`.padStart(10, '0'),
  name: `Student ${index + 1}`,
  email: `student${index + 1}@example.edu`,
  rollNumber: `CS22${(index + 1).toString().padStart(3, '0')}`,
  batch: "CSE 2022",
  department: "Computer Science",
}));

// Service to fetch students
const fetchStudents = async (): Promise<Student[]> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(MOCK_STUDENTS), 500);
  });
};

export default function Students() {
  const [searchQuery, setSearchQuery] = useState("");
  const { data: students, isLoading } = useQuery({
    queryKey: ["students"],
    queryFn: fetchStudents,
  });

  // Filter students based on search query
  const filteredStudents = students?.filter(student => 
    student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.rollNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Students</h1>
        <p className="text-muted-foreground">View and manage your students</p>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Input
            placeholder="Search by name, roll number, or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full"
          />
        </div>
        <Button>Add Student</Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Roll Number</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Batch</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  Loading students...
                </TableCell>
              </TableRow>
            ) : filteredStudents?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  No students found
                </TableCell>
              </TableRow>
            ) : (
              filteredStudents?.map((student) => (
                <TableRow key={student.id}>
                  <TableCell className="font-medium">{student.rollNumber}</TableCell>
                  <TableCell>{student.name}</TableCell>
                  <TableCell>{student.email}</TableCell>
                  <TableCell>{student.batch}</TableCell>
                  <TableCell>{student.department}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">View</Button>
                      <Button variant="outline" size="sm">Edit</Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
