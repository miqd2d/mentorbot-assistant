
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import SpeechToText from "@/components/SpeechToText";
import { supabase } from "@/integrations/supabase/client";

interface Message {
  content: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
}

export function AIAssistant() {
  const [messages, setMessages] = useState<Message[]>([
    {
      content: "Hello! I'm your AI assistant. How can I help you today?",
      sender: 'assistant',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      content: input,
      sender: 'user',
      timestamp: new Date(),
    };

    // Update messages with user input
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      // Call Supabase Edge Function
      const { data, error } = await supabase.functions.invoke('ai-assistant', {
        body: { 
          message: input,
          context: "You are an AI assistant for educators. You provide helpful, concise, and accurate information about educational topics, teaching methods, student management, and classroom activities. Be respectful and professional in your responses."
        },
      });

      if (error) {
        throw new Error(error.message);
      }

      if (!data || !data.response) {
        throw new Error("No response received from AI assistant");
      }

      const assistantMessage: Message = {
        content: data.response,
        sender: 'assistant',
        timestamp: new Date(),
      };

      // Update messages with AI response
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error calling AI assistant:', error);
      
      // Add error message to chat
      setMessages((prev) => [...prev, {
        content: "I'm sorry, I encountered an error processing your request. Please try again later.",
        sender: 'assistant',
        timestamp: new Date(),
      }]);
      
      toast({
        title: "Error",
        description: "Failed to get response from AI assistant. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !isLoading) {
      handleSendMessage();
    }
  };

  const handleSpeechResult = (text: string) => {
    setInput(text);
  };

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    const chatContent = document.querySelector('.ai-chat-content');
    if (chatContent) {
      chatContent.scrollTop = chatContent.scrollHeight;
    }
  }, [messages]);

  return (
    <Card className="col-span-2 h-[400px] flex flex-col">
      <CardHeader className="pb-3">
        <CardTitle>AI Assistant</CardTitle>
        <CardDescription>
          Ask questions about your classes, students, or assignments
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 overflow-auto space-y-4 text-sm pb-0 ai-chat-content">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${
              message.sender === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`max-w-[80%] px-3 py-2 rounded-lg ${
                message.sender === 'user'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted'
              }`}
            >
              {message.content}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="max-w-[80%] px-3 py-2 rounded-lg bg-muted flex items-center space-x-2">
              <Loader2 className="h-3 w-3 animate-spin" />
              <span>Thinking...</span>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="pt-4 flex flex-col space-y-2">
        <SpeechToText onTextCapture={handleSpeechResult} />
        <div className="flex w-full items-center space-x-2">
          <Input
            placeholder="Type your question..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
          />
          <Button 
            size="icon" 
            onClick={handleSendMessage} 
            disabled={isLoading || !input.trim()}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
