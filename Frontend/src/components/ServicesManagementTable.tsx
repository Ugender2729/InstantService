import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Eye, 
  CheckCircle, 
  XCircle, 
  Clock, 
  DollarSign, 
  MapPin, 
  User,
  Calendar,
  TrendingUp,
  Mail,
  Phone
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

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
  };
  category: {
    id: string;
    name: string;
    description: string;
  };
}

const ServicesManagementTable = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('services')
        .select(`
          *,
          provider:users!services_provider_id_fkey(id, full_name, email, phone),
          category:service_categories!services_category_id_fkey(id, name, description)
        `)
        .order('created_at', { ascending: false });

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

  const handleUpdateServiceStatus = async (serviceId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('services')
        .update({ status: newStatus })
        .eq('id', serviceId);

      if (error) throw error;

      toast({
        title: "✅ Success",
        description: `Service status updated to ${newStatus}`,
        variant: "default",
      });

      // Refresh services
      fetchServices();
    } catch (error: any) {
      console.error('Error updating service status:', error);
      toast({
        title: "❌ Error",
        description: error.message || "Failed to update service status",
        variant: "destructive",
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'suspended': return 'bg-red-100 text-red-800';
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

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-muted-foreground">Loading services...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {services.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <TrendingUp className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>No services found. Services will appear here when providers post them.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {services.map((service) => (
            <Card key={service.id} className="border-l-4 border-l-blue-500">
              <CardContent className="p-6">
                <div className="space-y-4">
                  {/* Service Header */}
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <h3 className="text-xl font-semibold text-gray-900">
                        {service.title}
                      </h3>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{service.category?.name || 'Unknown'}</Badge>
                        <Badge className={getStatusColor(service.status)}>
                          {service.status}
                        </Badge>
                        <Badge variant="outline">
                          ₹{service.price} {service.price_type === 'hourly' ? '/hr' : ''}
                        </Badge>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">
                        Posted {formatDate(service.created_at)}
                      </p>
                    </div>
                  </div>

                  {/* Service Description */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-2">Description</h4>
                    <p className="text-sm text-gray-700">{service.description}</p>
                  </div>

                  {/* Service Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Provider Info */}
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h4 className="font-medium text-blue-900 mb-3 flex items-center gap-2">
                        <User className="w-4 h-4" />
                        Service Provider
                      </h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">Name:</span>
                          <span>{service.provider?.full_name || 'Unknown'}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-blue-600" />
                          <span>{service.provider?.email || 'Unknown'}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-blue-600" />
                          <span>{service.provider?.phone || 'Unknown'}</span>
                        </div>
                      </div>
                    </div>

                    {/* Service Details */}
                    <div className="bg-green-50 p-4 rounded-lg">
                      <h4 className="font-medium text-green-900 mb-3">Service Details</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-green-600" />
                          <span className="font-medium">Location:</span>
                          <span>{service.location || 'Not specified'}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-green-600" />
                          <span className="font-medium">Availability:</span>
                          <span>{service.availability || 'Not specified'}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-green-600" />
                          <span className="font-medium">Posted:</span>
                          <span>{formatDate(service.created_at)}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Admin Actions */}
                  <div className="flex items-center gap-3 pt-4 border-t">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleUpdateServiceStatus(service.id, 'active')}
                      disabled={service.status === 'active'}
                    >
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Activate
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleUpdateServiceStatus(service.id, 'inactive')}
                      disabled={service.status === 'inactive'}
                    >
                      <Clock className="w-4 h-4 mr-1" />
                      Deactivate
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleUpdateServiceStatus(service.id, 'suspended')}
                      disabled={service.status === 'suspended'}
                    >
                      <XCircle className="w-4 h-4 mr-1" />
                      Suspend
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
    </div>
  );
};

export default ServicesManagementTable;
