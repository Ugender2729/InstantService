import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { Mail, Lock, ArrowLeft, CheckCircle, RotateCcw } from "lucide-react";

interface OTPForgotPasswordProps {
  onBack: () => void;
  onSuccess: () => void;
}

const OTPForgotPassword = ({ onBack, onSuccess }: OTPForgotPasswordProps) => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const { toast } = useToast();

  // Generate and send OTP
  const sendOTP = async () => {
    if (!email) {
      toast({
        title: "❌ Email Required",
        description: "Please enter your email address",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      // Generate a 6-digit OTP
      const generatedOTP = Math.floor(100000 + Math.random() * 900000).toString();
      
      // Store OTP in localStorage temporarily (in production, this should be stored securely on the server)
      localStorage.setItem('resetOTP', generatedOTP);
      localStorage.setItem('resetEmail', email);
      localStorage.setItem('otpExpiry', (Date.now() + 10 * 60 * 1000).toString()); // 10 minutes expiry
      
      // Send OTP via email using Supabase
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
        data: {
          otp: generatedOTP,
          message: `Your password reset OTP is: ${generatedOTP}. This code will expire in 10 minutes.`
        }
      });

      if (error) throw error;

      setOtpSent(true);
      setCountdown(60); // Start 60 second countdown
      
      // Countdown timer
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      toast({
        title: "✅ OTP Sent!",
        description: `A 6-digit OTP has been sent to ${email}`,
        variant: "default",
      });

    } catch (error: any) {
      console.error('OTP send error:', error);
      toast({
        title: "❌ OTP Send Failed",
        description: "Failed to send OTP. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Verify OTP
  const verifyOTP = () => {
    const storedOTP = localStorage.getItem('resetOTP');
    const storedEmail = localStorage.getItem('resetEmail');
    const otpExpiry = localStorage.getItem('otpExpiry');

    if (!storedOTP || !storedEmail || !otpExpiry) {
      toast({
        title: "❌ OTP Expired",
        description: "OTP has expired. Please request a new one.",
        variant: "destructive",
      });
      return;
    }

    if (Date.now() > parseInt(otpExpiry)) {
      toast({
        title: "❌ OTP Expired",
        description: "OTP has expired. Please request a new one.",
        variant: "destructive",
      });
      localStorage.removeItem('resetOTP');
      localStorage.removeItem('resetEmail');
      localStorage.removeItem('otpExpiry');
      setOtpSent(false);
      return;
    }

    if (storedEmail !== email) {
      toast({
        title: "❌ Email Mismatch",
        description: "Email doesn't match the one OTP was sent to.",
        variant: "destructive",
      });
      return;
    }

    if (otp === storedOTP) {
      setOtpVerified(true);
      toast({
        title: "✅ OTP Verified!",
        description: "OTP is correct. Please enter your new password.",
        variant: "default",
      });
    } else {
      toast({
        title: "❌ Invalid OTP",
        description: "Please enter the correct 6-digit OTP.",
        variant: "destructive",
      });
    }
  };

  // Reset password
  const resetPassword = async () => {
    if (newPassword !== confirmPassword) {
      toast({
        title: "❌ Passwords Don't Match",
        description: "New password and confirm password must be the same.",
        variant: "destructive",
      });
      return;
    }

    if (newPassword.length < 6) {
      toast({
        title: "❌ Password Too Short",
        description: "Password must be at least 6 characters long.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      // Update password using Supabase
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) throw error;

      // Clear stored OTP data
      localStorage.removeItem('resetOTP');
      localStorage.removeItem('resetEmail');
      localStorage.removeItem('otpExpiry');

      toast({
        title: "✅ Password Reset Success!",
        description: "Your password has been reset successfully. You can now sign in with your new password.",
        variant: "default",
      });

      onSuccess();

    } catch (error: any) {
      console.error('Password reset error:', error);
      toast({
        title: "❌ Password Reset Failed",
        description: "Failed to reset password. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Resend OTP
  const resendOTP = () => {
    if (countdown > 0) return;
    sendOTP();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white/95 backdrop-blur-sm shadow-2xl">
        <CardHeader className="text-center space-y-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="absolute left-4 top-4"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back
          </Button>
          <CardTitle className="text-2xl font-bold text-gray-900">Reset Password</CardTitle>
          <CardDescription className="text-gray-600">
            {!otpSent 
              ? "Enter your email to receive a 6-digit OTP"
              : !otpVerified
              ? "Enter the 6-digit OTP sent to your email"
              : "Enter your new password"
            }
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Step 1: Email Input */}
          {!otpSent && (
            <div className="space-y-4">
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
                onClick={sendOTP}
                className="w-full bg-blue-600 hover:bg-blue-700"
                disabled={loading}
              >
                {loading ? "Sending..." : "Send OTP"}
              </Button>
            </div>
          )}

          {/* Step 2: OTP Verification */}
          {otpSent && !otpVerified && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="otp">6-Digit OTP</Label>
                <Input
                  id="otp"
                  type="text"
                  placeholder="Enter 6-digit OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  maxLength={6}
                  className="text-center text-lg font-mono tracking-widest"
                  required
                />
              </div>

              <div className="flex gap-2">
                <Button 
                  onClick={verifyOTP}
                  className="flex-1 bg-green-600 hover:bg-green-700"
                  disabled={!otp || otp.length !== 6}
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Verify OTP
                </Button>
                
                <Button 
                  onClick={resendOTP}
                  variant="outline"
                  disabled={countdown > 0}
                  className="flex-1"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  {countdown > 0 ? `${countdown}s` : "Resend"}
                </Button>
              </div>

              {countdown > 0 && (
                <p className="text-xs text-gray-500 text-center">
                  Resend available in {countdown} seconds
                </p>
              )}
            </div>
          )}

          {/* Step 3: New Password */}
          {otpVerified && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="new-password">New Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="new-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter new password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="confirm-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="show-password"
                  checked={showPassword}
                  onChange={(e) => setShowPassword(e.target.checked)}
                  className="rounded"
                />
                <Label htmlFor="show-password" className="text-sm">
                  Show password
                </Label>
              </div>

              <Button 
                onClick={resetPassword}
                className="w-full bg-green-600 hover:bg-green-700"
                disabled={loading || !newPassword || !confirmPassword}
              >
                {loading ? "Resetting..." : "Reset Password"}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default OTPForgotPassword;
