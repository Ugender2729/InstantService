import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Phone, MapPin, Clock, MessageCircle, HelpCircle, FileText } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";

const Contact = () => {
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: ""
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!contactForm.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!contactForm.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactForm.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!contactForm.subject.trim()) {
      newErrors.subject = "Subject is required";
    }

    if (!contactForm.message.trim()) {
      newErrors.message = "Message is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      console.log("Contact form submitted:", contactForm);
      // Handle form submission
      alert("Thank you for your message! We'll get back to you soon.");
      setContactForm({ name: "", email: "", phone: "", subject: "", message: "" });
    }
  };

  const contactInfo = [
    {
      icon: Mail,
      title: "Email",
      value: "support@instaserve.com",
      description: "Get in touch with our support team"
    },
    {
      icon: Phone,
      title: "Phone",
      value: "+1 (555) 123-4567",
      description: "Call us during business hours"
    },
    {
      icon: MapPin,
      title: "Office",
      value: "Mumbai, Maharashtra",
      description: "Visit our headquarters"
    },
    {
      icon: Clock,
      title: "Business Hours",
      value: "Mon-Fri: 9AM-6PM",
      description: "We're here to help you"
    }
  ];

  const supportTopics = [
    {
      icon: HelpCircle,
      title: "General Support",
      description: "Questions about our services and platform",
      email: "support@instaserve.com"
    },
    {
      icon: MessageCircle,
      title: "Customer Service",
      description: "Issues with bookings or service quality",
      email: "customerservice@instaserve.com"
    },
    {
      icon: FileText,
      title: "Business Inquiries",
      description: "Partnerships and business opportunities",
      email: "business@instaserve.com"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Contact Us
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            We're here to help! Get in touch with our team for any questions, 
            support, or feedback about InstaServe.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-6">
                Get in Touch
              </h2>
              <div className="space-y-4">
                {contactInfo.map((info, index) => {
                  const IconComponent = info.icon;
                  return (
                    <Card key={index}>
                      <CardContent className="p-4">
                        <div className="flex items-start gap-4">
                          <IconComponent className="w-6 h-6 text-brand-primary mt-1" />
                          <div>
                            <h3 className="font-semibold text-foreground">{info.title}</h3>
                            <p className="text-brand-primary font-medium">{info.value}</p>
                            <p className="text-sm text-muted-foreground">{info.description}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>

            {/* Support Topics */}
            <div>
              <h3 className="text-xl font-bold text-foreground mb-4">
                Support Topics
              </h3>
              <div className="space-y-3">
                {supportTopics.map((topic, index) => {
                  const IconComponent = topic.icon;
                  return (
                    <Card key={index}>
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <IconComponent className="w-5 h-5 text-brand-primary mt-1" />
                          <div className="flex-1">
                            <h4 className="font-semibold text-foreground">{topic.title}</h4>
                            <p className="text-sm text-muted-foreground mb-2">{topic.description}</p>
                            <a 
                              href={`mailto:${topic.email}`}
                              className="text-sm text-brand-primary hover:underline"
                            >
                              {topic.email}
                            </a>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Send us a Message</CardTitle>
                <CardDescription>
                  Fill out the form below and we'll get back to you as soon as possible.
                </CardDescription>
              </CardHeader>
              <form onSubmit={handleSubmit}>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name *</Label>
                      <Input 
                        id="name" 
                        placeholder="Enter your full name"
                        value={contactForm.name}
                        onChange={(e) => setContactForm({...contactForm, name: e.target.value})}
                        className={errors.name ? "border-red-500" : ""}
                      />
                      {errors.name && (
                        <p className="text-xs text-red-500">{errors.name}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email *</Label>
                      <Input 
                        id="email" 
                        type="email" 
                        placeholder="Enter your email"
                        value={contactForm.email}
                        onChange={(e) => setContactForm({...contactForm, email: e.target.value})}
                        className={errors.email ? "border-red-500" : ""}
                      />
                      {errors.email && (
                        <p className="text-xs text-red-500">{errors.email}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number (Optional)</Label>
                    <Input 
                      id="phone" 
                      type="tel" 
                      placeholder="Enter your phone number"
                      value={contactForm.phone}
                      onChange={(e) => setContactForm({...contactForm, phone: e.target.value})}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject *</Label>
                    <Input 
                      id="subject" 
                      placeholder="What is this regarding?"
                      value={contactForm.subject}
                      onChange={(e) => setContactForm({...contactForm, subject: e.target.value})}
                      className={errors.subject ? "border-red-500" : ""}
                    />
                    {errors.subject && (
                      <p className="text-xs text-red-500">{errors.subject}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Message *</Label>
                    <Textarea 
                      id="message" 
                      placeholder="Tell us more about your inquiry..."
                      value={contactForm.message}
                      onChange={(e) => setContactForm({...contactForm, message: e.target.value})}
                      className={`resize-none ${errors.message ? "border-red-500" : ""}`}
                      rows={5}
                    />
                    {errors.message && (
                      <p className="text-xs text-red-500">{errors.message}</p>
                    )}
                  </div>

                  <Button type="submit" variant="brand" className="w-full">
                    Send Message
                  </Button>
                </CardContent>
              </form>
            </Card>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-center mb-8">Frequently Asked Questions</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">How do I book a service?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Browse our service categories, select a provider, choose your preferred date, 
                  and complete the booking with secure payment.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">How are providers verified?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  All providers undergo background checks, skill verification, and reference 
                  validation before being approved on our platform.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">What if I'm not satisfied?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  We offer a satisfaction guarantee. If you're not happy with the service, 
                  contact us within 24 hours for a refund or replacement.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">How do I become a provider?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Sign up as a provider, complete your profile with skills and experience, 
                  upload required documents, and get approved by our team.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle>Still Need Help?</CardTitle>
              <CardDescription>
                Can't find what you're looking for? Try these options:
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/find-services">
                  <Button variant="brand">Browse Services</Button>
                </Link>
                <Link to="/get-started">
                  <Button variant="outline-brand">Get Started</Button>
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

export default Contact; 