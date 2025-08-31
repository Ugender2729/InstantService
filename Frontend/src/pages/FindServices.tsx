import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, MapPin, Clock, Star } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "@/contexts/UserContext";
import { useNotifications } from "@/contexts/NotificationContext";
import { useState } from "react";
import BookingModal from "@/components/BookingModal";

const FindServices = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useUser();
  const { addNotification } = useNotifications();
  const [searchTerm, setSearchTerm] = useState("Mathematics");
  const [location, setLocation] = useState("Mumbai");
  const [selectedService, setSelectedService] = useState<any>(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  const mockServices = [
    {
      id: 1,
      name: "Mathematics Tutor",
      category: "Education",
      provider: "John Smith",
      rating: 4.8,
      price: 1500,
      location: "Mumbai",
      available: true,
      description: "Experienced math teacher for high school students"
    },
    {
      id: 2,
      name: "House Cleaning",
      category: "Household Help",
      provider: "Maria Garcia",
      rating: 4.9,
      price: 1200,
      location: "Delhi",
      available: true,
      description: "Professional cleaning service for homes and offices"
    },
    {
      id: 3,
      name: "Event Coordinator",
      category: "Events",
      provider: "Sarah Wilson",
      rating: 4.7,
      price: 2500,
      location: "Bangalore",
      available: false,
      description: "Complete event planning and coordination services"
    },
    {
      id: 4,
      name: "Moving Assistant",
      category: "Shifting",
      provider: "David Kumar",
      rating: 4.6,
      price: 1800,
      location: "Pune",
      available: true,
      description: "Help with packing, moving, and organizing belongings"
    }
  ];

  const handleBookService = (service: any) => {
    if (!isAuthenticated) {
      // Redirect to signup if not authenticated
      navigate('/get-started');
      return;
    }

    // Open booking modal
    setSelectedService(service);
    setIsBookingModalOpen(true);
  };

  // Redirect to signup if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center">Sign Up Required</CardTitle>
            <CardDescription className="text-center">
              You need to create an account to browse and book services
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-center text-muted-foreground">
              Join InstaServe to connect with verified professionals and book quality services.
            </p>
            <div className="flex flex-col gap-2">
              <Link to="/get-started">
                <Button variant="brand" className="w-full">
                  Create Account
                </Button>
              </Link>
              <Link to="/signin">
                <Button variant="outline" className="w-full">
                  Sign In
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Find Services</h1>
          <p className="text-muted-foreground">
            Discover verified professionals for your 8-hour service needs
          </p>
        </div>

        {/* Search Bar */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder="Search for services..." 
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex-1">
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder="Location" 
                    className="pl-10"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  />
                </div>
              </div>
              <Button variant="brand">Search</Button>
            </div>
          </CardContent>
        </Card>

        {/* Service Categories */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Categories</h2>
          <div className="flex flex-wrap gap-2">
            {["All", "Education", "Household Help", "Events", "Travel", "Shifting"].map((category) => (
              <Badge 
                key={category} 
                variant={category === "Education" ? "default" : "secondary"}
                className="cursor-pointer"
              >
                {category}
              </Badge>
            ))}
          </div>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockServices.map((service) => (
            <Card key={service.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <Badge variant="secondary">{service.category}</Badge>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium">{service.rating}</span>
                  </div>
                </div>
                <CardTitle className="text-lg">{service.name}</CardTitle>
                <CardDescription>{service.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Provider:</span>
                    <span className="font-medium">{service.provider}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Location:</span>
                    <span>{service.location}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">8-hour rate:</span>
                    <span className="font-bold text-brand-primary">₹{service.price}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="w-4 h-4" />
                    <span className={service.available ? "text-green-600" : "text-red-600"}>
                      {service.available ? "Available Today" : "Booked"}
                    </span>
                  </div>
                  <Button 
                    variant={service.available ? "brand" : "secondary"} 
                    className="w-full"
                    disabled={!service.available}
                    onClick={() => handleBookService(service)}
                  >
                    {service.available ? "Book Now" : "Unavailable"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-8">
          <Link to="/" className="text-sm text-muted-foreground hover:text-brand-primary">
            ← Back to Home
          </Link>
        </div>
      </div>

      {/* Booking Modal */}
      {selectedService && (
        <BookingModal
          isOpen={isBookingModalOpen}
          onClose={() => {
            setIsBookingModalOpen(false);
            setSelectedService(null);
          }}
          service={selectedService}
        />
      )}
    </div>
  );
};

export default FindServices;