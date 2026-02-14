import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import PageLayout from "@/components/layout/PageLayout";
import AnimatedSection from "@/components/ui/AnimatedSection";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { getStudentByUserId, getUpcomingEvents, getNotices, getResources } from "@/lib/firestore";
import {
  GraduationCap,
  Calendar,
  Clock,
  FileText,
  Bell,
  BookOpen,
  User,
  LogOut,
  Loader2,
  Download,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

const StudentDashboard = () => {
  const { currentUser, userData, userRole, logout, getStatusMessage } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [studentData, setStudentData] = useState(null);
  const [events, setEvents] = useState([]);
  const [notices, setNotices] = useState([]);
  const [resources, setResources] = useState([]);

  const isPending = userRole === "pending_student";
  const isRejected = userRole === "rejected_student";
  const statusMessage = getStatusMessage?.();

  const fetchData = async () => {
    try {
      const [student, eventsData, noticesData, resourcesData] = await Promise.all([
        getStudentByUserId(currentUser.uid),
        getUpcomingEvents(),
        getNotices(),
        getResources(),
      ]);
      setStudentData(student);
      setEvents(eventsData);
      setNotices(noticesData);
      setResources(resourcesData);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load dashboard data.",
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (currentUser) {
      fetchData();
    }
  }, [currentUser]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  if (loading) {
    return (
      <PageLayout>
        <div className="flex min-h-[60vh] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </PageLayout>
    );
  }

  // Show pending/rejected status
  if (isPending || isRejected) {
    return (
      <PageLayout>
        <section className="bg-gradient-to-br from-primary to-primary/80 py-12 text-primary-foreground">
          <div className="container">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-3xl font-bold">Student Dashboard</h1>
                <p className="mt-1 text-primary-foreground/80">
                  Welcome, {userData?.name || "Student"}
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </div>
          </div>
        </section>

        <section className="py-12">
          <div className="container">
            <AnimatedSection className="mx-auto max-w-lg">
              <Card>
                <CardContent className="p-8 text-center">
                  {isPending ? (
                    <>
                      <Clock className="mx-auto h-16 w-16 text-gold" />
                      <h2 className="mt-4 text-xl font-semibold">Application Pending</h2>
                      <p className="mt-2 text-muted-foreground">{statusMessage}</p>
                      <p className="mt-4 text-sm text-muted-foreground">
                        You'll receive full access to the student dashboard once your application is approved by an administrator.
                      </p>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="mx-auto h-16 w-16 text-destructive" />
                      <h2 className="mt-4 text-xl font-semibold">Application Not Approved</h2>
                      <p className="mt-2 text-muted-foreground">{statusMessage}</p>
                    </>
                  )}
                  <Button
                    variant="outline"
                    className="mt-6"
                    onClick={handleRefresh}
                    disabled={refreshing}
                  >
                    <RefreshCw className={`mr-2 h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
                    Check Status
                  </Button>
                </CardContent>
              </Card>
            </AnimatedSection>
          </div>
        </section>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <section className="bg-gradient-to-br from-primary to-primary/80 py-12 text-primary-foreground">
        <div className="container">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold">Student Dashboard</h1>
              <p className="mt-1 text-primary-foreground/80">
                Welcome back, {userData?.name || "Student"}
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                disabled={refreshing}
                className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10"
              >
                <RefreshCw className={`mr-2 h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
                Refresh
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-8">
        <div className="container">
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Profile Card */}
            <AnimatedSection className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    My Profile
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col items-center text-center">
                    <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
                      <GraduationCap className="h-10 w-10 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold">{userData?.name}</h3>
                    <p className="text-sm text-muted-foreground">{userData?.email}</p>
                    
                    {/* Status indicator */}
                    <div className="mt-3 flex items-center gap-2 rounded-full bg-accent/10 px-3 py-1">
                      <CheckCircle2 className="h-4 w-4 text-accent" />
                      <span className="text-sm font-medium text-accent">Approved</span>
                    </div>
                    
                    {studentData && (
                      <div className="mt-4 w-full space-y-2 text-left">
                        <div className="flex justify-between rounded-lg bg-muted p-2">
                          <span className="text-sm text-muted-foreground">Class</span>
                          <span className="text-sm font-medium">{studentData.class}</span>
                        </div>
                        <div className="flex justify-between rounded-lg bg-muted p-2">
                          <span className="text-sm text-muted-foreground">Section</span>
                          <span className="text-sm font-medium">{studentData.section}</span>
                        </div>
                        <div className="flex justify-between rounded-lg bg-muted p-2">
                          <span className="text-sm text-muted-foreground">Roll No</span>
                          <span className="text-sm font-medium">{studentData.rollNo || "To be assigned"}</span>
                        </div>
                      </div>
                    )}
                    {!studentData && (
                      <p className="mt-4 text-sm text-muted-foreground">
                        Your student profile is being set up by the administration.
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </AnimatedSection>

            {/* Main Content */}
            <div className="space-y-6 lg:col-span-2">
              {/* Quick Actions */}
              <AnimatedSection delay={0.1}>
                <div className="grid gap-4 sm:grid-cols-3">
                  <Card className="cursor-pointer transition-all hover:shadow-md">
                    <CardContent className="flex items-center gap-3 p-4">
                      <div className="rounded-lg bg-primary/10 p-2">
                        <Clock className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">Timetable</p>
                        <p className="text-sm text-muted-foreground">View schedule</p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="cursor-pointer transition-all hover:shadow-md">
                    <CardContent className="flex items-center gap-3 p-4">
                      <div className="rounded-lg bg-accent/10 p-2">
                        <BookOpen className="h-5 w-5 text-accent" />
                      </div>
                      <div>
                        <p className="font-medium">Syllabus</p>
                        <p className="text-sm text-muted-foreground">Download PDFs</p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="cursor-pointer transition-all hover:shadow-md">
                    <CardContent className="flex items-center gap-3 p-4">
                      <div className="rounded-lg bg-gold/10 p-2">
                        <FileText className="h-5 w-5 text-gold" />
                      </div>
                      <div>
                        <p className="font-medium">Reports</p>
                        <p className="text-sm text-muted-foreground">View scorecards</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </AnimatedSection>

              {/* Resources */}
              <AnimatedSection delay={0.15}>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Download className="h-5 w-5" />
                      Resources
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {resources.length === 0 ? (
                      <p className="text-center text-muted-foreground py-4">
                        No resources available yet.
                      </p>
                    ) : (
                      <div className="space-y-3">
                        {resources.slice(0, 5).map((resource) => (
                          <div key={resource.id} className="flex items-center justify-between rounded-lg border p-3">
                            <div className="flex items-center gap-3">
                              <FileText className="h-5 w-5 text-muted-foreground" />
                              <div>
                                <p className="font-medium">{resource.title}</p>
                                <p className="text-sm text-muted-foreground capitalize">{resource.type}</p>
                              </div>
                            </div>
                            {resource.url && (
                              <Button size="sm" variant="outline" asChild>
                                <a href={resource.url} target="_blank" rel="noopener noreferrer">
                                  <Download className="h-4 w-4" />
                                </a>
                              </Button>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </AnimatedSection>

              {/* Events & Notices */}
              <div className="grid gap-6 md:grid-cols-2">
                <AnimatedSection delay={0.2}>
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Calendar className="h-5 w-5" />
                        Upcoming Events
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {events.length === 0 ? (
                        <p className="text-center text-muted-foreground py-4">
                          No upcoming events.
                        </p>
                      ) : (
                        <div className="space-y-3">
                          {events.slice(0, 4).map((event) => (
                            <div key={event.id} className="rounded-lg border p-3">
                              <p className="font-medium">{event.title}</p>
                              <p className="text-sm text-muted-foreground">{event.date}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </AnimatedSection>

                <AnimatedSection delay={0.25}>
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Bell className="h-5 w-5" />
                        Notices
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {notices.length === 0 ? (
                        <p className="text-center text-muted-foreground py-4">
                          No notices.
                        </p>
                      ) : (
                        <div className="space-y-3">
                          {notices.slice(0, 4).map((notice) => (
                            <div key={notice.id} className="rounded-lg border p-3">
                              <p className="font-medium">{notice.title}</p>
                              <p className="text-sm text-muted-foreground line-clamp-2">{notice.content}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </AnimatedSection>
              </div>
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default StudentDashboard;
