import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import AnimatedSection from "@/components/ui/AnimatedSection";
import { ArrowRight } from "lucide-react";

const CTASection = () => {
  return (
    <section className="bg-primary py-16 md:py-24">
      <div className="container">
        <AnimatedSection className="text-center">
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-primary-foreground md:text-4xl">
            Ready to Join Our Community?
          </h2>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-primary-foreground/80">
            Applications are now open for the upcoming academic year. Take the first step 
            towards an exceptional education for your child.
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button
              asChild
              size="lg"
              className="bg-gold text-gold-foreground hover:bg-gold/90"
            >
              <Link to="/admission">
                Start Application
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10"
            >
              <Link to="/contact">Schedule a Tour</Link>
            </Button>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
};

export default CTASection;
