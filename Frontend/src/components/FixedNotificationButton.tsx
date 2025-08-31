import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bell, X, MessageCircle, Send, User, Calendar } from "lucide-react";
import { useUser } from "@/contexts/UserContext";
import { useNotifications } from "@/contexts/NotificationContext";

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  receiverId: string;
  receiverName: string;
  message: string;
  timestamp: Date;
  isRead: boolean;
}

const FixedNotificationButton = () => {
  const { user, isAuthenticated } = useUser();
  const { notifications } = useNotifications();
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("notifications");
  const [newMessage, setNewMessage] = useState("");
  const [selectedReceiver, setSelectedReceiver] = useState("");

  // Mock messages data - in real app this would come from a context or API
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      senderId: "user-1",
      senderName: "John Doe",
      receiverId: "provider-1",
      receiverName: "Sarah Johnson",
      message: "Hi Sarah, I need help with my booking for tomorrow.",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      isRead: false
    },
    {
      id: "2",
      senderId: "provider-1",
      senderName: "Sarah Johnson",
      receiverId: "user-1",
      receiverName: "John Doe",
      message: "Sure John! I'll be there at 10 AM as scheduled.",
      timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
      isRead: true
    },
    {
      id: "3",
      senderId: "user-1",
      senderName: "John Doe",
      receiverId: "provider-2",
      receiverName: "David Chen",
      message: "David, can you help me with a plumbing issue?",
      timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
      isRead: false
    }
  ]);

  // Mock users for messaging
  const availableUsers = [
    { id: "provider-1", name: "Sarah Johnson", type: "provider" },
    { id: "provider-2", name: "David Chen", type: "provider" },
    { id: "provider-3", name: "Maria Rodriguez", type: "provider" },
    { id: "user-2", name: "Jane Smith", type: "user" },
    { id: "user-3", name: "Mike Wilson", type: "user" }
  ];

  const unreadNotifications = notifications.filter(n => !n.isRead).length;
  const unreadMessages = messages.filter(m => 
    (m.receiverId === user?.id || m.senderId === user?.id) && !m.isRead
  ).length;

  const totalUnread = unreadNotifications + unreadMessages;

  const userMessages = messages.filter(m => 
    m.senderId === user?.id || m.receiverId === user?.id
  ).sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

  const userNotifications = notifications.filter(n => 
    n.data?.customerName === user?.name || 
    n.data?.providerName === user?.name ||
    n.data?.customerId === user?.id ||
    n.data?.providerId === user?.id
  ).sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedReceiver) return;

    const receiver = availableUsers.find(u => u.id === selectedReceiver);
    if (!receiver) return;

    const message: Message = {
      id: Date.now().toString(),
      senderId: user?.id || "",
      senderName: user?.name || "",
      receiverId: selectedReceiver,
      receiverName: receiver.name,
      message: newMessage.trim(),
      timestamp: new Date(),
      isRead: false
    };

    setMessages(prev => [message, ...prev]);
    setNewMessage("");
    setSelectedReceiver("");
  };

  const markMessageAsRead = (messageId: string) => {
    setMessages(prev => 
      prev.map(m => 
        m.id === messageId ? { ...m, isRead: true } : m
      )
    );
  };

  if (!isAuthenticated) return null;

  return (
    <>
      {/* Fixed Notification Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setIsOpen(true)}
          size="lg"
          className="rounded-full w-14 h-14 shadow-lg bg-brand-primary hover:bg-brand-primary/90"
        >
          <Bell className="w-6 h-6" />
          {totalUnread > 0 && (
            <Badge 
              className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0 flex items-center justify-center text-xs"
              variant="destructive"
            >
              {totalUnread > 99 ? "99+" : totalUnread}
            </Badge>
          )}
        </Button>
      </div>

      {/* Notification Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5" />
              Notifications & Messages
            </DialogTitle>
          </DialogHeader>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="notifications" className="flex items-center gap-2">
                <Bell className="w-4 h-4" />
                Notifications
                {unreadNotifications > 0 && (
                  <Badge variant="destructive" className="ml-1 h-5 w-5 rounded-full p-0 text-xs">
                    {unreadNotifications}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="messages" className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4" />
                Messages
                {unreadMessages > 0 && (
                  <Badge variant="destructive" className="ml-1 h-5 w-5 rounded-full p-0 text-xs">
                    {unreadMessages}
                  </Badge>
                )}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="notifications" className="mt-4 max-h-[60vh] overflow-y-auto">
              {userNotifications.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Bell className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No notifications yet</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {userNotifications.map((notification) => (
                    <Card key={notification.id} className="border-l-4 border-l-brand-primary">
                      <CardContent className="p-4">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <h4 className="font-semibold">{notification.title}</h4>
                            <Badge variant="secondary" className="text-xs">
                              {formatDate(notification.timestamp)}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {notification.message}
                          </p>
                          {notification.data && (
                            <div className="text-xs text-muted-foreground space-y-1">
                              {notification.data.service && (
                                <div>Service: {notification.data.service}</div>
                              )}
                              {notification.data.amount && (
                                <div>Amount: ₹{notification.data.amount}</div>
                              )}
                              {notification.data.location && (
                                <div>Location: {notification.data.location}</div>
                              )}
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="messages" className="mt-4 max-h-[60vh] overflow-y-auto">
              <div className="space-y-4">
                {/* Send New Message */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Send Message</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex gap-2">
                      <select
                        value={selectedReceiver}
                        onChange={(e) => setSelectedReceiver(e.target.value)}
                        className="flex-1 px-3 py-2 border border-input rounded-md text-sm"
                        aria-label="Select message recipient"
                      >
                        <option value="">Select recipient...</option>
                        {availableUsers
                          .filter(u => u.id !== user?.id)
                          .map(u => (
                            <option key={u.id} value={u.id}>
                              {u.name} ({u.type})
                            </option>
                          ))
                        }
                      </select>
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type your message..."
                        className="flex-1 px-3 py-2 border border-input rounded-md text-sm"
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      />
                      <Button 
                        onClick={handleSendMessage}
                        size="sm"
                        disabled={!newMessage.trim() || !selectedReceiver}
                      >
                        <Send className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Messages List */}
                {userMessages.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <MessageCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No messages yet</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {userMessages.map((message) => {
                      const isOwnMessage = message.senderId === user?.id;
                      const otherPerson = isOwnMessage ? message.receiverName : message.senderName;
                      
                      return (
                        <Card 
                          key={message.id} 
                          className={`border-l-4 ${
                            isOwnMessage ? 'border-l-blue-500' : 'border-l-green-500'
                          } ${!message.isRead && !isOwnMessage ? 'bg-blue-50' : ''}`}
                          onClick={() => !message.isRead && !isOwnMessage && markMessageAsRead(message.id)}
                        >
                          <CardContent className="p-4">
                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <User className="w-4 h-4" />
                                  <span className="font-medium text-sm">
                                    {isOwnMessage ? `To: ${otherPerson}` : `From: ${otherPerson}`}
                                  </span>
                                  {!message.isRead && !isOwnMessage && (
                                    <Badge variant="destructive" className="text-xs">
                                      New
                                    </Badge>
                                  )}
                                </div>
                                <div className="flex items-center gap-2">
                                  <Calendar className="w-4 h-4 text-muted-foreground" />
                                  <span className="text-xs text-muted-foreground">
                                    {formatDate(message.timestamp)}
                                  </span>
                                </div>
                              </div>
                              <p className="text-sm">{message.message}</p>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default FixedNotificationButton; 