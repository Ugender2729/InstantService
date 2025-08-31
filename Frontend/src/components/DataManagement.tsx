import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useUser } from "@/contexts/UserContext";
import { usePayment } from "@/contexts/PaymentContext";
import { useNotifications } from "@/contexts/NotificationContext";
import { 
  Download, 
  Upload, 
  Trash2, 
  Users, 
  Calendar, 
  CreditCard, 
  Bell,
  Database,
  FileText
} from "lucide-react";
import { Label } from "@/components/ui/label";

const DataManagement = () => {
  const { getAllUsers } = useUser();
  const { exportData, importData, clearAllData } = usePayment();
  const { exportNotifications, importNotifications } = useNotifications();
  const [importedData, setImportedData] = useState<string>("");

  const users = getAllUsers();
  const { bookings, payments } = exportData();
  const notifications = exportNotifications();

  const handleExportData = () => {
    const data = {
      users,
      bookings,
      payments,
      notifications,
      exportDate: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `instaserve-data-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImportData = () => {
    try {
      const data = JSON.parse(importedData);
      
      if (data.bookings && data.payments) {
        importData({ bookings: data.bookings, payments: data.payments });
      }
      
      if (data.notifications) {
        importNotifications(data.notifications);
      }
      
      alert('Data imported successfully!');
      setImportedData("");
    } catch (error) {
      alert('Error importing data. Please check the format.');
    }
  };

  const handleClearAllData = () => {
    if (confirm('Are you sure you want to clear all data? This action cannot be undone.')) {
      clearAllData();
      alert('All data has been cleared.');
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="w-5 h-5" />
            Data Management
          </CardTitle>
          <CardDescription>
            Export, import, and manage application data
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button onClick={handleExportData} className="w-full">
              <Download className="w-4 h-4 mr-2" />
              Export All Data
            </Button>
            <Button variant="outline" onClick={handleClearAllData} className="w-full">
              <Trash2 className="w-4 h-4 mr-2" />
              Clear All Data
            </Button>
          </div>

          <div className="space-y-2">
            <Label htmlFor="import-data">Import Data (JSON format)</Label>
            <textarea
              id="import-data"
              className="w-full h-32 p-2 border rounded-md"
              placeholder="Paste JSON data here..."
              value={importedData}
              onChange={(e) => setImportedData(e.target.value)}
            />
            <Button onClick={handleImportData} disabled={!importedData.trim()}>
              <Upload className="w-4 h-4 mr-2" />
              Import Data
            </Button>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="users" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="bookings">Bookings</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>

        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Registered Users ({users.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {users.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">No users found</p>
              ) : (
                <div className="space-y-4">
                  {users.map((user) => (
                    <Card key={user.id} className="border-l-4 border-l-brand-primary">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold">{user.name}</h3>
                              <Badge variant="secondary">{user.type}</Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">{user.email}</p>
                            <p className="text-sm text-muted-foreground">{user.phone}</p>
                            <p className="text-sm text-muted-foreground">{user.address}</p>
                            {user.skills && (
                              <p className="text-sm text-muted-foreground">
                                Skills: {user.skills}
                              </p>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bookings">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                All Bookings ({bookings.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {bookings.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">No bookings found</p>
              ) : (
                <div className="space-y-4">
                  {bookings.map((booking) => (
                    <Card key={booking.id} className="border-l-4 border-l-brand-primary">
                      <CardContent className="p-4">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold">{booking.serviceName}</h3>
                            <Badge variant="secondary">{booking.status}</Badge>
                          </div>
                          <div className="text-sm text-muted-foreground space-y-1">
                            <p>Customer: {booking.customerName}</p>
                            <p>Provider: {booking.providerName}</p>
                            <p>Amount: ₹{booking.amount}</p>
                            <p>Location: {booking.location}</p>
                            <p>Date: {formatDate(booking.timestamp)}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payments">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                All Payments ({payments.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {payments.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">No payments found</p>
              ) : (
                <div className="space-y-4">
                  {payments.map((payment) => (
                    <Card key={payment.id} className="border-l-4 border-l-green-500">
                      <CardContent className="p-4">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold">{payment.serviceName}</h3>
                            <Badge variant="secondary">{payment.status}</Badge>
                          </div>
                          <div className="text-sm text-muted-foreground space-y-1">
                            <p>Total Amount: ₹{payment.totalAmount}</p>
                            <p>Commission: ₹{payment.commissionAmount}</p>
                            <p>Provider Receives: ₹{payment.providerAmount}</p>
                            <p>Date: {formatDate(payment.timestamp)}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5" />
                All Notifications ({notifications.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {notifications.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">No notifications found</p>
              ) : (
                <div className="space-y-4">
                  {notifications.map((notification) => (
                    <Card key={notification.id} className="border-l-4 border-l-brand-primary">
                      <CardContent className="p-4">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold">{notification.title}</h3>
                            <Badge variant="secondary">{notification.type}</Badge>
                            {!notification.read && (
                              <Badge variant="destructive">Unread</Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">{notification.message}</p>
                          <p className="text-xs text-muted-foreground">
                            {formatDate(notification.timestamp)}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DataManagement; 