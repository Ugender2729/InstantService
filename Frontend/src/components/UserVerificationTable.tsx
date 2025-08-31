import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Users, 
  UserCheck, 
  UserX, 
  Phone, 
  Mail, 
  MapPin, 
  Calendar,
  Search,
  Shield,
  Building,
  DollarSign,
  CheckCircle,
  XCircle,
  Clock
} from "lucide-react";
import { supabaseAdmin } from "@/lib/supabase";

interface User {
  id: string;
  email: string;
  full_name: string;
  phone: string | null;
  user_type: 'customer' | 'provider' | 'admin';
  created_at: string;
  updated_at: string;
}

interface Provider {
  id: string;
  user_id: string;
  business_name: string;
  description: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  zip_code: string | null;
  hourly_rate: number | null;
  is_verified: boolean;
  is_available: boolean;
  created_at: string;
  user: User;
}

const UserVerificationTable = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTab, setSelectedTab] = useState("customers");

  useEffect(() => {
    fetchUsers();
    fetchProviders();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabaseAdmin
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProviders = async () => {
    try {
      const { data, error } = await supabaseAdmin
        .from('providers')
        .select(`
          *,
          user:users(id, email, full_name, phone, user_type, created_at)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProviders(data || []);
    } catch (error) {
      console.error('Error fetching providers:', error);
    }
  };

  const handleVerifyProvider = async (providerId: string) => {
    try {
      const { error } = await supabaseAdmin
        .from('providers')
        .update({ is_verified: true })
        .eq('id', providerId);

      if (error) throw error;
      
      // Refresh providers list
      fetchProviders();
    } catch (error) {
      console.error('Error verifying provider:', error);
    }
  };

  const handleUnverifyProvider = async (providerId: string) => {
    try {
      const { error } = await supabaseAdmin
        .from('providers')
        .update({ is_verified: false })
        .eq('id', providerId);

      if (error) throw error;
      
      // Refresh providers list
      fetchProviders();
    } catch (error) {
      console.error('Error unverifying provider:', error);
    }
  };

  const filteredUsers = users.filter(user => 
    user.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.phone?.includes(searchTerm) ||
    user.user_type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredProviders = providers.filter(provider => 
    provider.business_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    provider.user.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    provider.user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    provider.address?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified': return 'bg-green-100 text-green-800';
      case 'unverified': return 'bg-yellow-100 text-yellow-800';
      case 'admin': return 'bg-purple-100 text-purple-800';
      case 'customer': return 'bg-blue-100 text-blue-800';
      case 'provider': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <Clock className="w-8 h-8 mx-auto mb-4 animate-spin" />
        <p>Loading user data...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search users, providers, emails, phone numbers..."
          className="pl-10 w-full max-w-md"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="customers">Customers ({users.filter(u => u.user_type === 'customer').length})</TabsTrigger>
          <TabsTrigger value="providers">Service Providers ({providers.length})</TabsTrigger>
          <TabsTrigger value="all">All Users ({users.length})</TabsTrigger>
        </TabsList>

        {/* Customers Tab */}
        <TabsContent value="customers" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Customer Accounts
              </CardTitle>
            </CardHeader>
            <CardContent>
              {filteredUsers.filter(u => u.user_type === 'customer').length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No customers found</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredUsers.filter(u => u.user_type === 'customer').map((user) => (
                    <Card key={user.id} className="border-l-4 border-l-blue-500">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="space-y-3 flex-1">
                            <div className="flex items-center gap-3">
                              <h3 className="font-semibold text-lg">{user.full_name}</h3>
                              <Badge className={getStatusColor(user.user_type)}>
                                {user.user_type}
                              </Badge>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                              <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                  <Mail className="w-4 h-4 text-muted-foreground" />
                                  <span className="font-medium">Email:</span>
                                  <span>{user.email}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Phone className="w-4 h-4 text-muted-foreground" />
                                  <span className="font-medium">Phone:</span>
                                  <span>{user.phone || 'Not provided'}</span>
                                </div>
                              </div>
                              
                              <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                  <Calendar className="w-4 h-4 text-muted-foreground" />
                                  <span className="font-medium">Registered:</span>
                                  <span>{formatDate(user.created_at)}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Shield className="w-4 h-4 text-muted-foreground" />
                                  <span className="font-medium">Status:</span>
                                  <Badge variant="outline">Active</Badge>
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2 ml-4">
                            <Button variant="outline" size="sm">
                              <UserCheck className="w-4 h-4 mr-1" />
                              Verify
                            </Button>
                            <Button variant="outline" size="sm">
                              <UserX className="w-4 h-4 mr-1" />
                              Block
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

        {/* Providers Tab */}
        <TabsContent value="providers" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="w-5 h-5" />
                Service Providers
              </CardTitle>
            </CardHeader>
            <CardContent>
              {filteredProviders.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Building className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No service providers found</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredProviders.map((provider) => (
                    <Card key={provider.id} className="border-l-4 border-l-orange-500">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="space-y-3 flex-1">
                            <div className="flex items-center gap-3">
                              <h3 className="font-semibold text-lg">{provider.business_name}</h3>
                              <Badge className={getStatusColor(provider.is_verified ? 'verified' : 'unverified')}>
                                {provider.is_verified ? 'Verified' : 'Unverified'}
                              </Badge>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                              <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                  <Users className="w-4 h-4 text-muted-foreground" />
                                  <span className="font-medium">Owner:</span>
                                  <span>{provider.user.full_name}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Mail className="w-4 h-4 text-muted-foreground" />
                                  <span className="font-medium">Email:</span>
                                  <span>{provider.user.email}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Phone className="w-4 h-4 text-muted-foreground" />
                                  <span className="font-medium">Phone:</span>
                                  <span>{provider.user.phone || 'Not provided'}</span>
                                </div>
                              </div>
                              
                              <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                  <MapPin className="w-4 h-4 text-muted-foreground" />
                                  <span className="font-medium">Address:</span>
                                  <span>{provider.address || 'Not provided'}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <DollarSign className="w-4 h-4 text-muted-foreground" />
                                  <span className="font-medium">Rate:</span>
                                  <span>₹{provider.hourly_rate || 'Not set'}/hr</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Calendar className="w-4 h-4 text-muted-foreground" />
                                  <span className="font-medium">Joined:</span>
                                  <span>{formatDate(provider.created_at)}</span>
                                </div>
                              </div>
                            </div>
                            
                            {provider.description && (
                              <div className="text-sm text-muted-foreground">
                                <span className="font-medium">Description:</span> {provider.description}
                              </div>
                            )}
                          </div>
                          
                          <div className="flex items-center gap-2 ml-4">
                            {provider.is_verified ? (
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleUnverifyProvider(provider.id)}
                                className="text-yellow-600 border-yellow-600 hover:bg-yellow-50"
                              >
                                <XCircle className="w-4 h-4 mr-1" />
                                Unverify
                              </Button>
                            ) : (
                              <Button 
                                size="sm"
                                onClick={() => handleVerifyProvider(provider.id)}
                                className="bg-green-600 hover:bg-green-700"
                              >
                                <CheckCircle className="w-4 h-4 mr-1" />
                                Verify
                              </Button>
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

        {/* All Users Tab */}
        <TabsContent value="all" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                All User Accounts
              </CardTitle>
            </CardHeader>
            <CardContent>
              {filteredUsers.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No users found</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredUsers.map((user) => (
                    <Card key={user.id} className={`border-l-4 ${
                      user.user_type === 'admin' ? 'border-l-purple-500' :
                      user.user_type === 'provider' ? 'border-l-orange-500' :
                      'border-l-blue-500'
                    }`}>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="space-y-3 flex-1">
                            <div className="flex items-center gap-3">
                              <h3 className="font-semibold text-lg">{user.full_name}</h3>
                              <Badge className={getStatusColor(user.user_type)}>
                                {user.user_type}
                              </Badge>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                              <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                  <Mail className="w-4 h-4 text-muted-foreground" />
                                  <span className="font-medium">Email:</span>
                                  <span>{user.email}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Phone className="w-4 h-4 text-muted-foreground" />
                                  <span className="font-medium">Phone:</span>
                                  <span>{user.phone || 'Not provided'}</span>
                                </div>
                              </div>
                              
                              <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                  <Calendar className="w-4 h-4 text-muted-foreground" />
                                  <span className="font-medium">Registered:</span>
                                  <span>{formatDate(user.created_at)}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Shield className="w-4 h-4 text-muted-foreground" />
                                  <span className="font-medium">Status:</span>
                                  <Badge variant="outline">Active</Badge>
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2 ml-4">
                            <Button variant="outline" size="sm">
                              <UserCheck className="w-4 h-4 mr-1" />
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
      </Tabs>
    </div>
  );
};

export default UserVerificationTable;
