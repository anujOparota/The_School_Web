import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import AnimatedSection from "@/components/ui/AnimatedSection";
import { BookOpen, Users, Award, Palette, Trophy, Globe } from "lucide-react";

const features = [
  {
    icon: BookOpen,
    title: "Academic Excellence",
    description: "Rigorous curriculum aligned with national standards and college preparation.",
  },
  {
    icon: Users,
    title: "Expert Faculty",
    description: "Highly qualified teachers dedicated to personalized student success.",
  },
  {
    icon: Award,
    title: "STEM Programs",
    description: "Cutting-edge science, technology, engineering, and math education.",
  },
  {
    icon: Palette,
    title: "Arts & Culture",
    description: "Vibrant programs in visual arts, music, drama, and creative expression.",
  },
  {
    icon: Trophy,
    title: "Athletics",
    description: "Comprehensive sports programs fostering teamwork and physical fitness.",
  },
  {
    icon: Globe,
    title: "Global Perspective",
    description: "Language programs and international exchange opportunities.",
  },
];

const FeaturesSection = () => {
  return (
    <section className="py-16 md:py-24">
      <div className="container">
        <AnimatedSection className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Why Choose Sec. NKSS?
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Discover what makes our school a leader in K-12 education
          </p>
        </AnimatedSection>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <AnimatedSection key={feature.title} delay={index * 0.1}>
              <Card className="group h-full transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                <CardContent className="flex flex-col items-center p-6 text-center">
                  <div className="mb-4 rounded-xl bg-primary/10 p-3 transition-colors group-hover:bg-primary">
                    <feature.icon className="h-6 w-6 text-primary group-hover:text-primary-foreground" />
                  </div>
                  <h3 className="mb-2 text-lg font-semibold text-foreground">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            </AnimatedSection>
          ))}
        </div>

        <AnimatedSection delay={0.5} className="mt-12 text-center">
          <Button asChild size="lg" variant="outline">
            <Link to="/academics">
              Explore All Programs
            </Link>
          </Button>
        </AnimatedSection>
      </div>
    </section>
  );
};

export default FeaturesSection;
