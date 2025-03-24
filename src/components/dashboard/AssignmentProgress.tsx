
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Assignment } from "@/types/models";

interface AssignmentProgressProps {
  assignments: Assignment[];
}

export function AssignmentProgress({ assignments }: AssignmentProgressProps) {
  return (
    <Card className="col-span-1 md:col-span-2">
      <CardHeader>
        <CardTitle className="text-base font-medium">Assignment Progress</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {assignments.map((assignment) => (
            <div key={assignment.id} className="space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">{assignment.name}</div>
                  <div className="text-sm text-muted-foreground">{assignment.subject}</div>
                </div>
                <div className="text-sm text-muted-foreground">
                  Due: {assignment.due_date}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Progress value={assignment.submission_rate} className="h-2" />
                <span className="text-sm font-medium">
                  {assignment.submission_rate}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
