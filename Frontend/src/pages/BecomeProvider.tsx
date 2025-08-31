import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, DollarSign, Calendar, Users } from "lucide-react";
import { Link } from "react-router-dom";

const BecomeProvider = () => {
  const benefits = [
    {
      icon: DollarSign,
      title: "Earn Good Money",
      description: "Earn ₹1,000-₹3,000 per 8-hour service based on your skills"
    },
    {
      icon: Calendar,
      title: "Flexible Schedule",
      description: "Set your own availability and work when you want"
    },
    {
      icon: Users,
      title: "Growing Customer Base",
      description: "Access to thousands of customers looking for your services"
    },
    {
      icon: CheckCircle,
      title: "Verified Platform",
      description: "Work with verified customers through our secure platform"
    }
  ];

  const steps = [
    "Complete your profile with skills and experience",
    "Upload required documents for verification",
    "Get approved by our team",
    "Start receiving booking requests",
    "Deliver quality service and earn money"
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Become a Service Provider
          </h1>
          <p className="text-xl text-muted-foreground mb-6">
            Turn your skills into income. Join thousands of professionals earning through InstaServe.
          </p>
          <Link to="/get-started">
            <Button variant="hero" size="xl">
              Start Earning Today
            </Button>
          </Link>
        </div>

        {/* Benefits */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-center mb-8">Why Choose InstaServe?</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => (
              <Card key={index} className="text-center">
                <CardHeader>
                  <benefit.icon className="w-12 h-12 text-brand-primary mx-auto mb-4" />
                  <CardTitle className="text-lg">{benefit.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{benefit.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* How it Works */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-center mb-8">How It Works</h2>
          <Card className="max-w-2xl mx-auto">
            <CardContent className="p-6">
              <div className="space-y-4">
                {steps.map((step, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <div className="w-8 h-8 bg-brand-primary text-white rounded-full flex items-center justify-center font-bold">
                      {index + 1}
                    </div>
                    <span className="text-foreground">{step}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Popular Categories */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-center mb-8">Popular Service Categories</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { name: "Education", examples: "Tutoring, Language Teaching, Skill Training", rate: "₹1,500-₹2,500" },
              { name: "Household Help", examples: "Cleaning, Cooking, Maintenance", rate: "₹1,000-₹1,800" },
              { name: "Events", examples: "Photography, Decoration, Coordination", rate: "₹2,000-₹3,500" },
              { name: "Travel", examples: "Guide Services, Driver, Tour Planning", rate: "₹1,200-₹2,000" },
              { name: "Shifting", examples: "Packing, Moving, Organizing", rate: "₹1,500-₹2,200" },
              { name: "Professional", examples: "Consulting, Design, Writing", rate: "₹2,500-₹4,000" }
            ].map((category, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="text-lg">{category.name}</CardTitle>
                  <CardDescription>{category.examples}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-lg font-bold text-brand-primary">
                    {category.rate}/day
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <Card className="max-w-md mx-auto">
            <CardHeader>
              <CardTitle>Ready to Get Started?</CardTitle>
              <CardDescription>
                Join our platform and start earning from your skills today
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Link to="/get-started">
                <Button variant="brand" className="w-full">
                  Sign Up as Provider
                </Button>
              </Link>
              <Link to="/" className="text-sm text-muted-foreground hover:text-brand-primary block">
                ← Back to Home
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default BecomeProvider;