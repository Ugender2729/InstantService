import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Plus, 
  Edit, 
  Trash2, 
  Calendar, 
  Clock, 
  DollarSign, 
  MapPin, 
  Star,
  CheckCircle,
  XCircle,
  Eye,
  MessageSquare
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { useUser } from "@/contexts/UserContext";

interface Service {
  id: string;
  provider_id: string;
  title: string;
  description: string;
  category: string;
  hourly_rate: number;
  location: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  bookings: Booking[];
}

interface Booking {
  id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  service_date: string;
  start_time: string;
  end_time: string;
  total_amount: number;
  status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
  created_at: string;
}

const ProviderDashboard = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState("services");
  const { toast } = useToast();
  const { user } = useUser();

  // New service form state
  const [newService, setNewService] = useState({
    title: '',
    description: '',
    category: '',
    hourly_rate: '',
    location: ''
  });

  // Service categories
  const serviceCategories = [
    'House Cleaning',
    'Plumbing',
    'Electrical',
    'Carpentry',
    'Gardening',
    'Tutoring',
    'Event Planning',
    'Pet Care',
    'IT Support',
    'Beauty Services',
    'Fitness Training',
    'Other'
  ];

  useEffect(() => {
    if (user) {
      fetchServices();
      fetchBookings();
    }
  }, [user]);

  const fetchServices = async () => {
    try {
      // First get the provider ID from the providers table
      const { data: provider, error: providerError } = await supabase
        .from('providers')
        .select('id')
        .eq('email', user?.email)
        .single();

      if (providerError) throw providerError;
      if (!provider) {
        console.log('No provider profile found');
        setServices([]);
        return;
      }

      // Then fetch services for this provider
      const { data, error } = await supabase
        .from('services')
        .select(`
          *,
          bookings (*)
        `)
        .eq('provider_id', provider.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setServices(data || []);
    } catch (error) {
      console.error('Error fetching services:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchBookings = async () => {
    try {
      // First get the provider ID from the providers table
      const { data: provider, error: providerError } = await supabase
        .from('providers')
        .select('id')
        .eq('email', user?.email)
        .single();

      if (providerError) throw providerError;
      if (!provider) {
        console.log('No provider profile found');
        setBookings([]);
        return;
      }

      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          customer:users!bookings_customer_id_fkey(full_name, email, phone)
        `)
        .eq('provider_id', provider.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Transform the data to match our interface
      const transformedBookings = (data || []).map(booking => ({
        ...booking,
        customer_name: booking.customer?.full_name || 'Unknown',
        customer_email: booking.customer?.email || 'Unknown',
        customer_phone: booking.customer?.phone || 'Unknown'
      }));
      
      setBookings(transformedBookings);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    }
  };

  const handleCreateService = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "❌ Error",
        description: "You must be logged in to create services",
        variant: "destructive",
      });
      return;
    }

    try {
      // First get the provider ID from the providers table
      const { data: provider, error: providerError } = await supabase
        .from('providers')
        .select('id')
        .eq('email', user.email)
        .single();

      if (providerError) throw providerError;
      if (!provider) {
        toast({
          title: "❌ Error",
          description: "Provider profile not found. Please complete your provider registration first.",
          variant: "destructive",
        });
        return;
      }

      const { data, error } = await supabase
        .from('services')
        .insert({
          provider_id: provider.id,
          title: newService.title,
          description: newService.description,
          category: newService.category,
          hourly_rate: parseFloat(newService.hourly_rate),
          location: newService.location,
          is_active: true
        });

      if (error) throw error;

      toast({
        title: "✅ Service Created!",
        description: "Your service has been posted successfully",
        variant: "default",
      });

      // Reset form
      setNewService({
        title: '',
        description: '',
        category: '',
        hourly_rate: '',
        location: ''
      });

      // Refresh services
      fetchServices();
    } catch (error: any) {
      console.error('Error creating service:', error);
      toast({
        title: "❌ Error",
        description: error.message || "Failed to create service",
        variant: "destructive",
      });
    }
  };

  const handleUpdateBookingStatus = async (bookingId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ status: newStatus })
        .eq('id', bookingId);

      if (error) throw error;

      toast({
        title: "✅ Status Updated!",
        description: `Booking status updated to ${newStatus}`,
        variant: "default",
      });

      // Refresh bookings
      fetchBookings();
    } catch (error: any) {
      console.error('Error updating booking status:', error);
      toast({
        title: "❌ Error",
        description: error.message || "Failed to update status",
        variant: "destructive",
      });
    }
  };

  const handleDeleteService = async (serviceId: string) => {
    if (!confirm('Are you sure you want to delete this service?')) return;

    try {
      const { error } = await supabase
        .from('services')
        .delete()
        .eq('id', serviceId);

      if (error) throw error;

      toast({
        title: "✅ Service Deleted!",
        description: "Service has been removed successfully",
        variant: "default",
      });

      // Refresh services
      fetchServices();
    } catch (error: any) {
      console.error('Error deleting service:', error);
      toast({
        title: "❌ Error",
        description: error.message || "Failed to delete service",
        variant: "destructive",
      });
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <Card className="bg-white/95 backdrop-blur-sm shadow-2xl">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold text-gray-900">Provider Dashboard</CardTitle>
            <p className="text-gray-600">Manage your services and bookings</p>
          </CardHeader>
        </Card>

        {/* Main Content */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="services">My Services ({services.length})</TabsTrigger>
            <TabsTrigger value="bookings">Bookings ({bookings.length})</TabsTrigger>
            <TabsTrigger value="create">Post New Service</TabsTrigger>
          </TabsList>

          {/* Services Tab */}
          <TabsContent value="services" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="w-5 h-5" />
                  My Posted Services
                </CardTitle>
              </CardHeader>
              <CardContent>
                {services.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Plus className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No services posted yet. Create your first service to get started!</p>
                  </div>
                ) : (
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {services.map((service) => (
                      <Card key={service.id} className="border-l-4 border-l-blue-500">
                        <CardContent className="p-4">
                          <div className="space-y-3">
                            <div className="flex items-start justify-between">
                              <h3 className="font-semibold text-lg">{service.title}</h3>
                              <Badge className={service.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                                {service.is_active ? 'Available' : 'Unavailable'}
                              </Badge>
                            </div>
                            
                            <p className="text-sm text-gray-600">{service.description}</p>
                            
                            <div className="space-y-2 text-sm">
                              <div className="flex items-center gap-2">
                                <Badge variant="outline">{service.category}</Badge>
                              </div>
                              <div className="flex items-center gap-2">
                                <DollarSign className="w-4 h-4 text-muted-foreground" />
                                <span>₹{service.hourly_rate}/hr</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <MapPin className="w-4 h-4 text-muted-foreground" />
                                <span>{service.location}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-muted-foreground" />
                                <span>Posted: {formatDate(service.created_at)}</span>
                              </div>
                            </div>

                            <div className="flex items-center gap-2 pt-2">
                              <Button variant="outline" size="sm" className="flex-1">
                                <Edit className="w-4 h-4 mr-1" />
                                Edit
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="flex-1 text-red-600 border-red-600 hover:bg-red-50"
                                onClick={() => handleDeleteService(service.id)}
                              >
                                <Trash2 className="w-4 h-4 mr-1" />
                                Delete
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

          {/* Bookings Tab */}
          <TabsContent value="bookings" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Service Bookings
                </CardTitle>
              </CardHeader>
              <CardContent>
                {bookings.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No bookings yet. Your bookings will appear here when customers book your services.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {bookings.map((booking) => (
                      <Card key={booking.id} className="border-l-4 border-l-purple-500">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="space-y-3 flex-1">
                              <div className="flex items-center gap-3">
                                <h3 className="font-semibold text-lg">{booking.customer_name}</h3>
                                <Badge className={getStatusColor(booking.status)}>
                                  {booking.status}
                                </Badge>
                              </div>
                              
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                <div className="space-y-2">
                                  <div className="flex items-center gap-2">
                                    <MessageSquare className="w-4 h-4 text-muted-foreground" />
                                    <span className="font-medium">Email:</span>
                                    <span>{booking.customer_email}</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <MessageSquare className="w-4 h-4 text-muted-foreground" />
                                    <span className="font-medium">Phone:</span>
                                    <span>{booking.customer_phone}</span>
                                  </div>
                                </div>
                                
                                <div className="space-y-2">
                                  <div className="flex items-center gap-2">
                                    <Calendar className="w-4 h-4 text-muted-foreground" />
                                    <span className="font-medium">Date:</span>
                                    <span>{formatDate(booking.service_date)}</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Clock className="w-4 h-4 text-muted-foreground" />
                                    <span className="font-medium">Time:</span>
                                    <span>{formatTime(booking.start_time)} - {formatTime(booking.end_time)}</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <DollarSign className="w-4 h-4 text-muted-foreground" />
                                    <span className="font-medium">Amount:</span>
                                    <span>₹{booking.total_amount}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-2 ml-4">
                              {booking.status === 'pending' && (
                                <>
                                  <Button 
                                    size="sm"
                                    onClick={() => handleUpdateBookingStatus(booking.id, 'confirmed')}
                                    className="bg-green-600 hover:bg-green-700"
                                  >
                                    <CheckCircle className="w-4 h-4 mr-1" />
                                    Confirm
                                  </Button>
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={() => handleUpdateBookingStatus(booking.id, 'cancelled')}
                                    className="text-red-600 border-red-600 hover:bg-red-50"
                                  >
                                    <XCircle className="w-4 h-4 mr-1" />
                                    Decline
                                  </Button>
                                </>
                              )}
                              
                              {booking.status === 'confirmed' && (
                                <Button 
                                  size="sm"
                                  onClick={() => handleUpdateBookingStatus(booking.id, 'in_progress')}
                                  className="bg-blue-600 hover:bg-blue-700"
                                >
                                  <Clock className="w-4 h-4 mr-1" />
                                  Start Service
                                </Button>
                              )}
                              
                              {booking.status === 'in_progress' && (
                                <Button 
                                  size="sm"
                                  onClick={() => handleUpdateBookingStatus(booking.id, 'completed')}
                                  className="bg-purple-600 hover:bg-purple-700"
                                >
                                  <CheckCircle className="w-4 h-4 mr-1" />
                                  Complete
                                </Button>
                              )}
                              
                              <Button variant="outline" size="sm">
                                <Eye className="w-4 h-4" />
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

          {/* Create Service Tab */}
          <TabsContent value="create" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="w-5 h-5" />
                  Post New Service
                </CardTitle>
                <p className="text-gray-600">Create a new service offering to attract customers</p>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCreateService} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="service-title">Service Title *</Label>
                      <Input
                        id="service-title"
                        placeholder="e.g., Professional House Cleaning"
                        value={newService.title}
                        onChange={(e) => setNewService({...newService, title: e.target.value})}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="service-category">Service Category *</Label>
                      <select
                        id="service-category"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={newService.category}
                        onChange={(e) => setNewService({...newService, category: e.target.value})}
                        required
                      >
                        <option value="">Select a category</option>
                        {serviceCategories.map((category) => (
                          <option key={category} value={category}>{category}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="service-description">Service Description *</Label>
                    <Textarea
                      id="service-description"
                      placeholder="Describe your service, skills, experience, and what customers can expect..."
                      value={newService.description}
                      onChange={(e) => setNewService({...newService, description: e.target.value})}
                      rows={4}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="service-rate">Hourly Rate (₹) *</Label>
                      <Input
                        id="service-rate"
                        type="number"
                        placeholder="e.g., 500"
                        value={newService.hourly_rate}
                        onChange={(e) => setNewService({...newService, hourly_rate: e.target.value})}
                        min="1"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="service-location">Service Location *</Label>
                      <Input
                        id="service-location"
                        placeholder="e.g., Mumbai, Maharashtra"
                        value={newService.location}
                        onChange={(e) => setNewService({...newService, location: e.target.value})}
                        required
                      />
                    </div>
                  </div>

                  <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                    <Plus className="w-4 h-4 mr-2" />
                    Post Service
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ProviderDashboard;
