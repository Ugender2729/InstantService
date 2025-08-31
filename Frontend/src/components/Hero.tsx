import { Button } from "@/components/ui/button";
import { ArrowRight, Clock, Shield, Users } from "lucide-react";
import { Link } from "react-router-dom";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  CarouselIndicators,
} from "@/components/ui/carousel";

const Hero = () => {
  const heroImages = [
    {
      src: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=600&fit=crop",
      alt: "Professional services - Education and tutoring",
      title: "Expert Education Services",
      subtitle: "Connect with qualified tutors and teachers"
    },
    {
      src: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&h=600&fit=crop",
      alt: "Professional services - Household and cleaning",
      title: "Quality Household Help",
      subtitle: "Reliable cleaning and maintenance services"
    },
    {
      src: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&h=600&fit=crop",
      alt: "Professional services - Events and celebrations",
      title: "Perfect Event Planning",
      subtitle: "Make your events memorable with professionals"
    },
    {
      src: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=600&fit=crop",
      alt: "Professional services - Business and consulting",
      title: "Business Excellence",
      subtitle: "Professional consulting and support services"
    }
  ];

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto px-4 py-20 lg:py-28">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl lg:text-6xl font-bold text-foreground leading-tight">
                Hire Skilled 
                <span className="bg-gradient-to-r from-brand-primary to-brand-accent bg-clip-text text-transparent">
                  {" "}Professionals
                </span>{" "}
                for Full Day Services
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed">
                Book verified professionals for 8-hour services across Education, Household Help, Events, Travel, and more. Get quality work done with trusted experts.
              </p>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-brand-secondary" />
                <span>Verified Professionals</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-brand-secondary" />
                <span>8-Hour Service</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-brand-secondary" />
                <span>10,000+ Happy Customers</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/find-services">
                <Button variant="hero" size="xl" className="group">
                  Find Services
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link to="/become-provider">
                <Button variant="outline-brand" size="xl">
                  Become a Provider
                </Button>
              </Link>
            </div>

            {/* Social Proof */}
            <div className="flex items-center gap-8 pt-8 border-t border-border">
              <div>
                <div className="text-2xl font-bold text-foreground">10K+</div>
                <div className="text-sm text-muted-foreground">Services Completed</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-foreground">4.8★</div>
                <div className="text-sm text-muted-foreground">Average Rating</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-foreground">2K+</div>
                <div className="text-sm text-muted-foreground">Verified Providers</div>
              </div>
            </div>
          </div>

          {/* Right Content - Hero Image Carousel */}
          <div className="relative">
            <Carousel className="w-full" autoPlay={true} interval={4000}>
              <CarouselContent>
                {heroImages.map((image, index) => (
                  <CarouselItem key={index}>
                    <div className="relative">
                      <img
                        src={image.src}
                        alt={image.alt}
                        className="w-full h-[400px] lg:h-[500px] object-cover rounded-2xl shadow-2xl"
                        onError={(e) => {
                          // Fallback to placeholder if image fails to load
                          e.currentTarget.src = `https://via.placeholder.com/600x500?text=${encodeURIComponent(image.title)}`;
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent rounded-2xl"></div>
                      <div className="absolute bottom-6 left-6 right-6 text-white">
                        <h3 className="text-xl font-bold mb-2">{image.title}</h3>
                        <p className="text-sm opacity-90">{image.subtitle}</p>
                      </div>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
              <CarouselIndicators />
            </Carousel>
            
            {/* Background Elements */}
            <div className="absolute -top-4 -right-4 w-32 h-32 bg-brand-accent/20 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-8 -left-8 w-40 h-40 bg-brand-primary/20 rounded-full blur-3xl"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;