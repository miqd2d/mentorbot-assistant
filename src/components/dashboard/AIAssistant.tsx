
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Mic, Send, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export function AIAssistant() {
  const [input, setInput] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here we would handle sending the input to an AI API
    console.log("Sending query:", input);
    setInput("");
  };

  return (
    <Card className="col-span-1 md:col-span-2 overflow-hidden">
      <CardHeader className="bg-primary/5 border-b p-4">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-accent flex items-center justify-center">
            <Sparkles className="h-3.5 w-3.5 text-white" />
          </div>
          <CardTitle className="text-base font-medium">AI Assistant</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="p-4 h-[150px] overflow-y-auto">
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="w-7 h-7 rounded-full bg-accent/10 flex items-center justify-center mt-0.5">
              <Sparkles className="h-3.5 w-3.5 text-accent" />
            </div>
            <div className="bg-muted/50 rounded-lg p-3 text-sm">
              <p>Hello Professor! How can I assist you today?</p>
              <p className="mt-2 text-xs text-muted-foreground">Try asking about your class schedule, student attendance, or assignment status.</p>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-3 border-t">
        <form onSubmit={handleSubmit} className="flex items-center w-full gap-2">
          <Button
            type="button"
            variant="outline"
            size="icon"
            className={cn(
              "rounded-full flex-shrink-0 transition-all",
              isRecording && "bg-accent text-white border-accent animate-pulse-subtle"
            )}
            onClick={() => setIsRecording(!isRecording)}
          >
            <Mic className="h-4 w-4" />
          </Button>
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask anything..."
            className="flex-1"
          />
          <Button type="submit" size="icon" className="rounded-full flex-shrink-0" disabled={!input.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
}
