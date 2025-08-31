import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Menu, X, User, Settings, LogOut, LayoutDashboard, Shield, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { useUser } from "@/contexts/UserContext";

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useUser();

  const handleLogout = () => {
    logout();
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 w-full border-b border-border/40">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-br from-brand-primary to-brand-accent rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">I</span>
          </div>
          <Link to="/" className="text-xl font-bold text-foreground hover:text-brand-primary transition-colors">
            InstaServe
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <Link to="/find-services" className="text-muted-foreground hover:text-brand-primary transition-colors">
            Services
          </Link>
          {isAuthenticated && (
            <Link to="/view-providers" className="text-muted-foreground hover:text-brand-primary transition-colors flex items-center gap-1">
              <Users className="w-4 h-4" />
              Providers
            </Link>
          )}
          <Link to="/#how-it-works" className="text-muted-foreground hover:text-brand-primary transition-colors">
            How it Works
          </Link>
          <Link to="/about" className="text-muted-foreground hover:text-brand-primary transition-colors">
            About
          </Link>
          <Link to="/contact" className="text-muted-foreground hover:text-brand-primary transition-colors">
            Contact
          </Link>
          <Link to="/admin/login" className="text-muted-foreground hover:text-purple-600 transition-colors flex items-center gap-1">
            <Shield className="w-4 h-4" />
            Admin
          </Link>
        </nav>

        {/* Auth Buttons */}
        <div className="hidden md:flex items-center space-x-3">
          {isAuthenticated ? (
            <>
              <Link to="/dashboard">
                <Button variant="ghost" size="sm">
                  <LayoutDashboard className="w-4 h-4 mr-2" />
                  Dashboard
                </Button>
              </Link>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-muted-foreground">
                  Welcome, {user?.name}
                </span>
                <Button variant="ghost" size="sm" onClick={handleLogout}>
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </div>
            </>
          ) : (
            <>
              <Link to="/signin">
                <Button variant="ghost" size="sm">
                  <User className="w-4 h-4 mr-2" />
                  Sign In
                </Button>
              </Link>
              <Link to="/get-started">
                <Button variant="brand" size="sm">
                  Get Started
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X /> : <Menu />}
        </Button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-background">
          <div className="container mx-auto px-4 py-4 space-y-4">
            <nav className="flex flex-col space-y-3">
              <Link to="/find-services" className="text-muted-foreground hover:text-brand-primary transition-colors">
                Services
              </Link>
              {isAuthenticated && (
                <Link to="/view-providers" className="text-muted-foreground hover:text-brand-primary transition-colors flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  Providers
                </Link>
              )}
              <Link to="/#how-it-works" className="text-muted-foreground hover:text-brand-primary transition-colors">
                How it Works
              </Link>
              <Link to="/about" className="text-muted-foreground hover:text-brand-primary transition-colors">
                About
              </Link>
              <Link to="/contact" className="text-muted-foreground hover:text-brand-primary transition-colors">
                Contact
              </Link>
              <Link to="/admin/login" className="text-muted-foreground hover:text-purple-600 transition-colors flex items-center gap-1">
                <Shield className="w-4 h-4" />
                Admin Portal
              </Link>
            </nav>
            <div className="flex flex-col space-y-2 pt-4 border-t border-border">
              {isAuthenticated ? (
                <>
                  <Link to="/dashboard">
                    <Button variant="ghost" size="sm" className="justify-start w-full">
                      <LayoutDashboard className="w-4 h-4 mr-2" />
                      Dashboard
                    </Button>
                  </Link>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Welcome, {user?.name}
                    </span>
                    <Button variant="ghost" size="sm" onClick={handleLogout}>
                      <LogOut className="w-4 h-4 mr-2" />
                      Logout
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <Link to="/signin">
                    <Button variant="ghost" size="sm" className="justify-start w-full">
                      <User className="w-4 h-4 mr-2" />
                      Sign In
                    </Button>
                  </Link>
                  <Link to="/get-started">
                    <Button variant="brand" size="sm" className="w-full">
                      Get Started
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;