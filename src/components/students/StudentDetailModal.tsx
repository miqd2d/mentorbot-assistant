
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, GraduationCap, BookOpen, Star } from "lucide-react";
import { Student } from "@/types/models";
import { useStudentMarks } from "@/hooks/use-marks-data";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";

interface StudentDetailModalProps {
  student: Student | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function StudentDetailModal({ student, open, onOpenChange }: StudentDetailModalProps) {
  const [activeTab, setActiveTab] = useState("overview");
  const { data: studentMarks } = useStudentMarks(student?.id || "");

  if (!student) return null;

  // Mock attendance data (in a real app, this would come from an API)
  const attendanceData = [
    { date: "2023-03-20", status: "present" },
    { date: "2023-03-19", status: "present" },
    { date: "2023-03-18", status: "absent" },
    { date: "2023-03-17", status: "present" },
    { date: "2023-03-16", status: "present" },
    { date: "2023-03-15", status: "present" },
    { date: "2023-03-14", status: "absent" },
  ];

  const attendanceRate = Math.round(
    (attendanceData.filter((item) => item.status === "present").length /
      attendanceData.length) *
      100
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">{student.name}</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4 mt-4">
          <div className="flex flex-col md:flex-row gap-4 md:items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <GraduationCap size={30} />
              </div>
              <div>
                <h3 className="font-medium">{student.name}</h3>
                <p className="text-sm text-muted-foreground">{student.roll_number}</p>
                <p className="text-sm text-muted-foreground">{student.email}</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {student.batch}
              </Badge>
              <Badge variant="outline" className="flex items-center gap-1">
                <BookOpen className="h-3 w-3" />
                {student.department}
              </Badge>
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-3 w-full">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="performance">Performance</TabsTrigger>
              <TabsTrigger value="attendance">Attendance</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="space-y-4 mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Attendance Rate</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="text-2xl font-bold">{attendanceRate}%</div>
                      <Progress value={attendanceRate} className="w-[60%] h-2" />
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Average Grade</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2">
                      <div className="text-2xl font-bold">B+</div>
                      <div className="flex text-yellow-500">
                        <Star className="h-4 w-4 fill-current" />
                        <Star className="h-4 w-4 fill-current" />
                        <Star className="h-4 w-4 fill-current" />
                        <Star className="h-4 w-4 fill-current" />
                        <Star className="h-4 w-4" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="performance" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Subject Performance</CardTitle>
                  <CardDescription>
                    Student performance across different subjects
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Subject</TableHead>
                        <TableHead>Marks</TableHead>
                        <TableHead>Grade</TableHead>
                        <TableHead>Class Average</TableHead>
                        <TableHead>Performance</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {studentMarks?.map((mark) => {
                        // Determine appropriate color class based on marks
                        const colorClass = 
                          mark.marks >= 90 ? "bg-green-500" :
                          mark.marks >= 80 ? "bg-emerald-500" :
                          mark.marks >= 70 ? "bg-yellow-500" :
                          mark.marks >= 60 ? "bg-orange-500" :
                                           "bg-red-500";
                          
                        return (
                          <TableRow key={mark.subject}>
                            <TableCell className="font-medium">{mark.subject}</TableCell>
                            <TableCell>{mark.marks}</TableCell>
                            <TableCell>
                              <Badge 
                                variant={
                                  mark.grade === 'A' ? "default" : 
                                  mark.grade === 'B' ? "secondary" : 
                                  mark.grade === 'C' ? "outline" :
                                  "destructive"
                                }
                              >
                                {mark.grade}
                              </Badge>
                            </TableCell>
                            <TableCell>{mark.class_average}</TableCell>
                            <TableCell>
                              <Progress 
                                value={(mark.marks / 100) * 100} 
                                className="h-2" 
                                indicatorColor={colorClass}
                              />
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="attendance" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Attendance Records</CardTitle>
                  <CardDescription>
                    Recent attendance history
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {attendanceData.map((record, index) => (
                        <TableRow key={index}>
                          <TableCell>
                            {new Date(record.date).toLocaleDateString('en-US', {
                              weekday: 'short',
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </TableCell>
                          <TableCell>
                            <Badge 
                              variant={record.status === "present" ? "default" : "destructive"}
                            >
                              {record.status === "present" ? "Present" : "Absent"}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
}
