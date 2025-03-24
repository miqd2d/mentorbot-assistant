
import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ClassService } from "@/services/api";
import { ClassSession } from "@/types/models";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { CalendarCheck, Clock, MapPin } from "lucide-react";

export default function Schedule() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  
  const { data: classes, isLoading } = useQuery({
    queryKey: ["classes"],
    queryFn: ClassService.getClasses,
  });
  
  // Filter classes based on selected date
  const filteredClasses = classes?.filter(classSession => {
    if (!date) return false;
    const classDate = new Date(classSession.time);
    return (
      classDate.getDate() === date.getDate() &&
      classDate.getMonth() === date.getMonth() &&
      classDate.getFullYear() === date.getFullYear()
    );
  });

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Schedule</h1>
        <p className="text-muted-foreground">
          View and manage your class schedule
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Calendar</CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md border"
            />
          </CardContent>
        </Card>
        
        <Card className="col-span-1 lg:col-span-2">
          <CardHeader>
            <CardTitle>
              {date ? format(date, "EEEE, MMMM do, yyyy") : "Select a date"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center h-64">
                <p className="text-muted-foreground">Loading classes...</p>
              </div>
            ) : filteredClasses && filteredClasses.length > 0 ? (
              <div className="space-y-4">
                {filteredClasses.map((classSession) => (
                  <div 
                    key={classSession.id} 
                    className="flex flex-col p-4 border rounded-lg bg-card hover:bg-accent/5 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium">{classSession.subject}</h3>
                      <div className="px-2 py-1 text-xs rounded-full bg-primary/10 text-primary">
                        {classSession.batch}
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mt-2">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Clock size={16} />
                        <span>{format(new Date(classSession.time), "h:mm a")}</span>
                        <span>({classSession.duration})</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <MapPin size={16} />
                        <span>{classSession.location}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <CalendarCheck size={16} />
                        <span>{classSession.is_ongoing ? "Ongoing" : "Upcoming"}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-64 text-center">
                <p className="text-muted-foreground">No classes scheduled for this date</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
