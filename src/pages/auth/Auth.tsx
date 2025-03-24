
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Mail, Key, Loader2, LogIn } from "lucide-react";

export default function Auth() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  // Handle bypass authentication for demo/prototype purposes
  const handleBypassAuth = () => {
    toast({
      title: "Authentication bypassed",
      description: "You've been logged in for demo purposes.",
    });
    
    // Store a fake session in localStorage to mimic auth
    localStorage.setItem('supabase.auth.token', JSON.stringify({
      currentSession: {
        access_token: 'demo-token',
        user: {
          id: 'demo-user-id',
          email: 'demo@example.com',
        },
      },
    }));
    
    navigate("/");
  };
  
  // Handle email/password login
  const handleLogin = async () => {
    if (!email || !password) {
      toast({
        title: "Missing fields",
        description: "Please fill in all the required fields.",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      
      toast({
        title: "Welcome back!",
        description: "You have successfully logged in.",
      });
      
      navigate("/");
    } catch (error) {
      console.error("Login error:", error);
      toast({
        title: "Login failed",
        description: error.message || "An error occurred during login. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle email/password signup
  const handleSignup = async () => {
    if (!email || !password || !confirmPassword) {
      toast({
        title: "Missing fields",
        description: "Please fill in all the required fields.",
        variant: "destructive",
      });
      return;
    }
    
    if (password !== confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please make sure your passwords match.",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });
      
      if (error) throw error;
      
      toast({
        title: "Account created",
        description: "Your account has been successfully created.",
      });
      
      // If email confirmation is enabled, show a different message
      if (data?.user?.identities?.length === 0) {
        toast({
          title: "Email already registered",
          description: "This email is already registered. Please sign in instead.",
          variant: "destructive",
        });
        setActiveTab("login");
      } else if (!data?.session) {
        toast({
          title: "Verification email sent",
          description: "Please check your email to verify your account.",
        });
      } else {
        navigate("/");
      }
    } catch (error) {
      console.error("Signup error:", error);
      toast({
        title: "Signup failed",
        description: error.message || "An error occurred during signup. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle social login
  const handleSocialLogin = async (provider: "google" | "apple" | "azure") => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/`,
        },
      });
      
      if (error) throw error;
    } catch (error) {
      console.error(`${provider} login error:`, error);
      toast({
        title: "Login failed",
        description: error.message || `An error occurred during ${provider} login. Please try again.`,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white font-semibold text-xl">
              M
            </div>
          </div>
          <CardTitle className="text-2xl">Masterplan</CardTitle>
          <CardDescription>
            Enter your credentials to {activeTab === "login" ? "sign in" : "create an account"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="your@email.com" 
                    className="pl-9"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Button variant="link" className="p-0 h-auto text-xs">
                    Forgot Password?
                  </Button>
                </div>
                <div className="relative">
                  <Key className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="password" 
                    type="password" 
                    placeholder="••••••••" 
                    className="pl-9"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>
              
              <Button 
                className="w-full" 
                onClick={handleLogin}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  "Sign In"
                )}
              </Button>
            </TabsContent>
            
            <TabsContent value="signup" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="signup-email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="signup-email" 
                    type="email" 
                    placeholder="your@email.com" 
                    className="pl-9"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="signup-password">Password</Label>
                <div className="relative">
                  <Key className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="signup-password" 
                    type="password" 
                    placeholder="••••••••" 
                    className="pl-9"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm Password</Label>
                <div className="relative">
                  <Key className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="confirm-password" 
                    type="password" 
                    placeholder="••••••••" 
                    className="pl-9"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
              </div>
              
              <Button 
                className="w-full" 
                onClick={handleSignup}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  "Create Account"
                )}
              </Button>
            </TabsContent>
          </Tabs>
          
          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <Separator />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-2">
            <Button 
              variant="outline" 
              onClick={() => handleSocialLogin("google")}
              disabled={isLoading}
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
            </Button>
            <Button 
              variant="outline" 
              onClick={() => handleSocialLogin("apple")}
              disabled={isLoading}
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
                <path d="M16.52 2a5.36 5.36 0 0 0-4.97 2.95c-.05.11-.1.23-.14.35h.01c.06-.12.12-.24.19-.35A5.05 5.05 0 0 1 16.26 2h.26Z" fill="currentColor"/>
                <path d="M11.75 5.4c-.54.24-1.05.56-1.52.94-.86.7-1.44 1.62-1.69 2.58-.07.27-.12.54-.15.82h.04c.23-1.17.87-2.18 1.79-2.93.48-.39 1.01-.72 1.56-.96.56-.24 1.15-.4 1.75-.46.36-.04.72-.03 1.08.01-.35-.15-.72-.27-1.09-.34-.59-.09-1.19-.09-1.77 0-.33.06-.66.14-.99.25-.01 0-.01.05-.01.09Z" fill="currentColor"/>
                <path d="M21.39 16.43c-.04-.05-.08-.1-.11-.16-.14-.21-.27-.45-.38-.69-.33-.73-.51-1.52-.55-2.3v-.11c0-.28.01-.57.05-.86.07-.61.21-1.22.41-1.8.16-.47.36-.93.6-1.36.15-.27.22-.59.18-.9-.03-.31-.17-.6-.4-.8-.4-.36-.94-.4-1.38-.11-.1.07-.19.14-.29.22-.37.31-.7.66-1 1.05-.38.5-.7 1.03-.96 1.59-.21.47-.37.96-.48 1.47-.06.27-.1.54-.12.81 0 .13 0 .26-.02.4 0 .36.03.72.1 1.08.11.63.31 1.25.59 1.82.34.67.61 1.37.82 2.1.09.3.16.61.21.92.04.29.04.59 0 .88-.07.37-.2.73-.36 1.07-.19.37-.44.71-.74 1-.23.23-.5.42-.8.55-.2.08-.42.13-.65.12l-.08-.01c-.28-.04-.56-.12-.82-.23-.42-.19-.82-.42-1.18-.7-.7-.55-1.35-1.16-1.96-1.82-.46-.5-.89-1.03-1.29-1.58-.13-.18-.26-.36-.38-.55-.4-.59-.72-1.22-.96-1.89-.11-.33-.21-.67-.28-1.01-.04-.18-.07-.36-.09-.55-.03-.34-.04-.69-.04-1.03.01-.31.02-.62.05-.92.04-.39.1-.78.18-1.16.08-.34.17-.67.28-1 .1-.3.21-.6.33-.89.27-.64.6-1.25.98-1.82.6-.88 1.27-1.7 2.01-2.47.94-.97 1.94-1.87 3.01-2.7.27-.21.55-.42.83-.61.29-.2.58-.39.88-.57.15-.09.29-.17.44-.25.49-.26.99-.47 1.51-.64C15.9 1.83 16.33 2 16.64 2h-.12c-.6.08-1.16.29-1.65.6-.23.15-.45.32-.66.49-.24.19-.48.39-.7.6-.57.54-1.11 1.12-1.6 1.73-.43.54-.8 1.12-1.12 1.74-.33.59-.6 1.21-.8 1.86-.07.25-.14.5-.19.76-.15.84-.17 1.69-.08 2.54.05.4.13.8.25 1.18.13.48.32.94.54 1.38.11.22.24.44.37.65.15.25.32.49.5.73.41.56.88 1.09 1.37 1.58.52.54 1.07 1.06 1.64 1.56.5.43 1.04.82 1.6 1.17.48.3.98.58 1.49.81.27.13.55.24.83.35.39.15.79.26 1.2.34.09.02.19.04.28.05.22.04.43.05.65.05.22-.01.43-.04.64-.1.41-.11.79-.3 1.12-.57.32-.26.59-.57.8-.92.19-.32.34-.66.45-1.02.12-.41.18-.83.17-1.26-.01-.4-.06-.8-.14-1.2-.07-.33-.16-.65-.27-.97-.19-.54-.43-1.07-.71-1.57-.31-.57-.56-1.17-.72-1.8-.12-.48-.18-.98-.18-1.48 0-.42.04-.84.13-1.25.08-.36.19-.71.33-1.05.16-.41.37-.81.61-1.18.38-.57.79-1.12 1.27-1.62-.41.36-.77.76-1.09 1.19-.25.34-.47.7-.65 1.09-.18.37-.33.77-.43 1.18-.11.41-.17.84-.19 1.27 0 .41.03.83.11 1.24.08.44.21.87.37 1.28.21.51.46 1 .75 1.47.21.34.4.7.56 1.07.16.36.29.73.4 1.11.08.33.14.67.16 1.02.02.29.03.59 0 .88-.05.36-.15.72-.31 1.05-.17.36-.41.68-.7.96-.28.26-.6.45-.96.58-.15.05-.3.08-.45.09-.34.02-.69 0-1.02-.07-.3-.06-.59-.15-.87-.26-.5-.2-.98-.44-1.43-.73-.53-.33-1.05-.7-1.54-1.09-.59-.48-1.15-1-1.68-1.54-.42-.43-.82-.88-1.2-1.35-.29-.36-.57-.74-.8-1.16-.25-.44-.44-.92-.59-1.41-.17-.58-.26-1.19-.25-1.79-.01-.5.04-1 .16-1.48.09-.38.21-.76.37-1.12.16-.38.35-.75.57-1.09.2-.32.42-.63.66-.92.26-.33.55-.63.85-.92.32-.3.65-.59 1-.85.7-.53 1.44-1.01 2.21-1.44.41-.23.83-.44 1.26-.63.57-.25 1.17-.45 1.78-.61.65-.17 1.32-.29 1.99-.35.44-.04.87-.05 1.31-.02.36.02.71.06 1.06.12.71.13 1.4.34 2.08.6.5.19.99.43 1.45.7.4.23.77.51 1.11.83.31.29.56.62.76 1 .21.39.33.82.36 1.26.02.45-.05.89-.22 1.3-.17.42-.4.81-.67 1.18-.31.42-.65.81-1.02 1.18-.42.42-.87.81-1.33 1.18-.2.16-.41.31-.61.47-.42.33-.81.71-1.17 1.11-.33.38-.63.79-.87 1.22-.23.39-.4.81-.53 1.24-.16.53-.24 1.09-.23 1.65-.01.29.02.59.08.87.05.28.14.54.26.79.13.26.29.5.47.72.2.24.41.47.64.68.26.23.54.43.84.61.36.21.74.38 1.14.53.45.16.92.27 1.39.33.12.01.24.02.37.04.07.05.09.12.05.19Z" fill="currentColor"/>
              </svg>
            </Button>
            <Button 
              variant="outline" 
              onClick={() => handleSocialLogin("azure")}
              disabled={isLoading}
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
                <path d="M13.0404 4C13.0404 4 19.9167 4.16 19.9167 9.82333C19.9167 15.4867 13.914 20.0033 13.914 20.0033L21.3333 20V4H13.0404Z" fill="#0364B8"/>
                <path d="M13.0795 12.31C13.0795 12.31 10.2969 12.31 7.61167 12.31C4.92647 12.31 2.66667 14.4807 2.66667 17.155C2.66667 19.8293 4.92647 22 7.61167 22H13.0795V12.31Z" fill="#0078D4"/>
                <path d="M13.1187 12.31H7.65093C5.13032 12.31 3.10352 14.4807 3.10352 17.155C3.10352 19.8293 5.13032 22 7.65093 22H13.1187V12.31Z" fill="#1490DF"/>
                <path d="M3.06747 17.155C3.06747 19.8292 5.09427 22 7.61488 22H13.0827V17.155H3.06747Z" fill="#28A8EA"/>
                <path d="M12.9199 4.00001L6.42513 4.00002C4.00116 4.00002 2.66664 5.96907 2.66664 8.00001V13.9091L12.9199 13.9091V4.00001Z" fill="#0078D4"/>
                <path d="M2.66664 12H12.9199V4.00001L6.42513 4.00002C4.00116 4.00002 2.66664 5.96907 2.66664 8.00001V12Z" fill="#0364B8"/>
                <path d="M2.66664 8.00001V12H12.9199V4.00001L6.42513 4.00002C4.00116 4.00002 2.66664 5.96907 2.66664 8.00001Z" fill="#0078D4"/>
                <path d="M2.66664 8.00001C2.66664 10.0309 4.00116 12 6.42513 12H12.9199V4.00001L6.42513 4.00002C4.00116 4.00002 2.66664 5.96907 2.66664 8.00001Z" fill="#064A8C"/>
                <path d="M2.66664 8.00001C2.66664 9.11166 3.14333 10.1393 3.98819 11H12.9199V4.00001L6.42513 4.00002C4.00116 4.00002 2.66664 5.96907 2.66664 8.00001Z" fill="#0A2767"/>
                <path d="M2.66667 7.9999C2.66667 9.11155 3.14343 10.1392 3.98838 10.9999H12.92V3.99998L6.42516 3.99999C4.00119 3.99999 2.66667 5.96904 2.66667 7.9999Z" fill="#0078D4"/>
                <path d="M6.8 7.3H6.4C6.18 7.3 6 7.12 6 6.9C6 6.68 6.18 6.5 6.4 6.5H7.2C7.42 6.5 7.6 6.68 7.6 6.9C7.6 7.12 7.42 7.3 7.2 7.3V7.7C7.2 7.92 7.02 8.1 6.8 8.1C6.58 8.1 6.4 7.92 6.4 7.7V7.3Z" fill="white"/>
                <path d="M8.41159 6.89989C8.41159 6.67189 8.58859 6.48789 8.81159 6.48789H9.61159C9.83459 6.48789 10.0116 6.67189 10.0116 6.89989C10.0116 7.12789 9.83459 7.31189 9.61159 7.31189H9.21159V7.70789C9.21159 7.93589 9.03459 8.11989 8.81159 8.11989C8.58859 8.11989 8.41159 7.93589 8.41159 7.70789V6.89989Z" fill="white"/>
                <path d="M6 5.29999C6 5.07799 6.178 4.89999 6.4 4.89999H7.2C7.422 4.89999 7.6 5.07799 7.6 5.29999C7.6 5.52199 7.422 5.69999 7.2 5.69999H6.4C6.178 5.69999 6 5.52199 6 5.29999Z" fill="white"/>
                <path d="M8 5.3C8 5.078 8.178 4.9 8.4 4.9H9.2C9.422 4.9 9.6 5.078 9.6 5.3C9.6 5.522 9.422 5.7 9.2 5.7H8.4C8.178 5.7 8 5.522 8 5.3Z" fill="white"/>
                <path d="M6.8 9.69999C7.022 9.69999 7.2 9.52199 7.2 9.29999C7.2 9.07799 7.022 8.89999 6.8 8.89999C6.578 8.89999 6.4 9.07799 6.4 9.29999C6.4 9.52199 6.578 9.69999 6.8 9.69999Z" fill="white"/>
                <path d="M8.8 9.7C9.022 9.7 9.2 9.522 9.2 9.3C9.2 9.078 9.022 8.9 8.8 8.9C8.578 8.9 8.4 9.078 8.4 9.3C8.4 9.522 8.578 9.7 8.8 9.7Z" fill="white"/>
              </svg>
            </Button>
          </div>
          
          <div className="mt-6 pt-4 border-t border-border">
            <Button 
              variant="secondary"
              className="w-full flex items-center justify-center gap-2"
              onClick={handleBypassAuth}
            >
              <LogIn className="h-4 w-4" />
              Bypass Authentication (Demo Only)
            </Button>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col">
          <Button 
            variant="link" 
            onClick={() => setActiveTab(activeTab === "login" ? "signup" : "login")}
            className="w-full"
          >
            {activeTab === "login" 
              ? "Don't have an account? Sign up" 
              : "Already have an account? Sign in"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
