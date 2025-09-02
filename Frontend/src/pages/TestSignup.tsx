import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/lib/supabase";

const TestSignup = () => {
  const [email, setEmail] = useState('test@example.com');
  const [password, setPassword] = useState('123456');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const testBasicSignup = async () => {
    setLoading(true);
    setResult(null);
    
    try {
      console.log('Testing basic signup with:', { email, password });
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      console.log('Basic signup result:', { data, error });
      setResult({ data, error });

      if (error) {
        console.error('Signup error details:', {
          message: error.message,
          status: error.status,
          name: error.name,
          details: error
        });
      }

    } catch (err) {
      console.error('Unexpected error:', err);
      setResult({ error: err });
    } finally {
      setLoading(false);
    }
  };

  const testSignupWithMetadata = async () => {
    setLoading(true);
    setResult(null);
    
    try {
      console.log('Testing signup with metadata:', { 
        email, 
        password,
        metadata: { full_name: 'Test User', phone: '1234567890', user_type: 'provider' }
      });
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: 'Test User',
            phone: '1234567890',
            user_type: 'provider'
          }
        }
      });

      console.log('Signup with metadata result:', { data, error });
      setResult({ data, error });

      if (error) {
        console.error('Signup error details:', {
          message: error.message,
          status: error.status,
          name: error.name,
          details: error
        });
      }

    } catch (err) {
      console.error('Unexpected error:', err);
      setResult({ error: err });
    } finally {
      setLoading(false);
    }
  };

  const testDatabaseInsert = async () => {
    setLoading(true);
    setResult(null);
    
    try {
      console.log('Testing database insert...');
      
      // First create a test user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: `test${Date.now()}@example.com`,
        password: '123456',
      });

      if (authError) {
        setResult({ error: authError });
        return;
      }

      console.log('Auth successful, testing database insert...');

      // Test inserting into users table
      const { data: insertData, error: insertError } = await supabase
        .from('users')
        .insert({
          id: authData.user?.id,
          email: authData.user?.email,
          full_name: 'Test User',
          phone: '1234567890',
          address: 'Test Address',
          user_type: 'provider'
        })
        .select()
        .single();

      console.log('Database insert result:', { insertData, insertError });
      setResult({ insertData, insertError });

    } catch (err) {
      console.error('Unexpected error:', err);
      setResult({ error: err });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-2xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Signup Test Page</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="flex gap-2">
              <Button onClick={testBasicSignup} disabled={loading}>
                Test Basic Signup
              </Button>
              
              <Button onClick={testSignupWithMetadata} disabled={loading}>
                Test Signup with Metadata
              </Button>
              
              <Button onClick={testDatabaseInsert} disabled={loading}>
                Test Database Insert
              </Button>
            </div>

            {result && (
              <div className="mt-4 p-4 bg-gray-100 rounded">
                <h3 className="font-semibold mb-2">Result:</h3>
                <pre className="text-sm overflow-auto">
                  {JSON.stringify(result, null, 2)}
                </pre>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TestSignup;
