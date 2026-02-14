import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import PageLayout from "@/components/layout/PageLayout";
import AnimatedSection from "@/components/ui/AnimatedSection";
import { ShieldX, Home, ArrowLeft } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const AccessDenied = () => {
  const { currentUser, userRole } = useAuth();

  const getDashboardLink = () => {
    switch (userRole) {
      case "admin":
        return "/admin";
      case "student":
        return "/student";
      case "parent":
        return "/parent";
      default:
        return "/";
    }
  };

  return (
    <PageLayout>
      <section className="flex min-h-[60vh] items-center justify-center py-16">
        <div className="container">
          <AnimatedSection className="mx-auto max-w-md text-center">
            <Card>
              <CardContent className="p-8">
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
                  <ShieldX className="h-8 w-8 text-destructive" />
                </div>
                <h1 className="mb-2 text-2xl font-bold text-foreground">
                  Access Denied
                </h1>
                <p className="mb-6 text-muted-foreground">
                  You don't have permission to access this page. Please contact an administrator if you believe this is an error.
                </p>
                <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
                  {currentUser ? (
                    <Button asChild>
                      <Link to={getDashboardLink()}>
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Go to Dashboard
                      </Link>
                    </Button>
                  ) : (
                    <Button asChild>
                      <Link to="/login">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Login
                      </Link>
                    </Button>
                  )}
                  <Button variant="outline" asChild>
                    <Link to="/">
                      <Home className="mr-2 h-4 w-4" />
                      Home
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </AnimatedSection>
        </div>
      </section>
    </PageLayout>
  );
};

export default AccessDenied;
