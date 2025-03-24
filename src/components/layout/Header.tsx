
import { useEffect, useState } from "react";
import { Bell, Mic, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [isListening, setIsListening] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className={cn(
      "sticky top-0 z-30 w-full transition-all duration-200",
      scrolled ? "bg-background/80 backdrop-blur-md border-b" : "bg-transparent"
    )}>
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="relative flex w-full max-w-[500px]">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search..."
              className="w-full pl-8 bg-white dark:bg-slate-900"
            />
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            size="icon" 
            className={cn(
              "rounded-full transition-all duration-300",
              isListening && "bg-accent text-white border-accent hover:bg-accent/90 hover:text-white"
            )}
            onClick={() => setIsListening(!isListening)}
          >
            <Mic className={cn(
              "h-4 w-4 transition-all",
              isListening && "animate-pulse-subtle"
            )} />
            <span className="sr-only">Toggle voice input</span>
          </Button>
          
          <Button variant="outline" size="icon" className="rounded-full relative">
            <Bell className="h-4 w-4" />
            <span className="sr-only">Notifications</span>
            <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-accent"></span>
          </Button>
          
          <Avatar>
            <AvatarImage src="" alt="Professor" />
            <AvatarFallback className="bg-primary/10 text-primary font-medium">DP</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
}
