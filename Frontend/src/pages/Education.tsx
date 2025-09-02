import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  GraduationCap, 
  BookOpen, 
  Users, 
  Star, 
  Clock, 
  MapPin, 
  Phone, 
  Mail, 
  ArrowLeft,
  Search,
  Filter,
  Calendar,
  CheckCircle,
  Award,
  Brain
} from "lucide-react";
import { Link } from "react-router-dom";
import { useUser } from "@/contexts/UserContext";

interface Teacher {
  id: string;
  name: string;
  qualification: string;
  subjects: string[];
  experience: number;
  rating: number;
  hourlyRate: number;
  availability: string[];
  image: string;
  bio: string;
  specializations: string[];
  achievements: string[];
}

const Education = () => {
  const { user } = useUser();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedGrade, setSelectedGrade] = useState('');

  // Mock data for highly qualified teachers
  const teachers: Teacher[] = [
    {
      id: "1",
      name: "Dr. Priya Sharma",
      qualification: "IIT Delhi - Computer Science, PhD",
      subjects: ["Mathematics", "Computer Science", "Physics"],
      experience: 8,
      rating: 4.9,
      hourlyRate: 1200,
      availability: ["Mon", "Wed", "Fri", "Sat"],
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop",
      bio: "Expert in IIT-JEE preparation with 8+ years of experience. Specialized in Mathematics and Computer Science.",
      specializations: ["IIT-JEE", "NEET", "Class 11-12", "Competitive Exams"],
      achievements: ["100+ IIT selections", "Best Teacher Award 2023", "Published 15+ research papers"]
    },
    {
      id: "2",
      name: "Prof. Rajesh Kumar",
      qualification: "NIT Surathkal - Mechanical Engineering, MTech",
      subjects: ["Physics", "Chemistry", "Mathematics"],
      experience: 12,
      rating: 4.8,
      hourlyRate: 1000,
      availability: ["Tue", "Thu", "Sat", "Sun"],
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
      bio: "Specialized in Physics and Chemistry for competitive exams. Expert in NEET and JEE preparation.",
      specializations: ["NEET", "JEE Main", "Class 9-12", "Foundation Courses"],
      achievements: ["200+ NEET selections", "Author of Physics textbooks", "National Teacher Award"]
    },
    {
      id: "3",
      name: "Ms. Anjali Patel",
      qualification: "Delhi University - Mathematics, MSc",
      subjects: ["Mathematics", "English", "Science"],
      experience: 6,
      rating: 4.7,
      hourlyRate: 800,
      availability: ["Mon", "Tue", "Wed", "Thu", "Fri"],
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop",
      bio: "Specialized in primary and middle school education. Makes learning fun and engaging for young students.",
      specializations: ["Primary Classes (1-5)", "Middle School (6-8)", "Foundation Mathematics"],
      achievements: ["Best Primary Teacher 2022", "100% student improvement", "Parent Choice Award"]
    },
    {
      id: "4",
      name: "Dr. Amit Singh",
      qualification: "IIT Bombay - Physics, PhD",
      subjects: ["Physics", "Mathematics", "Chemistry"],
      experience: 15,
      rating: 4.9,
      hourlyRate: 1500,
      availability: ["Wed", "Fri", "Sat"],
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop",
      bio: "Senior Physics professor with expertise in advanced concepts. Perfect for IIT-JEE Advanced preparation.",
      specializations: ["IIT-JEE Advanced", "Olympiads", "Research Projects", "Class 11-12"],
      achievements: ["50+ Olympiad winners", "Research grants worth 2Cr+", "International recognition"]
    }
  ];

  const subjects = ["All Subjects", "Mathematics", "Physics", "Chemistry", "Biology", "English", "Computer Science"];
  const grades = ["All Grades", "Primary (1-5)", "Middle (6-8)", "High School (9-12)", "IIT-JEE", "NEET", "Competitive"];

  const filteredTeachers = teachers.filter(teacher => {
    const matchesSearch = teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         teacher.qualification.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         teacher.subjects.some(subject => subject.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesSubject = !selectedSubject || selectedSubject === "All Subjects" || 
                          teacher.subjects.includes(selectedSubject);
    
    const matchesGrade = !selectedGrade || selectedGrade === "All Grades" ||
                        teacher.specializations.some(spec => spec.includes(selectedGrade.split(' ')[0]));
    
    return matchesSearch && matchesSubject && matchesGrade;
  });

  const handleBookClass = (teacher: Teacher) => {
    if (!user) {
      // Redirect to sign in
      window.location.href = '/customer/signin';
      return;
    }
    // TODO: Implement booking logic
    console.log(`Booking class with ${teacher.name}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2 text-blue-600 hover:text-blue-700">
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Home</span>
            </Link>
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-900">Online Tuition Services</h1>
              <p className="text-gray-600">Learn from IITians, NITians & Expert Teachers</p>
            </div>
            <div className="w-24"></div> {/* Spacer for centering */}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full mb-4">
            <GraduationCap className="w-5 h-5" />
            <span className="font-medium">Highly Qualified Teachers</span>
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Learn from the <span className="text-blue-600">Best</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Get personalized online tuition from verified IITians, NITians, and expert teachers. 
            Specialized in primary classes, competitive exams, and advanced studies.
          </p>
          
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="text-3xl font-bold text-blue-600 mb-2">100+</div>
              <div className="text-gray-600">Expert Teachers</div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="text-3xl font-bold text-green-600 mb-2">1000+</div>
              <div className="text-gray-600">Students Taught</div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="text-3xl font-bold text-purple-600 mb-2">4.8★</div>
              <div className="text-gray-600">Average Rating</div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="text-3xl font-bold text-orange-600 mb-2">95%</div>
              <div className="text-gray-600">Success Rate</div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white p-6 rounded-xl shadow-sm mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search teachers, subjects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedSubject} onValueChange={setSelectedSubject}>
              <SelectTrigger>
                <SelectValue placeholder="Select Subject" />
              </SelectTrigger>
              <SelectContent>
                {subjects.map((subject) => (
                  <SelectItem key={subject} value={subject}>
                    {subject}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedGrade} onValueChange={setSelectedGrade}>
              <SelectTrigger>
                <SelectValue placeholder="Select Grade" />
              </SelectTrigger>
              <SelectContent>
                {grades.map((grade) => (
                  <SelectItem key={grade} value={grade}>
                    {grade}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button onClick={() => { setSearchTerm(''); setSelectedSubject(''); setSelectedGrade(''); }}>
              Clear Filters
            </Button>
          </div>
        </div>

        {/* Teachers Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {filteredTeachers.map((teacher) => (
            <Card key={teacher.id} className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="pb-4">
                <div className="flex items-start gap-4">
                  <img
                    src={teacher.image}
                    alt={teacher.name}
                    className="w-20 h-20 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <CardTitle className="text-xl mb-2">{teacher.name}</CardTitle>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                        {teacher.qualification.split(' - ')[0]}
                      </Badge>
                      <Badge variant="outline">
                        {teacher.experience}+ years
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      <span className="text-sm font-medium">{teacher.rating}</span>
                      <span className="text-gray-500">({Math.floor(Math.random() * 200) + 50} reviews)</span>
                    </div>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Subjects & Specializations</h4>
                  <div className="flex flex-wrap gap-2">
                    {teacher.subjects.map((subject) => (
                      <Badge key={subject} variant="outline" className="text-sm">
                        {subject}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Specializations</h4>
                  <div className="flex flex-wrap gap-2">
                    {teacher.specializations.map((spec) => (
                      <Badge key={spec} variant="secondary" className="text-sm bg-green-100 text-green-800">
                        {spec}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Key Achievements</h4>
                  <div className="space-y-1">
                    {teacher.achievements.slice(0, 2).map((achievement, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm text-gray-600">
                        <Award className="w-4 h-4 text-yellow-500" />
                        {achievement}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="text-2xl font-bold text-blue-600">
                    ₹{teacher.hourlyRate}/hr
                  </div>
                  <Button 
                    onClick={() => handleBookClass(teacher)}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    Book Class
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredTeachers.length === 0 && (
          <div className="text-center py-12">
            <Search className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <h3 className="text-xl font-medium mb-2">No teachers found</h3>
            <p className="text-gray-600">Try adjusting your search criteria</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Education;
