import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { useUser } from "@/contexts/UserContext";
import { Eye, EyeOff, Mail, Lock, ArrowLeft } from "lucide-react";

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [forgotPasswordMode, setForgotPasswordMode] = useState(false);
  const [resetEmailSent, setResetEmailSent] = useState(false);
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
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      // Get user profile data - check both users and providers tables
      let profileData = null;
      let profileError = null;

      // First try to find in users table (customers)
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', data.user.id)
        .single();

      if (userData) {
        profileData = userData;
      } else {
        // If not found in users, try providers table
        const { data: providerData, error: providerError } = await supabase
          .from('providers')
          .select('*')
          .eq('id', data.user.id)
          .single();
        
        if (providerData) {
          profileData = providerData;
        } else {
          profileError = providerError;
        }
      }

      if (profileError) throw profileError;

      // Determine user type based on which table the data came from
      const userType = userData ? 'customer' : 'provider';

      // Login with user context
      await login({
        id: data.user.id,
        name: profileData.full_name,
        email: data.user.email!,
        phone: profileData.phone,
        address: profileData.address || '',
        type: userType,
        skills: profileData.skills || '',
          });

          toast({
        title: "✅ Welcome Back!",
        description: `Successfully signed in as ${profileData.full_name}`,
            variant: "default",
          });
          
      // Redirect based on user type
      if (userType === 'provider') {
        navigate('/provider/dashboard');
        } else {
        navigate('/dashboard');
      }

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

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
            toast({
        title: "❌ Email Required",
        description: "Please enter your email address to reset password",
              variant: "destructive",
            });
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;

      setResetEmailSent(true);
        toast({
        title: "✅ Reset Email Sent!",
        description: "Check your email for password reset instructions",
        variant: "default",
      });

    } catch (error: any) {
      console.error('Password reset error:', error);
      toast({
        title: "❌ Reset Failed",
        description: "Failed to send reset email. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleBackToSignIn = () => {
    setForgotPasswordMode(false);
    setResetEmailSent(false);
  };

  if (forgotPasswordMode) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-white/95 backdrop-blur-sm shadow-2xl">
          <CardHeader className="text-center space-y-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBackToSignIn}
              className="absolute left-4 top-4"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back
            </Button>
            <CardTitle className="text-2xl font-bold text-gray-900">Forgot Password?</CardTitle>
            <CardDescription className="text-gray-600">
              {resetEmailSent 
                ? "Check your email for reset instructions"
                : "Enter your email to receive password reset instructions"
              }
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-4">
            {!resetEmailSent ? (
              <form onSubmit={handleForgotPassword} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="reset-email">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="reset-email"
                      type="email"
                      placeholder="Enter your email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  disabled={loading}
                >
                  {loading ? 'Sending Reset Email...' : 'Send Reset Email'}
                </Button>
              </form>
            ) : (
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                  <Mail className="w-8 h-8 text-green-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Reset Email Sent!</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    We've sent password reset instructions to <strong>{email}</strong>
                  </p>
                  <p className="text-xs text-gray-500">
                    Check your spam folder if you don't see it in your inbox
                  </p>
                </div>
                <Button 
                  onClick={handleBackToSignIn}
                  variant="outline"
                  className="w-full"
                >
                  Back to Sign In
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white/95 backdrop-blur-sm shadow-2xl">
        <CardHeader className="text-center space-y-2">
          <CardTitle className="text-2xl font-bold text-gray-900">Welcome Back</CardTitle>
          <CardDescription className="text-gray-600">
            Sign in to your InstaServe account
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
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                </Button>
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              disabled={loading}
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </Button>
          </form>

          {/* Forgot Password Link */}
          <div className="text-center">
            <Button
              variant="link"
              className="text-sm text-gray-600 hover:text-blue-600 p-0 h-auto"
              onClick={() => setForgotPasswordMode(true)}
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
              <Link to="/get-started" className="text-purple-600 hover:text-purple-700 font-medium">
                Sign up here
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

export default SignIn;