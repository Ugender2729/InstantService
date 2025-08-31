import { Card, CardContent } from "@/components/ui/card";
import { Search, Calendar, CreditCard, CheckCircle } from "lucide-react";

const steps = [
  {
    id: 1,
    title: "Browse & Select",
    description: "Choose from verified professionals in your preferred service category",
    icon: Search,
    color: "text-brand-primary"
  },
  {
    id: 2,
    title: "Book Your Date",
    description: "Select an available date and book for a full 8-hour day service",
    icon: Calendar,
    color: "text-brand-accent"
  },
  {
    id: 3,
    title: "Secure Payment",
    description: "Make secure payment and receive booking confirmation instantly",
    icon: CreditCard,
    color: "text-brand-secondary"
  },
  {
    id: 4,
    title: "Service Delivered",
    description: "Professional arrives on time and delivers quality service for 8 hours",
    icon: CheckCircle,
    color: "text-green-600"
  }
];

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
            How InstaServe Works
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Simple 4-step process to get quality professional services delivered to you
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => {
            const IconComponent = step.icon;
            return (
              <div key={step.id} className="relative">
                <Card className="text-center border-border/50 hover:shadow-md transition-shadow duration-300">
                  <CardContent className="pt-8 pb-6">
                    <div className="relative mb-6">
                      <div className="w-16 h-16 bg-gradient-to-br from-muted to-muted/50 rounded-full flex items-center justify-center mx-auto">
                        <IconComponent className={`w-8 h-8 ${step.color}`} />
                      </div>
                      <div className="absolute -top-2 -right-2 w-8 h-8 bg-brand-primary text-white rounded-full flex items-center justify-center text-sm font-bold">
                        {step.id}
                      </div>
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-3">
                      {step.title}
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {step.description}
                    </p>
                  </CardContent>
                </Card>
                
                {/* Arrow connector */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-brand-primary to-brand-accent transform -translate-y-1/2 z-10">
                    <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-0 h-0 border-l-4 border-l-brand-accent border-y-2 border-y-transparent"></div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-2 bg-muted/50 rounded-full px-6 py-3 text-sm text-muted-foreground">
            <CheckCircle className="w-4 h-4 text-brand-secondary" />
            All services are guaranteed for quality and satisfaction
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;