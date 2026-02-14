import { Card, CardContent } from "@/components/ui/card";
import AnimatedSection from "@/components/ui/AnimatedSection";
import principalImg from "@/assets/leaders/head.webp";
import directorImg from "@/assets/leaders/director.webp";


const leaders = [
  {
    name: "Mr. Anuj Parota",
    role: "Principal",
    image: principalImg,
    message:
      "Welcome to Sec. NKSS School! Our mission is to inspire a love for learning and to prepare students for success in the 21st century. With our dedicated faculty and comprehensive curriculum, we nurture every student's potential.",
  },
  {
    name: "Mr. Suyash Pawar",
    role: "Director",
    image: directorImg,
    message:
      "Education is the foundation of a brighter future. At Sec. NKSS School, we combine academic excellence with character development, ensuring our students graduate as well-rounded individuals ready to make a positive impact.",
  },
];

const LeadershipSection = () => {
  return (
    <section className="bg-secondary py-16 md:py-24">
      <div className="container">
        <AnimatedSection className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Meet Our Leadership
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Dedicated to excellence in education and student success
          </p>
        </AnimatedSection>

        <div className="grid gap-8 md:grid-cols-2">
          {leaders.map((leader, index) => (
            <AnimatedSection key={leader.name} delay={index * 0.15}>
              <Card className="overflow-hidden transition-all duration-300 hover:shadow-xl">
                <CardContent className="p-0">
                  <div className="flex flex-col sm:flex-row">
                    <div className="relative h-48 w-full shrink-0 sm:h-auto sm:w-48">
                      <img
                        src={leader.image}
                        alt={leader.name}
                        className="h-full w-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent sm:bg-gradient-to-r" />
                    </div>
                    <div className="flex flex-1 flex-col justify-center p-6">
                      <div className="mb-3">
                        <h3 className="text-xl font-bold text-foreground">{leader.name}</h3>
                        <p className="text-sm font-medium text-gold">{leader.role}</p>
                      </div>
                      <p className="text-sm leading-relaxed text-muted-foreground">
                        "{leader.message}"
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LeadershipSection;
