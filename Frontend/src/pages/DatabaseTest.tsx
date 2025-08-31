import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";

interface User {
  id: string;
  email: string;
  full_name: string;
  phone: string | null;
  user_type: string;
  created_at: string;
}

interface Provider {
  id: string;
  business_name: string;
  description: string | null;
  address: string | null;
  city: string | null;
  hourly_rate: number | null;
  is_verified: boolean;
  created_at: string;
}

const DatabaseTest = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch users from Supabase
      const { data: usersData, error: usersError } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });

      if (usersError) throw usersError;

      // Fetch providers from Supabase
      const { data: providersData, error: providersError } = await supabase
        .from('providers')
        .select('*')
        .order('created_at', { ascending: false });

      if (providersError) throw providersError;

      setUsers(usersData || []);
      setProviders(providersData || []);

      toast({
        title: "✅ Supabase Connected!",
        description: `Loaded ${usersData?.length || 0} users and ${providersData?.length || 0} providers from Supabase database.`,
        variant: "default",
      });

    } catch (error: any) {
      console.error('Error fetching data:', error);
      setError(error.message || 'Failed to load data from Supabase');
      toast({
        title: "❌ Supabase Error",
        description: error.message || "Failed to load data from Supabase",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const testServiceCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('service_categories')
        .select('*')
        .limit(5);

      if (error) throw error;

      toast({
        title: "✅ Service Categories Test",
        description: `Successfully loaded ${data?.length || 0} service categories from Supabase.`,
        variant: "default",
      });

    } catch (error: any) {
      toast({
        title: "❌ Service Categories Test Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const testBookings = async () => {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .limit(5);

      if (error) throw error;

      toast({
        title: "✅ Bookings Test",
        description: `Successfully loaded ${data?.length || 0} bookings from Supabase.`,
        variant: "default",
      });

    } catch (error: any) {
      toast({
        title: "❌ Bookings Test Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white text-xl">Loading database data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <Card className="bg-white/95 backdrop-blur-sm shadow-2xl">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold text-gray-900">Supabase Database Test</CardTitle>
            <CardDescription className="text-gray-600">
              Test your Supabase database connection and view data
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Test Buttons */}
            <div className="flex flex-wrap gap-4 justify-center">
              <Button
                onClick={fetchData}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Refresh Data
              </Button>
              <Button
                onClick={testServiceCategories}
                className="bg-green-600 hover:bg-green-700"
              >
                Test Service Categories
              </Button>
              <Button
                onClick={testBookings}
                className="bg-purple-600 hover:bg-purple-700"
              >
                Test Bookings
              </Button>
            </div>

            {/* Connection Status */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-medium text-blue-900 mb-2">Connection Status:</h3>
              <div className="text-sm text-blue-800 space-y-1">
                <div><strong>Database:</strong> Supabase PostgreSQL</div>
                <div><strong>Status:</strong> {error ? '❌ Error' : '✅ Connected'}</div>
                <div><strong>Users Table:</strong> {users.length} records</div>
                <div><strong>Providers Table:</strong> {providers.length} records</div>
                <div><strong>Environment:</strong> {import.meta.env.VITE_SUPABASE_URL?.includes('localhost') ? 'Local Development' : 'Production Cloud'}</div>
              </div>
            </div>

            {/* Error Display */}
            {error && (
              <div className="bg-red-50 p-4 rounded-lg">
                <h3 className="font-medium text-red-900 mb-2">Error:</h3>
                <p className="text-red-800 text-sm">{error}</p>
              </div>
            )}

            {/* Users Data */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-900">Users ({users.length})</h3>
              {users.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {users.map((user) => (
                    <Card key={user.id} className="bg-gray-50">
                      <CardContent className="p-4">
                        <div className="space-y-2">
                          <div><strong>Name:</strong> {user.full_name}</div>
                          <div><strong>Email:</strong> {user.email}</div>
                          <div><strong>Phone:</strong> {user.phone || 'N/A'}</div>
                          <div><strong>Type:</strong> {user.user_type}</div>
                          <div><strong>Created:</strong> {new Date(user.created_at).toLocaleDateString()}</div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p>No users found. Users will appear here after signup.</p>
                </div>
              )}
            </div>

            {/* Providers Data */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-900">Providers ({providers.length})</h3>
              {providers.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {providers.map((provider) => (
                    <Card key={provider.id} className="bg-gray-50">
                      <CardContent className="p-4">
                        <div className="space-y-2">
                          <div><strong>Business:</strong> {provider.business_name}</div>
                          <div><strong>Description:</strong> {provider.description || 'N/A'}</div>
                          <div><strong>Address:</strong> {provider.address || 'N/A'}</div>
                          <div><strong>City:</strong> {provider.city || 'N/A'}</div>
                          <div><strong>Rate:</strong> ${provider.hourly_rate || 'N/A'}/hr</div>
                          <div><strong>Verified:</strong> {provider.is_verified ? '✅' : '❌'}</div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p>No providers found. Providers will appear here after registration.</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DatabaseTest; 