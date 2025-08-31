import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase, supabaseAdmin } from "@/lib/supabase";

const SupabaseTest = () => {
  const [testResults, setTestResults] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const runConnectionTest = async () => {
    setLoading(true);
    const results: any = {};

    try {
      // Test 1: Basic connection
      const { data: categoriesData, error: categoriesError } = await supabase
        .from('service_categories')
        .select('*')
        .limit(1);

      results.basicConnection = {
        success: !categoriesError,
        data: categoriesData,
        error: categoriesError?.message
      };

      // Test 2: Auth connection
      const { data: authData, error: authError } = await supabase.auth.getSession();
      
      results.authConnection = {
        success: !authError,
        data: authData,
        error: authError?.message
      };

      // Test 3: Environment variables
      results.environment = {
        url: import.meta.env.VITE_SUPABASE_URL,
        keyLength: import.meta.env.VITE_SUPABASE_ANON_KEY?.length || 0,
        keyPreview: import.meta.env.VITE_SUPABASE_ANON_KEY?.substring(0, 50) + '...'
      };

      // Test 4: Try to create a test user (will fail but shows the error)
      const { data: signupData, error: signupError } = await supabase.auth.signUp({
        email: 'test@example.com',
        password: 'testpassword123'
      });

      results.testSignup = {
        success: !signupError,
        data: signupData,
        error: signupError?.message
      };

      setTestResults(results);

      if (categoriesError) {
        toast({
          title: "❌ Connection Failed",
          description: `Supabase connection error: ${categoriesError.message}`,
          variant: "destructive",
        });
      } else {
        toast({
          title: "✅ Connection Test Complete",
          description: "Check the results below for details",
          variant: "default",
        });
      }

    } catch (error: any) {
      results.generalError = error.message;
      setTestResults(results);
      toast({
        title: "❌ Test Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const testRegistration = async () => {
    setLoading(true);
    try {
      console.log('Testing registration with:', {
        email: 'testuser@example.com',
        password: 'testpassword123'
      });

      const { data, error } = await supabase.auth.signUp({
        email: 'testuser@example.com',
        password: 'testpassword123',
        options: {
          data: {
            full_name: 'Test User',
            phone: '1234567890',
            user_type: 'customer'
          }
        }
      });

      console.log('Registration response:', { data, error });

      if (error) {
        toast({
          title: "❌ Registration Test Failed",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "✅ Registration Test Success",
          description: "Test user created successfully!",
          variant: "default",
        });
      }

      setTestResults(prev => ({
        ...prev,
        registrationTest: { data, error: error?.message }
      }));

    } catch (error: any) {
      console.error('Registration test error:', error);
      toast({
        title: "❌ Registration Test Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const testDirectFetch = async () => {
    setLoading(true);
    try {
      console.log('Testing direct fetch to Supabase...');
      
      // Test direct fetch to Supabase
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/rest/v1/service_categories?select=*&limit=1`, {
        headers: {
          'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
        }
      });

      console.log('Fetch response status:', response.status);
      console.log('Fetch response headers:', response.headers);

      if (response.ok) {
        const data = await response.json();
        console.log('Fetch data:', data);
        toast({
          title: "✅ Direct Fetch Success",
          description: "Direct fetch to Supabase is working!",
          variant: "default",
        });
      } else {
        const errorText = await response.text();
        console.log('Fetch error response:', errorText);
        toast({
          title: "❌ Direct Fetch Failed",
          description: `HTTP ${response.status}: ${errorText}`,
          variant: "destructive",
        });
      }

      setTestResults(prev => ({
        ...prev,
        directFetch: { status: response.status, ok: response.ok }
      }));

    } catch (error: any) {
      console.error('Direct fetch error:', error);
      toast({
        title: "❌ Direct Fetch Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const testDataFlow = async () => {
    setLoading(true);
    try {
      console.log('Testing complete data flow...');
      
      // Step 1: Test database table access
      const { data: categoriesData, error: categoriesError } = await supabase
        .from('service_categories')
        .select('*')
        .limit(3);
      
      console.log('Categories data:', categoriesData);
      console.log('Categories error:', categoriesError);
      
      // Step 2: Test users table structure using ADMIN client (bypasses RLS)
      const { data: usersData, error: usersError } = await supabaseAdmin
        .from('users')
        .select('*')
        .limit(3);
      
      console.log('Users data:', usersData);
      console.log('Users error:', usersError);
      
      // Step 3: Test providers table
      const { data: providersData, error: providersError } = await supabase
        .from('providers')
        .select('*')
        .limit(3);
      
      console.log('Providers data:', providersData);
      console.log('Providers error:', providersError);
      
      // Step 4: Test bookings table
      const { data: bookingsData, error: bookingsError } = await supabase
        .from('bookings')
        .select('*')
        .limit(3);
      
      console.log('Bookings data:', bookingsData);
      console.log('Bookings error:', bookingsError);
      
      // Compile results
      const results = {
        categories: { success: !categoriesError, data: categoriesData, error: categoriesError?.message },
        users: { success: !usersError, data: usersData, error: usersError?.message },
        providers: { success: !providersError, data: providersData, error: providersError?.message },
        bookings: { success: !bookingsError, data: bookingsData, error: bookingsError?.message }
      };
      
      setTestResults(prev => ({ ...prev, dataFlow: results }));
      
      // Check if any tables are accessible
      const accessibleTables = Object.values(results).filter(r => r.success).length;
      
      if (accessibleTables === 0) {
        toast({
          title: "❌ No Database Access",
          description: "Cannot access any database tables. Check your Supabase connection.",
          variant: "destructive",
        });
      } else {
        toast({
          title: `✅ Database Access: ${accessibleTables}/4 Tables`,
          description: `${accessibleTables} out of 4 database tables are accessible.`,
          variant: "default",
        });
      }
      
    } catch (error: any) {
      console.error('Data flow test error:', error);
      toast({
        title: "❌ Data Flow Test Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <Card className="bg-white/95 backdrop-blur-sm shadow-2xl">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold text-gray-900">Supabase Connection Test</CardTitle>
            <CardDescription className="text-gray-600">
              Test your Supabase connection and debug registration issues
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Test Buttons */}
            <div className="flex flex-wrap gap-4 justify-center">
              <Button
                onClick={runConnectionTest}
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {loading ? 'Testing...' : 'Run Connection Test'}
              </Button>
              <Button
                onClick={testRegistration}
                disabled={loading}
                className="bg-green-600 hover:bg-green-700"
              >
                {loading ? 'Testing...' : 'Test Registration'}
              </Button>
              <Button
                onClick={testDirectFetch}
                disabled={loading}
                className="bg-orange-600 hover:bg-orange-700"
              >
                {loading ? 'Testing...' : 'Test Direct Fetch'}
              </Button>
              <Button
                onClick={testDataFlow}
                disabled={loading}
                className="bg-purple-600 hover:bg-purple-700"
              >
                {loading ? 'Testing...' : 'Test Data Flow'}
              </Button>
              <Button
                onClick={async () => {
                  setLoading(true);
                  try {
                    // Test anon access (should fail due to RLS)
                    const { data: anonData, error: anonError } = await supabase
                      .from('users')
                      .select('*')
                      .limit(1);
                    
                    // Test admin access (should succeed)
                    const { data: adminData, error: adminError } = await supabaseAdmin
                      .from('users')
                      .select('*')
                      .limit(1);
                    
                    setTestResults(prev => ({
                      ...prev,
                      usersTableTest: {
                        anon: { success: !anonError, data: anonData, error: anonError?.message },
                        admin: { success: !adminError, data: adminData, error: adminError?.message }
                      }
                    }));
                    
                    toast({
                      title: "✅ Users Table Test Complete",
                      description: `Anon: ${anonError ? 'Failed' : 'Success'}, Admin: ${adminError ? 'Failed' : 'Success'}`,
                      variant: "default",
                    });
                  } catch (error: any) {
                    toast({
                      title: "❌ Users Table Test Error",
                      description: error.message,
                      variant: "destructive",
                    });
                  } finally {
                    setLoading(false);
                  }
                }}
                disabled={loading}
                className="bg-red-600 hover:bg-red-700"
              >
                {loading ? 'Testing...' : 'Test Users Table'}
              </Button>
            </div>

            {/* Environment Variables */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-medium text-blue-900 mb-2">Environment Configuration:</h3>
              <div className="text-sm text-blue-800 space-y-1">
                <div><strong>Supabase URL:</strong> {import.meta.env.VITE_SUPABASE_URL}</div>
                <div><strong>Anon Key Length:</strong> {import.meta.env.VITE_SUPABASE_ANON_KEY?.length || 0} characters</div>
                <div><strong>Key Preview:</strong> {import.meta.env.VITE_SUPABASE_ANON_KEY?.substring(0, 50)}...</div>
                <div><strong>Status:</strong> 
                  {import.meta.env.VITE_SUPABASE_ANON_KEY?.length === 74 ? '❌ Demo Key (Wrong)' : '✅ Production Key'}
                </div>
              </div>
            </div>

            {/* Test Results */}
            {Object.keys(testResults).length > 0 && (
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-900">Test Results:</h3>
                
                {testResults.basicConnection && (
                  <div className="bg-gray-100 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-2">Basic Connection Test:</h4>
                    <div className="text-sm text-gray-600">
                      <div><strong>Status:</strong> {testResults.basicConnection.success ? '✅ Success' : '❌ Failed'}</div>
                      {testResults.basicConnection.error && (
                        <div><strong>Error:</strong> {testResults.basicConnection.error}</div>
                      )}
                    </div>
                  </div>
                )}

                {testResults.authConnection && (
                  <div className="bg-gray-100 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-2">Auth Connection Test:</h4>
                    <div className="text-sm text-gray-600">
                      <div><strong>Status:</strong> {testResults.authConnection.success ? '✅ Success' : '❌ Failed'}</div>
                      {testResults.authConnection.error && (
                        <div><strong>Error:</strong> {testResults.authConnection.error}</div>
                      )}
                    </div>
                  </div>
                )}

                {testResults.registrationTest && (
                  <div className="bg-gray-100 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-2">Registration Test:</h4>
                    <div className="text-sm text-gray-600">
                      <div><strong>Status:</strong> {testResults.registrationTest.error ? '❌ Failed' : '✅ Success'}</div>
                      {testResults.registrationTest.error && (
                        <div><strong>Error:</strong> {testResults.registrationTest.error}</div>
                      )}
                    </div>
                  </div>
                )}

                {testResults.dataFlow && (
                  <div className="bg-gray-100 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-2">Database Tables Test:</h4>
                    <div className="text-sm text-gray-600 space-y-2">
                      <div><strong>Service Categories:</strong> {testResults.dataFlow.categories.success ? '✅ Accessible' : '❌ Failed'}</div>
                      <div><strong>Users Table:</strong> {testResults.dataFlow.users.success ? '✅ Accessible' : '❌ Failed'}</div>
                      <div><strong>Providers Table:</strong> {testResults.dataFlow.providers.success ? '✅ Accessible' : '❌ Failed'}</div>
                      <div><strong>Bookings Table:</strong> {testResults.dataFlow.bookings.success ? '✅ Accessible' : '❌ Failed'}</div>
                    </div>
                  </div>
                )}

                {testResults.usersTableTest && (
                  <div className="bg-gray-100 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-2">Users Table Test:</h4>
                    <div className="text-sm text-gray-600 space-y-2">
                      <div><strong>Anon Access:</strong> {testResults.usersTableTest.anon.success ? '✅ Success' : '❌ Failed'}</div>
                      <div><strong>Admin Access:</strong> {testResults.usersTableTest.admin.success ? '✅ Success' : '❌ Failed'}</div>
                      {testResults.usersTableTest.anon.error && (
                        <div><strong>Anon Error:</strong> {testResults.usersTableTest.anon.error}</div>
                      )}
                      {testResults.usersTableTest.admin.error && (
                        <div><strong>Admin Error:</strong> {testResults.usersTableTest.admin.error}</div>
                      )}
                    </div>
                  </div>
                )}

                {testResults.generalError && (
                  <div className="bg-red-100 p-4 rounded-lg">
                    <h4 className="font-medium text-red-900 mb-2">General Error:</h4>
                    <div className="text-sm text-red-800">{testResults.generalError}</div>
                  </div>
                )}
              </div>
            )}

            {/* Troubleshooting Guide */}
            <div className="bg-yellow-50 p-4 rounded-lg">
              <h3 className="font-medium text-yellow-900 mb-2">Troubleshooting Guide:</h3>
              <div className="text-sm text-yellow-800 space-y-2">
                <div><strong>❌ Demo Key Issue:</strong> Your anon key is the demo key (74 characters). You need the production key from Supabase Cloud.</div>
                <div><strong>🔧 How to Fix:</strong></div>
                <ol className="list-decimal list-inside ml-4 space-y-1">
                  <li>Go to <a href="https://xkcdgipztkvikvifgqes.supabase.co" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">your Supabase project</a></li>
                  <li>Click "Settings" → "API"</li>
                  <li>Copy the "anon public" key (should be ~200+ characters)</li>
                  <li>Update your .env.local file</li>
                  <li>Restart your development server</li>
                </ol>
              </div>
            </div>

            {/* Data Flow Explanation */}
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-medium text-green-900 mb-2">📊 Data Flow & Storage Guide:</h3>
              <div className="text-sm text-green-800 space-y-3">
                <div><strong>🔄 Complete User Registration Flow:</strong></div>
                <ol className="list-decimal list-inside ml-4 space-y-2">
                  <li><strong>User fills form</strong> → Frontend validation</li>
                  <li><strong>Supabase Auth</strong> → Creates user account</li>
                  <li><strong>Users Table</strong> → Stores profile data (id, email, full_name, phone, user_type)</li>
                  <li><strong>Success Response</strong> → Toast notification + navigation</li>
                </ol>
                
                <div className="mt-3"><strong>🗄️ Database Tables & Data Storage:</strong></div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                  <div className="bg-white p-2 rounded border">
                    <strong>users</strong><br/>
                    • id (UUID)<br/>
                    • email, full_name, phone<br/>
                    • user_type (customer/provider)<br/>
                    • created_at, updated_at
                  </div>
                  <div className="bg-white p-2 rounded border">
                    <strong>service_categories</strong><br/>
                    • id (UUID)<br/>
                    • name, description, icon<br/>
                    • created_at
                  </div>
                  <div className="bg-white p-2 rounded border">
                    <strong>providers</strong><br/>
                    • id (UUID)<br/>
                    • user_id (links to users)<br/>
                    • business_name, description<br/>
                    • address, hourly_rate
                  </div>
                  <div className="bg-white p-2 rounded border">
                    <strong>bookings</strong><br/>
                    • id (UUID)<br/>
                    • customer_id, provider_id<br/>
                    • service_category_id<br/>
                    • date, time, status, amount
                  </div>
                </div>
                
                <div className="mt-3"><strong>🔗 Data Relationships:</strong></div>
                <div className="text-xs">
                  • <strong>User Registration</strong> → users table<br/>
                  • <strong>Provider Setup</strong> → users + providers tables<br/>
                  • <strong>Service Booking</strong> → users + providers + bookings tables<br/>
                  • <strong>Reviews</strong> → bookings + reviews tables
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SupabaseTest;


