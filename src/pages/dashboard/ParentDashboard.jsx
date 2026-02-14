import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import PageLayout from "@/components/layout/PageLayout";
import AnimatedSection from "@/components/ui/AnimatedSection";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { getStudentsByParentId, getUpcomingEvents, getNotices } from "@/lib/firestore";
import {
  Users,
  GraduationCap,
  Calendar,
  Bell,
  Clock,
  User,
  LogOut,
  Loader2,
  RefreshCw,
  BookOpen,
  BarChart3,
  AlertCircle,
  CheckCircle2,
  Link as LinkIcon,
} from "lucide-react";

const ParentDashboard = () => {
  const { currentUser, userData, userRole, logout, getStatusMessage } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [linkedStudents, setLinkedStudents] = useState([]);
  const [events, setEvents] = useState([]);
  const [notices, setNotices] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);

  const isPending = userRole === "pending_parent";
  const statusMessage = getStatusMessage?.();

  const fetchData = async () => {
    try {
      const [students, eventsData, noticesData] = await Promise.all([
        getStudentsByParentId(currentUser.uid),
        getUpcomingEvents(),
        getNotices(),
      ]);
      setLinkedStudents(students);
      setEvents(eventsData);
      setNotices(noticesData);
      if (students.length > 0 && !selectedStudent) {
        setSelectedStudent(students[0]);
      }
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

  // Show pending status
  if (isPending) {
    return (
      <PageLayout>
        <section className="bg-gradient-to-br from-primary to-primary/80 py-12 text-primary-foreground">
          <div className="container">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-3xl font-bold">Parent Dashboard</h1>
                <p className="mt-1 text-primary-foreground/80">
                  Welcome, {userData?.name || "Parent"}
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
                  <AlertCircle className="mx-auto h-16 w-16 text-gold" />
                  <h2 className="mt-4 text-xl font-semibold">Pending Verification</h2>
                  <p className="mt-2 text-muted-foreground">{statusMessage}</p>
                  
                  {userData?.requestedChildName && (
                    <div className="mt-4 rounded-lg border border-gold/30 bg-gold/5 p-4 text-left">
                      <p className="text-sm font-medium">Requested Child Information:</p>
                      <p className="text-sm text-muted-foreground">
                        Name: {userData.requestedChildName}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Email: {userData.requestedChildEmail}
                      </p>
                    </div>
                  )}
                  
                  <p className="mt-4 text-sm text-muted-foreground">
                    An administrator will review your request and link your account to your child's profile.
                  </p>
                  
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
              <h1 className="text-3xl font-bold">Parent Dashboard</h1>
              <p className="mt-1 text-primary-foreground/80">
                Welcome back, {userData?.name || "Parent"}
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
            {/* Parent Profile */}
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
                    <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gold/10">
                      <Users className="h-10 w-10 text-gold" />
                    </div>
                    <h3 className="text-lg font-semibold">{userData?.name}</h3>
                    <p className="text-sm text-muted-foreground">{userData?.email}</p>
                    
                    {/* Status indicator */}
                    <div className="mt-3 flex items-center gap-2 rounded-full bg-accent/10 px-3 py-1">
                      <CheckCircle2 className="h-4 w-4 text-accent" />
                      <span className="text-sm font-medium text-accent">Linked</span>
                    </div>
                    
                    <div className="mt-4 w-full">
                      <p className="text-sm text-muted-foreground">
                        {linkedStudents.length} linked student(s)
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Linked Students */}
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <GraduationCap className="h-5 w-5" />
                    My Children
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {linkedStudents.length === 0 ? (
                    <div className="text-center py-4">
                      <LinkIcon className="mx-auto h-8 w-8 text-muted-foreground" />
                      <p className="mt-2 text-sm text-muted-foreground">
                        No students linked yet.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {linkedStudents.map((student) => (
                        <button
                          key={student.id}
                          onClick={() => setSelectedStudent(student)}
                          className={`w-full rounded-lg border p-3 text-left transition-all ${
                            selectedStudent?.id === student.id
                              ? "border-primary bg-primary/5"
                              : "hover:border-primary/50"
                          }`}
                        >
                          <p className="font-medium">{student.name}</p>
                          <p className="text-sm text-muted-foreground">
                            Class {student.class} - {student.section}
                          </p>
                        </button>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </AnimatedSection>

            {/* Main Content */}
            <div className="space-y-6 lg:col-span-2">
              {/* Selected Student Details */}
              {selectedStudent ? (
                <AnimatedSection>
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <GraduationCap className="h-5 w-5" />
                        {selectedStudent.name}'s Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        <div className="rounded-lg bg-muted p-4">
                          <p className="text-sm text-muted-foreground">Class</p>
                          <p className="text-lg font-semibold">{selectedStudent.class}</p>
                        </div>
                        <div className="rounded-lg bg-muted p-4">
                          <p className="text-sm text-muted-foreground">Section</p>
                          <p className="text-lg font-semibold">{selectedStudent.section}</p>
                        </div>
                        <div className="rounded-lg bg-muted p-4">
                          <p className="text-sm text-muted-foreground">Roll No</p>
                          <p className="text-lg font-semibold">{selectedStudent.rollNo || "N/A"}</p>
                        </div>
                        <div className="rounded-lg bg-muted p-4">
                          <p className="text-sm text-muted-foreground">Attendance</p>
                          <p className="text-lg font-semibold">
                            {selectedStudent.attendance || "N/A"}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </AnimatedSection>
              ) : (
                <AnimatedSection>
                  <Card>
                    <CardContent className="py-12 text-center">
                      <Users className="mx-auto h-12 w-12 text-muted-foreground" />
                      <p className="mt-4 text-muted-foreground">
                        No student selected. Link your children to view their information.
                      </p>
                    </CardContent>
                  </Card>
                </AnimatedSection>
              )}

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
                        <BarChart3 className="h-5 w-5 text-accent" />
                      </div>
                      <div>
                        <p className="font-medium">Reports</p>
                        <p className="text-sm text-muted-foreground">View scorecards</p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="cursor-pointer transition-all hover:shadow-md">
                    <CardContent className="flex items-center gap-3 p-4">
                      <div className="rounded-lg bg-gold/10 p-2">
                        <BookOpen className="h-5 w-5 text-gold" />
                      </div>
                      <div>
                        <p className="font-medium">Syllabus</p>
                        <p className="text-sm text-muted-foreground">Download PDFs</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </AnimatedSection>

              {/* Events & Notices */}
              <div className="grid gap-6 md:grid-cols-2">
                <AnimatedSection delay={0.15}>
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

                <AnimatedSection delay={0.2}>
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Bell className="h-5 w-5" />
                        School Notices
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

export default ParentDashboard;