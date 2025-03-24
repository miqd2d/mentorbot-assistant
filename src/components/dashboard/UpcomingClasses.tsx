
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarDays } from "lucide-react";
import { cn } from "@/lib/utils";

interface ClassSession {
  id: string;
  subject: string;
  time: string;
  duration: string;
  location: string;
  isOngoing?: boolean;
}

interface UpcomingClassesProps {
  classes: ClassSession[];
  title?: string;
}

export function UpcomingClasses({ classes, title = "Today's Schedule" }: UpcomingClassesProps) {
  const currentTime = new Date();
  const formattedDate = currentTime.toLocaleDateString('en-US', { 
    weekday: 'long', 
    month: 'long', 
    day: 'numeric' 
  });

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-medium">{title}</CardTitle>
          <CalendarDays className="h-4 w-4 text-muted-foreground" />
        </div>
        <p className="text-sm text-muted-foreground">{formattedDate}</p>
      </CardHeader>
      <CardContent className="px-2">
        <div className="relative">
          <div className="absolute left-4 top-0 bottom-0 w-px bg-border/50"></div>
          <div className="space-y-6">
            {classes.map((session) => (
              <div key={session.id} className="relative pl-6 pr-2">
                <div 
                  className={cn(
                    "absolute left-[15px] top-[8px] w-2 h-2 rounded-full translate-x-[-50%]",
                    session.isOngoing ? "bg-accent animate-pulse-subtle" : "bg-muted-foreground"
                  )}
                ></div>
                <div 
                  className={cn(
                    "p-3 rounded-lg border",
                    session.isOngoing ? "border-accent/50 bg-accent/5" : "border-border"
                  )}
                >
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-medium">{session.subject}</h4>
                    {session.isOngoing && (
                      <span className="px-1.5 py-0.5 text-[10px] font-medium rounded-full bg-accent/10 text-accent">
                        Ongoing
                      </span>
                    )}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    <span>{session.time}</span>
                    <span className="mx-2">•</span>
                    <span>{session.duration}</span>
                    <span className="mx-2">•</span>
                    <span>{session.location}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
