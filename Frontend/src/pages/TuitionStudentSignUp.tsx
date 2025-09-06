import { Link } from "react-router-dom";

const TuitionStudentSignUp = () => {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Student Sign Up</h1>
          <p className="text-muted-foreground">Join our online tuition platform</p>
        </div>
        
        <div className="bg-card p-6 rounded-lg shadow-lg">
          <p className="text-center text-muted-foreground mb-4">
            Student signup form will be implemented here.
          </p>
          <div className="text-center">
            <Link 
              to="/tuition" 
              className="text-sm text-muted-foreground hover:text-brand-primary"
            >
              ← Back to Online Tuition
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TuitionStudentSignUp;