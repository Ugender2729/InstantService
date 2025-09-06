import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Users, 
  Calendar, 
  TrendingUp, 
  Settings,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  DollarSign,
  MapPin,
  User,
  Phone,
  Mail,
  LogOut
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import UserVerificationTable from "@/components/UserVerificationTable";
import { useAdmin } from "@/contexts/AdminContext";
import { useNavigate } from "react-router-dom";

interface Booking {
  id: string;
  booking_date: string;
  start_time: string;
  end_time: string;
  total_amount: number;
  status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
  notes: string;
  created_at: string;
  customer: {
    id: string;
    full_name: string;
    email: string;
    phone: string;
  };
  provider: {
    id: string;
    full_name: string;
    email: string;
    phone: string;
    business_name: string;
  };
}

const AdminDashboard = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState("overview");
  const { adminLogout } = useAdmin();
  const navigate = useNavigate();

  const handleLogout = () => {
    adminLogout();
    navigate('/admin/login');
  };

  useEffect(() => {
    fetchBookings();
    
    // Listen for booking creation events
    const handleBookingCreated = () => {
      fetchBookings();
    };
    
    window.addEventListener('bookingCreated', handleBookingCreated);
    
    return () => {
      window.removeEventListener('bookingCreated', handleBookingCreated);
    };
  }, []);

  const fetchBookings = async () => {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          customer:users!bookings_customer_id_fkey(id, full_name, email, phone),
          provider:providers!bookings_provider_id_fkey(id, full_name, email, phone, business_name)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setBookings(data || []);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateBookingStatus = async (bookingId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ status: newStatus })
        .eq('id', bookingId);

      if (error) throw error;

      // Dispatch custom event for real-time updates
      window.dispatchEvent(new CustomEvent('bookingStatusChanged', { 
        detail: { bookingId, newStatus } 
      }));

      // Refresh bookings
      fetchBookings();
    } catch (error: any) {
      console.error('Error updating booking status:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-purple-100 text-purple-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (timeString: string) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getDashboardStats = () => {
    const totalBookings = bookings.length;
    const pendingBookings = bookings.filter(b => b.status === 'pending').length;
    const confirmedBookings = bookings.filter(b => b.status === 'confirmed').length;
    const completedBookings = bookings.filter(b => b.status === 'completed').length;
    const totalRevenue = bookings
      .filter(b => b.status === 'completed')
      .reduce((sum, b) => sum + b.total_amount, 0);

    return {
      totalBookings,
      pendingBookings,
      confirmedBookings,
      completedBookings,
      totalRevenue
    };
  };

  // Add provider acceptance tracking
  const [providerStats, setProviderStats] = useState({
    totalProviders: 0,
    pendingProviders: 0,
    acceptedProviders: 0,
    rejectedProviders: 0
  });

  useEffect(() => {
    fetchProviderStats();
    
    // Listen for provider status changes
    const handleProviderStatusChange = () => {
      fetchProviderStats();
    };
    
    window.addEventListener('providerStatusChanged', handleProviderStatusChange);
    
    return () => {
      window.removeEventListener('providerStatusChanged', handleProviderStatusChange);
    };
  }, []);

  const fetchProviderStats = async () => {
    try {
      const { data, error } = await supabase
        .from('providers')
        .select('verification_status, is_verified');

      if (error) throw error;

      const stats = {
        totalProviders: data?.length || 0,
        pendingProviders: data?.filter(p => p.verification_status === 'pending').length || 0,
        acceptedProviders: data?.filter(p => p.verification_status === 'approved' && p.is_verified).length || 0,
        rejectedProviders: data?.filter(p => p.verification_status === 'rejected').length || 0
      };

      setProviderStats(stats);
    } catch (error) {
      console.error('Error fetching provider stats:', error);
    }
  };

  const stats = getDashboardStats();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <Card className="bg-white/95 backdrop-blur-sm shadow-2xl">
          <CardHeader className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
            <div className="text-center sm:text-left">
              <CardTitle className="text-3xl font-bold text-gray-900">Admin Dashboard</CardTitle>
              <p className="text-gray-600">Monitor and manage all system activities</p>
            </div>
            <Button 
              onClick={handleLogout}
              variant="outline" 
              className="border-red-500 text-red-600 hover:bg-red-50 hover:border-red-600 transition-all duration-300"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </CardHeader>
        </Card>

        {/* Main Content */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="bookings">Bookings ({bookings.length})</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-5 h-5 text-blue-600" />
              <div>
                      <p className="text-sm font-medium text-blue-600">Total Bookings</p>
                      <p className="text-2xl font-bold text-blue-900">{stats.totalBookings}</p>
              </div>
            </div>
                </CardContent>
              </Card>

              <Card className="bg-yellow-50 border-yellow-200">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <Clock className="w-5 h-5 text-yellow-600" />
                <div>
                      <p className="text-sm font-medium text-yellow-600">Pending</p>
                      <p className="text-2xl font-bold text-yellow-900">{stats.pendingBookings}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
              <Card className="bg-green-50 border-green-200">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                <div>
                      <p className="text-sm font-medium text-green-600">Confirmed</p>
                      <p className="text-2xl font-bold text-green-900">{stats.confirmedBookings}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
              <Card className="bg-purple-50 border-purple-200">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5 text-purple-600" />
                <div>
                      <p className="text-sm font-medium text-purple-600">Completed</p>
                      <p className="text-2xl font-bold text-purple-900">{stats.completedBookings}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
              <Card className="bg-emerald-50 border-emerald-200">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <DollarSign className="w-5 h-5 text-emerald-600" />
                <div>
                      <p className="text-sm font-medium text-emerald-600">Revenue</p>
                      <p className="text-2xl font-bold text-emerald-900">₹{stats.totalRevenue}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

            {/* Provider Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="bg-indigo-50 border-indigo-200">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <Users className="w-5 h-5 text-indigo-600" />
                    <div>
                      <p className="text-sm font-medium text-indigo-600">Total Providers</p>
                      <p className="text-2xl font-bold text-indigo-900">{providerStats.totalProviders}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-orange-50 border-orange-200">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <Clock className="w-5 h-5 text-orange-600" />
                    <div>
                      <p className="text-sm font-medium text-orange-600">Pending Review</p>
                      <p className="text-2xl font-bold text-orange-900">{providerStats.pendingProviders}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-green-50 border-green-200">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="text-sm font-medium text-green-600">Accepted</p>
                      <p className="text-2xl font-bold text-green-900">{providerStats.acceptedProviders}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-red-50 border-red-200">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <XCircle className="w-5 h-5 text-red-600" />
                    <div>
                      <p className="text-sm font-medium text-red-600">Rejected</p>
                      <p className="text-2xl font-bold text-red-900">{providerStats.rejectedProviders}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Bookings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Recent Bookings
                </CardTitle>
              </CardHeader>
              <CardContent>
                {bookings.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No bookings yet. Bookings will appear here when customers book services.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {bookings.slice(0, 5).map((booking) => (
                      <div key={booking.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-4">
                  <div>
                            <p className="font-medium">Service Booking</p>
                            <p className="text-sm text-muted-foreground">
                              {booking.customer?.full_name} → {booking.provider?.full_name}
                            </p>
                          </div>
                  </div>
                        <div className="flex items-center space-x-4">
                          <Badge className={getStatusColor(booking.status)}>
                            {booking.status}
                          </Badge>
                          <p className="text-sm font-medium">₹{booking.total_amount}</p>
                          <p className="text-sm text-muted-foreground">
                            {formatDate(booking.booking_date)}
                          </p>
                  </div>
                </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Bookings Tab */}
          <TabsContent value="bookings" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  All Service Bookings
                </CardTitle>
                <p className="text-gray-600">Monitor and manage all service bookings in the system</p>
              </CardHeader>
              <CardContent>
                {bookings.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No bookings found. Bookings will appear here when customers book services.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {bookings.map((booking) => (
                      <Card key={booking.id} className="border-l-4 border-l-blue-500">
                        <CardContent className="p-6">
                            <div className="space-y-4">
                            {/* Service and Status Header */}
                          <div className="flex items-start justify-between">
                              <div className="space-y-2">
                                <h3 className="text-xl font-semibold text-gray-900">
                                  Service Booking
                                </h3>
                              <div className="flex items-center gap-2">
                                  <Badge variant="outline">Service</Badge>
                                <Badge className={getStatusColor(booking.status)}>
                                  {booking.status}
                                </Badge>
                              </div>
                              </div>
                              <div className="text-right">
                                <p className="text-2xl font-bold text-green-600">₹{booking.total_amount}</p>
                                <p className="text-sm text-muted-foreground">
                                  {formatDate(booking.booking_date)}
                                </p>
                              </div>
                            </div>

                            {/* Customer and Provider Info */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              {/* Customer Info */}
                              <div className="bg-blue-50 p-4 rounded-lg">
                                <h4 className="font-medium text-blue-900 mb-3 flex items-center gap-2">
                                  <User className="w-4 h-4" />
                                  Customer Details
                                </h4>
                                <div className="space-y-2 text-sm">
                                  <div className="flex items-center gap-2">
                                    <span className="font-medium">Name:</span>
                                    <span>{booking.customer?.full_name || 'Unknown'}</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Mail className="w-4 h-4 text-blue-600" />
                                    <span>{booking.customer?.email || 'Unknown'}</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Phone className="w-4 h-4 text-blue-600" />
                                    <span>{booking.customer?.phone || 'Unknown'}</span>
                                  </div>
                                </div>
                              </div>

                              {/* Provider Info */}
                              <div className="bg-green-50 p-4 rounded-lg">
                                <h4 className="font-medium text-green-900 mb-3 flex items-center gap-2">
                                  <User className="w-4 h-4" />
                                  Service Provider
                                </h4>
                                <div className="space-y-2 text-sm">
                                  <div className="flex items-center gap-2">
                                    <span className="font-medium">Name:</span>
                                    <span>{booking.provider?.full_name || 'Unknown'}</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Mail className="w-4 h-4 text-green-600" />
                                    <span>{booking.provider?.email || 'Unknown'}</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Phone className="w-4 h-4 text-green-600" />
                                    <span>{booking.provider?.phone || 'Unknown'}</span>
                                  </div>
                                  </div>
                                  </div>
                            </div>

                            {/* Service Details */}
                            <div className="bg-gray-50 p-4 rounded-lg">
                              <h4 className="font-medium text-gray-900 mb-3">Service Details</h4>
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                <div className="flex items-center gap-2">
                                  <Clock className="w-4 h-4 text-muted-foreground" />
                                  <span className="font-medium">Time:</span>
                                  <span>{formatTime(booking.start_time)} - {formatTime(booking.end_time)}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <DollarSign className="w-4 h-4 text-muted-foreground" />
                                  <span className="font-medium">Total:</span>
                                  <span>₹{booking.total_amount}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <MapPin className="w-4 h-4 text-muted-foreground" />
                                  <span className="font-medium">Date:</span>
                                  <span>{formatDate(booking.booking_date)}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Calendar className="w-4 h-4 text-muted-foreground" />
                                  <span className="font-medium">Booked:</span>
                                  <span>{formatDate(booking.created_at)}</span>
                                </div>
                              </div>
                            </div>

                            {/* Notes */}
                            {booking.notes && (
                              <div className="bg-yellow-50 p-4 rounded-lg">
                                <h4 className="font-medium text-yellow-900 mb-2">Customer Notes</h4>
                                <p className="text-sm text-yellow-800">{booking.notes}</p>
                              </div>
                            )}

                            {/* Admin Actions */}
                            <div className="flex items-center gap-3 pt-4 border-t">
                                  <Button
                                variant="outline"
                                    size="sm"
                                onClick={() => handleUpdateBookingStatus(booking.id, 'confirmed')}
                                disabled={booking.status !== 'pending'}
                                  >
                                    <CheckCircle className="w-4 h-4 mr-1" />
                                    Confirm
                                  </Button>
                                  <Button
                                variant="outline"
                                    size="sm"
                                onClick={() => handleUpdateBookingStatus(booking.id, 'cancelled')}
                                disabled={booking.status === 'cancelled' || booking.status === 'completed'}
                                  >
                                    <XCircle className="w-4 h-4 mr-1" />
                                    Cancel
                                  </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleUpdateBookingStatus(booking.id, 'completed')}
                                disabled={booking.status !== 'in_progress'}
                              >
                                <CheckCircle className="w-4 h-4 mr-1" />
                                Mark Complete
                              </Button>
                              <Button variant="outline" size="sm">
                                <Eye className="w-4 h-4 mr-1" />
                                View Details
                              </Button>
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



          {/* Users Tab */}
          <TabsContent value="users" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  User Management & Verification
                </CardTitle>
                <CardDescription>
                  View and verify user accounts and service providers
                </CardDescription>
              </CardHeader>
              <CardContent>
                <UserVerificationTable />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  System Settings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  <Settings className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>System settings and configuration options coming soon...</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard; 