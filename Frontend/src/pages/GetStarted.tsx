import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useUser } from "@/contexts/UserContext";
import { useNotifications } from "@/contexts/NotificationContext";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Briefcase, CheckCircle } from "lucide-react";
import { supabase } from "@/lib/supabase";

const GetStarted = () => {
  const navigate = useNavigate();
  const { saveUserData } = useUser();
  const { addNotification } = useNotifications();
  const { toast } = useToast();

  // User form state
  const [userForm, setUserForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    skillsNeeded: "",
    password: ""  // Add password field
  });

  // Provider form state
  const [providerForm, setProviderForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    skills: "",
    password: ""  // Add password field
  });

  // Form errors
  const [userErrors, setUserErrors] = useState<Record<string, string>>({});
  const [providerErrors, setProviderErrors] = useState<Record<string, string>>({});

  const validateUserForm = () => {
    const errors: Record<string, string> = {};

    if (!userForm.name.trim()) {
      errors.name = "Name is required";
    }

    if (!userForm.email.trim()) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userForm.email)) {
      errors.email = "Please enter a valid email address";
    }

    if (!userForm.phone.trim()) {
      errors.phone = "Phone number is required";
    } else if (!/^\d{10}$/.test(userForm.phone.replace(/\D/g, ''))) {
      errors.phone = "Phone number must be exactly 10 digits";
    }

    if (!userForm.address.trim()) {
      errors.address = "Address is required";
    } else if (userForm.address.length > 35) {
      errors.address = "Address must be maximum 35 characters";
    }

    if (!userForm.password.trim()) {
      errors.password = "Password is required";
    } else if (userForm.password.length < 6) {
      errors.password = "Password must be at least 6 characters long";
    }

    if (!userForm.skillsNeeded.trim()) {
      errors.skillsNeeded = "Services needed is required";
    }

    setUserErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateProviderForm = () => {
    const errors: Record<string, string> = {};

    if (!providerForm.name.trim()) {
      errors.name = "Name is required";
    }

    if (!providerForm.email.trim()) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(providerForm.email)) {
      errors.email = "Please enter a valid email address";
    }

    if (!providerForm.phone.trim()) {
      errors.phone = "Phone number is required";
    } else if (!/^\d{10}$/.test(providerForm.phone.replace(/\D/g, ''))) {
      errors.phone = "Phone number must be exactly 10 digits";
    }

    if (!providerForm.address.trim()) {
      errors.address = "Address is required";
    } else if (providerForm.address.length > 35) {
      errors.address = "Address must be maximum 35 characters";
    }

    if (!providerForm.skills.trim()) {
      errors.skills = "Skills are required";
    }

    setProviderErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleUserSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateUserForm()) {
      try {
        // Use Supabase authentication
        const { data, error } = await supabase.auth.signUp({
          email: userForm.email,
          password: userForm.password, // Use userForm.password
          options: {
            data: {
              full_name: userForm.name,
              phone: userForm.phone,
              user_type: 'customer'
            }
          }
        });

        if (error) {
          throw error;
        }

        if (data.user) {
          // Create user profile in users table
          const { error: profileError } = await supabase
            .from('users')
            .insert({
              id: data.user.id,
              email: userForm.email,
              full_name: userForm.name,
              phone: userForm.phone,
              user_type: 'customer'
            });

          if (profileError) {
            console.error('Error creating profile:', profileError);
          }

          const userData = {
            id: data.user.id,
            name: userForm.name,
            email: userForm.email,
            phone: userForm.phone,
            address: userForm.address,
            type: 'user' as const,
            skills: userForm.skillsNeeded,
          };
          
          saveUserData(userData);
          
          // Show success popup
          toast({
            title: "🎉 Welcome to InstaServe!",
            description: "Your account has been created successfully! Please check your email to confirm your account. You can now browse and book services.",
            variant: "default",
          });
          
          addNotification({
            type: 'info',
            title: 'Welcome to InstaServe!',
            message: 'Your account has been created successfully! Please check your email to confirm your account.',
          });
          
          navigate('/find-services');
        }
      } catch (error: any) {
        console.error('Signup error:', error);
        
        let errorMessage = 'Failed to create account. Please try again.';
        if (error.message) {
          if (error.message.includes('User already registered')) {
            errorMessage = 'An account with this email already exists. Please try signing in instead.';
          } else if (error.message.includes('Password should be at least')) {
            errorMessage = 'Password must be at least 6 characters long.';
          } else if (error.message.includes('Invalid email')) {
            errorMessage = 'Please enter a valid email address.';
          } else if (error.message.includes('Email not confirmed')) {
            errorMessage = 'Please check your email and click the confirmation link.';
          } else {
            errorMessage = `Registration error: ${error.message}`;
          }
        }

        toast({
          title: "❌ Registration Failed",
          description: errorMessage,
          variant: "destructive",
        });
        
        addNotification({
          type: 'info',
          title: 'Registration Failed',
          message: errorMessage,
        });
      }
    }
  };

  const handleProviderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateProviderForm()) {
      try {
        // Use Supabase authentication
        const { data, error } = await supabase.auth.signUp({
          email: providerForm.email,
          password: providerForm.password, // Use providerForm.password
          options: {
            data: {
              full_name: providerForm.name,
              phone: providerForm.phone,
              user_type: 'provider'
            }
          }
        });

        if (error) {
          throw error;
        }

        if (data.user) {
          // Create user profile in users table
          const { error: profileError } = await supabase
            .from('users')
            .insert({
              id: data.user.id,
              email: providerForm.email,
              full_name: providerForm.name,
              phone: providerForm.phone,
              user_type: 'provider'
            });

          if (profileError) {
            console.error('Error creating profile:', profileError);
          }

          const userData = {
            id: data.user.id,
            name: providerForm.name,
            email: providerForm.email,
            phone: providerForm.phone,
            address: providerForm.address,
            type: 'provider' as const,
            skills: providerForm.skills,
          };
          
          saveUserData(userData);
          
          // Show success popup
          toast({
            title: "🎉 Provider Account Created!",
            description: "Your provider account has been created successfully! Please check your email to confirm your account. You can now set up your service offerings.",
            variant: "default",
          });
          
          addNotification({
            type: 'success',
            title: 'Provider Account Created!',
            message: 'Your provider account has been created successfully! Please check your email to confirm your account.',
          });
          
          navigate('/become-provider');
        }
      } catch (error: any) {
        console.error('Provider signup error:', error);
        
        let errorMessage = 'Failed to create provider account. Please try again.';
        if (error.message) {
          if (error.message.includes('User already registered')) {
            errorMessage = 'An account with this email already exists. Please try signing in instead.';
          } else if (error.message.includes('Password should be at least')) {
            errorMessage = 'Password must be at least 6 characters long.';
          }
        }

        toast({
          title: "❌ Provider Registration Failed",
          description: errorMessage,
          variant: "destructive",
        });
        
        addNotification({
          type: 'error',
          title: 'Provider Registration Failed',
          message: errorMessage,
        });
      }
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold">Get Started with InstaServe</CardTitle>
          <CardDescription>
            Join our platform to find services or offer your expertise
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="user" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="user" className="flex items-center gap-2">
                <User className="w-4 h-4" />
                Find Services
              </TabsTrigger>
              <TabsTrigger value="provider" className="flex items-center gap-2">
                <Briefcase className="w-4 h-4" />
                Provide Services
              </TabsTrigger>
            </TabsList>

            <TabsContent value="user" className="space-y-4">
              <form onSubmit={handleUserSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="user-name">Full Name *</Label>
                    <Input
                      id="user-name"
                      placeholder="Enter your full name"
                      value={userForm.name}
                      onChange={(e) => setUserForm({...userForm, name: e.target.value})}
                      className={userErrors.name ? "border-red-500" : ""}
                    />
                    {userErrors.name && (
                      <p className="text-xs text-red-500">{userErrors.name}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="user-email">Email *</Label>
                    <Input
                      id="user-email"
                      type="email"
                      placeholder="Enter your email"
                      value={userForm.email}
                      onChange={(e) => setUserForm({...userForm, email: e.target.value})}
                      className={userErrors.email ? "border-red-500" : ""}
                    />
                    {userErrors.email && (
                      <p className="text-xs text-red-500">{userErrors.email}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="user-phone">Phone Number *</Label>
                    <Input
                      id="user-phone"
                      placeholder="Enter 10-digit phone number"
                      value={userForm.phone}
                      onChange={(e) => setUserForm({...userForm, phone: e.target.value})}
                      className={userErrors.phone ? "border-red-500" : ""}
                    />
                    {userErrors.phone && (
                      <p className="text-xs text-red-500">{userErrors.phone}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="user-address">Address *</Label>
                    <Input
                      id="user-address"
                      placeholder="Enter your address (max 35 chars)"
                      value={userForm.address}
                      onChange={(e) => setUserForm({...userForm, address: e.target.value})}
                      maxLength={35}
                      className={userErrors.address ? "border-red-500" : ""}
                    />
                    {userErrors.address && (
                      <p className="text-xs text-red-500">{userErrors.address}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="user-password">Password *</Label>
                  <Input
                    id="user-password"
                    type="password"
                    placeholder="Enter a password (min 6 characters)"
                    value={userForm.password}
                    onChange={(e) => setUserForm({...userForm, password: e.target.value})}
                    className={userErrors.password ? "border-red-500" : ""}
                  />
                  {userErrors.password && (
                    <p className="text-xs text-red-500">{userErrors.password}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="user-skills">Services You're Looking For *</Label>
                  <Textarea
                    id="user-skills"
                    placeholder="Describe the services you need (e.g., house cleaning, tutoring, event planning)"
                    value={userForm.skillsNeeded}
                    onChange={(e) => setUserForm({...userForm, skillsNeeded: e.target.value})}
                    rows={3}
                    className={userErrors.skillsNeeded ? "border-red-500" : ""}
                  />
                  {userErrors.skillsNeeded && (
                    <p className="text-xs text-red-500">{userErrors.password}</p>
                  )}
                </div>

                <Button type="submit" variant="brand" className="w-full">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Create Account & Find Services
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="provider" className="space-y-4">
              <form onSubmit={handleProviderSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="provider-name">Full Name *</Label>
                    <Input
                      id="provider-name"
                      placeholder="Enter your full name"
                      value={providerForm.name}
                      onChange={(e) => setProviderForm({...providerForm, name: e.target.value})}
                      className={providerErrors.name ? "border-red-500" : ""}
                    />
                    {providerErrors.name && (
                      <p className="text-xs text-red-500">{providerErrors.name}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="provider-email">Email *</Label>
                    <Input
                      id="provider-email"
                      type="email"
                      placeholder="Enter your email"
                      value={providerForm.email}
                      onChange={(e) => setProviderForm({...providerForm, email: e.target.value})}
                      className={providerErrors.email ? "border-red-500" : ""}
                    />
                    {providerErrors.email && (
                      <p className="text-xs text-red-500">{providerErrors.email}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="provider-phone">Phone Number *</Label>
                    <Input
                      id="provider-phone"
                      placeholder="Enter 10-digit phone number"
                      value={providerForm.phone}
                      onChange={(e) => setProviderForm({...providerForm, phone: e.target.value})}
                      className={providerErrors.phone ? "border-red-500" : ""}
                    />
                    {providerErrors.phone && (
                      <p className="text-xs text-red-500">{providerErrors.phone}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="provider-address">Address *</Label>
                    <Input
                      id="provider-address"
                      placeholder="Enter your address (max 35 chars)"
                      value={providerForm.address}
                      onChange={(e) => setProviderForm({...providerForm, address: e.target.value})}
                      maxLength={35}
                      className={providerErrors.address ? "border-red-500" : ""}
                    />
                    {providerErrors.address && (
                      <p className="text-xs text-red-500">{providerErrors.address}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="provider-skills">Your Skills & Services *</Label>
                  <Textarea
                    id="provider-skills"
                    placeholder="Describe your skills and services (e.g., house cleaning, tutoring, event planning)"
                    value={providerForm.skills}
                    onChange={(e) => setProviderForm({...providerForm, skills: e.target.value})}
                    rows={3}
                    className={providerErrors.skills ? "border-red-500" : ""}
                  />
                  {providerErrors.skills && (
                    <p className="text-xs text-red-500">{providerErrors.skills}</p>
                  )}
                </div>

                <Button type="submit" variant="brand" className="w-full">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Create Provider Account
                </Button>
              </form>
            </TabsContent>
          </Tabs>

          <div className="text-center mt-6">
            <Link to="/" className="text-sm text-muted-foreground hover:text-brand-primary">
              ← Back to Home
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GetStarted;