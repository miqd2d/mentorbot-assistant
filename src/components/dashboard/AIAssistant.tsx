
import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Send, Sparkles, Bot, Settings, ArrowLeft, SaveIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export function AIAssistant() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: "Hello! I'm your teaching assistant. How can I help you today?",
      timestamp: new Date(),
    },
  ]);
  
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [apiKey, setApiKey] = useState(localStorage.getItem("openai_api_key") || "");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    // In a real application, this would be an API call to your backend
    // using the stored API key
    setTimeout(() => {
      const response = "I'm your AI teaching assistant. I can help you with educational tasks like creating lesson plans, explaining concepts, or answering questions about teaching methodologies. This is a demo response - in a real application, I would connect to OpenAI using your API key.";
      
      const assistantMessage: Message = {
        id: Date.now().toString(),
        role: "assistant",
        content: response,
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 1000);
  };

  const saveApiKey = () => {
    localStorage.setItem("openai_api_key", apiKey);
    toast({
      title: "API Key saved",
      description: "Your OpenAI API key has been saved securely.",
    });
    setShowSettings(false);
  };

  if (showSettings) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center gap-4">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setShowSettings(false)}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <CardTitle className="text-base font-medium">
            AI Assistant Settings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">
                OpenAI API Key
              </label>
              <Input
                className="mt-1"
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Enter your OpenAI API key"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Your API key is stored locally in your browser and never sent to our servers.
              </p>
            </div>
            <Button 
              onClick={saveApiKey} 
              className="w-full"
            >
              <SaveIcon className="h-4 w-4 mr-2" />
              Save API Key
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="col-span-1">
      <CardHeader className="flex flex-row items-center justify-between p-4">
        <CardTitle className="text-base font-medium">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-yellow-500" />
            AI Teaching Assistant
          </div>
        </CardTitle>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => setShowSettings(true)}
        >
          <Settings className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="p-0">
        <Tabs defaultValue="chat">
          <div className="border-b px-4">
            <TabsList className="w-full justify-start px-0 h-auto">
              <TabsTrigger value="chat" className="py-2">Chat</TabsTrigger>
              <TabsTrigger value="examples" className="py-2">Examples</TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="chat" className="m-0">
            <ScrollArea className="h-[350px] p-4">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${
                      message.role === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`flex max-w-[80%] ${
                        message.role === "user" ? "flex-row-reverse" : "flex-row"
                      } items-start gap-2`}
                    >
                      <Avatar className="h-6 w-6">
                        {message.role === "assistant" ? (
                          <>
                            <AvatarImage src="" />
                            <AvatarFallback className="bg-primary text-xs">
                              <Bot className="h-3 w-3" />
                            </AvatarFallback>
                          </>
                        ) : (
                          <>
                            <AvatarImage src="" />
                            <AvatarFallback className="bg-muted text-xs">
                              U
                            </AvatarFallback>
                          </>
                        )}
                      </Avatar>
                      <div
                        className={`rounded-lg px-3 py-2 text-sm ${
                          message.role === "user"
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted"
                        }`}
                      >
                        {message.content}
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>
            <div className="p-4 border-t">
              <form onSubmit={handleSubmit} className="flex gap-2">
                <Input
                  placeholder="Ask anything about teaching..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  disabled={isLoading}
                />
                <Button type="submit" size="icon" disabled={isLoading}>
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </div>
          </TabsContent>
          
          <TabsContent value="examples" className="m-0 p-4">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Try asking:</p>
              {[
                "Create a lesson plan on photosynthesis",
                "How do I handle disruptive students?",
                "Suggest activities for teaching fractions",
                "Create a quiz on world history"
              ].map((example, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="w-full justify-start text-left h-auto py-2 px-3"
                  onClick={() => {
                    setInput(example);
                  }}
                >
                  {example}
                </Button>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
