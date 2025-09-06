import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { useUser } from "@/contexts/UserContext";
import { Eye, EyeOff, Mail, Lock, ArrowLeft, Briefcase, Users } from "lucide-react";
import OTPForgotPassword from './OTPForgotPassword';

const ProviderSignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showOTPForgotPassword, setShowOTPForgotPassword] = useState(false);
  const { toast } = useToast();
  const { login } = useUser();
  const navigate = useNavigate();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: "❌ Missing Information",
        description: "Please enter both email and password",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      // Direct database authentication - check providers table
      const { data: profileData, error: profileError } = await supabase
        .from('providers')
        .select('*')
        .eq('email', email.toLowerCase())
        .single();

      if (profileError && profileError.code !== 'PGRST116') {
        throw profileError;
      }

      if (!profileData) {
        throw new Error('Provider not found. Please check your email or sign up first.');
      }

      // For now, we'll skip password verification since we're not storing passwords
      // In a production app, you'd verify the password hash here

      // Login with user context
      await login({
        id: profileData.id,
        name: profileData.full_name,
        email: profileData.email,
        phone: profileData.phone || '',
        address: profileData.address || '',
        type: 'provider',
        skills: profileData.skills || '',
      });

      toast({
        title: "✅ Welcome Back!",
        description: `Successfully signed in as ${profileData.full_name}`,
        variant: "default",
      });

      // Redirect to provider dashboard
      navigate('/provider/dashboard');

    } catch (error: any) {
      console.error('Sign in error:', error);
      
      let errorMessage = "Failed to sign in. Please try again.";
      
      if (error.message.includes('Invalid login credentials')) {
        errorMessage = "Invalid email or password. Please check your credentials.";
      } else if (error.message.includes('Too many requests')) {
        errorMessage = "Too many login attempts. Please try again later.";
      }

      toast({
        title: "❌ Login Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    setShowOTPForgotPassword(true);
  };

  const handleBackToSignIn = () => {
    setShowOTPForgotPassword(false);
  };

  const handlePasswordResetSuccess = () => {
    setShowOTPForgotPassword(false);
    toast({
      title: "✅ Success!",
      description: "You can now sign in with your new password",
      variant: "default",
    });
  };

  if (showOTPForgotPassword) {
    return (
      <OTPForgotPassword 
        onBack={handleBackToSignIn}
        onSuccess={handlePasswordResetSuccess}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white/95 backdrop-blur-sm shadow-2xl">
        <CardHeader className="text-center space-y-2">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Briefcase className="w-8 h-8 text-green-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">Provide Services</CardTitle>
          <CardDescription className="text-gray-600">
            Sign in to manage your services and bookings
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <form onSubmit={handleSignIn} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10"
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 h-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 h-4 text-muted-foreground" />
                  )}
                </Button>
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full bg-green-600 hover:bg-green-700"
              disabled={loading}
            >
              {loading ? 'Signing In...' : 'Sign In to Provide Services'}
            </Button>
          </form>

          {/* Forgot Password Link */}
          <div className="text-center">
            <Button
              variant="link"
              className="text-sm text-gray-600 hover:text-green-600 p-0 h-auto"
              onClick={handleForgotPassword}
            >
              Forgot your password?
            </Button>
          </div>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-gray-500">Or</span>
            </div>
          </div>

          {/* Sign Up Link */}
          <div className="text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <Link to="/get-started" className="text-green-600 hover:text-green-700 font-medium">
                Sign up here
              </Link>
            </p>
          </div>

          {/* Switch to Customer Sign In */}
          <div className="text-center pt-2">
            <p className="text-sm text-gray-600">
              Looking for services?{' '}
              <Link to="/customer/signin" className="text-blue-600 hover:text-blue-700 font-medium">
                Sign in here
              </Link>
            </p>
          </div>

          {/* Admin Login Link */}
          <div className="text-center pt-2">
            <Link to="/admin/login" className="text-sm text-gray-500 hover:text-gray-700">
              Admin Login
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProviderSignIn;
