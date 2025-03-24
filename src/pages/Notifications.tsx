
import { useState } from "react";
import { NotificationService } from "@/services/api";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Bell, Calendar, Mail, MessageSquare, Search, Send, User } from "lucide-react";

export default function Notifications() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  
  const { data: notifications, isLoading } = useQuery({
    queryKey: ["notifications"],
    queryFn: NotificationService.getNotifications,
  });
  
  // Filter notifications based on search query and active tab
  const filteredNotifications = notifications?.filter(notification => {
    const matchesSearch = 
      notification.subject?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      notification.message.toLowerCase().includes(searchQuery.toLowerCase());
      
    if (activeTab === "all") return matchesSearch;
    return matchesSearch && notification.type === activeTab;
  });

  // Get icon based on notification type
  const getIcon = (type: string) => {
    switch (type) {
      case "email":
        return <Mail className="h-4 w-4" />;
      case "whatsapp":
        return <MessageSquare className="h-4 w-4" />;
      case "sms":
        return <MessageSquare className="h-4 w-4" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };
  
  // Get badge color based on notification status
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "sent":
        return <Badge variant="outline" className="bg-green-100">Sent</Badge>;
      case "failed":
        return <Badge variant="outline" className="bg-red-100">Failed</Badge>;
      case "pending":
        return <Badge variant="outline" className="bg-yellow-100">Pending</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Notifications</h1>
        <p className="text-muted-foreground">
          View and manage notifications sent to students
        </p>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search notifications..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button>
          <Send className="mr-2 h-4 w-4" />
          New Notification
        </Button>
      </div>
      
      <Tabs defaultValue="all" onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="email">Email</TabsTrigger>
          <TabsTrigger value="whatsapp">WhatsApp</TabsTrigger>
          <TabsTrigger value="sms">SMS</TabsTrigger>
        </TabsList>
        
        <TabsContent value={activeTab}>
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <p className="text-muted-foreground">Loading notifications...</p>
            </div>
          ) : filteredNotifications && filteredNotifications.length > 0 ? (
            <div className="space-y-4">
              {filteredNotifications.map((notification) => (
                <Card key={notification.id} className="hover:shadow-sm transition-all">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2 mb-1">
                          {getIcon(notification.type)}
                          <h3 className="font-medium">{notification.subject || "No Subject"}</h3>
                          {getStatusBadge(notification.status)}
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{notification.message}</p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground mt-2">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            <span>{format(new Date(notification.sent_at), "PPp")}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            <span>{notification.sentTo?.length || 0} recipients</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <Bell className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No notifications found</p>
              {(searchQuery || activeTab !== "all") && (
                <Button 
                  variant="link" 
                  onClick={() => {
                    setSearchQuery("");
                    setActiveTab("all");
                  }}
                  className="mt-2"
                >
                  Clear filters
                </Button>
              )}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
