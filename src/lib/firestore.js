import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy,
  addDoc,
  arrayUnion,
  arrayRemove,
  serverTimestamp 
} from "firebase/firestore";
import { db } from "@/lib/firebase";

// ==================== USERS ====================
export const getUserById = async (userId) => {
  const docRef = doc(db, "users", userId);
  const docSnap = await getDoc(docRef);
  return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null;
};

export const updateUser = async (userId, data) => {
  const docRef = doc(db, "users", userId);
  await updateDoc(docRef, { ...data, updatedAt: new Date().toISOString() });
};

export const getAllUsers = async () => {
  const querySnapshot = await getDocs(collection(db, "users"));
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const getUsersByRole = async (role) => {
  const q = query(collection(db, "users"), where("role", "==", role));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const getUsersByRoles = async (roles) => {
  const q = query(collection(db, "users"), where("role", "in", roles));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const getPendingParents = async () => {
  const q = query(collection(db, "users"), where("role", "==", "pending_parent"));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// ==================== ADMISSIONS ====================
export const submitAdmission = async (data) => {
  const docRef = await addDoc(collection(db, "admissions"), {
    ...data,
    status: "pending",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  });
  return docRef.id;
};

export const getAdmissions = async () => {
  const q = query(collection(db, "admissions"), orderBy("createdAt", "desc"));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const getPendingAdmissions = async () => {
  const q = query(
    collection(db, "admissions"), 
    where("status", "==", "pending"),
    orderBy("createdAt", "desc")
  );
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const getAdmissionById = async (admissionId) => {
  const docRef = doc(db, "admissions", admissionId);
  const docSnap = await getDoc(docRef);
  return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null;
};

export const updateAdmissionStatus = async (admissionId, status, notes = "") => {
  const docRef = doc(db, "admissions", admissionId);
  await updateDoc(docRef, { 
    status, 
    adminNotes: notes,
    updatedAt: new Date().toISOString() 
  });
};

// Approve admission and create student record
export const approveAdmission = async (admissionId, adminUid, adminName) => {
  const admission = await getAdmissionById(admissionId);
  if (!admission) throw new Error("Admission not found");
  
  // Update admission status
  const admissionRef = doc(db, "admissions", admissionId);
  await updateDoc(admissionRef, {
    status: "approved",
    approvedBy: adminUid,
    approvedByName: adminName,
    approvedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  });
  
  // Create student record
  const studentData = {
    name: admission.studentName,
    email: admission.email,
    applicantUid: admission.applicantUid || null,
    admissionId: admissionId,
    class: admission.gradeApplyingFor || admission.grade,
    section: "A", // Default section
    rollNo: "", // To be assigned
    parentIds: [],
    parentName: admission.parentName,
    parentEmail: admission.parentEmail || admission.email,
    phone: admission.phone,
    timetable: null,
    scorecards: [],
    attendance: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  const studentRef = await addDoc(collection(db, "students"), studentData);
  
  // Update user role if applicantUid exists
  if (admission.applicantUid) {
    const userRef = doc(db, "users", admission.applicantUid);
    await updateDoc(userRef, {
      role: "student",
      studentId: studentRef.id,
      updatedAt: new Date().toISOString()
    });
  }
  
  // Log the action
  await createAuditLog({
    action: "ADMISSION_APPROVED",
    targetType: "admission",
    targetId: admissionId,
    performedBy: adminUid,
    performedByName: adminName,
    details: {
      studentName: admission.studentName,
      studentId: studentRef.id
    }
  });
  
  // Try to auto-link any pending parents who requested this student
  await tryAutoLinkPendingParents(studentRef.id, admission.studentName, admission.email);
  
  return studentRef.id;
};

export const rejectAdmission = async (admissionId, adminUid, adminName, reason = "") => {
  const admission = await getAdmissionById(admissionId);
  if (!admission) throw new Error("Admission not found");
  
  const admissionRef = doc(db, "admissions", admissionId);
  await updateDoc(admissionRef, {
    status: "rejected",
    rejectedBy: adminUid,
    rejectedByName: adminName,
    rejectedAt: new Date().toISOString(),
    rejectionReason: reason,
    updatedAt: new Date().toISOString()
  });
  
  // Update user role if applicantUid exists
  if (admission.applicantUid) {
    const userRef = doc(db, "users", admission.applicantUid);
    await updateDoc(userRef, {
      role: "rejected_student",
      updatedAt: new Date().toISOString()
    });
  }
  
  await createAuditLog({
    action: "ADMISSION_REJECTED",
    targetType: "admission",
    targetId: admissionId,
    performedBy: adminUid,
    performedByName: adminName,
    details: {
      studentName: admission.studentName,
      reason
    }
  });
};

// ==================== STUDENTS ====================
export const createStudent = async (studentData) => {
  const docRef = await addDoc(collection(db, "students"), {
    ...studentData,
    parentIds: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  });
  return docRef.id;
};

export const getStudentById = async (studentId) => {
  const docRef = doc(db, "students", studentId);
  const docSnap = await getDoc(docRef);
  return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null;
};

export const getStudentByUserId = async (userId) => {
  const q = query(collection(db, "students"), where("applicantUid", "==", userId));
  const querySnapshot = await getDocs(q);
  if (querySnapshot.empty) return null;
  const doc = querySnapshot.docs[0];
  return { id: doc.id, ...doc.data() };
};

export const getAllStudents = async () => {
  const querySnapshot = await getDocs(collection(db, "students"));
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const updateStudent = async (studentId, data) => {
  const docRef = doc(db, "students", studentId);
  await updateDoc(docRef, { ...data, updatedAt: new Date().toISOString() });
};

export const getStudentsByParentId = async (parentId) => {
  const q = query(collection(db, "students"), where("parentIds", "array-contains", parentId));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// Search students by name and email for linking
export const searchStudentForLinking = async (studentName, studentEmail) => {
  // Normalize for comparison - remove extra spaces and lowercase
  const normalizedName = studentName.toLowerCase().trim().replace(/\s+/g, ' ');
  const normalizedEmail = studentEmail.toLowerCase().trim();
  
  console.log("🔍 Parent linking - searching for student:", { normalizedName, normalizedEmail });
  
  // Get all students and filter (Firestore doesn't support case-insensitive queries well)
  const querySnapshot = await getDocs(collection(db, "students"));
  const students = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  
  console.log("📋 All students in database:", students.map(s => ({ 
    id: s.id, 
    name: s.name, 
    email: s.email,
    parentEmail: s.parentEmail
  })));
  
  // Find match - normalize student data and check both email and parentEmail fields
  const match = students.find(s => {
    const sName = (s.name || "").toLowerCase().trim().replace(/\s+/g, ' ');
    const sEmail = (s.email || "").toLowerCase().trim();
    const sParentEmail = (s.parentEmail || "").toLowerCase().trim();
    
    const nameMatches = sName === normalizedName;
    // Check both email fields - student email OR the parent email from application
    const emailMatches = sEmail === normalizedEmail || sParentEmail === normalizedEmail;
    
    console.log("🔄 Comparing:", { 
      studentName: sName, 
      studentEmail: sEmail,
      studentParentEmail: sParentEmail,
      inputName: normalizedName, 
      inputEmail: normalizedEmail,
      nameMatches,
      emailMatches
    });
    
    return nameMatches && emailMatches;
  });
  
  console.log("✅ Match result:", match ? { id: match.id, name: match.name } : "No match found");
  
  return match || null;
};

// ==================== PARENT-STUDENT LINKING ====================
export const linkParentToStudent = async (parentUid, studentId, adminUid, adminName) => {
  // Update student's parentIds
  const studentRef = doc(db, "students", studentId);
  await updateDoc(studentRef, {
    parentIds: arrayUnion(parentUid),
    updatedAt: new Date().toISOString()
  });
  
  // Update parent's linkedStudentIds and role
  const userRef = doc(db, "users", parentUid);
  const userDoc = await getDoc(userRef);
  const userData = userDoc.data();
  
  await updateDoc(userRef, {
    linkedStudentIds: arrayUnion(studentId),
    role: "parent", // Upgrade from pending_parent
    updatedAt: new Date().toISOString()
  });
  
  // Log the action
  const student = await getStudentById(studentId);
  await createAuditLog({
    action: "PARENT_LINKED",
    targetType: "parent",
    targetId: parentUid,
    performedBy: adminUid,
    performedByName: adminName,
    details: {
      parentName: userData?.name,
      parentEmail: userData?.email,
      studentId,
      studentName: student?.name
    }
  });
};

export const unlinkParentFromStudent = async (parentUid, studentId, adminUid, adminName) => {
  // Remove from student's parentIds
  const studentRef = doc(db, "students", studentId);
  await updateDoc(studentRef, {
    parentIds: arrayRemove(parentUid),
    updatedAt: new Date().toISOString()
  });
  
  // Remove from parent's linkedStudentIds
  const userRef = doc(db, "users", parentUid);
  const userDoc = await getDoc(userRef);
  const userData = userDoc.data();
  
  const remainingStudents = (userData.linkedStudentIds || []).filter(id => id !== studentId);
  
  await updateDoc(userRef, {
    linkedStudentIds: arrayRemove(studentId),
    // If no more linked students, set back to pending
    role: remainingStudents.length === 0 ? "pending_parent" : "parent",
    updatedAt: new Date().toISOString()
  });
  
  // Log the action
  const student = await getStudentById(studentId);
  await createAuditLog({
    action: "PARENT_UNLINKED",
    targetType: "parent",
    targetId: parentUid,
    performedBy: adminUid,
    performedByName: adminName,
    details: {
      parentName: userData?.name,
      parentEmail: userData?.email,
      studentId,
      studentName: student?.name
    }
  });
};

// Try auto-linking pending parents when a student is approved
export const tryAutoLinkPendingParents = async (studentId, studentName, studentEmail) => {
  const student = await getStudentById(studentId);
  if (!student) return;
  
  const pendingParents = await getPendingParents();
  
  for (const parent of pendingParents) {
    const requestedChildName = (parent.requestedChildName || "").toLowerCase().trim();
    const requestedChildEmail = (parent.requestedChildEmail || "").toLowerCase().trim();
    
    if (
      requestedChildName === studentName.toLowerCase().trim() &&
      requestedChildEmail === studentEmail.toLowerCase().trim()
    ) {
      // Auto-link this parent
      const studentRef = doc(db, "students", studentId);
      await updateDoc(studentRef, {
        parentIds: arrayUnion(parent.id),
        updatedAt: new Date().toISOString()
      });
      
      const userRef = doc(db, "users", parent.id);
      await updateDoc(userRef, {
        linkedStudentIds: arrayUnion(studentId),
        role: "parent",
        autoLinked: true,
        autoLinkedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
      
      await createAuditLog({
        action: "PARENT_AUTO_LINKED",
        targetType: "parent",
        targetId: parent.id,
        performedBy: "system",
        performedByName: "System",
        details: {
          parentName: parent.name,
          parentEmail: parent.email,
          studentId,
          studentName
        }
      });
    }
  }
};

// ==================== AUDIT LOG ====================
export const createAuditLog = async (logData) => {
  await addDoc(collection(db, "auditLogs"), {
    ...logData,
    timestamp: new Date().toISOString()
  });
};

export const getAuditLogs = async (limit = 50) => {
  const q = query(collection(db, "auditLogs"), orderBy("timestamp", "desc"));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.slice(0, limit).map(doc => ({ id: doc.id, ...doc.data() }));
};

// ==================== EVENTS ====================
export const createEvent = async (eventData) => {
  const docRef = await addDoc(collection(db, "events"), {
    ...eventData,
    createdAt: new Date().toISOString()
  });
  return docRef.id;
};

export const getEvents = async () => {
  const q = query(collection(db, "events"), orderBy("date", "desc"));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const getUpcomingEvents = async () => {
  const today = new Date().toISOString().split('T')[0];
  const q = query(
    collection(db, "events"), 
    where("date", ">=", today),
    orderBy("date", "asc")
  );
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const updateEvent = async (eventId, data) => {
  const docRef = doc(db, "events", eventId);
  await updateDoc(docRef, { ...data, updatedAt: new Date().toISOString() });
};

export const deleteEvent = async (eventId) => {
  const docRef = doc(db, "events", eventId);
  await deleteDoc(docRef);
};

// ==================== NOTICES ====================
export const createNotice = async (noticeData) => {
  const docRef = await addDoc(collection(db, "notices"), {
    ...noticeData,
    createdAt: new Date().toISOString()
  });
  return docRef.id;
};

export const getNotices = async () => {
  const q = query(collection(db, "notices"), orderBy("createdAt", "desc"));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const deleteNotice = async (noticeId) => {
  const docRef = doc(db, "notices", noticeId);
  await deleteDoc(docRef);
};

// ==================== RESOURCES ====================
export const createResource = async (resourceData) => {
  const docRef = await addDoc(collection(db, "resources"), {
    ...resourceData,
    createdAt: new Date().toISOString()
  });
  return docRef.id;
};

export const getResources = async (type = null) => {
  let q;
  if (type) {
    q = query(collection(db, "resources"), where("type", "==", type), orderBy("createdAt", "desc"));
  } else {
    q = query(collection(db, "resources"), orderBy("createdAt", "desc"));
  }
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const deleteResource = async (resourceId) => {
  const docRef = doc(db, "resources", resourceId);
  await deleteDoc(docRef);
};
