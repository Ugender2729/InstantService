import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

const DatabaseTest = () => {
  const [testResults, setTestResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const addResult = (test: string, success: boolean, data?: any, error?: any) => {
    setTestResults(prev => [...prev, {
      test,
      success,
      data,
      error: error?.message || error,
      timestamp: new Date().toLocaleTimeString()
    }]);
  };

  const runTests = async () => {
    setLoading(true);
    setTestResults([]);

    try {
      // Test 1: Basic connection
      addResult('Basic Connection Test', true, 'Starting tests...');

      // Test 2: Check if users table exists
      try {
        const { data, error } = await supabase
          .from('users')
          .select('count')
          .limit(1);
        
        if (error) {
          addResult('Users Table Access', false, null, error);
        } else {
          addResult('Users Table Access', true, 'Table accessible');
        }
      } catch (err: any) {
        addResult('Users Table Access', false, null, err);
      }

      // Test 3: Check RLS policies
      try {
        const { data, error } = await supabase
          .from('users')
          .select('id, email')
          .limit(1);
        
        if (error) {
          addResult('RLS Policy Test', false, null, error);
        } else {
          addResult('RLS Policy Test', true, `Found ${data?.length || 0} users`);
        }
      } catch (err: any) {
        addResult('RLS Policy Test', false, null, err);
      }

      // Test 4: Check specific user
      try {
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('user_type', 'provider')
          .limit(1);
        
        if (error) {
          addResult('Provider Query Test', false, null, error);
        } else {
          addResult('Provider Query Test', true, `Found ${data?.length || 0} providers`);
        }
      } catch (err: any) {
        addResult('Provider Query Test', false, null, err);
      }

      // Test 5: Check auth status
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          addResult('Auth Status Test', true, `Logged in as: ${user.email}`);
        } else {
          addResult('Auth Status Test', false, 'Not logged in');
        }
      } catch (err: any) {
        addResult('Auth Status Test', false, null, err);
      }

    } catch (error: any) {
      addResult('Overall Test', false, null, error);
    } finally {
      setLoading(false);
    }
  };

  const clearResults = () => {
    setTestResults([]);
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Database Connection Test
          <div className="flex gap-2">
            <Button onClick={runTests} disabled={loading}>
              {loading ? 'Running Tests...' : 'Run Tests'}
            </Button>
            <Button variant="outline" onClick={clearResults}>
              Clear Results
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {testResults.map((result, index) => (
            <div
              key={index}
              className={`p-3 rounded-lg border ${
                result.success 
                  ? 'bg-green-50 border-green-200 text-green-800' 
                  : 'bg-red-50 border-red-200 text-red-800'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-medium">
                  {result.success ? '✅' : '❌'} {result.test}
                </span>
                <span className="text-sm text-gray-500">{result.timestamp}</span>
              </div>
              {result.data && (
                <div className="mt-1 text-sm">
                  <strong>Data:</strong> {JSON.stringify(result.data)}
                </div>
              )}
              {result.error && (
                <div className="mt-1 text-sm">
                  <strong>Error:</strong> {result.error}
                </div>
              )}
            </div>
          ))}
          
          {testResults.length === 0 && (
            <div className="text-center text-gray-500 py-8">
              Click "Run Tests" to start debugging the database connection
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default DatabaseTest;

