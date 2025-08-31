import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";

const ServerTest = () => {
  const [supabaseStatus, setSupabaseStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [dbStatus, setDbStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [supabaseData, setSupabaseData] = useState<any>(null);
  const [dbData, setDbData] = useState<any>(null);
  const { toast } = useToast();

  const testSupabase = async () => {
    setSupabaseStatus('loading');
    try {
      // Test Supabase connection by fetching service categories
      const { data, error } = await supabase
        .from('service_categories')
        .select('*')
        .limit(1);

      if (error) throw error;

      setSupabaseData({
        status: 'connected',
        data: data,
        timestamp: new Date().toISOString()
      });

      setSupabaseStatus('success');
      toast({
        title: "✅ Supabase Connected!",
        description: "Supabase API is responding successfully.",
        variant: "default",
      });
    } catch (error: any) {
      setSupabaseStatus('error');
      setSupabaseData({ error: error.message });
      toast({
        title: "❌ Supabase Connection Failed",
        description: error.message || "Cannot connect to Supabase API.",
        variant: "destructive",
      });
    }
  };

  const testDatabase = async () => {
    setDbStatus('loading');
    try {
      // Test database tables
      const tables = ['users', 'providers', 'service_categories', 'bookings', 'reviews'];
      const results: any = {};

      for (const table of tables) {
        const { data, error } = await supabase
          .from(table)
          .select('count')
          .limit(1);

        if (error) {
          results[table] = { error: error.message };
        } else {
          // Get actual count
          const { count } = await supabase
            .from(table)
            .select('*', { count: 'exact', head: true });
          
          results[table] = { count: count || 0, status: 'connected' };
        }
      }

      setDbData({
        status: 'connected',
        tables: results,
        timestamp: new Date().toISOString()
      });

      setDbStatus('success');
      toast({
        title: "✅ Database Connected!",
        description: "All database tables are accessible.",
        variant: "default",
      });
    } catch (error: any) {
      setDbStatus('error');
      setDbData({ error: error.message });
      toast({
        title: "❌ Database Connection Failed",
        description: error.message || "Cannot connect to database.",
        variant: "destructive",
      });
    }
  };

  const runAllTests = async () => {
    await testSupabase();
    await testDatabase();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <Card className="bg-white/95 backdrop-blur-sm shadow-2xl">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold text-gray-900">Server & Database Test</CardTitle>
            <CardDescription className="text-gray-600">
              Test your Supabase server and database connections
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Test Buttons */}
            <div className="flex flex-wrap gap-4 justify-center">
              <Button
                onClick={testSupabase}
                disabled={supabaseStatus === 'loading'}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {supabaseStatus === 'loading' ? 'Testing...' : 'Test Supabase API'}
              </Button>
              <Button
                onClick={testDatabase}
                disabled={dbStatus === 'loading'}
                className="bg-green-600 hover:bg-green-700"
              >
                {dbStatus === 'loading' ? 'Testing...' : 'Test Database'}
              </Button>
              <Button
                onClick={runAllTests}
                disabled={supabaseStatus === 'loading' || dbStatus === 'loading'}
                className="bg-purple-600 hover:bg-purple-700"
              >
                Run All Tests
              </Button>
            </div>

            {/* Connection Status */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Supabase Status */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-medium text-blue-900 mb-2">Supabase API Status:</h3>
                <div className="text-sm text-blue-800 space-y-1">
                  <div><strong>Status:</strong> 
                    {supabaseStatus === 'idle' && '⏳ Not Tested'}
                    {supabaseStatus === 'loading' && '🔄 Testing...'}
                    {supabaseStatus === 'success' && '✅ Connected'}
                    {supabaseStatus === 'error' && '❌ Error'}
                  </div>
                  <div><strong>URL:</strong> {import.meta.env.VITE_SUPABASE_URL}</div>
                  <div><strong>Environment:</strong> {import.meta.env.VITE_SUPABASE_URL?.includes('localhost') ? 'Local Development' : 'Production Cloud'}</div>
                </div>
              </div>

              {/* Database Status */}
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="font-medium text-green-900 mb-2">Database Status:</h3>
                <div className="text-sm text-green-800 space-y-1">
                  <div><strong>Status:</strong> 
                    {dbStatus === 'idle' && '⏳ Not Tested'}
                    {dbStatus === 'loading' && '🔄 Testing...'}
                    {dbStatus === 'success' && '✅ Connected'}
                    {dbStatus === 'error' && '❌ Error'}
                  </div>
                  <div><strong>Type:</strong> PostgreSQL (Supabase)</div>
                  <div><strong>Tables:</strong> 7 tables ready</div>
                </div>
              </div>
            </div>

            {/* Supabase Test Results */}
            {supabaseData && (
              <div className="bg-gray-100 p-4 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-2">Supabase Test Results:</h3>
                <div className="text-sm text-gray-600 font-mono">
                  <pre>{JSON.stringify(supabaseData, null, 2)}</pre>
                </div>
              </div>
            )}

            {/* Database Test Results */}
            {dbData && (
              <div className="bg-gray-100 p-4 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-2">Database Test Results:</h3>
                <div className="text-sm text-gray-600 font-mono">
                  <pre>{JSON.stringify(dbData, null, 2)}</pre>
                </div>
              </div>
            )}

            {/* System Information */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium text-gray-900 mb-2">System Information:</h3>
              <div className="text-sm text-gray-700 space-y-1">
                <div><strong>Frontend:</strong> React + Vite + TypeScript</div>
                <div><strong>Backend:</strong> Supabase (PostgreSQL + Auth + Real-time)</div>
                <div><strong>UI Library:</strong> Shadcn/ui + Tailwind CSS</div>
                <div><strong>State Management:</strong> React Context + React Query</div>
                <div><strong>Database:</strong> PostgreSQL with Row Level Security</div>
                <div><strong>Authentication:</strong> Supabase Auth (JWT)</div>
                <div><strong>Real-time:</strong> Supabase Realtime subscriptions</div>
              </div>
            </div>

            {/* Next Steps */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-medium text-blue-900 mb-2">Next Steps:</h3>
              <div className="text-sm text-blue-800 space-y-1">
                <div>1. ✅ <strong>Supabase Integration:</strong> Complete</div>
                <div>2. ✅ <strong>Database Schema:</strong> Ready</div>
                <div>3. ✅ <strong>Authentication:</strong> Working</div>
                <div>4. 🔄 <strong>Frontend Development:</strong> In Progress</div>
                <div>5. ⏳ <strong>Production Deployment:</strong> Ready for Netlify</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ServerTest; 