import { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import PageLayout from "@/components/layout/PageLayout";
import AnimatedSection from "@/components/ui/AnimatedSection";
import SectionHeading from "@/components/ui/SectionHeading";
import { Search, Mail, X } from "lucide-react";

const facultyData = [
  {
    id: 1,
    name: "Dr. Sarah Mitchell",
    department: "Science",
    subject: "Physics",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80",
    email: "s.mitchell@horizon.edu",
    bio: "Dr. Mitchell brings 15 years of experience in physics education with a passion for making complex concepts accessible.",
    education: "Ph.D. in Physics, MIT",
    experience: "15 years",
  },
  {
    id: 2,
    name: "Mr. James Wilson",
    department: "Mathematics",
    subject: "Calculus",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80",
    email: "j.wilson@horizon.edu",
    bio: "A dedicated mathematician who believes every student can excel with the right approach and encouragement.",
    education: "M.S. in Mathematics, Stanford",
    experience: "12 years",
  },
  {
    id: 3,
    name: "Ms. Emily Chen",
    department: "Languages",
    subject: "English Literature",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80",
    email: "e.chen@horizon.edu",
    bio: "Passionate about literature and creative writing, Ms. Chen inspires students to find their voice.",
    education: "M.A. in English, Yale",
    experience: "10 years",
  },
  {
    id: 4,
    name: "Mr. David Rodriguez",
    department: "Arts",
    subject: "Visual Arts",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80",
    email: "d.rodriguez@horizon.edu",
    bio: "An award-winning artist dedicated to nurturing creativity and artistic expression in students.",
    education: "MFA, Rhode Island School of Design",
    experience: "8 years",
  },
  {
    id: 5,
    name: "Dr. Michael Brown",
    department: "Science",
    subject: "Chemistry",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80",
    email: "m.brown@horizon.edu",
    bio: "Dr. Brown's interactive lab sessions make chemistry exciting and relevant for students.",
    education: "Ph.D. in Chemistry, Berkeley",
    experience: "14 years",
  },
  {
    id: 6,
    name: "Ms. Jennifer Lee",
    department: "Social Studies",
    subject: "World History",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80",
    email: "j.lee@horizon.edu",
    bio: "Bringing history to life through storytelling and connections to contemporary events.",
    education: "M.A. in History, Columbia",
    experience: "11 years",
  },
  {
    id: 7,
    name: "Mr. Robert Taylor",
    department: "Physical Education",
    subject: "Athletics",
    image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&q=80",
    email: "r.taylor@horizon.edu",
    bio: "Former professional athlete dedicated to developing well-rounded student athletes.",
    education: "M.Ed., University of Michigan",
    experience: "16 years",
  },
  {
    id: 8,
    name: "Dr. Lisa Anderson",
    department: "Science",
    subject: "Biology",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&q=80",
    email: "l.anderson@horizon.edu",
    bio: "Environmental scientist inspiring the next generation of biologists and conservationists.",
    education: "Ph.D. in Biology, Duke",
    experience: "9 years",
  },
  {
    id: 9,
    name: "Mr. Thomas Garcia",
    department: "Technology",
    subject: "Computer Science",
    image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&q=80",
    email: "t.garcia@horizon.edu",
    bio: "Former software engineer at Google, now teaching coding and computational thinking.",
    education: "M.S. in Computer Science, Carnegie Mellon",
    experience: "7 years",
  },
  {
    id: 10,
    name: "Ms. Amanda White",
    department: "Languages",
    subject: "Spanish",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&q=80",
    email: "a.white@horizon.edu",
    bio: "Native speaker with expertise in immersive language teaching methods.",
    education: "M.A. in Spanish, Universidad Complutense",
    experience: "13 years",
  },
  {
    id: 11,
    name: "Mr. Kevin Park",
    department: "Mathematics",
    subject: "Algebra",
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&q=80",
    email: "k.park@horizon.edu",
    bio: "Makes algebra accessible and fun through real-world applications and problem-solving.",
    education: "M.S. in Mathematics Education, UCLA",
    experience: "10 years",
  },
  {
    id: 12,
    name: "Ms. Rachel Green",
    department: "Arts",
    subject: "Music",
    image: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400&q=80",
    email: "r.green@horizon.edu",
    bio: "Professional musician and conductor leading our award-winning music programs.",
    education: "M.M. in Music Education, Juilliard",
    experience: "12 years",
  },
];

const departments = ["All Departments", "Science", "Mathematics", "Languages", "Arts", "Social Studies", "Physical Education", "Technology"];

const Faculty = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("All Departments");
  const [selectedMember, setSelectedMember] = useState(null);

  const filteredFaculty = useMemo(() => {
    return facultyData.filter((member) => {
      const matchesSearch =
        member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.subject.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesDepartment =
        selectedDepartment === "All Departments" || member.department === selectedDepartment;
      return matchesSearch && matchesDepartment;
    });
  }, [searchQuery, selectedDepartment]);

  return (
    <PageLayout>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary to-primary/80 py-16 text-primary-foreground md:py-24">
        <div className="container">
          <AnimatedSection className="mx-auto max-w-3xl text-center">
            <h1 className="mb-6 text-4xl font-bold tracking-tight md:text-5xl">
              Our Faculty
            </h1>
            <p className="text-lg text-primary-foreground/90 md:text-xl">
              Meet the dedicated educators who inspire and guide our students every day
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Search & Filter */}
      <section className="border-b border-border bg-card py-6">
        <div className="container">
          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by name or subject..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="Department" />
              </SelectTrigger>
              <SelectContent>
                {departments.map((dept) => (
                  <SelectItem key={dept} value={dept}>
                    {dept}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </section>

      {/* Faculty Grid */}
      <section className="py-16 md:py-24">
        <div className="container">
          {filteredFaculty.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-lg text-muted-foreground">No faculty members found matching your criteria.</p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedDepartment("All Departments");
                }}
              >
                Clear Filters
              </Button>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredFaculty.map((member, index) => (
                <AnimatedSection key={member.id} delay={index * 0.05}>
                  <Card
                    className="group cursor-pointer overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                    onClick={() => setSelectedMember(member)}
                  >
                    <div className="relative h-56 overflow-hidden">
                      <img
                        src={member.image}
                        alt={member.name}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-foreground">{member.name}</h3>
                      <p className="text-sm text-gold">{member.subject}</p>
                      <p className="mt-1 text-xs text-muted-foreground">{member.department}</p>
                    </CardContent>
                  </Card>
                </AnimatedSection>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Faculty Detail Dialog */}
      <Dialog open={!!selectedMember} onOpenChange={() => setSelectedMember(null)}>
        <DialogContent className="max-w-lg">
          {selectedMember && (
            <>
              <DialogHeader>
                <DialogTitle className="sr-only">{selectedMember.name}</DialogTitle>
              </DialogHeader>
              <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
                <img
                  src={selectedMember.image}
                  alt={selectedMember.name}
                  className="h-32 w-32 rounded-xl object-cover"
                />
                <div className="text-center sm:text-left">
                  <h3 className="text-xl font-bold text-foreground">{selectedMember.name}</h3>
                  <p className="text-gold">{selectedMember.subject}</p>
                  <p className="text-sm text-muted-foreground">{selectedMember.department}</p>
                  <a
                    href={`mailto:${selectedMember.email}`}
                    className="mt-2 inline-flex items-center gap-1 text-sm text-primary hover:underline"
                  >
                    <Mail className="h-4 w-4" />
                    {selectedMember.email}
                  </a>
                </div>
              </div>
              <div className="mt-4 space-y-4">
                <p className="text-muted-foreground">{selectedMember.bio}</p>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs font-medium uppercase text-muted-foreground">Education</p>
                    <p className="text-sm text-foreground">{selectedMember.education}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium uppercase text-muted-foreground">Experience</p>
                    <p className="text-sm text-foreground">{selectedMember.experience}</p>
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </PageLayout>
  );
};

export default Faculty;
