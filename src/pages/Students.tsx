
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
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
import { StudentService } from "@/services/api";
import SpeechToText from "@/components/SpeechToText";

export default function Students() {
  const [searchQuery, setSearchQuery] = useState("");
  const { data: students, isLoading } = useQuery({
    queryKey: ["students"],
    queryFn: StudentService.getStudents,
  });

  // Handle speech recognition result
  const handleSpeechResult = (text: string) => {
    setSearchQuery(text);
  };

  // Filter students based on search query
  const filteredStudents = students?.filter(student => 
    student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.roll_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Students</h1>
        <p className="text-muted-foreground">View and manage your students</p>
      </div>

      <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
        <div className="relative flex-1 w-full">
          <Input
            placeholder="Search by name, roll number, or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full"
          />
        </div>
        <div className="w-full md:w-auto">
          <SpeechToText onTextCapture={handleSpeechResult} />
        </div>
        <Button>Add Student</Button>
      </div>

      <div className="rounded-md border overflow-hidden">
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
                  <TableCell className="font-medium">{student.roll_number}</TableCell>
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
