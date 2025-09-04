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
    password: "",
    confirmPassword: "",
    gender: "",
    age: ""
  });

  // Provider form state
  const [providerForm, setProviderForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    skills: "",
    password: "",
    confirmPassword: "",
    gender: "",
    age: ""
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

    if (!userForm.confirmPassword.trim()) {
      errors.confirmPassword = "Confirm your password";
    } else if (userForm.confirmPassword !== userForm.password) {
      errors.confirmPassword = "Passwords do not match";
    }

    if (!userForm.gender) {
      errors.gender = "Gender is required";
    }

    if (!userForm.age) {
      errors.age = "Age is required";
    } else {
      const ageNum = Number(userForm.age);
      if (!Number.isFinite(ageNum) || ageNum < 13 || ageNum > 75) {
        errors.age = "Enter a valid age (13-75)";
      }
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

    if (!providerForm.password.trim()) {
      errors.password = "Password is required";
    } else if (providerForm.password.length < 6) {
      errors.password = "Password must be at least 6 characters long";
    }

    if (!providerForm.confirmPassword.trim()) {
      errors.confirmPassword = "Confirm your password";
    } else if (providerForm.confirmPassword !== providerForm.password) {
      errors.confirmPassword = "Passwords do not match";
    }

    if (!providerForm.gender) {
      errors.gender = "Gender is required";
    }

    if (!providerForm.age) {
      errors.age = "Age is required";
    } else {
      const ageNum = Number(providerForm.age);
      if (!Number.isFinite(ageNum) || ageNum < 18 || ageNum > 75) {
        errors.age = "Enter a valid age (18-75)";
      }
    }

    setProviderErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleUserSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateUserForm()) {
      try {
        // First check if email already exists in users table
        console.log('Checking if email exists:', userForm.email);
        const { data: existingUser, error: checkError } = await supabase
          .from('users')
          .select('id, email')
          .eq('email', userForm.email.toLowerCase())
          .single();

        if (existingUser) {
          toast({
            title: "❌ Email Already Exists",
            description: "An account with this email already exists. Please try signing in instead.",
            variant: "destructive",
          });
          return;
        }

        if (checkError && checkError.code !== 'PGRST116') { // PGRST116 = no rows returned
          console.error('Error checking email:', checkError);
        }

        console.log('Email is available, proceeding with registration');
        // Use Supabase authentication
        const { data, error } = await supabase.auth.signUp({
          email: userForm.email,
          password: userForm.password, // Use userForm.password
          options: {
            data: {
              full_name: userForm.name,
              phone: userForm.phone,
              user_type: 'customer',
              gender: userForm.gender,
              age: Number(userForm.age)
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
              address: userForm.address,
              user_type: 'customer',
              gender: userForm.gender,
              age: Number(userForm.age)
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
            type: 'customer' as const,
            skills: userForm.skillsNeeded,
          };
          
          // Automatically log in the user after successful signup
          await saveUserData(userData);
          
          // Show success popup
          toast({
            title: "🎉 Welcome to InstaServe!",
            description: "Your account has been created successfully! You are now logged in and can browse and book services.",
            variant: "default",
          });
          
          addNotification({
            type: 'info',
            title: 'Welcome to InstaServe!',
            message: 'Your account has been created successfully! You are now logged in.',
          });
          
          // Clear the form
          setUserForm({
            name: "",
            email: "",
            phone: "",
            address: "",
            skillsNeeded: "",
            password: "",
            confirmPassword: "",
            gender: "",
            age: ""
          });
          
          // Redirect to customer dashboard (immediate access)
          navigate('/dashboard');
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
        // First check if email already exists in users table
        console.log('Checking if email exists:', providerForm.email);
        const { data: existingUser, error: checkError } = await supabase
          .from('users')
          .select('id, email')
          .eq('email', providerForm.email.toLowerCase())
          .single();

        if (existingUser) {
          toast({
            title: "❌ Email Already Exists",
            description: "An account with this email already exists. Please try signing in instead.",
            variant: "destructive",
          });
          return;
        }

        if (checkError && checkError.code !== 'PGRST116') { // PGRST116 = no rows returned
          console.error('Error checking email:', checkError);
        }

        console.log('Email is available, proceeding with registration');
        console.log('Attempting Supabase Auth signup with:', {
          email: providerForm.email,
          password: providerForm.password,
          options: {
            data: {
              full_name: providerForm.name,
              phone: providerForm.phone,
              user_type: 'provider'
            }
          }
        });

        // Use Supabase authentication
        const { data, error } = await supabase.auth.signUp({
          email: providerForm.email,
          password: providerForm.password,
          options: {
            data: {
              full_name: providerForm.name,
              phone: providerForm.phone,
              user_type: 'provider',
              gender: providerForm.gender,
              age: Number(providerForm.age)
            }
          }
        });

        console.log('Supabase Auth response:', { data, error });

        if (error) {
          throw error;
        }

        if (data.user) {
          console.log('Creating user profile with data:', {
            id: data.user.id,
            email: providerForm.email,
            full_name: providerForm.name,
            phone: providerForm.phone,
            address: providerForm.address,
            user_type: 'provider'
          });

          // Create user profile in users table
          const { data: profileData, error: profileError } = await supabase
            .from('users')
            .insert({
              id: data.user.id,
              email: providerForm.email,
              full_name: providerForm.name,
              phone: providerForm.phone,
              address: providerForm.address,
              user_type: 'provider',
              gender: providerForm.gender,
              age: Number(providerForm.age),
              verification_status: 'pending'
            })
            .select()
            .single();

          console.log('Profile creation response:', { profileData, profileError });

          if (profileError) {
            console.error('Error creating profile:', profileError);
            console.error('Profile error details:', profileError.message);
            console.error('Profile error code:', profileError.code);
            console.error('Profile error details:', profileError.details);
            console.error('Profile error hint:', profileError.hint);
            throw profileError;
          }

          console.log('Profile created successfully:', profileData);

          const userData = {
            id: data.user.id,
            name: providerForm.name,
            email: providerForm.email,
            phone: providerForm.phone,
            address: providerForm.address,
            type: 'provider' as const,
            skills: providerForm.skills,
          };
          
          // Automatically log in the provider after successful signup
          await saveUserData(userData);
          
          // Show success popup
          toast({
            title: "🎉 Provider Account Created!",
            description: "Your provider account has been created successfully! You are now logged in and can set up your service offerings.",
            variant: "default",
          });
          
          addNotification({
            type: 'info',
            title: 'Provider Account Created!',
            message: 'Your provider account has been created successfully! You are now logged in.',
          });
          
          // Clear the form
          setProviderForm({
            name: "",
            email: "",
            phone: "",
            address: "",
            skills: "",
            password: "",
            confirmPassword: "",
            gender: "",
            age: ""
          });
          
          // Redirect to provider dashboard (immediate access)
          navigate('/provider/dashboard');
        }
      } catch (error: any) {
        console.error('Provider signup error:', error);
        console.error('Error details:', error.message);
        console.error('Error code:', error.code);
        console.error('Error details:', error.details);
        console.error('Error hint:', error.hint);
        
        let errorMessage = 'Failed to create provider account. Please try again.';
        if (error.message) {
          if (error.message.includes('User already registered') || error.message.includes('already registered')) {
            errorMessage = 'An account with this email already exists. Please try signing in instead.';
          } else if (error.message.includes('Password should be at least')) {
            errorMessage = 'Password must be at least 6 characters long.';
          } else if (error.message.includes('address')) {
            errorMessage = 'Address field error: ' + error.message;
          } else if (error.message.includes('verification_status')) {
            errorMessage = 'Verification status error: ' + error.message;
          } else if (error.message.includes('email')) {
            errorMessage = 'Email error: ' + error.message;
          }
        }

        toast({
          title: "❌ Provider Registration Failed",
          description: errorMessage,
          variant: "destructive",
        });
        
        addNotification({
          type: 'info',
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

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="user-confirm-password">Confirm Password *</Label>
                    <Input
                      id="user-confirm-password"
                      type="password"
                      placeholder="Re-enter your password"
                      value={userForm.confirmPassword}
                      onChange={(e) => setUserForm({...userForm, confirmPassword: e.target.value})}
                      className={userErrors.confirmPassword ? "border-red-500" : ""}
                    />
                    {userErrors.confirmPassword && (
                      <p className="text-xs text-red-500">{userErrors.confirmPassword}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="user-age">Age *</Label>
                    <Input
                      id="user-age"
                      type="number"
                      min={13}
                      max={120}
                      placeholder="Your age"
                      value={userForm.age}
                      onChange={(e) => setUserForm({...userForm, age: e.target.value})}
                      className={userErrors.age ? "border-red-500" : ""}
                    />
                    {userErrors.age && (
                      <p className="text-xs text-red-500">{userErrors.age}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="user-gender">Gender *</Label>
                  <select
                    id="user-gender"
                    value={userForm.gender}
                    onChange={(e) => setUserForm({...userForm, gender: e.target.value})}
                    className={`w-full rounded-md border px-3 py-2 text-sm ${userErrors.gender ? 'border-red-500' : 'border-input'}`}
                  >
                    <option value="">Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                    <option value="prefer_not_to_say">Prefer not to say</option>
                  </select>
                  {userErrors.gender && (
                    <p className="text-xs text-red-500">{userErrors.gender}</p>
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
                  <Label htmlFor="provider-password">Password *</Label>
                  <Input
                    id="provider-password"
                    type="password"
                    placeholder="Enter a password (min 6 characters)"
                    value={providerForm.password}
                    onChange={(e) => setProviderForm({...providerForm, password: e.target.value})}
                    className={providerErrors.password ? "border-red-500" : ""}
                  />
                  {providerErrors.password && (
                    <p className="text-xs text-red-500">{providerErrors.password}</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="provider-confirm-password">Confirm Password *</Label>
                    <Input
                      id="provider-confirm-password"
                      type="password"
                      placeholder="Re-enter your password"
                      value={providerForm.confirmPassword}
                      onChange={(e) => setProviderForm({...providerForm, confirmPassword: e.target.value})}
                      className={providerErrors.confirmPassword ? "border-red-500" : ""}
                    />
                    {providerErrors.confirmPassword && (
                      <p className="text-xs text-red-500">{providerErrors.confirmPassword}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="provider-age">Age *</Label>
                    <Input
                      id="provider-age"
                      type="number"
                      min={18}
                      max={120}
                      placeholder="Your age"
                      value={providerForm.age}
                      onChange={(e) => setProviderForm({...providerForm, age: e.target.value})}
                      className={providerErrors.age ? "border-red-500" : ""}
                    />
                    {providerErrors.age && (
                      <p className="text-xs text-red-500">{providerErrors.age}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="provider-gender">Gender *</Label>
                  <select
                    id="provider-gender"
                    value={providerForm.gender}
                    onChange={(e) => setProviderForm({...providerForm, gender: e.target.value})}
                    className={`w-full rounded-md border px-3 py-2 text-sm ${providerErrors.gender ? 'border-red-500' : 'border-input'}`}
                  >
                    <option value="">Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                    <option value="prefer_not_to_say">Prefer not to say</option>
                  </select>
                  {providerErrors.gender && (
                    <p className="text-xs text-red-500">{providerErrors.gender}</p>
                  )}
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

          <div className="text-center mt-6 space-y-4">
            <div className="flex justify-center gap-4">
              <Button 
                variant="outline" 
                size="sm"
                onClick={async () => {
                  try {
                    const { data, error } = await supabase
                      .from('users')
                      .select('count')
                      .limit(1);
                    
                    if (error) {
                      toast({
                        title: "❌ Database Error",
                        description: `Error: ${error.message}`,
                        variant: "destructive",
                      });
                    } else {
                      toast({
                        title: "✅ Database Connected",
                        description: "Successfully connected to Supabase database",
                        variant: "default",
                      });
                    }
                  } catch (err) {
                    toast({
                      title: "❌ Connection Failed",
                      description: "Failed to connect to database",
                      variant: "destructive",
                    });
                  }
                }}
              >
                Test Database Connection
              </Button>
            </div>
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