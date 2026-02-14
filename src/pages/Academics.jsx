import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import PageLayout from "@/components/layout/PageLayout";
import AnimatedSection from "@/components/ui/AnimatedSection";
import SectionHeading from "@/components/ui/SectionHeading";
import {
  BookOpen,
  Atom,
  Palette,
  Trophy,
  Languages,
  Calculator,
  Microscope,
  Globe,
  Music,
  Monitor,
  FileText,
  Calendar,
  Download,
} from "lucide-react";

const gradeLevels = [
  {
    level: "Elementary School",
    grades: "K-5",
    description: "Building strong foundations in literacy, numeracy, and social skills through engaging, hands-on learning.",
    color: "bg-accent",
  },
  {
    level: "Middle School",
    grades: "6-8",
    description: "Developing critical thinking and preparing students for high school with rigorous academics and exploration.",
    color: "bg-gold",
  },
  {
    level: "High School",
    grades: "9-12",
    description: "College-preparatory curriculum with Advanced Placement courses and career readiness programs.",
    color: "bg-primary",
  },
];

const programs = [
  {
    icon: Atom,
    title: "STEM Excellence",
    description: "Robotics, coding, advanced mathematics, and scientific research opportunities.",
  },
  {
    icon: Palette,
    title: "Visual & Performing Arts",
    description: "Studio art, drama, dance, and digital media programs to nurture creativity.",
  },
  {
    icon: Trophy,
    title: "Athletics Program",
    description: "Competitive sports teams, physical education, and wellness programs.",
  },
  {
    icon: Languages,
    title: "World Languages",
    description: "Spanish, French, Mandarin, and Latin courses from elementary through high school.",
  },
];

const subjects = [
  { icon: BookOpen, name: "English Language Arts" },
  { icon: Calculator, name: "Mathematics" },
  { icon: Microscope, name: "Sciences" },
  { icon: Globe, name: "Social Studies" },
  { icon: Music, name: "Music & Arts" },
  { icon: Monitor, name: "Computer Science" },
];

const resources = [
  {
    title: "Academic Calendar 2024-25",
    description: "Important dates, holidays, and school events",
    icon: Calendar,
  },
  {
    title: "Curriculum Guide",
    description: "Detailed course descriptions for all grade levels",
    icon: FileText,
  },
];

const Academics = () => {
  return (
    <PageLayout>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary to-primary/80 py-16 text-primary-foreground md:py-24">
        <div className="container">
          <AnimatedSection className="mx-auto max-w-3xl text-center">
            <h1 className="mb-6 text-4xl font-bold tracking-tight md:text-5xl">
              Academic Excellence
            </h1>
            <p className="text-lg text-primary-foreground/90 md:text-xl">
              Our comprehensive K-12 curriculum prepares students for success in college, 
              career, and life through rigorous academics and innovative programs.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Grade Levels */}
      <section className="py-16 md:py-24">
        <div className="container">
          <SectionHeading
            title="Grade Levels"
            subtitle="Age-appropriate education designed to meet students where they are"
          />

          <div className="grid gap-8 md:grid-cols-3">
            {gradeLevels.map((level, index) => (
              <AnimatedSection key={level.level} delay={index * 0.15}>
                <Card className="group h-full overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                  <div className={`h-2 ${level.color}`} />
                  <CardContent className="p-6">
                    <div className="mb-4">
                      <p className="text-sm font-medium text-gold">Grades {level.grades}</p>
                      <h3 className="text-xl font-bold text-foreground">{level.level}</h3>
                    </div>
                    <p className="text-muted-foreground">{level.description}</p>
                  </CardContent>
                </Card>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Special Programs */}
      <section className="bg-secondary py-16 md:py-24">
        <div className="container">
          <SectionHeading
            title="Special Programs"
            subtitle="Enrichment opportunities that go beyond traditional academics"
          />

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {programs.map((program, index) => (
              <AnimatedSection key={program.title} delay={index * 0.1}>
                <Card className="group h-full transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                  <CardContent className="flex flex-col items-center p-6 text-center">
                    <div className="mb-4 rounded-xl bg-primary/10 p-4 transition-colors group-hover:bg-primary">
                      <program.icon className="h-8 w-8 text-primary group-hover:text-primary-foreground" />
                    </div>
                    <h3 className="mb-2 text-lg font-semibold text-foreground">{program.title}</h3>
                    <p className="text-sm text-muted-foreground">{program.description}</p>
                  </CardContent>
                </Card>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Subject Departments */}
      <section className="py-16 md:py-24">
        <div className="container">
          <SectionHeading
            title="Academic Departments"
            subtitle="Core subjects taught by expert educators"
          />

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {subjects.map((subject, index) => (
              <AnimatedSection key={subject.name} delay={index * 0.05}>
                <div className="flex flex-col items-center rounded-xl border border-border bg-card p-4 text-center transition-all duration-300 hover:border-primary/50 hover:shadow-md">
                  <subject.icon className="mb-2 h-8 w-8 text-primary" />
                  <span className="text-sm font-medium text-foreground">{subject.name}</span>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Downloadable Resources */}
      <section className="bg-secondary py-16 md:py-24">
        <div className="container">
          <SectionHeading
            title="Resources"
            subtitle="Download helpful documents for students and parents"
          />

          <div className="mx-auto grid max-w-2xl gap-6 sm:grid-cols-2">
            {resources.map((resource, index) => (
              <AnimatedSection key={resource.title} delay={index * 0.15}>
                <Card className="group transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                  <CardContent className="flex items-center gap-4 p-6">
                    <div className="rounded-lg bg-primary/10 p-3">
                      <resource.icon className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground">{resource.title}</h3>
                      <p className="text-sm text-muted-foreground">{resource.description}</p>
                    </div>
                    <Button variant="ghost" size="icon">
                      <Download className="h-5 w-5" />
                    </Button>
                  </CardContent>
                </Card>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default Academics;
