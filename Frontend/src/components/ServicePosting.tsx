import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { useUser } from "@/contexts/UserContext";

interface ServiceCategory {
  id: string;
  name: string;
  description: string;
}

interface ServicePost {
  id?: string;
  title: string;
  description: string;
  category_id: string;
  price: number;
  price_type: 'hourly' | 'fixed';
  location: string;
  availability: string;
}

const ServicePosting = () => {
  const { user } = useUser();
  const { toast } = useToast();
  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [loading, setLoading] = useState(false);
  const [serviceForm, setServiceForm] = useState<ServicePost>({
    title: '',
    description: '',
    category_id: '',
    price: 0,
    price_type: 'hourly',
    location: '',
    availability: ''
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('service_categories')
        .select('*')
        .order('name');

      if (error) throw error;
      setCategories(data || []);
    } catch (error: any) {
      console.error('Error fetching categories:', error);
      toast({
        title: "❌ Error",
        description: "Failed to fetch service categories",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user || user.type !== 'provider') {
      toast({
        title: "❌ Access Denied",
        description: "Only service providers can post services",
        variant: "destructive",
      });
      return;
    }

    if (!serviceForm.title || !serviceForm.description || !serviceForm.category_id || !serviceForm.price) {
      toast({
        title: "❌ Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      // First, get the provider profile from providers table
      const { data: providerData, error: providerError } = await supabase
        .from('providers')
        .select('id')
        .eq('id', user.id)
        .single();

      if (providerError || !providerData) {
        throw new Error('Provider profile not found');
      }

      // Create the service post
      const { data: serviceData, error: serviceError } = await supabase
        .from('services')
        .insert({
          provider_id: user.id,
          title: serviceForm.title,
          description: serviceForm.description,
          category_id: serviceForm.category_id,
          price: serviceForm.price,
          price_type: serviceForm.price_type,
          location: serviceForm.location,
          availability: serviceForm.availability,
          status: 'active'
        })
        .select()
        .single();

      if (serviceError) throw serviceError;

      toast({
        title: "✅ Success!",
        description: "Service posted successfully",
        variant: "default",
      });

      // Reset form
      setServiceForm({
        title: '',
        description: '',
        category_id: '',
        price: 0,
        price_type: 'hourly',
        location: '',
        availability: ''
      });

    } catch (error: any) {
      console.error('Error posting service:', error);
      toast({
        title: "❌ Error",
        description: error.message || "Failed to post service",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Post a New Service</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Service Title *</Label>
              <Input
                id="title"
                value={serviceForm.title}
                onChange={(e) => setServiceForm({ ...serviceForm, title: e.target.value })}
                placeholder="e.g., Deep House Cleaning, Plumbing Repair"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={serviceForm.description}
                onChange={(e) => setServiceForm({ ...serviceForm, description: e.target.value })}
                placeholder="Describe your service in detail..."
                rows={4}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Service Category *</Label>
                <Select
                  value={serviceForm.category_id}
                  onValueChange={(value) => setServiceForm({ ...serviceForm, category_id: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="price">Price *</Label>
                <Input
                  id="price"
                  type="number"
                  value={serviceForm.price}
                  onChange={(e) => setServiceForm({ ...serviceForm, price: parseFloat(e.target.value) })}
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price_type">Price Type</Label>
                <Select
                  value={serviceForm.price_type}
                  onValueChange={(value: 'hourly' | 'fixed') => setServiceForm({ ...serviceForm, price_type: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hourly">Per Hour</SelectItem>
                    <SelectItem value="fixed">Fixed Price</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Service Location</Label>
                <Input
                  id="location"
                  value={serviceForm.location}
                  onChange={(e) => setServiceForm({ ...serviceForm, location: e.target.value })}
                  placeholder="e.g., Mumbai, Maharashtra"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="availability">Availability</Label>
              <Textarea
                id="availability"
                value={serviceForm.availability}
                onChange={(e) => setServiceForm({ ...serviceForm, availability: e.target.value })}
                placeholder="e.g., Monday-Friday 9 AM - 6 PM, Weekends available"
                rows={2}
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Posting Service..." : "Post Service"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ServicePosting;
