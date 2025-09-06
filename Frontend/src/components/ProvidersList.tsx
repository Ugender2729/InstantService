import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, Clock, MapPin, Phone } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface Provider {
  id: string;
  email: string;
  business_name: string;
  full_name: string;
  phone: string | null;
  address: string;
  city: string;
  state: string;
  zip_code: string;
  description: string;
  skills: string;
  hourly_rate: number;
  is_verified: boolean;
  verification_status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  updated_at: string;
}

const ProvidersList = () => {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProviders();
  }, []);

  const fetchProviders = async () => {
    setLoading(true);
    try {
      // Fetch only accepted providers from Supabase
      const { data, error } = await supabase
        .from('providers')
        .select('*')
        .eq('is_verified', true)
        .eq('verification_status', 'approved')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setProviders(data || []);
    } catch (error: any) {
      console.error('Error fetching providers:', error);
      setError(error.message || 'Failed to fetch providers');
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star
          key={i}
          className={`w-4 h-4 ${i <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
        />
      );
    }
    return stars;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading providers...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background p-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center py-8">
            <p className="text-red-500 mb-4">{error}</p>
            <Button onClick={fetchProviders} variant="brand">
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-center mb-2">Available Service Providers</h1>
          <p className="text-center text-muted-foreground">
            Find the perfect service provider for your needs
          </p>
        </div>

        {providers.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No providers available at the moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {providers.map((provider) => (
              <Card key={provider.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl">{provider.full_name}</CardTitle>
                      <CardDescription className="mt-2">
                        <div className="flex items-center gap-1 text-sm">
                          <MapPin className="w-4 h-4" />
                          <span>{provider.city}, {provider.state}</span>
                        </div>
                        {provider.business_name && (
                          <div className="text-sm text-muted-foreground mt-1">
                            {provider.business_name}
                          </div>
                        )}
                      </CardDescription>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      ₹{provider.hourly_rate}/hr
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Skills & Services</h4>
                    <p className="text-sm text-muted-foreground">{provider.skills}</p>
                  </div>

                  {provider.description && (
                    <div>
                      <h4 className="font-medium mb-1 text-sm">Description</h4>
                      <p className="text-sm text-muted-foreground">{provider.description}</p>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm text-muted-foreground ml-1">
                        Verified Provider
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      <span>Available</span>
                    </div>
                  </div>

                  {/* Only show contact details for verified providers */}
                  {provider.is_verified && provider.verification_status === 'approved' ? (
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-muted-foreground" />
                        <span>{provider.phone || 'Phone not provided'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-muted-foreground" />
                        <span>{provider.address}</span>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Phone className="w-4 h-4" />
                        <span>Contact details available after verification</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <MapPin className="w-4 h-4" />
                        <span>Location: {provider.city}, {provider.state}</span>
                      </div>
                    </div>
                  )}

                  <div className="flex gap-2">
                    <Button 
                      variant="brand" 
                      className="flex-1"
                      disabled={!provider.is_verified || provider.verification_status !== 'approved'}
                    >
                      <Phone className="w-4 h-4 mr-2" />
                      {provider.is_verified && provider.verification_status === 'approved' ? 'Contact' : 'Verify to Contact'}
                    </Button>
                    <Button 
                      variant="outline" 
                      className="flex-1"
                      disabled={!provider.is_verified || provider.verification_status !== 'approved'}
                    >
                      View Profile
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProvidersList; 