import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import PageLayout from "@/components/layout/PageLayout";
import AnimatedSection from "@/components/ui/AnimatedSection";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { 
  GraduationCap, 
  UserCircle, 
  Users, 
  LogIn,
  UserPlus,
  Loader2,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle2
} from "lucide-react";

const Login = () => {
  const [mode, setMode] = useState("login"); // "login", "register-student", "register-parent"
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Login form
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });
  
  // Student registration form
  const [studentData, setStudentData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    parentName: "",
    phone: "",
    grade: "",
  });
  
  // Parent registration form
  const [parentData, setParentData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    childName: "",
    childEmail: "",
  });
  
  const [errors, setErrors] = useState({});
  const [registrationResult, setRegistrationResult] = useState(null);

  const { login, registerStudent, registerParent } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/";

  const validateLogin = () => {
    const newErrors = {};
    if (!loginData.email.trim()) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(loginData.email)) newErrors.email = "Invalid email";
    if (!loginData.password) newErrors.password = "Password is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStudentRegistration = () => {
    const newErrors = {};
    if (!studentData.name.trim()) newErrors.name = "Name is required";
    if (!studentData.email.trim()) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(studentData.email)) newErrors.email = "Invalid email";
    if (!studentData.password) newErrors.password = "Password is required";
    else if (studentData.password.length < 6) newErrors.password = "Password must be at least 6 characters";
    if (studentData.password !== studentData.confirmPassword) newErrors.confirmPassword = "Passwords do not match";
    if (!studentData.parentName.trim()) newErrors.parentName = "Parent name is required";
    if (!studentData.phone.trim()) newErrors.phone = "Phone is required";
    if (!studentData.grade) newErrors.grade = "Grade is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateParentRegistration = () => {
    const newErrors = {};
    if (!parentData.name.trim()) newErrors.name = "Name is required";
    if (!parentData.email.trim()) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(parentData.email)) newErrors.email = "Invalid email";
    if (!parentData.password) newErrors.password = "Password is required";
    else if (parentData.password.length < 6) newErrors.password = "Password must be at least 6 characters";
    if (parentData.password !== parentData.confirmPassword) newErrors.confirmPassword = "Passwords do not match";
    if (!parentData.childName.trim()) newErrors.childName = "Child's name is required";
    if (!parentData.childEmail.trim()) newErrors.childEmail = "Child's email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(parentData.childEmail)) newErrors.childEmail = "Invalid email";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!validateLogin()) return;

    setLoading(true);
    try {
      await login(loginData.email, loginData.password);
      toast({
        title: "Welcome back!",
        description: "You have successfully logged in.",
      });
      setTimeout(() => {
        navigate(from !== "/login" ? from : "/dashboard");
      }, 500);
    } catch (error) {
      console.error("Login error:", error);
      let errorMessage = "An error occurred. Please try again.";
      if (error.code === "auth/user-not-found" || error.code === "auth/wrong-password" || error.code === "auth/invalid-credential") {
        errorMessage = "Invalid email or password.";
      }
      toast({
        variant: "destructive",
        title: "Login Failed",
        description: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleStudentRegistration = async (e) => {
    e.preventDefault();
    if (!validateStudentRegistration()) return;

    setLoading(true);
    try {
      const result = await registerStudent(
        studentData.email, 
        studentData.password, 
        studentData.name,
        {
          studentName: studentData.name,
          parentName: studentData.parentName,
          email: studentData.email,
          phone: studentData.phone,
          gradeApplyingFor: studentData.grade,
        }
      );
      
      setRegistrationResult({
        type: "student",
        success: true,
        message: "Your application has been submitted! Please wait for admin approval.",
      });
      
      toast({
        title: "Application Submitted!",
        description: "Your admission application is pending review.",
      });
    } catch (error) {
      console.error("Registration error:", error);
      let errorMessage = "Registration failed. Please try again.";
      if (error.code === "auth/email-already-in-use") {
        errorMessage = "This email is already registered.";
      }
      toast({
        variant: "destructive",
        title: "Registration Failed",
        description: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleParentRegistration = async (e) => {
    e.preventDefault();
    if (!validateParentRegistration()) return;

    setLoading(true);
    try {
      const result = await registerParent(
        parentData.email,
        parentData.password,
        parentData.name,
        parentData.childName,
        parentData.childEmail
      );
      
      if (result.linked) {
        setRegistrationResult({
          type: "parent",
          success: true,
          linked: true,
          message: `Successfully linked to ${result.studentName}! Redirecting to dashboard...`,
        });
        toast({
          title: "Account Created & Linked!",
          description: `You've been automatically linked to ${result.studentName}.`,
        });
        setTimeout(() => navigate("/parent"), 2000);
      } else {
        setRegistrationResult({
          type: "parent",
          success: true,
          linked: false,
          message: "We couldn't verify the linked student. Your account is pending admin verification.",
        });
        toast({
          title: "Account Created",
          description: "Your account is pending admin verification for student linking.",
        });
      }
    } catch (error) {
      console.error("Registration error:", error);
      let errorMessage = "Registration failed. Please try again.";
      if (error.code === "auth/email-already-in-use") {
        errorMessage = "This email is already registered.";
      }
      toast({
        variant: "destructive",
        title: "Registration Failed",
        description: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  const resetForms = () => {
    setErrors({});
    setRegistrationResult(null);
    setLoginData({ email: "", password: "" });
    setStudentData({ name: "", email: "", password: "", confirmPassword: "", parentName: "", phone: "", grade: "" });
    setParentData({ name: "", email: "", password: "", confirmPassword: "", childName: "", childEmail: "" });
  };

  const switchMode = (newMode) => {
    setMode(newMode);
    resetForms();
  };

  // Registration success screen
  if (registrationResult?.success) {
    return (
      <PageLayout>
        <section className="bg-gradient-to-br from-primary to-primary/80 py-16 text-primary-foreground md:py-24">
          <div className="container">
            <AnimatedSection className="mx-auto max-w-3xl text-center">
              <h1 className="mb-4 text-4xl font-bold tracking-tight md:text-5xl">
                Registration Complete
              </h1>
            </AnimatedSection>
          </div>
        </section>

        <section className="py-12 md:py-16">
          <div className="container">
            <AnimatedSection className="mx-auto max-w-md">
              <Card>
                <CardContent className="p-8 text-center">
                  {registrationResult.linked ? (
                    <CheckCircle2 className="mx-auto h-16 w-16 text-accent" />
                  ) : (
                    <AlertCircle className="mx-auto h-16 w-16 text-gold" />
                  )}
                  <h2 className="mt-4 text-xl font-semibold">
                    {registrationResult.linked ? "Successfully Linked!" : "Pending Verification"}
                  </h2>
                  <p className="mt-2 text-muted-foreground">
                    {registrationResult.message}
                  </p>
                  <div className="mt-6 space-y-3">
                    <Button onClick={() => navigate("/")} variant="outline" className="w-full">
                      Back to Home
                    </Button>
                    {!registrationResult.linked && (
                      <Button onClick={() => switchMode("login")} className="w-full">
                        Go to Login
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </AnimatedSection>
          </div>
        </section>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <section className="bg-gradient-to-br from-primary to-primary/80 py-16 text-primary-foreground md:py-24">
        <div className="container">
          <AnimatedSection className="mx-auto max-w-3xl text-center">
            <h1 className="mb-4 text-4xl font-bold tracking-tight md:text-5xl">
              {mode === "login" ? "Welcome Back" : mode === "register-student" ? "Student Application" : "Parent Registration"}
            </h1>
            <p className="text-lg text-primary-foreground/90">
              {mode === "login" 
                ? "Sign in to access your dashboard and resources." 
                : mode === "register-student"
                ? "Apply for admission to Horizon Academy."
                : "Register as a parent to view your child's progress."
              }
            </p>
          </AnimatedSection>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="container">
          <AnimatedSection className="mx-auto max-w-md">
            <Card>
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                  {mode === "login" ? (
                    <UserCircle className="h-8 w-8 text-primary" />
                  ) : mode === "register-student" ? (
                    <GraduationCap className="h-8 w-8 text-primary" />
                  ) : (
                    <Users className="h-8 w-8 text-primary" />
                  )}
                </div>
                <CardTitle className="text-2xl">
                  {mode === "login" ? "Sign In" : mode === "register-student" ? "Apply as Student" : "Register as Parent"}
                </CardTitle>
                <CardDescription>
                  {mode === "login" 
                    ? "Enter your credentials to access your account" 
                    : mode === "register-student"
                    ? "Fill in your details to submit an application"
                    : "Link your account to your child's profile"
                  }
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* LOGIN FORM */}
                {mode === "login" && (
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter your email"
                        value={loginData.email}
                        onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                        className={errors.email ? "border-destructive" : ""}
                        disabled={loading}
                      />
                      {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="password">Password *</Label>
                      <div className="relative">
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter your password"
                          value={loginData.password}
                          onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                          className={errors.password ? "border-destructive pr-10" : "pr-10"}
                          disabled={loading}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                      {errors.password && <p className="text-sm text-destructive">{errors.password}</p>}
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full bg-gold text-gold-foreground hover:bg-gold/90"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Signing In...
                        </>
                      ) : (
                        <>
                          <LogIn className="mr-2 h-4 w-4" />
                          Sign In
                        </>
                      )}
                    </Button>
                  </form>
                )}

                {/* STUDENT REGISTRATION FORM */}
                {mode === "register-student" && (
                  <form onSubmit={handleStudentRegistration} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Student Full Name *</Label>
                      <Input
                        id="name"
                        placeholder="Enter student's full name"
                        value={studentData.name}
                        onChange={(e) => setStudentData({ ...studentData, name: e.target.value })}
                        className={errors.name ? "border-destructive" : ""}
                        disabled={loading}
                      />
                      {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter email"
                        value={studentData.email}
                        onChange={(e) => setStudentData({ ...studentData, email: e.target.value })}
                        className={errors.email ? "border-destructive" : ""}
                        disabled={loading}
                      />
                      {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="password">Password *</Label>
                        <Input
                          id="password"
                          type="password"
                          placeholder="Create password"
                          value={studentData.password}
                          onChange={(e) => setStudentData({ ...studentData, password: e.target.value })}
                          className={errors.password ? "border-destructive" : ""}
                          disabled={loading}
                        />
                        {errors.password && <p className="text-sm text-destructive">{errors.password}</p>}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Confirm Password *</Label>
                        <Input
                          id="confirmPassword"
                          type="password"
                          placeholder="Confirm password"
                          value={studentData.confirmPassword}
                          onChange={(e) => setStudentData({ ...studentData, confirmPassword: e.target.value })}
                          className={errors.confirmPassword ? "border-destructive" : ""}
                          disabled={loading}
                        />
                        {errors.confirmPassword && <p className="text-sm text-destructive">{errors.confirmPassword}</p>}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="parentName">Parent/Guardian Name *</Label>
                      <Input
                        id="parentName"
                        placeholder="Enter parent's name"
                        value={studentData.parentName}
                        onChange={(e) => setStudentData({ ...studentData, parentName: e.target.value })}
                        className={errors.parentName ? "border-destructive" : ""}
                        disabled={loading}
                      />
                      {errors.parentName && <p className="text-sm text-destructive">{errors.parentName}</p>}
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number *</Label>
                        <Input
                          id="phone"
                          type="tel"
                          placeholder="Enter phone"
                          value={studentData.phone}
                          onChange={(e) => setStudentData({ ...studentData, phone: e.target.value })}
                          className={errors.phone ? "border-destructive" : ""}
                          disabled={loading}
                        />
                        {errors.phone && <p className="text-sm text-destructive">{errors.phone}</p>}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="grade">Grade Applying For *</Label>
                        <select
                          id="grade"
                          value={studentData.grade}
                          onChange={(e) => setStudentData({ ...studentData, grade: e.target.value })}
                          className={`flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${errors.grade ? "border-destructive" : "border-input"}`}
                          disabled={loading}
                        >
                          <option value="">Select grade</option>
                          <option value="kindergarten">Kindergarten</option>
                          {[1,2,3,4,5,6,7,8,9,10,11,12].map(g => (
                            <option key={g} value={`grade-${g}`}>Grade {g}</option>
                          ))}
                        </select>
                        {errors.grade && <p className="text-sm text-destructive">{errors.grade}</p>}
                      </div>
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full bg-gold text-gold-foreground hover:bg-gold/90"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Submitting Application...
                        </>
                      ) : (
                        <>
                          <UserPlus className="mr-2 h-4 w-4" />
                          Submit Application
                        </>
                      )}
                    </Button>
                  </form>
                )}

                {/* PARENT REGISTRATION FORM */}
                {mode === "register-parent" && (
                  <form onSubmit={handleParentRegistration} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Your Full Name *</Label>
                      <Input
                        id="name"
                        placeholder="Enter your full name"
                        value={parentData.name}
                        onChange={(e) => setParentData({ ...parentData, name: e.target.value })}
                        className={errors.name ? "border-destructive" : ""}
                        disabled={loading}
                      />
                      {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Your Email Address *</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter your email"
                        value={parentData.email}
                        onChange={(e) => setParentData({ ...parentData, email: e.target.value })}
                        className={errors.email ? "border-destructive" : ""}
                        disabled={loading}
                      />
                      {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="password">Password *</Label>
                        <Input
                          id="password"
                          type="password"
                          placeholder="Create password"
                          value={parentData.password}
                          onChange={(e) => setParentData({ ...parentData, password: e.target.value })}
                          className={errors.password ? "border-destructive" : ""}
                          disabled={loading}
                        />
                        {errors.password && <p className="text-sm text-destructive">{errors.password}</p>}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Confirm Password *</Label>
                        <Input
                          id="confirmPassword"
                          type="password"
                          placeholder="Confirm password"
                          value={parentData.confirmPassword}
                          onChange={(e) => setParentData({ ...parentData, confirmPassword: e.target.value })}
                          className={errors.confirmPassword ? "border-destructive" : ""}
                          disabled={loading}
                        />
                        {errors.confirmPassword && <p className="text-sm text-destructive">{errors.confirmPassword}</p>}
                      </div>
                    </div>

                    <div className="rounded-lg border border-gold/30 bg-gold/5 p-4">
                      <p className="mb-3 text-sm font-medium">Link to Your Child's Account</p>
                      <p className="mb-4 text-xs text-muted-foreground">
                        Enter your child's name and email exactly as used in their application. 
                        If we find a match, you'll be automatically linked.
                      </p>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="childName">Child's Full Name *</Label>
                          <Input
                            id="childName"
                            placeholder="Enter child's full name"
                            value={parentData.childName}
                            onChange={(e) => setParentData({ ...parentData, childName: e.target.value })}
                            className={errors.childName ? "border-destructive" : ""}
                            disabled={loading}
                          />
                          {errors.childName && <p className="text-sm text-destructive">{errors.childName}</p>}
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="childEmail">Child's Application Email *</Label>
                          <Input
                            id="childEmail"
                            type="email"
                            placeholder="Enter child's application email"
                            value={parentData.childEmail}
                            onChange={(e) => setParentData({ ...parentData, childEmail: e.target.value })}
                            className={errors.childEmail ? "border-destructive" : ""}
                            disabled={loading}
                          />
                          {errors.childEmail && <p className="text-sm text-destructive">{errors.childEmail}</p>}
                        </div>
                      </div>
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full bg-gold text-gold-foreground hover:bg-gold/90"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Creating Account...
                        </>
                      ) : (
                        <>
                          <UserPlus className="mr-2 h-4 w-4" />
                          Create Parent Account
                        </>
                      )}
                    </Button>
                  </form>
                )}

                {/* Mode switchers */}
                <div className="mt-6 space-y-4">
                  {mode === "login" && (
                    <>
                      <div className="text-center">
                        <p className="text-sm text-muted-foreground">Don't have an account?</p>
                      </div>
                      <div className="grid gap-2 sm:grid-cols-2">
                        <Button
                          variant="outline"
                          onClick={() => switchMode("register-student")}
                          disabled={loading}
                          className="w-full"
                        >
                          <GraduationCap className="mr-2 h-4 w-4" />
                          Apply as Student
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => switchMode("register-parent")}
                          disabled={loading}
                          className="w-full"
                        >
                          <Users className="mr-2 h-4 w-4" />
                          Register as Parent
                        </Button>
                      </div>
                    </>
                  )}

                  {mode !== "login" && (
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground">
                        Already have an account?{" "}
                        <button
                          type="button"
                          onClick={() => switchMode("login")}
                          className="font-medium text-primary hover:underline"
                          disabled={loading}
                        >
                          Sign in here
                        </button>
                      </p>
                      {mode === "register-student" && (
                        <p className="mt-2 text-sm text-muted-foreground">
                          Are you a parent?{" "}
                          <button
                            type="button"
                            onClick={() => switchMode("register-parent")}
                            className="font-medium text-primary hover:underline"
                            disabled={loading}
                          >
                            Register as parent
                          </button>
                        </p>
                      )}
                      {mode === "register-parent" && (
                        <p className="mt-2 text-sm text-muted-foreground">
                          Want to apply as student?{" "}
                          <button
                            type="button"
                            onClick={() => switchMode("register-student")}
                            className="font-medium text-primary hover:underline"
                            disabled={loading}
                          >
                            Apply as student
                          </button>
                        </p>
                      )}
                    </div>
                  )}
                </div>

                <div className="mt-4 text-center">
                  <Link 
                    to="/" 
                    className="text-sm text-muted-foreground hover:text-primary"
                  >
                    ← Back to Home
                  </Link>
                </div>
              </CardContent>
            </Card>
          </AnimatedSection>
        </div>
      </section>
    </PageLayout>
  );
};

export default Login;
