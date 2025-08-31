import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Star, MapPin, Phone, Mail, Calendar, Clock, ArrowLeft } from "lucide-react";
import BookingModal from "@/components/BookingModal";
import { useUser } from "@/contexts/UserContext";
import { Link } from "react-router-dom";

interface Provider {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  rating: number;
  services: Service[];
  experience: string;
  bio: string;
  avatar: string;
}

interface Service {
  id: number;
  name: string;
  price: number;
  description: string;
  category: string;
}

const ViewProviders = () => {
  const { user } = useUser();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  // Mock providers data
  const providers: Provider[] = [
    {
      id: "provider-1",
      name: "Sarah Johnson",
      email: "sarah@example.com",
      phone: "+91 9876543210",
      location: "Mumbai, Maharashtra",
      rating: 4.8,
      experience: "5+ years",
      bio: "Professional cleaning expert with 5+ years of experience. Specialized in deep cleaning and eco-friendly solutions.",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
      services: [
        {
          id: 1,
          name: "Deep House Cleaning",
          price: 2500,
          description: "Complete house cleaning including kitchen, bathrooms, living areas",
          category: "Cleaning"
        },
        {
          id: 2,
          name: "Kitchen Deep Clean",
          price: 1200,
          description: "Specialized kitchen cleaning with appliance maintenance",
          category: "Cleaning"
        }
      ]
    },
    {
      id: "provider-2",
      name: "David Chen",
      email: "david@example.com",
      phone: "+91 9876543211",
      location: "Delhi, NCR",
      rating: 4.6,
      experience: "3+ years",
      bio: "Expert plumber with extensive experience in residential and commercial plumbing solutions.",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      services: [
        {
          id: 3,
          name: "Plumbing Repair",
          price: 800,
          description: "Fix leaks, clogs, and plumbing issues",
          category: "Plumbing"
        },
        {
          id: 4,
          name: "Bathroom Installation",
          price: 5000,
          description: "Complete bathroom fixture installation and setup",
          category: "Plumbing"
        }
      ]
    },
    {
      id: "provider-3",
      name: "Maria Rodriguez",
      email: "maria@example.com",
      phone: "+91 9876543212",
      location: "Bangalore, Karnataka",
      rating: 4.9,
      experience: "7+ years",
      bio: "Certified electrician with expertise in residential electrical work and safety compliance.",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
      services: [
        {
          id: 5,
          name: "Electrical Wiring",
          price: 1500,
          description: "Complete electrical wiring and installation",
          category: "Electrical"
        },
        {
          id: 6,
          name: "Fan Installation",
          price: 400,
          description: "Ceiling fan installation and repair",
          category: "Electrical"
        }
      ]
    }
  ];

  const filteredProviders = providers.filter(provider =>
    provider.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    provider.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    provider.services.some(service => 
      service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.category.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const handleBookService = (service: Service) => {
    setSelectedService(service);
    setIsBookingModalOpen(true);
  };

  const handleCloseBookingModal = () => {
    setIsBookingModalOpen(false);
    setSelectedService(null);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Service Providers</h1>
            <p className="text-muted-foreground">
              Find and book services from verified professionals in your area
            </p>
          </div>
          <Link to="/dashboard">
            <Button variant="outline" className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search providers, services, or locations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Providers Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProviders.map((provider) => (
          <Card key={provider.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start gap-4">
                <img
                  src={provider.avatar}
                  alt={provider.name}
                  className="w-16 h-16 rounded-full object-cover"
                />
                <div className="flex-1">
                  <CardTitle className="text-lg">{provider.name}</CardTitle>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium">{provider.rating}</span>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {provider.experience}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">{provider.bio}</p>
              
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <span>{provider.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  <span>{provider.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <span>{provider.email}</span>
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-medium mb-3">Available Services</h4>
                <div className="space-y-3">
                  {provider.services.map((service) => (
                    <Card key={service.id} className="border-l-4 border-l-brand-primary">
                      <CardContent className="p-3">
                        <div className="flex items-start justify-between">
                          <div className="space-y-1">
                            <h5 className="font-medium text-sm">{service.name}</h5>
                            <p className="text-xs text-muted-foreground">{service.description}</p>
                            <Badge variant="outline" className="text-xs">
                              {service.category}
                            </Badge>
                          </div>
                          <div className="text-right">
                            <div className="font-medium text-sm">₹{service.price}</div>
                            <Button
                              size="sm"
                              onClick={() => handleBookService(service)}
                              className="mt-2"
                            >
                              Book Now
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredProviders.length === 0 && (
        <div className="text-center py-12">
          <Search className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
          <h3 className="text-lg font-medium mb-2">No providers found</h3>
          <p className="text-muted-foreground">
            Try adjusting your search terms or check back later for new providers.
          </p>
        </div>
      )}

      {/* Booking Modal */}
      {selectedService && (
        <BookingModal
          isOpen={isBookingModalOpen}
          onClose={handleCloseBookingModal}
          service={{
            id: selectedService.id,
            name: selectedService.name,
            provider: providers.find(p => p.services.some(s => s.id === selectedService.id))?.name || "",
            price: selectedService.price,
            location: providers.find(p => p.services.some(s => s.id === selectedService.id))?.location || "",
            description: selectedService.description
          }}
        />
      )}
    </div>
  );
};

export default ViewProviders; 