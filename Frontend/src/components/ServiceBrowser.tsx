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
  title: string;
  description: string;
  price: number;
  price_type: 'hourly' | 'fixed';
  location: string;
  availability: string;
  status: string;
  created_at: string;
  provider: {
    id: string;
    full_name: string;
    email: string;
    phone: string;
    address: string;
  };
  category: {
    id: string;
    name: string;
    description: string;
  };
}

const ServiceBrowser = () => {
  const { user } = useUser();
  const { toast } = useToast();
  const [services, setServices] = useState<Service[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');

  useEffect(() => {
    fetchServices();
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('service_categories')
        .select('*')
        .order('name');

      if (error) throw error;
      setCategories(data || []);
    } catch (error: any) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchServices = async () => {
    try {
      setLoading(true);
      
      let query = supabase
        .from('services')
        .select(`
          *,
          provider:users!services_provider_id_fkey(
            id,
            full_name,
            email,
            phone,
            address
          ),
          category:service_categories!services_category_id_fkey(
            id,
            name,
            description
          )
        `)
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (selectedCategory) {
        query = query.eq('category_id', selectedCategory);
      }

      if (selectedLocation) {
        query = query.ilike('location', `%${selectedLocation}%`);
      }

      const { data, error } = await query;

      if (error) throw error;
      setServices(data || []);
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
          total_amount: service.price,
          notes: `Booking for ${service.title}`,
          status: 'pending'
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "✅ Booking Created!",
        description: "Your service has been booked successfully",
        variant: "default",
      });

      // Refresh services
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
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
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
                      <Badge variant="secondary">{service.category.name}</Badge>
                      <Badge variant="outline">
                        ₹{service.price} {service.price_type === 'hourly' ? '/hr' : ''}
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
                    <div>{service.provider.phone}</div>
                  </div>
                </div>

                <Button 
                  onClick={() => handleBookService(service)}
                  className="w-full"
                  disabled={user?.type === 'provider'}
                >
                  Book This Service
                </Button>
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
