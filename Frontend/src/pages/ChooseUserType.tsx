import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Search, Briefcase, ArrowRight, Users, Star, Clock, Shield, Zap, CheckCircle } from "lucide-react";
import '../styles/ChooseUserType.css';

const ChooseUserType = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 flex items-center justify-center p-4 min-h-screen">
        <div className="max-w-6xl mx-auto space-y-12">
          {/* Enhanced Header */}
          <div className="text-center space-y-6">
            <div className="relative">
              <div className="w-24 h-24 bg-gradient-to-br from-purple-500 via-pink-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl animate-pulse">
                <span className="text-white font-bold text-3xl">I</span>
              </div>
              <div className="absolute inset-0 w-24 h-24 bg-gradient-to-br from-purple-500 via-pink-500 to-blue-500 rounded-full blur-xl opacity-50 animate-ping"></div>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-purple-200 to-pink-200 mb-6 animate-fade-in">
              Welcome to InstaServe
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-200 max-w-3xl mx-auto leading-relaxed animate-fade-in animation-delay-300">
              Choose how you want to use our platform - find professional services or offer your expertise
            </p>
            
            {/* Floating Features */}
            <div className="flex flex-wrap justify-center gap-6 mt-8 animate-fade-in animation-delay-600">
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 text-white text-sm">
                <Zap className="w-4 h-4 text-yellow-400" />
                <span>Instant Booking</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 text-white text-sm">
                <Shield className="w-4 h-4 text-green-400" />
                <span>Verified Providers</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 text-white text-sm">
                <CheckCircle className="w-4 h-4 text-blue-400" />
                <span>Quality Assured</span>
              </div>
            </div>
          </div>

          {/* Enhanced User Type Cards */}
          <div className="grid md:grid-cols-2 gap-10 max-w-5xl mx-auto">
            {/* Customer Card */}
                         <Card className="group bg-gradient-to-br from-white/95 to-blue-50/95 backdrop-blur-sm shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-105 border-l-4 border-l-blue-500 hover:border-l-blue-400 overflow-hidden card-hover">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <CardHeader className="text-center pb-6 relative">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
                  <Search className="w-10 h-10 text-white" />
                </div>
                <CardTitle className="text-3xl font-bold text-gray-900 mb-3">Find Services</CardTitle>
                <CardDescription className="text-gray-600 text-lg">
                  Browse and book professional services from verified providers
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-8 relative">
                {/* Enhanced Features */}
                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-3 rounded-lg hover:bg-blue-50 transition-colors duration-200">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <Search className="w-5 h-5 text-blue-600" />
                    </div>
                    <span className="text-gray-700 font-medium">Browse thousands of services</span>
                  </div>
                  <div className="flex items-center gap-4 p-3 rounded-lg hover:bg-blue-50 transition-colors duration-200">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <Star className="w-5 h-5 text-blue-600" />
                    </div>
                    <span className="text-gray-700 font-medium">Read reviews and ratings</span>
                  </div>
                  <div className="flex items-center gap-4 p-3 rounded-lg hover:bg-blue-50 transition-colors duration-200">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <Clock className="w-5 h-5 text-blue-600" />
                    </div>
                    <span className="text-gray-700 font-medium">Book services instantly</span>
                  </div>
                  <div className="flex items-center gap-4 p-3 rounded-lg hover:bg-blue-50 transition-colors duration-200">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <Shield className="w-5 h-5 text-blue-600" />
                    </div>
                    <span className="text-gray-700 font-medium">Verified and secure providers</span>
                  </div>
                </div>

                {/* Enhanced Action Buttons */}
                <div className="space-y-4">
                  <Link to="/customer/signin" className="block">
                    <Button className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                      Sign In to Find Services
                      <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                    </Button>
                  </Link>
                  <Link to="/get-started" className="block">
                    <Button variant="outline" className="w-full border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white font-semibold py-3 text-lg transition-all duration-300 transform hover:-translate-y-1">
                      Create Customer Account
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Provider Card */}
                         <Card className="group bg-gradient-to-br from-white/95 to-green-50/95 backdrop-blur-sm shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-105 border-l-4 border-l-green-500 hover:border-l-green-400 overflow-hidden card-hover">
              <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <CardHeader className="text-center pb-6 relative">
                <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
                  <Briefcase className="w-10 h-10 text-white" />
                </div>
                <CardTitle className="text-3xl font-bold text-gray-900 mb-3">Provide Services</CardTitle>
                <CardDescription className="text-gray-600 text-lg">
                  Offer your professional services and manage bookings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-8 relative">
                {/* Enhanced Features */}
                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-3 rounded-lg hover:bg-green-50 transition-colors duration-200">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <Briefcase className="w-5 h-5 text-green-600" />
                    </div>
                    <span className="text-gray-700 font-medium">Post your service offerings</span>
                  </div>
                  <div className="flex items-center gap-4 p-3 rounded-lg hover:bg-green-50 transition-colors duration-200">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <Users className="w-5 h-5 text-green-600" />
                    </div>
                    <span className="text-gray-700 font-medium">Manage customer bookings</span>
                  </div>
                  <div className="flex items-center gap-4 p-3 rounded-lg hover:bg-green-50 transition-colors duration-200">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <Clock className="w-5 h-5 text-green-600" />
                    </div>
                    <span className="text-gray-700 font-medium">Set your own schedule</span>
                  </div>
                  <div className="flex items-center gap-4 p-3 rounded-lg hover:bg-green-50 transition-colors duration-200">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <Star className="w-5 h-5 text-green-600" />
                    </div>
                    <span className="text-gray-700 font-medium">Build your reputation</span>
                  </div>
                </div>

                {/* Enhanced Action Buttons */}
                <div className="space-y-4">
                  <Link to="/provider/signin" className="block">
                    <Button className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold py-3 text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                      Sign In to Provide Services
                      <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                    </Button>
                  </Link>
                  <Link to="/get-started" className="block">
                    <Button variant="outline" className="w-full border-2 border-green-600 text-green-600 hover:bg-green-600 hover:text-white font-semibold py-3 text-lg transition-all duration-300 transform hover:-translate-y-1">
                      Create Provider Account
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Enhanced Additional Info */}
          <div className="text-center space-y-6">
                         <div className="bg-gradient-to-r from-white/20 to-white/10 backdrop-blur-sm rounded-2xl p-8 max-w-3xl mx-auto border border-white/20 shadow-2xl animate-slide-up">
              <h3 className="text-2xl font-bold text-white mb-4 flex items-center justify-center gap-3">
                <CheckCircle className="w-6 h-6 text-green-400" />
                Already have an account?
              </h3>
              <p className="text-gray-200 mb-6 text-lg leading-relaxed">
                You can use the same email to access both dashboards based on your account type
              </p>
                               <div className="flex flex-col sm:flex-row gap-4 justify-center">
                   <Link to="/customer/signin">
                     <Button variant="outline" className="group border-2 border-blue-400 text-blue-300 hover:bg-blue-500 hover:text-white hover:border-blue-500 font-semibold px-8 py-4 transition-all duration-500 transform hover:-translate-y-2 hover:shadow-2xl hover:shadow-blue-500/25 text-lg min-w-[200px]">
                       <div className="flex items-center gap-3">
                         <Search className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                         <span>Customer Sign In</span>
                         <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                       </div>
                     </Button>
                   </Link>
                   <Link to="/provider/signin">
                     <Button variant="outline" className="group border-2 border-green-400 text-green-300 hover:bg-green-500 hover:text-white hover:border-green-500 font-semibold px-8 py-4 transition-all duration-500 transform hover:-translate-y-2 hover:shadow-2xl hover:shadow-green-500/25 text-lg min-w-[200px]">
                       <div className="flex items-center gap-3">
                         <Briefcase className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                         <span>Provider Sign In</span>
                         <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                       </div>
                     </Button>
                   </Link>
                 </div>
            </div>

            {/* Enhanced Admin Access */}
            <div className="text-center">
              <Link to="/admin/login" className="inline-flex items-center gap-2 text-gray-300 hover:text-white transition-all duration-300 hover:scale-105 px-4 py-2 rounded-lg hover:bg-white/10">
                <Shield className="w-4 h-4" />
                Admin Portal Access
              </Link>
            </div>
          </div>
        </div>
      </div>


    </div>
  );
};

export default ChooseUserType;
