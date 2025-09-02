import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Star, MapPin, Phone, Mail, Calendar, Clock, ArrowLeft } from "lucide-react";
import BookingModal from "@/components/BookingModal";
import { useUser } from "@/contexts/UserContext";
import { Link } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import DatabaseTest from "@/components/DatabaseTest";

interface Provider {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  address: string;
  user_type: string;
  created_at: string;
  verification_status: 'pending' | 'approved' | 'rejected';
  services?: Service[];
}

interface Service {
  id: number;
  name: string;
  price: number;
  description: string;
  category: string;
}

const ViewProviders = () => {
  const { user } = useUser();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const { toast } = useToast();

  // Mock providers data
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingProvider, setProcessingProvider] = useState<string | null>(null);

  // Fetch real providers from database
  useEffect(() => {
    fetchProviders();
  }, []);

  const fetchProviders = async () => {
    try {
      setLoading(true);
      console.log('Fetching providers...');
      
      // First, let's check if we can access the users table at all
      const { data: testData, error: testError } = await supabase
        .from('users')
        .select('id')
        .limit(1);
      
      if (testError) {
        console.error('Test query failed:', testError);
        throw testError;
      }
      
      console.log('Test query successful, now fetching providers...');
      
      // Use specific columns instead of select(*) to avoid 406 errors
      const { data, error } = await supabase
        .from('users')
        .select(`
          id,
          full_name,
          email,
          phone,
          address,
          user_type,
          verification_status,
          created_at
        `)
        .eq('user_type', 'provider')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Provider fetch error:', error);
        throw error;
      }
      
      console.log('Providers fetched successfully:', data);
      setProviders(data || []);
    } catch (error: any) {
      console.error('Error fetching providers:', error);
      toast({
        title: "❌ Error",
        description: `Failed to fetch providers: ${error.message}`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Mock data removed - using real data from database

  const filteredProviders = providers.filter(provider =>
    provider.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    provider.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
    provider.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleBookService = (service: Service) => {
    setSelectedService(service);
    setIsBookingModalOpen(true);
  };

  const handleCloseBookingModal = () => {
    setIsBookingModalOpen(false);
    setSelectedService(null);
  };

  const handleAcceptProvider = async (providerId: string) => {
    try {
      setProcessingProvider(providerId);
      
      // First update the users table
      const { error: tableError } = await supabase
        .from('users')
        .update({ verification_status: 'approved' })
        .eq('id', providerId);

      if (tableError) throw tableError;

      // Then update the Supabase Auth user metadata
      const { error: authError } = await supabase.auth.admin.updateUserById(providerId, {
        user_metadata: { 
          user_type: 'provider',
          verification_status: 'approved'
        }
      });

      if (authError) {
        console.log('Auth update error (this is normal for non-admin users):', authError);
      }

      // Update the local state immediately for better UX
      setProviders(prevProviders => {
        const updatedProviders = prevProviders.map(provider => 
          provider.id === providerId 
            ? { ...provider, verification_status: 'approved' as const }
            : provider
        );
        console.log('Updated providers state:', updatedProviders);
        return updatedProviders;
      });

      // Refresh providers list from database
      await fetchProviders();

      // Trigger admin dashboard refresh if on admin page
      if (window.location.pathname.includes('/admin')) {
        window.dispatchEvent(new CustomEvent('providerStatusChanged'));
      }

      toast({
        title: "✅ Provider Accepted!",
        description: "Service provider has been accepted. Contact details are now visible.",
        variant: "default",
      });
    } catch (error: any) {
      console.error('Error accepting provider:', error);
      toast({
        title: "❌ Error",
        description: "Failed to accept provider. Please try again.",
        variant: "destructive",
      });
    } finally {
      setProcessingProvider(null);
    }
  };

  const handleIgnoreProvider = async (providerId: string) => {
    try {
      setProcessingProvider(providerId);
      
      // First update the users table
      const { error: tableError } = await supabase
        .from('users')
        .update({ verification_status: 'rejected' })
        .eq('id', providerId);

      if (tableError) throw tableError;

      // Then update the Supabase Auth user metadata
      const { error: authError } = await supabase.auth.admin.updateUserById(providerId, {
        user_metadata: { 
          user_type: 'provider',
          verification_status: 'rejected'
        }
      });

      if (authError) {
        console.log('Auth update error (this is normal for non-admin users):', authError);
      }

      // Update the local state immediately for better UX
      setProviders(prevProviders => 
        prevProviders.map(provider => 
          provider.id === providerId 
            ? { ...provider, verification_status: 'rejected' as const }
            : provider
        )
      );

      // Refresh providers list from database
      await fetchProviders();

      // Trigger admin dashboard refresh if on admin page
      if (window.location.pathname.includes('/admin')) {
        window.dispatchEvent(new CustomEvent('providerStatusChanged'));
      }

      toast({
        title: "⚠️ Provider Ignored",
        description: "Service provider has been ignored.",
        variant: "default",
      });
    } catch (error: any) {
      console.error('Error ignoring provider:', error);
      toast({
        title: "❌ Error",
        description: "Failed to ignore provider. Please try again.",
        variant: "destructive",
      });
    } finally {
      setProcessingProvider(null);
    }
  };

  const handleVerification = async (providerId: string, status: 'approved' | 'rejected') => {
    try {
      const { error } = await supabase
        .from('users')
        .update({ verification_status: status })
        .eq('id', providerId);

      if (error) throw error;

      // Refresh providers list
      await fetchProviders();

      toast({
        title: "✅ Success",
        description: `Provider ${status === 'approved' ? 'approved' : 'rejected'} successfully.`,
        variant: "default",
      });
    } catch (error: any) {
      console.error('Error updating verification status:', error);
      toast({
        title: "❌ Error",
        description: "Failed to update verification status. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Service Providers</h1>
            <p className="text-muted-foreground">
              Find and book services from verified professionals in your area
            </p>
          </div>
          <Link to="/dashboard">
            <Button variant="outline" className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </div>

      {/* Database Test Component - Temporary for debugging */}
      <div className="mb-8">
        <DatabaseTest />
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search providers, services, or locations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Providers Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProviders.map((provider) => (
          <Card key={provider.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
                  <span className="text-2xl font-bold text-blue-600">
                    {provider.full_name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="flex-1">
                  <CardTitle className="text-lg">{provider.full_name}</CardTitle>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="secondary" className="text-xs">
                      {provider.user_type}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">Service Provider</p>
              
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <span>{provider.address}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  <span>{provider.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <span>{provider.email}</span>
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-medium mb-3">Provider Information</h4>
                <div className="space-y-2 text-xs text-muted-foreground">
                  <div>Joined: {new Date(provider.created_at).toLocaleDateString()}</div>
                  <div>ID: {provider.id}</div>
                  <div className="flex items-center gap-2">
                    <span>Status:</span>
                    <Badge 
                      variant={
                        provider.verification_status === 'approved' ? 'default' :
                        provider.verification_status === 'rejected' ? 'destructive' : 'secondary'
                      }
                      className="text-xs"
                    >
                      {provider.verification_status}
                    </Badge>
                  </div>
                </div>
                
                {/* Accept/Ignore Buttons - Show for all users */}
                {provider.verification_status === 'pending' && (
                  <div className="flex gap-2 mt-4">
                    <Button
                      size="sm"
                      onClick={() => handleAcceptProvider(provider.id)}
                      disabled={processingProvider === provider.id}
                      className="bg-green-600 hover:bg-green-700 text-white disabled:opacity-50"
                    >
                      {processingProvider === provider.id ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Processing...
                        </>
                      ) : (
                        "✅ Accept"
                      )}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleIgnoreProvider(provider.id)}
                      disabled={processingProvider === provider.id}
                      className="border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50"
                    >
                      {processingProvider === provider.id ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600 mr-2"></div>
                          Processing...
                        </>
                      ) : (
                        "⚠️ Ignore"
                      )}
                    </Button>
                  </div>
                )}

                {/* Show approved status */}
                {provider.verification_status === 'approved' && (
                  <div className="mt-4">
                    <Badge variant="default" className="bg-green-100 text-green-800">
                      ✅ Approved - Contact Details Visible
                    </Badge>
                  </div>
                )}

                {/* Show rejected status */}
                {provider.verification_status === 'rejected' && (
                  <div className="mt-4">
                    <Badge variant="destructive">
                      ❌ Rejected
                    </Badge>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredProviders.length === 0 && (
        <div className="text-center py-12">
          <Search className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
          <h3 className="text-lg font-medium mb-2">No providers found</h3>
          <p className="text-muted-foreground">
            Try adjusting your search terms or check back later for new providers.
          </p>
        </div>
      )}

      {/* Booking Modal - Removed for now as it's not properly integrated */}
    </div>
  );
};

export default ViewProviders; 