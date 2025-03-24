
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  CalendarClock, 
  FileText, 
  Users, 
  Bell, 
  Settings, 
  Menu, 
  X,
  LogOut
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const navItems = [
  { 
    name: "Dashboard", 
    path: "/", 
    icon: LayoutDashboard 
  },
  { 
    name: "Schedule", 
    path: "/schedule", 
    icon: CalendarClock 
  },
  { 
    name: "Assignments", 
    path: "/assignments", 
    icon: FileText 
  },
  { 
    name: "Students", 
    path: "/students", 
    icon: Users 
  },
  { 
    name: "Notifications", 
    path: "/notifications", 
    icon: Bell 
  },
  { 
    name: "Settings", 
    path: "/settings", 
    icon: Settings 
  }
];

export function Sidebar() {
  const [expanded, setExpanded] = useState(true);
  const location = useLocation();

  return (
    <div 
      className={cn(
        "h-screen fixed top-0 left-0 z-40 transition-all duration-300 ease-in-out bg-sidebar border-r border-sidebar-border",
        expanded ? "w-64" : "w-20"
      )}
    >
      <div className="flex h-full flex-col">
        <div className="flex h-16 items-center justify-between px-4">
          {expanded && (
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-white font-semibold text-lg">
                M
              </div>
              <span className="font-semibold text-sidebar-foreground">
                Masterplan
              </span>
            </Link>
          )}
          {!expanded && (
            <div className="w-8 h-8 mx-auto rounded-full bg-accent flex items-center justify-center text-white font-semibold text-lg">
              M
            </div>
          )}
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setExpanded(!expanded)}
            className="text-sidebar-foreground hover:text-white hover:bg-sidebar-accent"
          >
            {expanded ? <X size={18} /> : <Menu size={18} />}
          </Button>
        </div>
        
        <div className="flex-1 overflow-auto py-6">
          <nav className="grid gap-1 px-2">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-all",
                  location.pathname === item.path
                    ? "bg-sidebar-accent text-sidebar-foreground"
                    : "text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50",
                  !expanded && "justify-center"
                )}
              >
                <item.icon size={20} />
                {expanded && <span>{item.name}</span>}
              </Link>
            ))}
          </nav>
        </div>
        
        <div className="border-t border-sidebar-border/50 p-4">
          <div className={cn(
            "flex items-center gap-3 rounded-md px-3 py-2 text-sm cursor-pointer text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50 transition-all",
            !expanded && "justify-center"
          )}>
            <LogOut size={20} />
            {expanded && <span>Log out</span>}
          </div>
        </div>
      </div>
    </div>
  );
}
