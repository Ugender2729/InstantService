import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  X, 
  Calendar, 
  Clock, 
  DollarSign, 
  MapPin, 
  User,
  Phone,
  Mail,
  AlertCircle
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { useUser } from "@/contexts/UserContext";

interface Service {
  id: string;
  title: string;
  description: string;
  category: string;
  hourly_rate: number;
  location: string;
  provider: {
    id: string;
    full_name: string;
    business_name: string;
    phone: string;
    email: string;
    address: string;
    city: string;
    state: string;
    zip_code: string;
    is_verified: boolean;
    verification_status: 'pending' | 'approved' | 'rejected';
  };
}

interface BookingModalProps {
  service: Service;
  onClose: () => void;
  onSuccess: () => void;
}

const BookingModal = ({ service, onClose, onSuccess }: BookingModalProps) => {
  const [loading, setLoading] = useState(false);
  const [bookingData, setBookingData] = useState({
    service_date: '',
    start_time: '',
    end_time: '',
    notes: '',
    address: ''
  });
  const { toast } = useToast();
  const { user } = useUser();

  // Calculate total hours and amount
  const calculateTotal = () => {
    if (!bookingData.start_time || !bookingData.end_time) return { hours: 0, amount: 0 };
    
    const start = new Date(`2000-01-01T${bookingData.start_time}`);
    const end = new Date(`2000-01-01T${bookingData.end_time}`);
    
    if (end <= start) return { hours: 0, amount: 0 };
    
    const diffMs = end.getTime() - start.getTime();
    const hours = Math.ceil(diffMs / (1000 * 60 * 60));
    const amount = hours * service.hourly_rate;
    
    return { hours, amount };
  };

  const { hours, amount } = calculateTotal();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "❌ Login Required",
        description: "Please log in to book services",
        variant: "destructive",
      });
      return;
    }

    // Check if provider is verified
    if (!service.provider.is_verified || service.provider.verification_status !== 'approved') {
      toast({
        title: "❌ Provider Not Verified",
        description: "This provider is not yet verified. Please choose a verified provider.",
        variant: "destructive",
      });
      return;
    }

    if (hours <= 0) {
      toast({
        title: "❌ Invalid Time",
        description: "End time must be after start time",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      // Create booking
      const { data: bookingResult, error: bookingError } = await supabase
        .from('bookings')
        .insert({
          customer_id: user.id,
          provider_id: service.provider.id,
          service_category_id: service.id, // Using service as category for now
          booking_date: bookingData.service_date,
          start_time: bookingData.start_time,
          end_time: bookingData.end_time,
          total_amount: amount,
          notes: bookingData.notes,
          status: 'pending'
        })
        .select()
        .single();

      if (bookingError) throw bookingError;

      // Create notification for provider
      await supabase
        .from('notifications')
        .insert({
          user_id: service.provider.id,
          title: 'New Service Booking',
          message: `${user.full_name} has booked your "${service.title}" service for ${bookingData.service_date}`,
          type: 'booking_request'
        });

      // Dispatch event to update admin dashboard
      window.dispatchEvent(new CustomEvent('bookingCreated'));

      toast({
        title: "✅ Booking Successful!",
        description: "Your service has been booked. The provider will contact you soon.",
        variant: "default",
      });

      onSuccess();
    } catch (error: any) {
      console.error('Booking error:', error);
      toast({
        title: "❌ Booking Failed",
        description: error.message || "Failed to create booking. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setBookingData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-xl font-bold">Book Service</CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Service Details */}
          <div className="bg-gray-50 p-4 rounded-lg space-y-3">
            <h3 className="font-semibold text-lg text-gray-900">{service.title}</h3>
            <div className="flex items-center gap-2">
              <Badge variant="outline">{service.category}</Badge>
              <Badge className="bg-green-100 text-green-800">₹{service.hourly_rate}/hr</Badge>
            </div>
            <p className="text-sm text-gray-600">{service.description}</p>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <MapPin className="w-4 h-4" />
              <span>{service.location}</span>
            </div>
          </div>

          {/* Provider Info */}
          <div className="bg-blue-50 p-4 rounded-lg space-y-3">
            <h4 className="font-medium text-blue-900">Service Provider</h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-blue-600" />
                <span className="font-medium">{service.provider.full_name}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-blue-600" />
                <span>{service.provider.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-blue-600" />
                <span>{service.provider.email}</span>
              </div>
            </div>
          </div>

          {/* Booking Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="service-date">Service Date *</Label>
                <Input
                  id="service-date"
                  type="date"
                  value={bookingData.service_date}
                  onChange={(e) => handleInputChange('service_date', e.target.value)}
                  min={getMinDate()}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="service-address">Service Address *</Label>
                <Input
                  id="service-address"
                  placeholder="Where should the service be performed?"
                  value={bookingData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="start-time">Start Time *</Label>
                <Input
                  id="start-time"
                  type="time"
                  value={bookingData.start_time}
                  onChange={(e) => handleInputChange('start_time', e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="end-time">End Time *</Label>
                <Input
                  id="end-time"
                  type="time"
                  value={bookingData.end_time}
                  onChange={(e) => handleInputChange('end_time', e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Additional Notes</Label>
              <Textarea
                id="notes"
                placeholder="Any special requirements or instructions..."
                value={bookingData.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                rows={3}
              />
            </div>

            {/* Booking Summary */}
            {hours > 0 && (
              <div className="bg-green-50 p-4 rounded-lg space-y-2">
                <h4 className="font-medium text-green-900">Booking Summary</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-green-600" />
                    <span className="font-medium">Date:</span>
                    <span>{bookingData.service_date ? formatDate(bookingData.service_date) : 'Not selected'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-green-600" />
                    <span className="font-medium">Duration:</span>
                    <span>{hours} hour{hours !== 1 ? 's' : ''}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-green-600" />
                    <span className="font-medium">Rate:</span>
                    <span>₹{service.hourly_rate}/hr</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-green-600" />
                    <span className="font-medium">Total:</span>
                    <span className="font-bold text-lg">₹{amount}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Error Display */}
            {hours <= 0 && (bookingData.start_time || bookingData.end_time) && (
              <div className="bg-red-50 p-4 rounded-lg flex items-center gap-2 text-red-800">
                <AlertCircle className="w-4 h-4" />
                <span className="text-sm">End time must be after start time</span>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center gap-3 pt-4">
              <Button
                type="submit"
                className="flex-1 bg-blue-600 hover:bg-blue-700"
                disabled={loading || hours <= 0}
              >
                {loading ? 'Creating Booking...' : `Book Service - ₹${amount}`}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={loading}
              >
                Cancel
              </Button>
            </div>
          </form>

          {/* Important Notes */}
          <div className="bg-yellow-50 p-4 rounded-lg space-y-2">
            <h4 className="font-medium text-yellow-900">Important Information</h4>
            <ul className="text-sm text-yellow-800 space-y-1">
              <li>• Payment will be processed after service completion</li>
              <li>• Provider will contact you within 24 hours to confirm</li>
              <li>• You can cancel up to 2 hours before the scheduled time</li>
              <li>• Service quality is guaranteed by our verification system</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BookingModal; 