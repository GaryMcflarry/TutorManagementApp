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

// Function to get the current user's data
export const getCurrentUser = async () => {
  try {
    const currentUser = FIREBASE_AUTH.currentUser;
    if (!currentUser) {
        console.log("No user is currently signed in")
        return null;
    } else {
        // console.log('Current User: ', currentUser);
        const userDoc = await getDoc(doc(FIREBASE_DB, "User", currentUser.uid));
        return userDoc.exists() ? userDoc.data() : null;
    }

  } catch (error) {
    console.error("Error fetching current user:", error);
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
    return tutorDataArray.filter(tutor => tutor !== null); // Filter out any null responses
  } catch (error) {
    console.error("Error fetching tutor data:", error);
    return [];
  } 
}