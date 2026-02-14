import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import PageLayout from "@/components/layout/PageLayout";
import AnimatedSection from "@/components/ui/AnimatedSection";
import SectionHeading from "@/components/ui/SectionHeading";
import {
  Calendar,
  BookOpen,
  Bell,
  Download,
  Users,
  Music,
  Trophy,
  Palette,
  Microscope,
  Globe,
  Camera,
} from "lucide-react";

const resources = [
  {
    icon: Calendar,
    title: "Class Timetable",
    description: "View your daily class schedule and room assignments",
    action: "View Schedule",
  },
  {
    icon: BookOpen,
    title: "Student Handbook",
    description: "Guidelines, policies, and important information",
    action: "Download PDF",
  },
  {
    icon: Bell,
    title: "Notices & Announcements",
    description: "Stay updated with the latest school news",
    action: "View All",
  },
];

const clubs = [
  { icon: Microscope, name: "Science Club", members: 45 },
  { icon: Music, name: "Music & Band", members: 38 },
  { icon: Palette, name: "Art Society", members: 32 },
  { icon: Globe, name: "Model UN", members: 28 },
  { icon: Trophy, name: "Sports Teams", members: 120 },
  { icon: Users, name: "Student Council", members: 15 },
];

const events = [
  {
    date: "Mar 15",
    title: "Spring Science Fair",
    description: "Annual showcase of student science projects",
  },
  {
    date: "Mar 22",
    title: "Music Concert",
    description: "Spring music performance by school bands and choirs",
  },
  {
    date: "Apr 5",
    title: "Sports Day",
    description: "Inter-house athletic competitions",
  },
  {
    date: "Apr 18",
    title: "Art Exhibition",
    description: "Student artwork display in the main gallery",
  },
];

const galleryImages = [
  "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=600&q=80",
  "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=600&q=80",
  "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=600&q=80",
  "https://images.unsplash.com/photo-1571260899304-425eee4c7efc?w=600&q=80",
  "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=600&q=80",
  "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600&q=80",
];

const Students = () => {
  return (
    <PageLayout>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary to-primary/80 py-16 text-primary-foreground md:py-24">
        <div className="container">
          <AnimatedSection className="mx-auto max-w-3xl text-center">
            <h1 className="mb-6 text-4xl font-bold tracking-tight md:text-5xl">
              Student Life
            </h1>
            <p className="text-lg text-primary-foreground/90 md:text-xl">
              Resources, activities, and everything you need for a successful school year
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Quick Resources */}
      <section className="py-16 md:py-24">
        <div className="container">
          <SectionHeading
            title="Student Resources"
            subtitle="Quick access to essential tools and information"
          />

          <div className="grid gap-6 md:grid-cols-3">
            {resources.map((resource, index) => (
              <AnimatedSection key={resource.title} delay={index * 0.15}>
                <Card className="group h-full transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                  <CardContent className="flex flex-col items-center p-8 text-center">
                    <div className="mb-4 rounded-xl bg-primary/10 p-4 transition-colors group-hover:bg-primary">
                      <resource.icon className="h-8 w-8 text-primary group-hover:text-primary-foreground" />
                    </div>
                    <h3 className="mb-2 text-xl font-semibold text-foreground">{resource.title}</h3>
                    <p className="mb-4 text-muted-foreground">{resource.description}</p>
                    <Button variant="outline" className="mt-auto">
                      <Download className="mr-2 h-4 w-4" />
                      {resource.action}
                    </Button>
                  </CardContent>
                </Card>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Clubs & Activities */}
      <section className="bg-secondary py-16 md:py-24">
        <div className="container">
          <SectionHeading
            title="Clubs & Activities"
            subtitle="Join a community that matches your interests"
          />

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {clubs.map((club, index) => (
              <AnimatedSection key={club.name} delay={index * 0.1}>
                <Card className="group transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                  <CardContent className="flex items-center gap-4 p-4">
                    <div className="rounded-lg bg-primary/10 p-3 transition-colors group-hover:bg-primary">
                      <club.icon className="h-6 w-6 text-primary group-hover:text-primary-foreground" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground">{club.name}</h3>
                      <p className="text-sm text-muted-foreground">{club.members} members</p>
                    </div>
                    <Button variant="ghost" size="sm">
                      Join
                    </Button>
                  </CardContent>
                </Card>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="py-16 md:py-24">
        <div className="container">
          <SectionHeading
            title="Upcoming Events"
            subtitle="Mark your calendars for these exciting activities"
          />

          <div className="mx-auto max-w-3xl space-y-4">
            {events.map((event, index) => (
              <AnimatedSection key={event.title} delay={index * 0.1}>
                <Card className="transition-all duration-300 hover:shadow-lg">
                  <CardContent className="flex items-center gap-6 p-4 sm:p-6">
                    <div className="flex h-16 w-16 shrink-0 flex-col items-center justify-center rounded-lg bg-primary text-primary-foreground">
                      <span className="text-xs font-medium uppercase">{event.date.split(" ")[0]}</span>
                      <span className="text-2xl font-bold">{event.date.split(" ")[1]}</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">{event.title}</h3>
                      <p className="text-sm text-muted-foreground">{event.description}</p>
                    </div>
                  </CardContent>
                </Card>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Photo Gallery */}
      <section className="bg-secondary py-16 md:py-24">
        <div className="container">
          <SectionHeading
            title="Campus Gallery"
            subtitle="Glimpses of life at Horizon Academy"
          />

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {galleryImages.map((image, index) => (
              <AnimatedSection key={index} delay={index * 0.1}>
                <div className="group relative overflow-hidden rounded-xl">
                  <img
                    src={image}
                    alt={`Campus photo ${index + 1}`}
                    className="aspect-[4/3] h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-primary/60 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <Camera className="h-8 w-8 text-primary-foreground" />
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default Students;
