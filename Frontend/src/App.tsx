import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { UserProvider } from './contexts/UserContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { AdminProvider } from './contexts/AdminContext';
import { PaymentProvider } from './contexts/PaymentContext';
import { Toaster } from './components/ui/toaster';
import Header from './components/Header';
import Index from './pages/Index';
import GetStarted from './pages/GetStarted';
import SignIn from './pages/SignIn';
import UserDashboard from './components/UserDashboard';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import DatabaseTest from './pages/DatabaseTest';
import ServerTest from './pages/ServerTest';
import SupabaseTest from './pages/SupabaseTest';
import ProviderDashboard from './pages/ProviderDashboard';
import FindServices from './pages/FindServices';
import ResetPassword from './pages/ResetPassword';
import CustomerSignIn from './components/CustomerSignIn';
import ProviderSignIn from './components/ProviderSignIn';
import ChooseUserType from './pages/ChooseUserType';
import About from './pages/About';
import Contact from './pages/Contact';
import NotFound from './pages/NotFound';
import BecomeProvider from './pages/BecomeProvider';
import ViewProviders from './pages/ViewProviders';
import TestSignup from './pages/TestSignup';
import ServicePosting from './components/ServicePosting';
import ServiceBrowser from './components/ServiceBrowser';
import Education from './pages/Education';
import OnlineTuition from './pages/OnlineTuition';
import InstantService from './pages/InstantService';
// import TuitionStudentSignUp from './pages/TuitionStudentSignUp';
// import TuitionTeacherSignUp from './pages/TuitionTeacherSignUp';

// Full App with all routes restored
function App() {
  return (
    <UserProvider>
      <NotificationProvider>
        <AdminProvider>
          <PaymentProvider>
            <Router>
              <div className="App">
                <Header />
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/get-started" element={<GetStarted />} />
                  <Route path="/signin" element={<SignIn />} />
                  <Route path="/dashboard" element={<UserDashboard />} />
                  <Route path="/admin/login" element={<AdminLogin />} />
                  <Route path="/admin/dashboard" element={<AdminDashboard />} />
                  <Route path="/database-test" element={<DatabaseTest />} />
                  <Route path="/server-test" element={<ServerTest />} />
                  <Route path="/supabase-test" element={<SupabaseTest />} />
                  <Route path="/provider/dashboard" element={<ProviderDashboard />} />
                  <Route path="/find-services" element={<FindServices />} />
                  <Route path="/reset-password" element={<ResetPassword />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/become-provider" element={<BecomeProvider />} />
                  <Route path="/view-providers" element={<ViewProviders />} />
                  <Route path="/post-service" element={<ServicePosting />} />
                  <Route path="/browse-services" element={<ServiceBrowser />} />
                  <Route path="/education" element={<Education />} />
                  <Route path="/tuition" element={<OnlineTuition />} />
                  {/* <Route path="/tuition/student/signup" element={<TuitionStudentSignUp />} />
                  <Route path="/tuition/teacher/signup" element={<TuitionTeacherSignUp />} /> */}
                  <Route path="/instant-service" element={<InstantService />} />
                  <Route path="/test-signup" element={<TestSignup />} />
                  
                  {/* New Separate Sign-In Routes */}
                  <Route path="/choose-type" element={<ChooseUserType />} />
                  <Route path="/customer/signin" element={<CustomerSignIn />} />
                  <Route path="/provider/signin" element={<ProviderSignIn />} />
                  
                  {/* Catch-all route */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
                <Toaster />
              </div>
            </Router>
          </PaymentProvider>
        </AdminProvider>
      </NotificationProvider>
    </UserProvider>
  );
}

export default App;
