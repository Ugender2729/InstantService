import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useUser } from "@/contexts/UserContext";
import { usePayment } from "@/contexts/PaymentContext";
import { useNotifications } from "@/contexts/NotificationContext";
import { Calendar, Clock, MapPin, User, CreditCard } from "lucide-react";

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  service: {
    id: number;
    name: string;
    provider: string;
    price: number;
    location: string;
    description: string;
  };
}

const BookingModal = ({ isOpen, onClose, service }: BookingModalProps) => {
  const { user } = useUser();
  const { createBooking, processPayment, calculateCommission } = usePayment();
  const { addNotification } = useNotifications();
  const [bookingData, setBookingData] = useState({
    date: "",
    time: "",
    address: "",
    specialInstructions: ""
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isProcessing, setIsProcessing] = useState(false);

  const { commission, providerAmount } = calculateCommission(service.price);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!bookingData.date.trim()) {
      newErrors.date = "Date is required";
    } else {
      const selectedDate = new Date(bookingData.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (selectedDate < today) {
        newErrors.date = "Cannot select past dates";
      }
    }

    if (!bookingData.time.trim()) {
      newErrors.time = "Time is required";
    }

    if (!bookingData.address.trim()) {
      newErrors.address = "Service address is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleBooking = async () => {
    if (!user) return;

    if (!validateForm()) {
      return;
    }

    setIsProcessing(true);

    try {
      // Create booking
      const booking = createBooking({
        customerId: user.id,
        providerId: "provider-1", // Mock provider ID
        serviceName: service.name,
        customerName: user.name,
        providerName: service.provider,
        customerPhone: user.phone,
        providerPhone: "+91 9876543210", // Mock provider phone
        location: bookingData.address || user.address,
        amount: service.price,
      });

      // Process payment
      const payment = processPayment(booking.id);

      // Add notifications
      addNotification({
        type: 'booking_request',
        title: 'Booking Confirmed',
        message: `Your booking for ${service.name} has been confirmed and payment processed.`,
        data: {
          service: service.name,
          amount: service.price,
          bookingId: booking.id,
          paymentId: payment.id
        }
      });

      // Add notification for provider
      addNotification({
        type: 'booking_request',
        title: 'New Booking Request',
        message: `${user.name} has booked your ${service.name} service.`,
        data: {
          service: service.name,
          customerName: user.name,
          location: bookingData.address || user.address,
          amount: service.price,
          providerAmount: providerAmount
        }
      });

      // Close modal
      onClose();
      
      // Reset form
      setBookingData({
        date: "",
        time: "",
        address: "",
        specialInstructions: ""
      });
      setErrors({});

    } catch (error) {
      console.error('Booking error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Book Service</DialogTitle>
          <DialogDescription>
            Complete your booking for {service.name}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Service Details */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">{service.name}</CardTitle>
              <CardDescription>{service.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <User className="w-4 h-4" />
                <span>Provider: {service.provider}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="w-4 h-4" />
                <span>Location: {service.location}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <CreditCard className="w-4 h-4" />
                <span>Price: ₹{service.price}</span>
              </div>
            </CardContent>
          </Card>

          {/* Booking Form */}
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date">Date *</Label>
                <Input
                  id="date"
                  type="date"
                  value={bookingData.date}
                  onChange={(e) => setBookingData({...bookingData, date: e.target.value})}
                  className={errors.date ? "border-red-500" : ""}
                  min={new Date().toISOString().split('T')[0]}
                />
                {errors.date && (
                  <p className="text-xs text-red-500">{errors.date}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="time">Time *</Label>
                <Input
                  id="time"
                  type="time"
                  value={bookingData.time}
                  onChange={(e) => setBookingData({...bookingData, time: e.target.value})}
                  className={errors.time ? "border-red-500" : ""}
                />
                {errors.time && (
                  <p className="text-xs text-red-500">{errors.time}</p>
                )}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="address">Service Address *</Label>
              <Textarea
                id="address"
                placeholder="Enter the address where service is needed"
                value={bookingData.address}
                onChange={(e) => setBookingData({...bookingData, address: e.target.value})}
                rows={2}
                className={errors.address ? "border-red-500" : ""}
              />
              {errors.address && (
                <p className="text-xs text-red-500">{errors.address}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="instructions">Special Instructions</Label>
              <Textarea
                id="instructions"
                placeholder="Any special requirements or instructions"
                value={bookingData.specialInstructions}
                onChange={(e) => setBookingData({...bookingData, specialInstructions: e.target.value})}
                rows={2}
              />
            </div>
          </div>

          {/* Payment Summary */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Payment Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Service Amount:</span>
                <span>₹{service.price}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Platform Fee (10%):</span>
                <span>₹{commission}</span>
              </div>
              <div className="flex justify-between font-medium border-t pt-2">
                <span>Provider Receives:</span>
                <span>₹{providerAmount}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleBooking} 
            disabled={isProcessing}
          >
            {isProcessing ? "Processing..." : "Confirm Booking"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BookingModal; 