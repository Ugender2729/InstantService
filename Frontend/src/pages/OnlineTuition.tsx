import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap, BookOpen, Users, Clock, Star, CheckCircle, Video, Globe, Award, Target } from "lucide-react";

const OnlineTuition = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <GraduationCap className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Online Tuition Platform
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            Connect with expert tutors for personalized learning experiences. Whether you're a student seeking help 
            or a qualified teacher wanting to share knowledge, our platform makes education accessible to everyone.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/tuition/student/signup">
              <Button variant="brand" size="lg" className="text-lg px-8 py-3">
                <BookOpen className="w-5 h-5 mr-2" />
                Get Started as Student
              </Button>
            </Link>
            <Link to="/tuition/teacher/signup">
              <Button variant="outline" size="lg" className="text-lg px-8 py-3 border-2">
                <GraduationCap className="w-5 h-5 mr-2" />
                Become a Tutor
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          Why Choose Our Online Tuition Platform?
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card className="text-center p-6 hover:shadow-lg transition-shadow">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Video className="w-8 h-8 text-blue-600" />
            </div>
            <CardTitle className="text-xl mb-2">Live Interactive Sessions</CardTitle>
            <CardDescription>
              Real-time video calls with screen sharing, whiteboard, and chat features for effective learning.
            </CardDescription>
          </Card>

          <Card className="text-center p-6 hover:shadow-lg transition-shadow">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-green-600" />
            </div>
            <CardTitle className="text-xl mb-2">Expert Tutors</CardTitle>
            <CardDescription>
              Verified teachers with proven track records in their subjects and teaching experience.
            </CardDescription>
          </Card>

          <Card className="text-center p-6 hover:shadow-lg transition-shadow">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="w-8 h-8 text-purple-600" />
            </div>
            <CardTitle className="text-xl mb-2">Flexible Scheduling</CardTitle>
            <CardDescription>
              Book sessions at your convenience, 24/7 availability with tutors across time zones.
            </CardDescription>
          </Card>

          <Card className="text-center p-6 hover:shadow-lg transition-shadow">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Star className="w-8 h-8 text-orange-600" />
            </div>
            <CardTitle className="text-xl mb-2">Personalized Learning</CardTitle>
            <CardDescription>
              Customized lesson plans and teaching methods tailored to individual learning styles.
            </CardDescription>
          </Card>

          <Card className="text-center p-6 hover:shadow-lg transition-shadow">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Target className="w-8 h-8 text-red-600" />
            </div>
            <CardTitle className="text-xl mb-2">Progress Tracking</CardTitle>
            <CardDescription>
              Monitor your learning progress with detailed reports and performance analytics.
            </CardDescription>
          </Card>

          <Card className="text-center p-6 hover:shadow-lg transition-shadow">
            <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Globe className="w-8 h-8 text-indigo-600" />
            </div>
            <CardTitle className="text-xl mb-2">Global Access</CardTitle>
            <CardDescription>
              Learn from anywhere in the world with our secure and reliable online platform.
            </CardDescription>
          </Card>
        </div>
      </section>

      {/* Subjects Section */}
      <section className="container mx-auto px-4 py-16 bg-white">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          Popular Subjects We Cover
        </h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 max-w-4xl mx-auto">
          {[
            "Mathematics", "Physics", "Chemistry", "Biology", "English", "Computer Science",
            "History", "Geography", "Economics", "Literature", "Art", "Music"
          ].map((subject) => (
            <div key={subject} className="text-center p-4 bg-gray-50 rounded-lg hover:bg-blue-50 transition-colors">
              <span className="text-sm font-medium text-gray-700">{subject}</span>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          How It Works
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white text-2xl font-bold">
              1
            </div>
            <h3 className="text-xl font-semibold mb-2">Sign Up & Profile</h3>
            <p className="text-gray-600">
              Create your account and complete your profile with your learning needs or teaching expertise.
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white text-2xl font-bold">
              2
            </div>
            <h3 className="text-xl font-semibold mb-2">Find Your Match</h3>
            <p className="text-gray-600">
              Browse tutors or students, read reviews, and choose the perfect match for your learning journey.
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white text-2xl font-bold">
              3
            </div>
            <h3 className="text-xl font-semibold mb-2">Start Learning</h3>
            <p className="text-gray-600">
              Book sessions, attend live classes, and track your progress towards your learning goals.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-3xl mx-auto bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-12 text-white">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Transform Your Learning?
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            Join thousands of students and tutors who are already benefiting from our platform.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/tuition/student/signup">
              <Button variant="secondary" size="lg" className="text-lg px-8 py-3">
                <BookOpen className="w-5 h-5 mr-2" />
                Start Learning Today
              </Button>
            </Link>
            <Link to="/tuition/teacher/signup">
              <Button variant="outline" size="lg" className="text-lg px-8 py-3 border-white text-white hover:bg-white hover:text-blue-600">
                <GraduationCap className="w-5 h-5 mr-2" />
                Start Teaching Today
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default OnlineTuition;


