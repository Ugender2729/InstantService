import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-muted/30 border-t border-border">
      <div className="container mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-brand-primary to-brand-accent rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">I</span>
              </div>
              <span className="text-xl font-bold text-foreground">InstaServe</span>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              Connecting you with verified professionals for quality full-day services across multiple categories.
            </p>
            <div className="flex space-x-4">
              <Button variant="ghost" size="icon">
                <Facebook className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon">
                <Twitter className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon">
                <Instagram className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon">
                <Linkedin className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Services</h3>
            <ul className="space-y-3 text-muted-foreground">
              <li><a href="#" className="hover:text-brand-primary transition-colors">Education</a></li>
              <li><a href="#" className="hover:text-brand-primary transition-colors">Household Help</a></li>
              <li><a href="#" className="hover:text-brand-primary transition-colors">Events</a></li>
              <li><a href="#" className="hover:text-brand-primary transition-colors">Travel</a></li>
              <li><a href="#" className="hover:text-brand-primary transition-colors">Shifting</a></li>
              <li><a href="#" className="hover:text-brand-primary transition-colors">Business</a></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Company</h3>
            <ul className="space-y-3 text-muted-foreground">
              <li><a href="#" className="hover:text-brand-primary transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-brand-primary transition-colors">How it Works</a></li>
              <li><a href="#" className="hover:text-brand-primary transition-colors">Become a Provider</a></li>
              <li><a href="#" className="hover:text-brand-primary transition-colors">Support</a></li>
              <li><a href="#" className="hover:text-brand-primary transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-brand-primary transition-colors">Privacy Policy</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Contact Us</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-muted-foreground">
                <Mail className="w-4 h-4 text-brand-primary" />
                <span>support@instaserve.com</span>
              </div>
              <div className="flex items-center gap-3 text-muted-foreground">
                <Phone className="w-4 h-4 text-brand-primary" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center gap-3 text-muted-foreground">
                <MapPin className="w-4 h-4 text-brand-primary" />
                <span>New York, NY</span>
              </div>
              
              {/* Newsletter */}
              <div className="pt-4">
                <h4 className="font-medium text-foreground mb-2">Stay Updated</h4>
                <div className="flex gap-2">
                  <Input 
                    placeholder="Enter your email" 
                    className="flex-1" 
                  />
                  <Button variant="brand" size="sm">
                    Subscribe
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-border mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-muted-foreground text-sm">
            © 2024 InstaServe. All rights reserved.
          </p>
          <div className="flex items-center gap-6 mt-4 md:mt-0 text-sm text-muted-foreground">
            <a href="#" className="hover:text-brand-primary transition-colors">Privacy</a>
            <a href="#" className="hover:text-brand-primary transition-colors">Terms</a>
            <a href="#" className="hover:text-brand-primary transition-colors">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;