import { createContext, useContext, useState, useEffect } from "react";
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged 
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { submitAdmission, searchStudentForLinking, linkParentToStudent, createAuditLog } from "@/lib/firestore";

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Register new student (creates admission application)
  const registerStudent = async (email, password, name, admissionData) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Store user data with pending_student role
    await setDoc(doc(db, "users", user.uid), {
      name,
      email,
      role: "pending_student",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });

    // Create admission application
    const admissionId = await submitAdmission({
      ...admissionData,
      applicantUid: user.uid,
      applicantName: name,
      applicantEmail: email,
      studentName: admissionData.studentName || name,
      status: "pending"
    });

    return { user, admissionId };
  };

  // Register new parent with auto-linking attempt
  const registerParent = async (email, password, name, childName, childEmail) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // IMPORTANT SECURITY NOTE:
    // Auto-linking requires reading student records, which is typically blocked by Firestore rules
    // for non-admin users (to prevent data exposure). So we always create the parent as
    // pending_parent and let an admin (or the admin approval flow) perform the linking.
    await setDoc(doc(db, "users", user.uid), {
      name,
      email,
      role: "pending_parent",
      linkedStudentIds: [],
      requestedChildName: childName,
      requestedChildEmail: childEmail,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });

    return { user, linked: false };
  };

  // Legacy register function (kept for backward compatibility)
  const register = async (email, password, name, role) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    await setDoc(doc(db, "users", user.uid), {
      name,
      email,
      role,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });

    return user;
  };

  // Login user
  const login = async (email, password) => {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  };

  // Logout user
  const logout = async () => {
    await signOut(auth);
    setUserRole(null);
    setUserData(null);
  };

  // Fetch user role and data from Firestore
  const fetchUserData = async (uid) => {
    try {
      const userDoc = await getDoc(doc(db, "users", uid));
      if (userDoc.exists()) {
        const data = userDoc.data();
        setUserRole(data.role);
        setUserData(data);
        return data;
      }
      return null;
    } catch (error) {
      console.error("Error fetching user data:", error);
      return null;
    }
  };

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        await fetchUserData(user.uid);
      } else {
        setUserRole(null);
        setUserData(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // Check if user has a specific role
  const hasRole = (role) => {
    return userRole === role;
  };

  // Check if user is admin
  const isAdmin = () => hasRole("admin");

  // Check if user is student (approved)
  const isStudent = () => hasRole("student");

  // Check if user is pending student
  const isPendingStudent = () => hasRole("pending_student");

  // Check if user is parent (linked)
  const isParent = () => hasRole("parent");

  // Check if user is pending parent
  const isPendingParent = () => hasRole("pending_parent");

  // Check if user has access (approved roles only)
  const hasAccess = () => {
    return ["admin", "student", "parent"].includes(userRole);
  };

  // Get user status message
  const getStatusMessage = () => {
    switch (userRole) {
      case "pending_student":
        return "Your application is pending admin approval.";
      case "pending_parent":
        return "We couldn't verify the linked student. Your account is pending admin verification.";
      case "rejected_student":
        return "Your application was not approved. Please contact the school for more information.";
      default:
        return null;
    }
  };

  const value = {
    currentUser,
    userRole,
    userData,
    loading,
    register,
    registerStudent,
    registerParent,
    login,
    logout,
    hasRole,
    isAdmin,
    isStudent,
    isPendingStudent,
    isParent,
    isPendingParent,
    hasAccess,
    getStatusMessage,
    fetchUserData
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
