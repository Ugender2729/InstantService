import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { useUser } from "@/contexts/UserContext";
import { Search, MapPin, Clock, Star, Calendar } from "lucide-react";

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
  provider: {
    id: string;
    full_name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    is_verified: boolean;
    verification_status: 'pending' | 'approved' | 'rejected';
  };
}

const ServiceBrowser = () => {
  const { user } = useUser();
  const { toast } = useToast();
  const [services, setServices] = useState<Service[]>([]);
  const [userBookings, setUserBookings] = useState<string[]>([]);
  const [confirmedBookings, setConfirmedBookings] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');

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
    fetchServices();
    if (user) {
      fetchUserBookings();
    }
  }, [selectedCategory, selectedLocation, user]);

  // Listen for booking status changes
  useEffect(() => {
    const handleBookingStatusChange = () => {
      if (user) {
        fetchUserBookings();
      }
    };

    window.addEventListener('bookingStatusChanged', handleBookingStatusChange);
    return () => window.removeEventListener('bookingStatusChanged', handleBookingStatusChange);
  }, [user]);

  const fetchUserBookings = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select('service_id, status')
        .eq('customer_id', user.id);

      if (error) throw error;
      
      const bookedServiceIds = data?.map(booking => booking.service_id) || [];
      const confirmedServiceIds = data?.filter(booking => booking.status === 'confirmed').map(booking => booking.service_id) || [];
      
      setUserBookings(bookedServiceIds);
      setConfirmedBookings(confirmedServiceIds);
    } catch (error) {
      console.error('Error fetching user bookings:', error);
    }
  };

  const fetchServices = async () => {
    try {
      setLoading(true);
      
      // First, fetch all services
      let query = supabase
        .from('services')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (selectedCategory) {
        query = query.eq('category', selectedCategory);
      }

      if (selectedLocation) {
        query = query.ilike('location', `%${selectedLocation}%`);
      }

      const { data: servicesData, error: servicesError } = await query;

      if (servicesError) throw servicesError;

      if (!servicesData || servicesData.length === 0) {
        setServices([]);
        return;
      }

      // Get all provider IDs from services
      const providerIds = [...new Set(servicesData.map(service => service.provider_id))];
      
      // Fetch providers data
      const { data: providersData, error: providersError } = await supabase
        .from('providers')
        .select('id, full_name, email, phone, address, city, state, is_verified, verification_status')
        .in('id', providerIds);

      if (providersError) throw providersError;

      // Combine services with provider data
      const servicesWithProviders = servicesData.map(service => {
        const provider = providersData?.find(p => p.id === service.provider_id);
        return {
          ...service,
          provider: provider || {
            id: service.provider_id,
            full_name: 'Unknown Provider',
            email: '',
            phone: '',
            address: '',
            city: '',
            state: '',
            is_verified: false,
            verification_status: 'pending'
          }
        };
      });

      // Show all services (for now, until providers are verified)
      // TODO: Change back to verified only after providers are approved
      setServices(servicesWithProviders);
    } catch (error: any) {
      console.error('Error fetching services:', error);
      toast({
        title: "❌ Error",
        description: "Failed to fetch services",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleBookService = async (service: Service) => {
    if (!user) {
      toast({
        title: "❌ Sign In Required",
        description: "Please sign in to book services",
        variant: "destructive",
      });
      return;
    }

    if (user.type === 'provider') {
      toast({
        title: "❌ Access Denied",
        description: "Providers cannot book services",
        variant: "destructive",
      });
      return;
    }

    try {
      // Create booking
      const { data: booking, error } = await supabase
        .from('bookings')
        .insert({
          customer_id: user.id,
          provider_id: service.provider.id,
          service_id: service.id,
          booking_date: new Date().toISOString().split('T')[0], // Today
          start_time: '09:00',
          end_time: '10:00',
          total_amount: service.hourly_rate,
          notes: `Booking for ${service.title}`,
          status: 'pending'
        })
        .select()
        .single();

      if (error) throw error;

      // Dispatch custom event for real-time updates
      window.dispatchEvent(new CustomEvent('bookingCreated'));

      toast({
        title: "✅ Booking Created!",
        description: "Your service has been booked successfully. Contact details will be visible once confirmed.",
        variant: "default",
      });

      // Refresh user bookings and services to show contact details
      await fetchUserBookings();
      fetchServices();

    } catch (error: any) {
      console.error('Error creating booking:', error);
      toast({
        title: "❌ Error",
        description: error.message || "Failed to create booking",
        variant: "destructive",
      });
    }
  };

  const handleDeleteService = async (service: Service) => {
    if (!user) {
      toast({
        title: "❌ Login Required",
        description: "Please sign in to delete services",
        variant: "destructive",
      });
      return;
    }

    if (user.type !== 'provider') {
      toast({
        title: "❌ Access Denied",
        description: "Only service providers can delete their services",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('services')
        .delete()
        .eq('id', service.id)
        .eq('provider_id', user.id);

      if (error) throw error;

      toast({
        title: "✅ Service Deleted!",
        description: "Your service has been deleted successfully.",
        variant: "default",
      });

      // Refresh services list
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

  const handleCancelBooking = async (service: Service) => {
    if (!user) {
      toast({
        title: "❌ Login Required",
        description: "Please sign in to cancel bookings",
        variant: "destructive",
      });
      return;
    }

    try {
      // Find the booking for this service
      const { data: bookings, error: fetchError } = await supabase
        .from('bookings')
        .select('id')
        .eq('customer_id', user.id)
        .eq('service_id', service.id)
        .eq('status', 'pending');

      if (fetchError) throw fetchError;

      if (bookings && bookings.length > 0) {
        // Cancel the booking
        const { error } = await supabase
          .from('bookings')
          .update({ status: 'cancelled' })
          .eq('id', bookings[0].id);

        if (error) throw error;

        toast({
          title: "✅ Booking Cancelled!",
          description: "Your booking has been cancelled successfully.",
          variant: "default",
        });

        // Refresh user bookings and services
        await fetchUserBookings();
        fetchServices();
      } else {
        toast({
          title: "❌ No Booking Found",
          description: "No pending booking found for this service.",
          variant: "destructive",
        });
      }

    } catch (error: any) {
      console.error('Error cancelling booking:', error);
      toast({
        title: "❌ Error",
        description: error.message || "Failed to cancel booking",
        variant: "destructive",
      });
    }
  };

  const filteredServices = services.filter(service =>
    service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    service.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    service.provider.full_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Find Services</h1>
        <p className="text-muted-foreground">
          Browse and book services from verified professionals in your area
        </p>
      </div>

      {/* Search and Filters */}
      <div className="mb-6 space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search services, providers, or descriptions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label>Category</Label>
            <Select value={selectedCategory || 'all'} onValueChange={(v) => setSelectedCategory(v === 'all' ? '' : v)}>
              <SelectTrigger>
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {serviceCategories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Location</Label>
            <Input
              placeholder="Enter location..."
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>&nbsp;</Label>
            <Button onClick={fetchServices} className="w-full">
              Apply Filters
            </Button>
          </div>
        </div>
      </div>

      {/* Services Grid */}
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading services...</p>
        </div>
      ) : filteredServices.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map((service) => (
            <Card key={service.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{service.title}</CardTitle>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="secondary">{service.category}</Badge>
                      <Badge variant="outline">
                        ₹{service.hourly_rate}/hr
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground line-clamp-3">
                  {service.description}
                </p>
                
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <span>{service.location || service.provider.address}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span>Posted {new Date(service.created_at).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h4 className="font-medium mb-2">Provider</h4>
                  <div className="text-sm text-muted-foreground">
                    <div>{service.provider.full_name}</div>
                    <div>{service.provider.city}, {service.provider.state}</div>
                    {confirmedBookings.includes(service.id) ? (
                      <div className="space-y-1 mt-2">
                        <div className="text-green-600 font-medium">✓ Confirmed - Contact Details:</div>
                        <div>📧 {service.provider.email}</div>
                        <div>📞 {service.provider.phone || 'Phone not provided'}</div>
                        <div>📍 {service.provider.address || 'Address not provided'}</div>
                      </div>
                    ) : userBookings.includes(service.id) ? (
                      <div className="text-yellow-600 font-medium">⏳ Booking Pending - Contact details will be visible once confirmed</div>
                    ) : (
                      <div className="text-gray-500">Book this service to see contact details</div>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Button 
                    onClick={() => handleBookService(service)}
                    className="w-full"
                    disabled={user?.type === 'provider' || userBookings.includes(service.id)}
                    variant={userBookings.includes(service.id) ? "outline" : "default"}
                  >
                    {userBookings.includes(service.id) ? '✓ Booked' : 'Book This Service'}
                  </Button>
                  
                  {/* Cancel booking button for customers */}
                  {user?.type === 'customer' && userBookings.includes(service.id) && (
                    <Button 
                      onClick={() => handleCancelBooking(service)}
                      className="w-full"
                      variant="outline"
                      size="sm"
                    >
                      ❌ Cancel Booking
                    </Button>
                  )}
                  
                  {/* Delete button for service owners */}
                  {user?.type === 'provider' && service.provider_id === user.id && (
                    <Button 
                      onClick={() => handleDeleteService(service)}
                      className="w-full"
                      variant="destructive"
                      size="sm"
                    >
                      🗑️ Delete Service
                    </Button>
                  )}
                  
                  {/* Show delete button for testing - remove in production */}
                  {user?.type === 'provider' && (
                    <Button 
                      onClick={() => handleDeleteService(service)}
                      className="w-full"
                      variant="outline"
                      size="sm"
                    >
                      🗑️ Delete Service (Test)
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Search className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
          <h3 className="text-lg font-medium mb-2">No services found</h3>
          <p className="text-muted-foreground">
            Try adjusting your search terms or check back later for new services.
          </p>
        </div>
      )}
    </div>
  );
};

export default ServiceBrowser;
