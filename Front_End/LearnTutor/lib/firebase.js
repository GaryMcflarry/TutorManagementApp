// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  getReactNativePersistence,
  initializeAuth
} from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';


// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC2eF1Y6891qgShiJmeA9mhIrj9s4pIRAs",
  authDomain: "ltutor-7e7ab.firebaseapp.com",
  projectId: "ltutor-7e7ab",
  storageBucket: "ltutor-7e7ab.appspot.com",
  messagingSenderId: "424228330561",
  appId: "1:424228330561:web:12b42e1360e876dfdc3ac0",
};

// Initialize Firebase
const FIREBASE_APP = initializeApp(firebaseConfig);

const FIREBASE_AUTH = initializeAuth(FIREBASE_APP, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});
const FIREBASE_DB = getFirestore(FIREBASE_APP);

// Function to create a new user
export const createUser = async (email, password) => {
  try {
    // Create a new user with Firebase Authentication
    const userCredential = await createUserWithEmailAndPassword(
      FIREBASE_AUTH,
      email,
      password
    );
    const userId = userCredential.user.uid;

    // Add the user data to Firestore
    await setDoc(doc(FIREBASE_DB, "User", userId), {
      email: email,
      password: password,
      grade: null,
      address: null,
      availability: null,
      chatLink: null,
      meetingLink: null,
      status: null,
      students: null,
      subject: null,
      tutors: null,
    });

    //no signing in as admin must remain the current user of application
    // // Automatically sign the user in
    // await login(email, password);

    return userCredential.user;
  } catch (error) {
    throw new Error(`Failed to create user: ${error.message}`);
  }
};

// Function to sign in a user
export const login = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      FIREBASE_AUTH,
      email,
      password
    );
    //console.log("User signed in:", userCredential.user);
    return userCredential.user;
  } catch (error) {
    throw new Error(`Failed to sign in: ${error.message}`);
  }
};

export const signOut = async () => {
  try {
    await FIREBASE_AUTH.signOut()
  } catch (error) {
    throw new Error(error);
  }
};


export const getCurrentUser = async () => {
  try {
    const currentUser = FIREBASE_AUTH.currentUser;
    if (!currentUser) {
      console.log("No user is currently signed in");
      return null;
    } else {
      // Fetch user document from Firestore
      const userDoc = await getDoc(doc(FIREBASE_DB, "User", currentUser.uid));
      
      // Check if the user document exists and return the user data with UID
      if (userDoc.exists()) {
        return { uid: currentUser.uid, ...userDoc.data() }; // Include the UID in the returned data
      } else {
        return null; // Return null if the document does not exist
      }
    }
  } catch (error) {
    console.error("Error fetching current user:", error);
    return null; // Return null in case of an error
  }
};

export const getTutorInfoByStudent = async (user) => {
  try {
    // Get the array of tutor IDs (ensure it's an array)
    const tutorIds = user?.tutors;
    
    if (!Array.isArray(tutorIds) || tutorIds.length === 0) {
      console.log("No tutor IDs found.");
      return [];
    }

    // Fetch tutor data for each tutorId, by converting them into document references
    const tutorPromises = tutorIds.map(async (tutorId) => {
      if (!tutorId || typeof tutorId !== 'string') {
        console.warn("Invalid tutor ID:", tutorId);
        return null; // Skip invalid IDs
      }

      const tutorDoc = await getDoc(doc(FIREBASE_DB, "User", tutorId));
      return tutorDoc.exists() ? tutorDoc.data() : null;
    });

    // Wait for all promises to resolve
    const tutorDataArray = await Promise.all(tutorPromises);
    // console.log("TEST: ", tutorDataArray);
    return tutorDataArray.filter(tutor => tutor !== null); // Filter out any null responses
  } catch (error) {
    console.error("Error fetching tutor data:", error);
    return [];
  } 
}


export const getContacts = async (user) => {
  if (!user) return [];

  let connectedUsers = [];
  const db = FIREBASE_DB; // Use your Firestore instance

  try {
    // If the logged-in user is a student, fetch their tutors
    if (user.status === "student") {
      const tutorRefs = user.tutors || []; // Ensure `user.tutors` is an array
      const tutorPromises = tutorRefs.map(async (tutorId) => {
        const tutorDoc = await getDoc(doc(db, "User", tutorId)); // Fetch tutor document
        return tutorDoc.exists() ? tutorDoc.data() : null; // Safely check if the document exists
      });
      connectedUsers = await Promise.all(tutorPromises);

    // If the logged-in user is a tutor, fetch their students
    } else if (user.status === "tutor") {
      const studentRefs = user.students || []; // Ensure `user.tutors` is an array
      const studentPromises = studentRefs.map(async (studentId) => {
        const studentDoc = await getDoc(doc(db, "User", studentId)); // Fetch tutor document
        return studentDoc.exists() ? studentDoc.data() : null; // Safely check if the document exists
      });
      connectedUsers = await Promise.all(studentPromises);
    }

  } catch (error) {
    console.error("Error fetching connected users: ", error);
  }

  return connectedUsers.filter(Boolean); // Filter out null values
};