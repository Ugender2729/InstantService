import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { UserProvider } from "@/contexts/UserContext";
import { NotificationProvider } from "@/contexts/NotificationContext";
import { PaymentProvider } from "@/contexts/PaymentContext";
import { AdminProvider } from "@/contexts/AdminContext";
import Index from "./pages/Index";
import SignIn from "./pages/SignIn";
import FindServices from "./pages/FindServices";
import GetStarted from "./pages/GetStarted";
import BecomeProvider from "./pages/BecomeProvider";
import About from "./pages/About";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import UserDashboard from "./components/UserDashboard";
import ViewProviders from "./pages/ViewProviders";
import DatabaseTest from "./pages/DatabaseTest";
import ServerTest from "./pages/ServerTest";
import SupabaseTest from "./pages/SupabaseTest";
import FixedNotificationButton from "./components/FixedNotificationButton";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <UserProvider>
      <NotificationProvider>
        <PaymentProvider>
          <AdminProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <FixedNotificationButton />
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/signin" element={<SignIn />} />
                  <Route path="/find-services" element={<FindServices />} />
                  <Route path="/get-started" element={<GetStarted />} />
                  <Route path="/become-provider" element={<BecomeProvider />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/dashboard" element={<UserDashboard />} />
                  <Route path="/view-providers" element={<ViewProviders />} />
                  <Route path="/database-test" element={<DatabaseTest />} />
                  <Route path="/server-test" element={<ServerTest />} />
                  <Route path="/supabase-test" element={<SupabaseTest />} />
                  
                  {/* Admin Routes */}
                  <Route path="/admin/login" element={<AdminLogin />} />
                  <Route path="/admin/dashboard" element={<AdminDashboard />} />
                  
                  {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </BrowserRouter>
            </TooltipProvider>
          </AdminProvider>
        </PaymentProvider>
      </NotificationProvider>
    </UserProvider>
  </QueryClientProvider>
);

export default App;
