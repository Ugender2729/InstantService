import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useUser } from "@/contexts/UserContext";
import { usePayment } from "@/contexts/PaymentContext";
import { useNotifications } from "@/contexts/NotificationContext";
import { Calendar, Clock, MapPin, User, CreditCard, Eye, EyeOff, Users, ArrowLeft, Briefcase } from "lucide-react";
import { Link } from "react-router-dom";

const UserDashboard = () => {
  const { user } = useUser();
  const { getBookingsByUser, getPaymentsByUser } = usePayment();
  const { notifications } = useNotifications();
  const [showPhoneNumbers, setShowPhoneNumbers] = useState(false);

  const userBookings = getBookingsByUser(user?.id || "");
  const userPayments = getPaymentsByUser(user?.id || "");
  const userNotifications = notifications.filter(n => 
    n.data?.customerName === user?.name || n.data?.providerName === user?.name
  );

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link to="/">
              <Button 
                variant="ghost" 
                size="sm"
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Home
              </Button>
            </Link>
            <div className="border-l border-border/50 pl-6">
              <h1 className="text-3xl font-bold text-foreground mb-2">Dashboard</h1>
              <p className="text-muted-foreground">
                Welcome back, {user?.name}! Manage your bookings and payments.
              </p>
            </div>
          </div>
          <Link to="/find-services">
            <Button className="flex items-center gap-2 bg-brand-primary hover:bg-brand-primary/90">
              <Briefcase className="w-4 h-4" />
              Posted Services
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Bookings</p>
                <p className="text-2xl font-bold">{userBookings.length}</p>
              </div>
              <Calendar className="w-8 h-8 text-brand-primary" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Payments</p>
                <p className="text-2xl font-bold">₹{userPayments.reduce((sum, p) => sum + p.totalAmount, 0)}</p>
              </div>
              <CreditCard className="w-8 h-8 text-brand-primary" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Notifications</p>
                <p className="text-2xl font-bold">{userNotifications.length}</p>
              </div>
              <Clock className="w-8 h-8 text-brand-primary" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Account Type</p>
                <p className="text-2xl font-bold capitalize">{user?.type}</p>
              </div>
              <User className="w-8 h-8 text-brand-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="bookings" className="space-y-6">
        <TabsList>
          <TabsTrigger value="bookings">Bookings</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>

        <TabsContent value="bookings">
          <Card>
            <CardHeader>
              <CardTitle>Your Bookings</CardTitle>
              <CardDescription>
                Track all your service bookings and their status
              </CardDescription>
            </CardHeader>
            <CardContent>
              {userBookings.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No bookings yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {userBookings.map((booking) => (
                    <Card key={booking.id} className="border-l-4 border-l-brand-primary">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold">{booking.serviceName}</h3>
                              <Badge className={getStatusColor(booking.status)}>
                                {booking.status}
                              </Badge>
                            </div>
                            <div className="text-sm text-muted-foreground space-y-1">
                              <div className="flex items-center gap-2">
                                <User className="w-4 h-4" />
                                <span>
                                  {user?.type === 'customer' ? `Provider: ${booking.providerName}` : `Customer: ${booking.customerName}`}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <MapPin className="w-4 h-4" />
                                <span>{booking.location}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <CreditCard className="w-4 h-4" />
                                <span>₹{booking.amount}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4" />
                                <span>{formatDate(booking.timestamp)}</span>
                              </div>
                              {showPhoneNumbers && (
                                <div className="flex items-center gap-2">
                                  <span className="text-xs bg-muted px-2 py-1 rounded">
                                    {user?.type === 'customer' ? `Provider: ${booking.providerPhone}` : `Customer: ${booking.customerPhone}`}
                                  </span>
                                </div>
                              )}
                            </div>
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
              <CardTitle>Payment History</CardTitle>
              <CardDescription>
                View all your payment transactions
              </CardDescription>
            </CardHeader>
            <CardContent>
              {userPayments.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <CreditCard className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No payments yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {userPayments.map((payment) => (
                    <Card key={payment.id} className="border-l-4 border-l-green-500">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold">{payment.serviceName}</h3>
                              <Badge className="bg-green-100 text-green-800">
                                {payment.status}
                              </Badge>
                            </div>
                            <div className="text-sm text-muted-foreground space-y-1">
                              <div className="flex justify-between">
                                <span>Total Amount:</span>
                                <span>₹{payment.totalAmount}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Platform Fee:</span>
                                <span>₹{payment.commissionAmount}</span>
                              </div>
                              <div className="flex justify-between font-medium">
                                <span>Provider Receives:</span>
                                <span>₹{payment.providerAmount}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4" />
                                <span>{formatDate(payment.timestamp)}</span>
                              </div>
                            </div>
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
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Notifications</CardTitle>
                  <CardDescription>
                    Stay updated with your booking activities
                  </CardDescription>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowPhoneNumbers(!showPhoneNumbers)}
                >
                  {showPhoneNumbers ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  {showPhoneNumbers ? "Hide" : "Show"} Contact Info
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {userNotifications.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Clock className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No notifications yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {userNotifications.map((notification) => (
                    <Card key={notification.id} className="border-l-4 border-l-brand-primary">
                      <CardContent className="p-4">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <h3 className="font-semibold">{notification.title}</h3>
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
                              {showPhoneNumbers && notification.data.phone && (
                                <div>Contact: {notification.data.phone}</div>
                              )}
                            </div>
                          )}
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

export default UserDashboard; 