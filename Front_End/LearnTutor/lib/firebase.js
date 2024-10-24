// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  getReactNativePersistence,
  initializeAuth,
} from "firebase/auth";
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  collection,
  query,
  where,
  onSnapshot,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";

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

// Function to sign in a user (Sign-in Page)
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

//Function for signing out of the application
export const signOut = async () => {
  try {
    await FIREBASE_AUTH.signOut();
  } catch (error) {
    throw new Error(error);
  }
};

//Function for fetching information on the current logged in user (Globalcontext)
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

//function for getting connected contacts for the current logged in user (Convo Page)
export const getConnectedUsers = async (user) => {
  if (!user) return [];

  let connectedUsers = [];

  try {
    // If the logged-in user is a student, fetch their tutors
    if (user.status === "student") {
      const tutorRefs = user.tutors || []; // Ensure `user.tutors` is an array
      const tutorPromises = tutorRefs.map(async (tutorId) => {
        const tutorDoc = await getDoc(doc(FIREBASE_DB, "User", tutorId)); // Fetch tutor document
        if (tutorDoc.exists()) {
          return { id: tutorDoc.id, ...tutorDoc.data() }; // Include the id in the returned data
        }
        return null;
      });
      connectedUsers = await Promise.all(tutorPromises);
      
      // If the logged-in user is a tutor, fetch their students
    } else if (user.status === "tutor") {
      const studentRefs = user.students || []; // Ensure `user.students` is an array
      const studentPromises = studentRefs.map(async (studentId) => {
        const studentDoc = await getDoc(doc(FIREBASE_DB, "User", studentId)); // Fetch student document
        if (studentDoc.exists()) {
          return { id: studentDoc.id, ...studentDoc.data() }; // Include the id in the returned data
        }
        return null;
      });
      connectedUsers = await Promise.all(studentPromises);
    }
  } catch (error) {
    console.error("Error fetching connected users: ", error);
  }
  // console.log("Connected Users: ", connectedUsers);
  return connectedUsers.filter(Boolean); // Filter out null values
};

export const fetchRecipientInfo = async (userId) => {
  try {
    // Fetch user document from Firestore
    const userDoc = await getDoc(doc(FIREBASE_DB, "User", userId));
    // Check if the user document exists and return the user data
    if (userDoc.exists()) {
      // console.log('text', userDoc.data());
      return userDoc.data(); // Return the data correctly
    } else {
      return null; // Return null if the document does not exist
    }
  } catch (error) {
    console.error("Error fetching recipient info: ", error);
  }
};

export const sendMessage = async (fromId, toId, messageContent) => {
  try {
    const newMessageRef = doc(
      FIREBASE_DB,
      "Conversations",
      generateMessageId()
    ); // Generate a new message ID
    await setDoc(newMessageRef, {
      fromId: fromId,
      message: messageContent,
      timeStamp: serverTimestamp(), // Set server-side timestamp
      toId: toId,
    });
    console.log("Message sent successfully!");
  } catch (error) {
    console.error("Error sending message: ", error);
  }
};
// Helper function to generate a unique message ID
const generateMessageId = () => {
  return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

export const fetchMessages = (userId, recipientId, setMessages) => {
  const messagesRef = collection(FIREBASE_DB, "Conversations");

  // Query messages sent from the current user to the recipient
  const fromUserToRecipient = query(
    messagesRef,
    where("fromId", "==", userId),
    where("toId", "==", recipientId),
    orderBy("timeStamp", "asc") // Ensure messages are ordered by time
  );

  // Query messages sent from the recipient to the current user
  const fromRecipientToUser = query(
    messagesRef,
    where("fromId", "==", recipientId),
    where("toId", "==", userId),
    orderBy("timeStamp", "asc") // Ensure messages are ordered by time
  );

  // Listener for messages from user to recipient
  const unsubscribeFromUserToRecipient = onSnapshot(
    fromUserToRecipient,
    (snapshot) => {
      // Map through snapshot docs to retrieve message data
      const fromUserMessages = snapshot.docs.map((doc) => ({
        id: doc.id, // Unique ID for each message
        ...doc.data(), // Spread the document data
      }));

      setMessages((prevMessages) => {
        // Combine new messages with the previous state
        const combinedMessages = [...prevMessages, ...fromUserMessages];
        // Ensure messages are unique by filtering based on the message ID
        const uniqueMessages = [
          ...new Map(combinedMessages.map((msg) => [msg.id, msg])).values(),
        ];
        // Sort messages by their timestamp
        return uniqueMessages.sort((a, b) => a.timeStamp - b.timeStamp);
      });
    }
  );

  // Listener for messages from recipient to user
  const unsubscribeFromRecipientToUser = onSnapshot(
    fromRecipientToUser,
    (snapshot) => {
      // Map through snapshot docs to retrieve message data
      const fromRecipientMessages = snapshot.docs.map((doc) => ({
        id: doc.id, // Unique ID for each message
        ...doc.data(), // Spread the document data
      }));

      setMessages((prevMessages) => {
        // Combine new messages with the previous state
        const combinedMessages = [...prevMessages, ...fromRecipientMessages];
        // Ensure messages are unique by filtering based on the message ID
        const uniqueMessages = [
          ...new Map(combinedMessages.map((msg) => [msg.id, msg])).values(),
        ];
        // Sort messages by their timestamp
        return uniqueMessages.sort((a, b) => a.timeStamp - b.timeStamp);
      });
    }
  );

  // Return the unsubscribe functions to stop listening when the component unmounts
  return () => {
    unsubscribeFromUserToRecipient(); // Stop listening to messages from user to recipient
    unsubscribeFromRecipientToUser(); // Stop listening to messages from recipient to user
  };
};

export const submittingHomework = async (studId, tutorId, subject, description, dueDate) => {
  try {
    const newHWRef = doc(
      FIREBASE_DB,
      "Homework",
      generateMessageId()
    ); // Generate a new message ID
    await setDoc(newHWRef, {
      completed: false,
      description: description,
      dueDate: dueDate,
      studentId: studId,
      subject: subject,
      tutorId: tutorId
    });
    console.log("Homework submitted successfully!");
  } catch (error) {
    console.error("Error sending message: ", error);
  }
};


export const fetchHomework = (userId) => {
  const homeworkRef = collection(FIREBASE_DB, "Homework");

  
  const homeworkForId = query(
    homeworkRef,
    where("studentId", "==", userId),
    where("tutorId", "==", userId),
    orderBy("subject", "asc") 
  );

  
  const unsubscribeFromHomeworkFetch = onSnapshot(
    homeworkForId,
    (snapshot) => {
      
      const homework = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(), 
      }));

      console.log("User Homework: ", homework);
    }
  );

  
  return () => {
     
    unsubscribeFromHomeworkFetch(); 
  };
};