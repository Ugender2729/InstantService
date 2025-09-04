import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Shield, Clock, Star, Award, Target, Heart, GraduationCap, BookOpen, Lightbulb } from "lucide-react";
import { Link } from "react-router-dom";

const About = () => {
  const stats = [
    { icon: Users, value: "10,000+", label: "Happy Customers" },
    { icon: Shield, value: "2,000+", label: "Verified Providers" },
    { icon: Clock, value: "50,000+", label: "Hours of Service" },
    { icon: Star, value: "4.8★", label: "Average Rating" }
  ];

  const values = [
    {
      icon: Target,
      title: "Quality First",
      description: "We ensure every service provider is verified and maintains high standards of quality."
    },
    {
      icon: Heart,
      title: "Customer Focus",
      description: "Your satisfaction is our priority. We're here to make your life easier."
    },
    {
      icon: Shield,
      title: "Trust & Safety",
      description: "All providers are background-checked and insured for your peace of mind."
    },
    {
      icon: Clock,
      title: "Reliability",
      description: "On-time service delivery with guaranteed 8-hour work commitment."
    }
  ];

  const tuitionFeatures = [
    {
      icon: GraduationCap,
      title: "Top Mentors from IITs & NITs",
      description: "Learn from the brightest minds who graduated from India's premier institutes"
    },
    {
      icon: BookOpen,
      title: "Personalized Tuition",
      description: "Tailored learning experience designed to meet your unique educational needs"
    },
    {
      icon: Lightbulb,
      title: "Future-Ready Learning",
      description: "Comprehensive curriculum that prepares students for tomorrow's challenges"
    },
    {
      icon: Star,
      title: "Trusted by Parents",
      description: "Loved by students with mentorship from India's best institutes"
    }
  ];

  const team = [
    {
      name: "IIT Alumni Team",
      role: "3 IITians",
      description: "Graduates from India's most prestigious engineering institutes"
    },
    {
      name: "NIT Alumni Team", 
      role: "2 NITians",
      description: "Experts from National Institutes of Technology"
    },
    {
      name: "Education Vision",
      role: "Our Mission",
      description: "Providing quality education online with experienced teachers at affordable prices"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            About InstaServe
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Connecting skilled professionals with customers who need quality services. 
            We're building India's most trusted platform for full-day professional services.
          </p>
        </div>

        {/* Tuition Service Section */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Excel in Studies with Guidance from IIT & NIT Graduates
            </h2>
            <p className="text-lg text-muted-foreground max-w-4xl mx-auto mb-6">
              "Your Success, Our Mission – Premium Tuition by IIT–NIT Scholars"
            </p>
            <p className="text-xl text-brand-primary font-semibold">
              Crack Exams with Confidence – Learn from IIT & NIT Experts
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {tuitionFeatures.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <Card key={index} className="text-center">
                  <CardHeader>
                    <IconComponent className="w-12 h-12 text-brand-primary mx-auto mb-4" />
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>{feature.description}</CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <Card className="bg-gradient-to-r from-brand-primary/10 to-brand-accent/10 border-brand-primary/20">
            <CardContent className="pt-6">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-foreground mb-4">
                  Trusted by Parents | Loved by Students | Mentorship from India's Best Institutes
                </h3>
                <p className="text-lg text-muted-foreground mb-6">
                  3 IITians and 2 NITians came together to provide quality education online with experienced teachers, 
                  believing in trust and delivering excellence at affordable prices.
                </p>
                <Link to="/tuition">
                  <Button variant="brand" size="lg">
                    Book Your Classes Today!
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <Card key={index} className="text-center">
                <CardContent className="pt-6">
                  <IconComponent className="w-8 h-8 text-brand-primary mx-auto mb-2" />
                  <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Mission & Vision */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5 text-brand-primary" />
                Our Mission
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                To democratize access to quality professional services by connecting verified 
                experts with customers who need reliable, full-day assistance. We believe 
                everyone deserves access to skilled professionals without the hassle of 
                traditional hiring processes.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="w-5 h-5 text-brand-primary" />
                Our Vision
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                To become India's leading platform for professional services, empowering 
                millions of skilled individuals to earn a livelihood while providing 
                customers with convenient access to quality services at fair prices.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Values */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Our Values</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => {
              const IconComponent = value.icon;
              return (
                <Card key={index} className="text-center">
                  <CardHeader>
                    <IconComponent className="w-12 h-12 text-brand-primary mx-auto mb-4" />
                    <CardTitle className="text-lg">{value.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>{value.description}</CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Story */}
        <div className="mb-16">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Our Story</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground leading-relaxed">
                InstaServe was born from a simple observation: finding reliable, skilled 
                professionals for full-day services was incredibly difficult. Whether it was 
                a tutor for children, a house cleaner, or an event coordinator, the process 
                was time-consuming, expensive, and often unreliable.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Founded in 2023, we set out to solve this problem by creating a platform 
                that connects verified professionals with customers who need quality services. 
                Our unique approach focuses on full-day commitments, ensuring both customers 
                and providers get maximum value from their time.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Today, we're proud to serve thousands of customers across India, helping 
                skilled professionals earn a good living while providing customers with 
                reliable, quality services they can trust.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Team */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Our Leadership Team</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {team.map((member, index) => (
              <Card key={index} className="text-center">
                <CardHeader>
                  <div className="w-16 h-16 bg-gradient-to-br from-brand-primary to-brand-accent rounded-full mx-auto mb-4 flex items-center justify-center">
                    <span className="text-white font-bold text-lg">
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <CardTitle className="text-lg">{member.name}</CardTitle>
                  <Badge variant="secondary">{member.role}</Badge>
                </CardHeader>
                <CardContent>
                  <CardDescription>{member.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle>Join the InstaServe Community</CardTitle>
              <CardDescription>
                Whether you're looking for services or want to provide them, 
                we'd love to have you on board.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/find-services">
                  <Button variant="brand">Find Services</Button>
                </Link>
                <Link to="/become-provider">
                  <Button variant="outline-brand">Become a Provider</Button>
                </Link>
              </div>
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

export default About; 