import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const categories = [
  {
    id: "education",
    title: "Online Tuition",
    description: "Highly qualified NITians, IITians & teachers for primary to advanced students",
    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=600&fit=crop",
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    services: ["Primary Classes (1-5)", "Middle School (6-8)", "High School (9-12)", "IIT/JEE Preparation", "NEET Preparation", "Competitive Exams"]
  },
  {
    id: "household",
    title: "Household Help",
    description: "Cleaning, cooking, maintenance services - Coming Soon!",
    image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&h=600&fit=crop",
    color: "text-green-600",
    bgColor: "bg-green-50",
    services: ["House Cleaning", "Cooking", "Gardening", "Maintenance"]
  },
  {
    id: "events",
    title: "Events",
    description: "Event planning, photography, decoration - Coming Soon!",
    image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&h=600&fit=crop",
    color: "text-purple-600",
    bgColor: "bg-purple-50",
    services: ["Event Planning", "Photography", "Decoration", "Catering"]
  },
  {
    id: "travel",
    title: "Travel",
    description: "Tour guides, travel assistance, local experts - Coming Soon!",
    image: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&h=600&fit=crop",
    color: "text-orange-600",
    bgColor: "bg-orange-50",
    services: ["Tour Guide", "Travel Planning", "Local Expert", "Driver"]
  },
  {
    id: "shifting",
    title: "Shifting",
    description: "Moving, packing, furniture assembly - Coming Soon!",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop",
    color: "text-red-600",
    bgColor: "bg-red-50",
    services: ["Packing", "Moving", "Assembly", "Loading"]
  },
  {
    id: "business",
    title: "Business",
    description: "Administrative, consulting, digital services - Coming Soon!",
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=600&fit=crop",
    color: "text-indigo-600",
    bgColor: "bg-indigo-50",
    services: ["Admin Support", "Consulting", "Digital Marketing", "Data Entry"]
  }
];

const ServiceCategories = () => {
  return (
    <section id="services" className="py-20 bg-muted/20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
            Choose Your Service Category
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Find skilled professionals for full-day services across various categories. 
            All providers are verified and ready to deliver quality work.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category) => (
            <Card 
              key={category.id} 
              className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer border-border/50 hover:border-brand-primary/50 overflow-hidden"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={category.image}
                  alt={category.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  onError={(e) => {
                    // Fallback to placeholder if image fails to load
                    e.currentTarget.src = "https://via.placeholder.com/400x300?text=" + category.title;
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                <div className="absolute bottom-4 left-4">
                  <h3 className="text-white font-bold text-lg">{category.title}</h3>
                </div>
              </div>
              <CardHeader className="pb-4">
                <CardDescription className="text-muted-foreground">
                  {category.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-2 mb-6">
                  {category.services.map((service, index) => (
                    <div key={index} className="flex items-center text-sm text-muted-foreground">
                      <div className="w-1.5 h-1.5 bg-brand-primary rounded-full mr-2"></div>
                      {service}
                    </div>
                  ))}
                </div>
                {category.id === "education" ? (
                  <Link to="/education" className="block">
                    <Button 
                      variant="outline-brand" 
                      className="w-full group-hover:bg-brand-primary group-hover:text-brand-primary-foreground"
                    >
                      Start Learning
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                ) : (
                  <Button 
                    variant="outline" 
                    className="w-full opacity-60 cursor-not-allowed"
                    disabled
                  >
                    Coming Soon
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>


      </div>
    </section>
  );
};

export default ServiceCategories;