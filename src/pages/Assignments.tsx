
import { useState } from "react";
import { AssignmentService } from "@/services/api";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Clock, FileText, Search, Users } from "lucide-react";

export default function Assignments() {
  const [searchQuery, setSearchQuery] = useState("");
  
  const { data: assignments, isLoading } = useQuery({
    queryKey: ["assignments"],
    queryFn: AssignmentService.getAssignments,
  });
  
  // Filter assignments based on search query
  const filteredAssignments = assignments?.filter(assignment => 
    assignment.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    assignment.subject.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Assignments</h1>
        <p className="text-muted-foreground">
          View and manage student assignments
        </p>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search assignments..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button>
          <FileText className="mr-2 h-4 w-4" />
          New Assignment
        </Button>
      </div>
      
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Loading assignments...</p>
        </div>
      ) : filteredAssignments && filteredAssignments.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredAssignments.map((assignment) => (
            <Card key={assignment.id} className="hover:shadow-md transition-all">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle>{assignment.name}</CardTitle>
                  <Badge>{assignment.subject}</Badge>
                </div>
              </CardHeader>
              <CardContent className="pb-2">
                <p className="text-sm text-muted-foreground mb-4">
                  {assignment.description || "No description provided"}
                </p>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                  <Clock size={14} />
                  <span>Due: {format(new Date(assignment.due_date), "PPP")}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Users size={14} />
                  <span>{assignment.submitted_count} / {assignment.total_students} submitted</span>
                </div>
                <div className="mt-3">
                  <Progress value={assignment.submission_rate} className="h-2" />
                </div>
              </CardContent>
              <CardFooter className="pt-2">
                <div className="flex justify-between w-full">
                  <Button variant="outline" size="sm">View Details</Button>
                  <Button variant="outline" size="sm">Review</Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-64 text-center">
          <FileText className="h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-muted-foreground">No assignments found</p>
          {searchQuery && (
            <Button 
              variant="link" 
              onClick={() => setSearchQuery("")}
              className="mt-2"
            >
              Clear search
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
