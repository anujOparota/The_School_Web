import { Link } from "react-router-dom";
import { GraduationCap, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Youtube } from "lucide-react";
import logo from "@/assets/logo.png";


const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-primary text-primary-foreground">
      <div className="container py-12 md:py-16">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* About */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-foreground">
                <img
                  src={logo}
                  alt="Secondary Nav Kalika Shikshan Sansthan Logo"
                  className="h-full w-full object-contain p-1"
                />
              </div>

              <span className="text-lg font-bold">Secondary Nav Kalika Shikshan Sansthan</span>
            </div>
            <p className="text-sm text-primary-foreground/80">
              Nurturing minds, building futures. Providing quality education from Kindergarten through 12th grade since 1985.
            </p>
            <div className="flex gap-3">
              <a href="#" className="rounded-full bg-primary-foreground/10 p-2 transition-colors hover:bg-primary-foreground/20">
                <Facebook className="h-4 w-4" />
              </a>
              <a href="#" className="rounded-full bg-primary-foreground/10 p-2 transition-colors hover:bg-primary-foreground/20">
                <Twitter className="h-4 w-4" />
              </a>
              <a href="#" className="rounded-full bg-primary-foreground/10 p-2 transition-colors hover:bg-primary-foreground/20">
                <Instagram className="h-4 w-4" />
              </a>
              <a href="#" className="rounded-full bg-primary-foreground/10 p-2 transition-colors hover:bg-primary-foreground/20">
                <Youtube className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Quick Links</h3>
            <ul className="space-y-2">
              {[
                { name: "About Us", path: "/" },
                { name: "Academics", path: "/academics" },
                { name: "Admissions", path: "/admission" },
                { name: "Faculty", path: "/faculty" },
                { name: "Student Life", path: "/students" },
                { name: "Contact", path: "/contact" },
              ].map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-sm text-primary-foreground/80 transition-colors hover:text-primary-foreground"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Programs */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Programs</h3>
            <ul className="space-y-2">
              {[
                "Elementary School",
                "Middle School",
                "High School",
                "STEM Program",
                "Arts & Music",
                "Athletics",
              ].map((program) => (
                <li key={program}>
                  <span className="text-sm text-primary-foreground/80">{program}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                <span className="text-sm text-primary-foreground/80">
                  Hisampur road, Nasirda Tonk 304507, Rajasthan
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-4 w-4 shrink-0 text-gold" />
                <span className="text-sm text-primary-foreground/80">+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-4 w-4 shrink-0 text-gold" />
                <span className="text-sm text-primary-foreground/80">info@nkss.edu</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-primary-foreground/10">
        <div className="container flex flex-col items-center justify-between gap-4 py-6 text-sm md:flex-row">
          <p className="text-primary-foreground/70">
            © {currentYear} Sec. NKSS Nasirda, Tonk. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link to="#" className="text-primary-foreground/70 hover:text-primary-foreground">
              Privacy Policy
            </Link>
            <Link to="#" className="text-primary-foreground/70 hover:text-primary-foreground">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
