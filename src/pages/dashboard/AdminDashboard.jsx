import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import PageLayout from "@/components/layout/PageLayout";
import AnimatedSection from "@/components/ui/AnimatedSection";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import {
  getAdmissions,
  getAllStudents,
  getUsersByRole,
  getUsersByRoles,
  getPendingParents,
  getEvents,
  createEvent,
  deleteEvent,
  getNotices,
  createNotice,
  deleteNotice,
  getAuditLogs,
  approveAdmission,
  rejectAdmission,
  linkParentToStudent,
  unlinkParentFromStudent,
  searchStudentForLinking,
} from "@/lib/firestore";
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  FileText,
  Calendar,
  Bell,
  LogOut,
  CheckCircle2,
  XCircle,
  Clock,
  Eye,
  Trash2,
  Plus,
  Loader2,
  RefreshCw,
  Link as LinkIcon,
  Unlink,
  ClipboardList,
  Search,
  AlertCircle,
  History,
} from "lucide-react";

const AdminDashboard = () => {
  const { currentUser, userData, logout } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [actionLoading, setActionLoading] = useState(null);

  // Data states
  const [admissions, setAdmissions] = useState([]);
  const [students, setStudents] = useState([]);
  const [parents, setParents] = useState([]);
  const [pendingParents, setPendingParents] = useState([]);
  const [events, setEvents] = useState([]);
  const [notices, setNotices] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);

  // Modal states
  const [newEvent, setNewEvent] = useState({ title: "", date: "", description: "" });
  const [newNotice, setNewNotice] = useState({ title: "", content: "" });
  const [linkSearch, setLinkSearch] = useState({ studentName: "", studentEmail: "" });
  const [selectedParentForLink, setSelectedParentForLink] = useState(null);

  const fetchData = async () => {
    try {
      const [
        admissionsData,
        studentsData,
        parentsData,
        pendingParentsData,
        eventsData,
        noticesData,
        logsData,
      ] = await Promise.all([
        getAdmissions(),
        getAllStudents(),
        getUsersByRole("parent"),
        getPendingParents(),
        getEvents(),
        getNotices(),
        getAuditLogs(50),
      ]);
      setAdmissions(admissionsData);
      setStudents(studentsData);
      setParents(parentsData);
      setPendingParents(pendingParentsData);
      setEvents(eventsData);
      setNotices(noticesData);
      setAuditLogs(logsData);
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
    fetchData();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  // Approve admission
  const handleApproveAdmission = async (admissionId) => {
    setActionLoading(admissionId);
    try {
      const studentId = await approveAdmission(admissionId, currentUser.uid, userData?.name || "Admin");
      toast({
        title: "Application Approved",
        description: "Student record created successfully.",
      });
      fetchData();
    } catch (error) {
      console.error("Error approving admission:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to approve application.",
      });
    } finally {
      setActionLoading(null);
    }
  };

  // Reject admission
  const handleRejectAdmission = async (admissionId) => {
    setActionLoading(admissionId);
    try {
      await rejectAdmission(admissionId, currentUser.uid, userData?.name || "Admin");
      toast({
        title: "Application Rejected",
        description: "The application has been rejected.",
      });
      fetchData();
    } catch (error) {
      console.error("Error rejecting admission:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to reject application.",
      });
    } finally {
      setActionLoading(null);
    }
  };

  // Link parent to student
  const handleLinkParent = async (parentUid, studentId) => {
    setActionLoading(`link-${parentUid}`);
    try {
      await linkParentToStudent(parentUid, studentId, currentUser.uid, userData?.name || "Admin");
      toast({
        title: "Parent Linked",
        description: "Parent has been linked to the student.",
      });
      fetchData();
      setSelectedParentForLink(null);
      setLinkSearch({ studentName: "", studentEmail: "" });
    } catch (error) {
      console.error("Error linking parent:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to link parent.",
      });
    } finally {
      setActionLoading(null);
    }
  };

  // Unlink parent from student
  const handleUnlinkParent = async (parentUid, studentId) => {
    setActionLoading(`unlink-${parentUid}-${studentId}`);
    try {
      await unlinkParentFromStudent(parentUid, studentId, currentUser.uid, userData?.name || "Admin");
      toast({
        title: "Parent Unlinked",
        description: "Parent has been unlinked from the student.",
      });
      fetchData();
    } catch (error) {
      console.error("Error unlinking parent:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to unlink parent.",
      });
    } finally {
      setActionLoading(null);
    }
  };

  const handleCreateEvent = async () => {
    if (!newEvent.title || !newEvent.date) {
      toast({ variant: "destructive", title: "Error", description: "Please fill in all required fields." });
      return;
    }
    try {
      await createEvent(newEvent);
      setNewEvent({ title: "", date: "", description: "" });
      toast({ title: "Event Created", description: "New event has been added." });
      fetchData();
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: "Failed to create event." });
    }
  };

  const handleDeleteEvent = async (eventId) => {
    try {
      await deleteEvent(eventId);
      toast({ title: "Event Deleted", description: "Event has been removed." });
      fetchData();
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: "Failed to delete event." });
    }
  };

  const handleCreateNotice = async () => {
    if (!newNotice.title || !newNotice.content) {
      toast({ variant: "destructive", title: "Error", description: "Please fill in all fields." });
      return;
    }
    try {
      await createNotice(newNotice);
      setNewNotice({ title: "", content: "" });
      toast({ title: "Notice Created", description: "New notice has been posted." });
      fetchData();
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: "Failed to create notice." });
    }
  };

  const handleDeleteNotice = async (noticeId) => {
    try {
      await deleteNotice(noticeId);
      toast({ title: "Notice Deleted", description: "Notice has been removed." });
      fetchData();
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: "Failed to delete notice." });
    }
  };

  const tabs = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "admissions", label: "Admissions", icon: FileText },
    { id: "pending-parents", label: "Parent Links", icon: LinkIcon },
    { id: "students", label: "Students", icon: GraduationCap },
    { id: "parents", label: "Parents", icon: Users },
    { id: "events", label: "Events", icon: Calendar },
    { id: "notices", label: "Notices", icon: Bell },
    { id: "audit", label: "Audit Log", icon: History },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "approved": return "text-accent";
      case "rejected": return "text-destructive";
      default: return "text-gold";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "approved": return CheckCircle2;
      case "rejected": return XCircle;
      default: return Clock;
    }
  };

  const pendingAdmissions = admissions.filter(a => a.status === "pending");

  // Get linked students for a parent
  const getLinkedStudentsForParent = (parentId, linkedStudentIds) => {
    return students.filter(s => linkedStudentIds?.includes(s.id));
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

  return (
    <PageLayout>
      <section className="bg-gradient-to-br from-primary to-primary/80 py-12 text-primary-foreground">
        <div className="container">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold">Admin Dashboard</h1>
              <p className="mt-1 text-primary-foreground/80">
                Welcome back, {userData?.name || "Administrator"}
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
          {/* Tab Navigation */}
          <div className="mb-8 flex flex-wrap gap-2">
            {tabs.map((tab) => (
              <Button
                key={tab.id}
                variant={activeTab === tab.id ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveTab(tab.id)}
                className={activeTab === tab.id ? "bg-primary" : ""}
              >
                <tab.icon className="mr-2 h-4 w-4" />
                {tab.label}
                {tab.id === "admissions" && pendingAdmissions.length > 0 && (
                  <span className="ml-2 rounded-full bg-gold px-2 py-0.5 text-xs text-gold-foreground">
                    {pendingAdmissions.length}
                  </span>
                )}
                {tab.id === "pending-parents" && pendingParents.length > 0 && (
                  <span className="ml-2 rounded-full bg-gold px-2 py-0.5 text-xs text-gold-foreground">
                    {pendingParents.length}
                  </span>
                )}
              </Button>
            ))}
          </div>

          {/* Overview Tab */}
          {activeTab === "overview" && (
            <AnimatedSection>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="rounded-lg bg-gold/10 p-3">
                        <FileText className="h-6 w-6 text-gold" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Pending Applications</p>
                        <p className="text-2xl font-bold">{pendingAdmissions.length}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="rounded-lg bg-accent/10 p-3">
                        <GraduationCap className="h-6 w-6 text-accent" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Approved Students</p>
                        <p className="text-2xl font-bold">{students.length}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="rounded-lg bg-primary/10 p-3">
                        <Users className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Linked Parents</p>
                        <p className="text-2xl font-bold">{parents.length}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="rounded-lg bg-destructive/10 p-3">
                        <AlertCircle className="h-6 w-6 text-destructive" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Pending Parent Links</p>
                        <p className="text-2xl font-bold">{pendingParents.length}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="mt-8 grid gap-6 lg:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Recent Pending Admissions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {pendingAdmissions.slice(0, 5).length === 0 ? (
                      <p className="text-sm text-muted-foreground">No pending applications.</p>
                    ) : (
                      <div className="space-y-3">
                        {pendingAdmissions.slice(0, 5).map((admission) => (
                          <div key={admission.id} className="flex items-center justify-between rounded-lg border p-3">
                            <div>
                              <p className="font-medium">{admission.studentName}</p>
                              <p className="text-sm text-muted-foreground">{admission.gradeApplyingFor}</p>
                            </div>
                            <div className="flex items-center gap-1 text-gold">
                              <Clock className="h-4 w-4" />
                              <span className="text-sm">Pending</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Recent Audit Log</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {auditLogs.slice(0, 5).length === 0 ? (
                      <p className="text-sm text-muted-foreground">No audit entries yet.</p>
                    ) : (
                      <div className="space-y-3">
                        {auditLogs.slice(0, 5).map((log) => (
                          <div key={log.id} className="rounded-lg border p-3">
                            <p className="text-sm font-medium">{log.action.replace(/_/g, " ")}</p>
                            <p className="text-xs text-muted-foreground">
                              By {log.performedByName} • {new Date(log.timestamp).toLocaleString()}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </AnimatedSection>
          )}

          {/* Admissions Tab */}
          {activeTab === "admissions" && (
            <AnimatedSection>
              <Card>
                <CardHeader>
                  <CardTitle>Admission Applications</CardTitle>
                </CardHeader>
                <CardContent>
                  {admissions.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">No applications yet.</p>
                  ) : (
                    <div className="space-y-4">
                      {admissions.map((admission) => {
                        const StatusIcon = getStatusIcon(admission.status);
                        return (
                          <div key={admission.id} className="flex flex-col gap-4 rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between">
                            <div className="space-y-1">
                              <p className="font-medium">{admission.studentName}</p>
                              <p className="text-sm text-muted-foreground">
                                Parent: {admission.parentName} | Grade: {admission.gradeApplyingFor}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                Email: {admission.email} | Phone: {admission.phone}
                              </p>
                              {admission.approvedAt && (
                                <p className="text-xs text-accent">
                                  Approved by {admission.approvedByName} on {new Date(admission.approvedAt).toLocaleDateString()}
                                </p>
                              )}
                              {admission.rejectedAt && (
                                <p className="text-xs text-destructive">
                                  Rejected by {admission.rejectedByName} on {new Date(admission.rejectedAt).toLocaleDateString()}
                                </p>
                              )}
                            </div>
                            <div className="flex items-center gap-2">
                              <div className={`flex items-center gap-1 ${getStatusColor(admission.status)}`}>
                                <StatusIcon className="h-4 w-4" />
                                <span className="text-sm capitalize">{admission.status}</span>
                              </div>
                              {admission.status === "pending" && (
                                <div className="flex gap-2">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleRejectAdmission(admission.id)}
                                    disabled={actionLoading === admission.id}
                                    className="text-destructive hover:text-destructive"
                                  >
                                    {actionLoading === admission.id ? (
                                      <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : (
                                      <XCircle className="h-4 w-4" />
                                    )}
                                  </Button>
                                  <Button
                                    size="sm"
                                    onClick={() => handleApproveAdmission(admission.id)}
                                    disabled={actionLoading === admission.id}
                                    className="bg-accent hover:bg-accent/90"
                                  >
                                    {actionLoading === admission.id ? (
                                      <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : (
                                      <>
                                        <CheckCircle2 className="mr-1 h-4 w-4" />
                                        Approve
                                      </>
                                    )}
                                  </Button>
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>
            </AnimatedSection>
          )}

          {/* Pending Parents Tab */}
          {activeTab === "pending-parents" && (
            <AnimatedSection>
              <Card>
                <CardHeader>
                  <CardTitle>Pending Parent Link Requests</CardTitle>
                </CardHeader>
                <CardContent>
                  {pendingParents.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">No pending parent link requests.</p>
                  ) : (
                    <div className="space-y-4">
                      {pendingParents.map((parent) => (
                        <div key={parent.id} className="rounded-lg border p-4">
                          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                            <div className="space-y-1">
                              <p className="font-medium">{parent.name}</p>
                              <p className="text-sm text-muted-foreground">{parent.email}</p>
                              <div className="mt-2 rounded bg-muted p-2">
                                <p className="text-xs font-medium text-muted-foreground">Requested Child:</p>
                                <p className="text-sm">Name: {parent.requestedChildName || "N/A"}</p>
                                <p className="text-sm">Email: {parent.requestedChildEmail || "N/A"}</p>
                              </div>
                            </div>
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button
                                  size="sm"
                                  onClick={() => setSelectedParentForLink(parent)}
                                >
                                  <LinkIcon className="mr-2 h-4 w-4" />
                                  Link to Student
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Link Parent to Student</DialogTitle>
                                  <DialogDescription>
                                    Select a student to link to {parent.name}
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4 py-4">
                                  <p className="text-sm text-muted-foreground">
                                    Parent requested: <strong>{parent.requestedChildName}</strong> ({parent.requestedChildEmail})
                                  </p>
                                  <div className="max-h-60 space-y-2 overflow-y-auto">
                                    {students.map((student) => (
                                      <div
                                        key={student.id}
                                        className="flex items-center justify-between rounded-lg border p-3 hover:bg-muted"
                                      >
                                        <div>
                                          <p className="font-medium">{student.name}</p>
                                          <p className="text-sm text-muted-foreground">
                                            {student.email} • Class {student.class}
                                          </p>
                                        </div>
                                        <Button
                                          size="sm"
                                          onClick={() => handleLinkParent(parent.id, student.id)}
                                          disabled={actionLoading === `link-${parent.id}`}
                                        >
                                          {actionLoading === `link-${parent.id}` ? (
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                          ) : (
                                            "Link"
                                          )}
                                        </Button>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </DialogContent>
                            </Dialog>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </AnimatedSection>
          )}

          {/* Students Tab */}
          {activeTab === "students" && (
            <AnimatedSection>
              <Card>
                <CardHeader>
                  <CardTitle>Approved Students</CardTitle>
                </CardHeader>
                <CardContent>
                  {students.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">No approved students yet.</p>
                  ) : (
                    <div className="space-y-4">
                      {students.map((student) => {
                        const linkedParents = parents.filter(p => 
                          p.linkedStudentIds?.includes(student.id)
                        );
                        return (
                          <div key={student.id} className="rounded-lg border p-4">
                            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                              <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                  <GraduationCap className="h-5 w-5 text-primary" />
                                  <p className="font-medium">{student.name}</p>
                                </div>
                                <p className="text-sm text-muted-foreground">{student.email}</p>
                                <p className="text-sm text-muted-foreground">
                                  Class {student.class} - Section {student.section}
                                </p>
                                {linkedParents.length > 0 && (
                                  <div className="mt-2">
                                    <p className="text-xs font-medium text-muted-foreground mb-1">Linked Parents:</p>
                                    <div className="space-y-1">
                                      {linkedParents.map((parent) => (
                                        <div key={parent.id} className="flex items-center justify-between rounded bg-accent/10 px-2 py-1">
                                          <span className="text-sm">{parent.name} ({parent.email})</span>
                                          <Button
                                            size="sm"
                                            variant="ghost"
                                            className="h-6 w-6 p-0 text-destructive hover:text-destructive"
                                            onClick={() => handleUnlinkParent(parent.id, student.id)}
                                            disabled={actionLoading === `unlink-${parent.id}-${student.id}`}
                                          >
                                            {actionLoading === `unlink-${parent.id}-${student.id}` ? (
                                              <Loader2 className="h-3 w-3 animate-spin" />
                                            ) : (
                                              <Unlink className="h-3 w-3" />
                                            )}
                                          </Button>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}
                                {linkedParents.length === 0 && (
                                  <p className="text-xs text-muted-foreground italic">No linked parents</p>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>
            </AnimatedSection>
          )}

          {/* Parents Tab */}
          {activeTab === "parents" && (
            <AnimatedSection>
              <Card>
                <CardHeader>
                  <CardTitle>Linked Parents</CardTitle>
                </CardHeader>
                <CardContent>
                  {parents.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">No linked parents yet.</p>
                  ) : (
                    <div className="grid gap-4 md:grid-cols-2">
                      {parents.map((parent) => {
                        const linkedStudents = getLinkedStudentsForParent(parent.id, parent.linkedStudentIds);
                        return (
                          <Card key={parent.id}>
                            <CardContent className="p-4">
                              <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gold/10">
                                  <Users className="h-5 w-5 text-gold" />
                                </div>
                                <div className="flex-1">
                                  <p className="font-medium">{parent.name}</p>
                                  <p className="text-sm text-muted-foreground">{parent.email}</p>
                                </div>
                              </div>
                              {linkedStudents.length > 0 && (
                                <div className="mt-3 border-t pt-3">
                                  <p className="text-xs font-medium text-muted-foreground mb-1">Linked Students:</p>
                                  {linkedStudents.map((student) => (
                                    <p key={student.id} className="text-sm">
                                      {student.name} (Class {student.class})
                                    </p>
                                  ))}
                                </div>
                              )}
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>
            </AnimatedSection>
          )}

          {/* Events Tab */}
          {activeTab === "events" && (
            <AnimatedSection>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Events</CardTitle>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button size="sm">
                        <Plus className="mr-1 h-4 w-4" />
                        Add Event
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Create New Event</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <Label htmlFor="eventTitle">Title *</Label>
                          <Input
                            id="eventTitle"
                            value={newEvent.title}
                            onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                            placeholder="Event title"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="eventDate">Date *</Label>
                          <Input
                            id="eventDate"
                            type="date"
                            value={newEvent.date}
                            onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="eventDesc">Description</Label>
                          <Textarea
                            id="eventDesc"
                            value={newEvent.description}
                            onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                            placeholder="Event description"
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <DialogClose asChild>
                          <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        <DialogClose asChild>
                          <Button onClick={handleCreateEvent}>Create Event</Button>
                        </DialogClose>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </CardHeader>
                <CardContent>
                  {events.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">No events yet.</p>
                  ) : (
                    <div className="space-y-4">
                      {events.map((event) => (
                        <div key={event.id} className="flex items-start justify-between rounded-lg border p-4">
                          <div className="space-y-1">
                            <p className="font-medium">{event.title}</p>
                            <p className="text-sm text-muted-foreground">{event.date}</p>
                            {event.description && (
                              <p className="text-sm text-muted-foreground">{event.description}</p>
                            )}
                          </div>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-destructive hover:text-destructive"
                            onClick={() => handleDeleteEvent(event.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </AnimatedSection>
          )}

          {/* Notices Tab */}
          {activeTab === "notices" && (
            <AnimatedSection>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Notices</CardTitle>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button size="sm">
                        <Plus className="mr-1 h-4 w-4" />
                        Add Notice
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Create New Notice</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <Label htmlFor="noticeTitle">Title *</Label>
                          <Input
                            id="noticeTitle"
                            value={newNotice.title}
                            onChange={(e) => setNewNotice({ ...newNotice, title: e.target.value })}
                            placeholder="Notice title"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="noticeContent">Content *</Label>
                          <Textarea
                            id="noticeContent"
                            value={newNotice.content}
                            onChange={(e) => setNewNotice({ ...newNotice, content: e.target.value })}
                            placeholder="Notice content"
                            rows={4}
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <DialogClose asChild>
                          <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        <DialogClose asChild>
                          <Button onClick={handleCreateNotice}>Post Notice</Button>
                        </DialogClose>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </CardHeader>
                <CardContent>
                  {notices.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">No notices yet.</p>
                  ) : (
                    <div className="space-y-4">
                      {notices.map((notice) => (
                        <div key={notice.id} className="flex items-start justify-between rounded-lg border p-4">
                          <div className="space-y-1">
                            <p className="font-medium">{notice.title}</p>
                            <p className="text-sm text-muted-foreground">{notice.content}</p>
                          </div>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-destructive hover:text-destructive"
                            onClick={() => handleDeleteNotice(notice.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </AnimatedSection>
          )}

          {/* Audit Log Tab */}
          {activeTab === "audit" && (
            <AnimatedSection>
              <Card>
                <CardHeader>
                  <CardTitle>Audit Log</CardTitle>
                </CardHeader>
                <CardContent>
                  {auditLogs.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">No audit entries yet.</p>
                  ) : (
                    <div className="space-y-3">
                      {auditLogs.map((log) => (
                        <div key={log.id} className="rounded-lg border p-4">
                          <div className="flex items-start justify-between">
                            <div className="space-y-1">
                              <p className="font-medium">{log.action.replace(/_/g, " ")}</p>
                              <p className="text-sm text-muted-foreground">
                                By {log.performedByName}
                              </p>
                              {log.details && (
                                <div className="mt-2 rounded bg-muted p-2 text-xs">
                                  {Object.entries(log.details).map(([key, value]) => (
                                    <p key={key}>
                                      <strong>{key}:</strong> {String(value)}
                                    </p>
                                  ))}
                                </div>
                              )}
                            </div>
                            <span className="text-xs text-muted-foreground">
                              {new Date(log.timestamp).toLocaleString()}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </AnimatedSection>
          )}
        </div>
      </section>
    </PageLayout>
  );
};

export default AdminDashboard;
