import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import PageLayout from "@/components/layout/PageLayout";
import AnimatedSection from "@/components/ui/AnimatedSection";
import SectionHeading from "@/components/ui/SectionHeading";
import {
  FileText,
  Calendar,
  ClipboardCheck,
  UserCheck,
  GraduationCap,
  CheckCircle2,
  ArrowRight,
  Loader2,
  LogIn,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { submitAdmission } from "@/lib/firestore";

const steps = [
  {
    icon: FileText,
    title: "Submit Application",
    description: "Complete the online application form with student and parent information.",
  },
  {
    icon: Calendar,
    title: "Schedule Assessment",
    description: "Book an assessment date based on the grade level applied for.",
  },
  {
    icon: ClipboardCheck,
    title: "Complete Assessment",
    description: "Student completes age-appropriate assessment and interview.",
  },
  {
    icon: UserCheck,
    title: "Receive Decision",
    description: "Admission decision communicated within 2 weeks of assessment.",
  },
  {
    icon: GraduationCap,
    title: "Complete Enrollment",
    description: "Submit required documents and complete fee payment to secure admission.",
  },
];

const eligibility = [
  { grade: "Kindergarten", age: "5 years by September 1st" },
  { grade: "Grade 1-5", age: "Age-appropriate placement" },
  { grade: "Grade 6-8", age: "Successful completion of previous grade" },
  { grade: "Grade 9-12", age: "Transcripts and recommendations required" },
];

const importantDates = [
  { date: "January 15", event: "Applications Open" },
  { date: "March 31", event: "Early Application Deadline" },
  { date: "April 15", event: "Assessment Week" },
  { date: "May 15", event: "Regular Application Deadline" },
  { date: "June 1", event: "Enrollment Deadline" },
];

const Admission = () => {
  const { toast } = useToast();
  const { currentUser, userData } = useAuth();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    studentName: "",
    parentName: "",
    email: "",
    phone: "",
    grade: "",
    message: "",
  });
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!formData.studentName.trim()) {
      newErrors.studentName = "Student name is required";
    }
    if (!formData.parentName.trim()) {
      newErrors.parentName = "Parent name is required";
    }
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    }
    if (!formData.grade) {
      newErrors.grade = "Please select a grade";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Check if user is logged in
    if (!currentUser) {
      toast({
        variant: "destructive",
        title: "Login Required",
        description: "Please login to submit an admission application.",
      });
      navigate("/login", { state: { from: { pathname: "/admission" } } });
      return;
    }

    if (!validateForm()) return;

    setSubmitting(true);
    try {
      await submitAdmission({
        ...formData,
        gradeApplyingFor: formData.grade,
        userId: currentUser.uid,
        userEmail: currentUser.email,
      });
      
      toast({
        title: "Application Submitted!",
        description: "Thank you for your interest. We will contact you within 3-5 business days.",
      });
      setFormData({
        studentName: "",
        parentName: "",
        email: "",
        phone: "",
        grade: "",
        message: "",
      });
    } catch (error) {
      console.error("Error submitting admission:", error);
      toast({
        variant: "destructive",
        title: "Submission Failed",
        description: "Failed to submit application. Please try again.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  return (
    <PageLayout>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary to-primary/80 py-16 text-primary-foreground md:py-24">
        <div className="container">
          <AnimatedSection className="mx-auto max-w-3xl text-center">
            <h1 className="mb-6 text-4xl font-bold tracking-tight md:text-5xl">
              Join Our Community
            </h1>
            <p className="text-lg text-primary-foreground/90 md:text-xl">
              Begin your journey at Horizon Academy. We're excited to welcome your family.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Admission Process */}
      <section className="py-16 md:py-24">
        <div className="container">
          <SectionHeading
            title="Admission Process"
            subtitle="Five simple steps to join Horizon Academy"
          />

          <div className="relative mx-auto max-w-4xl">
            {/* Timeline line */}
            <div className="absolute left-4 top-0 h-full w-0.5 bg-border md:left-1/2 md:-translate-x-1/2" />

            {steps.map((step, index) => (
              <AnimatedSection
                key={step.title}
                delay={index * 0.15}
                className={`relative mb-8 flex items-center gap-6 ${
                  index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                }`}
              >
                {/* Step number */}
                <div className="absolute left-0 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground md:left-1/2 md:-translate-x-1/2">
                  {index + 1}
                </div>

                <div className={`ml-12 flex-1 md:ml-0 ${index % 2 === 0 ? "md:pr-12 md:text-right" : "md:pl-12"}`}>
                  <Card className="transition-all duration-300 hover:shadow-lg">
                    <CardContent className="p-6">
                      <div className={`mb-3 flex items-center gap-3 ${index % 2 === 0 ? "md:justify-end" : ""}`}>
                        <step.icon className="h-5 w-5 text-gold" />
                        <h3 className="font-semibold text-foreground">{step.title}</h3>
                      </div>
                      <p className="text-sm text-muted-foreground">{step.description}</p>
                    </CardContent>
                  </Card>
                </div>

                <div className="hidden flex-1 md:block" />
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Eligibility & Dates */}
      <section className="bg-secondary py-16 md:py-24">
        <div className="container">
          <div className="grid gap-12 lg:grid-cols-2">
            {/* Eligibility */}
            <AnimatedSection>
              <h3 className="mb-6 text-2xl font-bold text-foreground">Eligibility Criteria</h3>
              <div className="space-y-3">
                {eligibility.map((item) => (
                  <div key={item.grade} className="flex items-center gap-3 rounded-lg bg-card p-4">
                    <CheckCircle2 className="h-5 w-5 shrink-0 text-accent" />
                    <div>
                      <span className="font-medium text-foreground">{item.grade}</span>
                      <span className="text-muted-foreground"> — {item.age}</span>
                    </div>
                  </div>
                ))}
              </div>
            </AnimatedSection>

            {/* Important Dates */}
            <AnimatedSection delay={0.15}>
              <h3 className="mb-6 text-2xl font-bold text-foreground">Important Dates</h3>
              <div className="space-y-3">
                {importantDates.map((item) => (
                  <div key={item.event} className="flex items-center gap-4 rounded-lg bg-card p-4">
                    <div className="rounded-lg bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground">
                      {item.date}
                    </div>
                    <span className="text-foreground">{item.event}</span>
                  </div>
                ))}
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Enquiry Form */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="mx-auto max-w-2xl">
            <SectionHeading
              title="Admission Enquiry"
              subtitle="Have questions? Fill out the form and we'll get back to you shortly."
            />

            <AnimatedSection>
              <Card>
                <CardContent className="p-6 md:p-8">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid gap-6 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="studentName">Student Name *</Label>
                        <Input
                          id="studentName"
                          value={formData.studentName}
                          onChange={(e) => handleChange("studentName", e.target.value)}
                          className={errors.studentName ? "border-destructive" : ""}
                        />
                        {errors.studentName && (
                          <p className="text-sm text-destructive">{errors.studentName}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="parentName">Parent/Guardian Name *</Label>
                        <Input
                          id="parentName"
                          value={formData.parentName}
                          onChange={(e) => handleChange("parentName", e.target.value)}
                          className={errors.parentName ? "border-destructive" : ""}
                        />
                        {errors.parentName && (
                          <p className="text-sm text-destructive">{errors.parentName}</p>
                        )}
                      </div>
                    </div>

                    <div className="grid gap-6 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address *</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => handleChange("email", e.target.value)}
                          className={errors.email ? "border-destructive" : ""}
                        />
                        {errors.email && (
                          <p className="text-sm text-destructive">{errors.email}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number *</Label>
                        <Input
                          id="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => handleChange("phone", e.target.value)}
                          className={errors.phone ? "border-destructive" : ""}
                        />
                        {errors.phone && (
                          <p className="text-sm text-destructive">{errors.phone}</p>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="grade">Grade Applying For *</Label>
                      <Select value={formData.grade} onValueChange={(value) => handleChange("grade", value)}>
                        <SelectTrigger className={errors.grade ? "border-destructive" : ""}>
                          <SelectValue placeholder="Select a grade" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="kindergarten">Kindergarten</SelectItem>
                          <SelectItem value="grade-1">Grade 1</SelectItem>
                          <SelectItem value="grade-2">Grade 2</SelectItem>
                          <SelectItem value="grade-3">Grade 3</SelectItem>
                          <SelectItem value="grade-4">Grade 4</SelectItem>
                          <SelectItem value="grade-5">Grade 5</SelectItem>
                          <SelectItem value="grade-6">Grade 6</SelectItem>
                          <SelectItem value="grade-7">Grade 7</SelectItem>
                          <SelectItem value="grade-8">Grade 8</SelectItem>
                          <SelectItem value="grade-9">Grade 9</SelectItem>
                          <SelectItem value="grade-10">Grade 10</SelectItem>
                          <SelectItem value="grade-11">Grade 11</SelectItem>
                          <SelectItem value="grade-12">Grade 12</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.grade && (
                        <p className="text-sm text-destructive">{errors.grade}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message">Additional Message (Optional)</Label>
                      <Textarea
                        id="message"
                        placeholder="Tell us more about your child or any questions you have..."
                        value={formData.message}
                        onChange={(e) => handleChange("message", e.target.value)}
                        rows={4}
                      />
                    </div>

                    {!currentUser && (
                      <div className="mb-4 rounded-lg border border-gold/30 bg-gold/5 p-4">
                        <p className="text-sm text-muted-foreground">
                          <LogIn className="mr-2 inline h-4 w-4" />
                          You need to{" "}
                          <Link to="/login" className="font-medium text-primary hover:underline">
                            login
                          </Link>{" "}
                          to submit an admission application.
                        </p>
                      </div>
                    )}
                    <Button 
                      type="submit" 
                      size="lg" 
                      className="w-full bg-gold text-gold-foreground hover:bg-gold/90"
                      disabled={submitting}
                    >
                      {submitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        <>
                          Submit Enquiry
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </AnimatedSection>
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default Admission;
