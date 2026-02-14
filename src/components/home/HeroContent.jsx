import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, BookOpen, GraduationCap, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";

const HeroContent = () => {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="container text-center text-primary-foreground">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mx-auto max-w-3xl"
        >
          <span className="mb-4 inline-block rounded-full bg-gold/20 px-4 py-2 text-sm font-medium text-gold backdrop-blur-sm">
            Excellence in K-12 Education Since 1985
          </span>
          <h1 className="mb-6 text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
            Nurturing Minds,
            <br />
            <span className="text-gold">Building Futures</span>
          </h1>
          <p className="mb-8 text-lg text-primary-foreground/90 md:text-xl">
            At Sec. NKSS School, we empower students with knowledge, creativity, and the skills 
            to succeed in an ever-changing world. Join our community of learners and leaders.
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button
              asChild
              size="lg"
              className="bg-gold text-gold-foreground hover:bg-gold/90"
            >
              <Link to="/admission">
                <GraduationCap className="mr-2 h-5 w-5" />
                Apply Now
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-primary-foreground/30 bg-primary-foreground/10 text-primary-foreground backdrop-blur-sm hover:bg-primary-foreground/20"
            >
              <Link to="/academics">
                <BookOpen className="mr-2 h-5 w-5" />
                Explore Academics
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="ghost"
              className="text-primary-foreground hover:bg-primary-foreground/10"
            >
              <Link to="/contact">
                <Phone className="mr-2 h-5 w-5" />
                Contact Us
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default HeroContent;
