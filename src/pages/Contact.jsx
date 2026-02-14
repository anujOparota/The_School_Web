import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import PageLayout from "@/components/layout/PageLayout";
import AnimatedSection from "@/components/ui/AnimatedSection";
import SectionHeading from "@/components/ui/SectionHeading";
import { MapPin, Phone, Mail, Clock, Send, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const contactInfo = [
  {
    icon: MapPin,
    title: "Address",
    content: "Hisampur road, Nasirda\n Tonk 304507, Rajasthan",
  },
  {
    icon: Phone,
    title: "Phone",
    content: "+1 (555) 123-4567\n+1 (555) 123-4568",
  },
  {
    icon: Mail,
    title: "Email",
    content: "info@nkss.edu\nadmissions@nkss.edu",
  },
  {
    icon: Clock,
    title: "Office Hours",
    content: "Monday - Friday: 8:00 AM - 4:00 PM\nSaturday: 9:00 AM - 12:00 PM",
  },
];

const Contact = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }
    if (!formData.subject.trim()) {
      newErrors.subject = "Subject is required";
    }
    if (!formData.message.trim()) {
      newErrors.message = "Message is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      setIsSubmitted(true);
      toast({
        title: "Message Sent!",
        description: "Thank you for contacting us. We'll respond within 24-48 hours.",
      });
    }
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
    });
    setIsSubmitted(false);
  };

  return (
    <PageLayout>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary to-primary/80 py-16 text-primary-foreground md:py-24">
        <div className="container">
          <AnimatedSection className="mx-auto max-w-3xl text-center">
            <h1 className="mb-6 text-4xl font-bold tracking-tight md:text-5xl">
              Contact Us
            </h1>
            <p className="text-lg text-primary-foreground/90 md:text-xl">
              We'd love to hear from you. Reach out with questions, schedule a tour, or learn more about Sec. NKSS School.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Contact Info & Form */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="grid gap-12 lg:grid-cols-2">
            {/* Contact Information */}
            <AnimatedSection>
              <h2 className="mb-6 text-2xl font-bold text-foreground">Get in Touch</h2>
              <p className="mb-8 text-muted-foreground">
                Our admissions team is here to help you learn more about Sec. NKSS School 
                and guide you through the enrollment process.
              </p>

              <div className="space-y-6">
                {contactInfo.map((item) => (
                  <div key={item.title} className="flex gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                      <item.icon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">{item.title}</h3>
                      <p className="whitespace-pre-line text-muted-foreground">{item.content}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Map Placeholder */}
              <div className="mt-8 overflow-hidden rounded-xl border border-border">
                <div className="relative h-64 bg-muted">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d456.44882807340326!2d75.36475576003266!3d25.952210231935485!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x396eeb749f42f03f%3A0xefbbd6db1fcf79dd!2sNavkalika%20Secondary%20School!5e1!3m2!1sen!2sin!4v1771003582150!5m2!1sen!2sin"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="School Location"
                  />
                </div>
              </div>
            </AnimatedSection>

            {/* Contact Form */}
            <AnimatedSection delay={0.15}>
              <Card>
                <CardContent className="p-6 md:p-8">
                  {isSubmitted ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <div className="mb-4 rounded-full bg-accent/10 p-4">
                        <CheckCircle className="h-12 w-12 text-accent" />
                      </div>
                      <h3 className="mb-2 text-xl font-semibold text-foreground">Message Sent!</h3>
                      <p className="mb-6 text-muted-foreground">
                        Thank you for reaching out. Our team will get back to you within 24-48 hours.
                      </p>
                      <Button onClick={resetForm} variant="outline">
                        Send Another Message
                      </Button>
                    </div>
                  ) : (
                    <>
                      <h3 className="mb-6 text-xl font-semibold text-foreground">Send us a Message</h3>
                      <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid gap-6 sm:grid-cols-2">
                          <div className="space-y-2">
                            <Label htmlFor="name">Full Name *</Label>
                            <Input
                              id="name"
                              value={formData.name}
                              onChange={(e) => handleChange("name", e.target.value)}
                              className={errors.name ? "border-destructive" : ""}
                            />
                            {errors.name && (
                              <p className="text-sm text-destructive">{errors.name}</p>
                            )}
                          </div>
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
                        </div>

                        <div className="grid gap-6 sm:grid-cols-2">
                          <div className="space-y-2">
                            <Label htmlFor="phone">Phone Number</Label>
                            <Input
                              id="phone"
                              type="tel"
                              value={formData.phone}
                              onChange={(e) => handleChange("phone", e.target.value)}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="subject">Subject *</Label>
                            <Input
                              id="subject"
                              value={formData.subject}
                              onChange={(e) => handleChange("subject", e.target.value)}
                              className={errors.subject ? "border-destructive" : ""}
                            />
                            {errors.subject && (
                              <p className="text-sm text-destructive">{errors.subject}</p>
                            )}
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="message">Message *</Label>
                          <Textarea
                            id="message"
                            placeholder="How can we help you?"
                            value={formData.message}
                            onChange={(e) => handleChange("message", e.target.value)}
                            className={errors.message ? "border-destructive" : ""}
                            rows={5}
                          />
                          {errors.message && (
                            <p className="text-sm text-destructive">{errors.message}</p>
                          )}
                        </div>

                        <Button type="submit" size="lg" className="w-full">
                          <Send className="mr-2 h-4 w-4" />
                          Send Message
                        </Button>

                        <p className="text-center text-xs text-muted-foreground">
                          We typically respond within 24-48 business hours.
                        </p>
                      </form>
                    </>
                  )}
                </CardContent>
              </Card>
            </AnimatedSection>
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default Contact;
