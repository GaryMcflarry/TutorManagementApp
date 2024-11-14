// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {
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
  getDocs,
  collection,
  query,
  where,
  onSnapshot,
  orderBy,
  serverTimestamp,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
import { getFunctions, httpsCallable } from "firebase/functions";
// Your web app's Firebase configuration for implementation
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

// Functions to create a new users (Sign-up Page)
//=============================================================================
//Function to create and store admin to firebase
export const createAdmin = async (email, password, status) => {
  try {
    //console.log("Status: ", status);
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
      status: status,
    });

    return userCredential.user;
  } catch (error) {
    throw new Error(`Failed to create user: ${error.message}`);
  }
};
//Function to create and store tutor to firebase
export const createTutor = async (
  email,
  password,
  status,
  fullName,
  meetingLink,
  chatLink,
  connectionsArray
) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      FIREBASE_AUTH,
      email,
      password
    );
    const userId = userCredential.user.uid;

    //console.log("Connections Array: ", connectionsArray);
    // Add the user data to Firestore
    await setDoc(doc(FIREBASE_DB, "User", userId), {
      email: email,
      password: password,
      availability: [],
      fullname: fullName,
      chatLink: chatLink,
      meetingLink: meetingLink,
      status: status,
      connections: connectionsArray, // Store the connections array here
    });

    return userCredential.user;
  } catch (error) {
    throw new Error(`Failed to create user: ${error.message}`);
  }
};
//Function to create and store student to firebase
export const createStudent = async (
  email,
  password,
  status,
  fullName,
  grade,
  address,
  connectionsArray
) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      FIREBASE_AUTH,
      email,
      password
    );
    const userId = userCredential.user.uid;

    // Filter out connections with a null tutor ID
    const filteredConnections = connectionsArray
      .map((conn) => {
        const [subject, tutorId] = conn.split(" "); // Split subject and tutorId
        return tutorId && tutorId !== "NoTutors" ? conn : subject; // If tutorId is null or "No Tutors", return only the subject
      })
      .filter((conn) => conn); // Remove any empty entries

    //console.log("Filtered Connections Array: ", filteredConnections);

    // Add the user data to Firestore
    await setDoc(doc(FIREBASE_DB, "User", userId), {
      email: email,
      availability: [],
      password: password,
      fullname: fullName,
      status: status,
      grade: grade,
      address: address,
      connections: filteredConnections, // Store the filtered connections array here
    });

    // Update the tutor's connections with the new student ID
    await updateTutorsConnections(filteredConnections, userId);

    return userCredential.user;
  } catch (error) {
    throw new Error(`Failed to create user: ${error.message}`);
  }
};
//=============================================================================

//
//=============================================================================
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
//Function for signing out of the application (Sign-in Page)
export const signOut = async () => {
  try {
    await FIREBASE_AUTH.signOut();
  } catch (error) {
    throw new Error(error);
  }
};
//=============================================================================

//Functions for fetching information on users
//=============================================================================

//Function to get current logged in user details
export const getCurrentUser = async () => {
  try {
    const currentUser = FIREBASE_AUTH.currentUser;
    if (!currentUser) {
      //console.log("No user is currently signed in");
      return null;
    } else {
      // Fetch user document from Firestore
      const userDoc = await getDoc(doc(FIREBASE_DB, "User", currentUser.uid));

      // Check if the user document exists and return the user data with UID
      if (userDoc.exists()) {
        //console.log("CURRENT USER Acknowledged")
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
//Function to get connected users for logged in user
export const getConnectedUsers = async (user) => {
  if (!user || !user.connections) return [];

  let connectedUsers = [];

  try {
    const connectionPromises = user.connections.map(async (connection) => {
      const [subject, userId] = connection.split(" ");

      if (userId) {
        const userDoc = await getDoc(doc(FIREBASE_DB, "User", userId));
        if (userDoc.exists()) {
          // console.log("CONNECTED USER:", userDoc.data());
          return { id: userDoc.id, subject, ...userDoc.data() };
        }
      } else {
        console.log(`No connection ID for subject: ${subject}`);
      }
      return null;
    });

    connectedUsers = await Promise.all(connectionPromises);
  } catch (error) {
    console.error("Error fetching connected users: ", error);
  }

  // console.log("CONNECTED USERS: ", connectedUsers)
  return connectedUsers.filter(Boolean);
};
//Function to get user details based of their id
export const fetchRecipientInfo = async (userId) => {
  try {
    // Fetch user document from Firestore
    const userDoc = await getDoc(doc(FIREBASE_DB, "User", userId));
    // Check if the user document exists and return the user data
    if (userDoc.exists()) {
      //console.log("text", userDoc.data());
      return userDoc.data(); // Return the data correctly
    } else {
      return null; // Return null if the document does not exist
    }
  } catch (error) {
    console.error("Error fetching recipient info: ", error);
  }
};
//Function to get available tutor, grouped by subject
export const getAvailableTutors = async () => {
  const subjectsWithTutors = [
    { subject: "Mathematics", selected: false, tutorIds: [], tutorNames: [] },
    { subject: "English", selected: false, tutorIds: [], tutorNames: [] },
    { subject: "Science", selected: false, tutorIds: [], tutorNames: [] },
    { subject: "Geography", selected: false, tutorIds: [], tutorNames: [] },
  ];

  try {
    // Query to fetch all users with status 'tutor'
    const tutorsQuery = query(
      collection(FIREBASE_DB, "User"),
      where("status", "==", "tutor")
    );

    const querySnapshot = await getDocs(tutorsQuery);

    querySnapshot.forEach((doc) => {
      const tutorData = doc.data();
      const tutorId = doc.id;

      // Get the available subjects for the tutor
      const availableSubjects = (tutorData.connections || []).filter(
        (connection) => !connection.includes(" ")
      );

      availableSubjects.forEach((subject) => {
        const subjectIndex = subjectsWithTutors.findIndex(
          (sub) => sub.subject === subject
        );

        if (subjectIndex !== -1) {
          // Check if the tutor ID already exists in the tutors array
          if (!subjectsWithTutors[subjectIndex].tutorIds.includes(tutorId)) {
            subjectsWithTutors[subjectIndex].tutorIds.push(tutorId);
            subjectsWithTutors[subjectIndex].tutorNames.push(
              tutorData.fullname || ""
            ); // Adding tutor name
          }
        }
      });
    });

    return subjectsWithTutors;
  } catch (error) {
    console.error("Error fetching available tutors: ", error);
    throw new Error("Failed to fetch available tutors.");
  }
};
//Function to fetch all users by their status
export const listenToUsers = (setUsers) => {
  // Define a query to get all users ordered by the 'status' field
  const usersQuery = query(
    collection(FIREBASE_DB, "User"),
    orderBy("status") // Order by 'status' field
  );

  // Set up a listener for changes in the users collection
  const unsubscribe = onSnapshot(
    usersQuery,
    (querySnapshot) => {
      // Map over the query results and return each user's data along with their UID
      const users = querySnapshot.docs.map((doc) => ({
        uid: doc.id, // UID of each user
        ...doc.data(), // User data
      }));

      setUsers(users); // Update the state with the new users list
    },
    (error) => {
      console.error("Error fetching users:", error);
    }
  );

  // Return the unsubscribe function to stop listening when needed
  return unsubscribe;
};

//=============================================================================

// Edit Users (Admin Page)
//=============================================================================
//Helper Function to remove connection between tutor and student
const removeStudentFromTutor = async (tutorId, subject, studentId) => {
  try {
    const tutorRef = doc(FIREBASE_DB, "User", tutorId);
    const tutorDoc = await getDoc(tutorRef);

    if (tutorDoc.exists()) {
      const tutorData = tutorDoc.data();
      const updatedConnections = tutorData.connections
        .map((conn) => {
          const [connSubject, connStudentId] = conn.split(" ");
          // If the connection matches both subject and studentId, keep only the subject
          return connSubject === subject && connStudentId === studentId
            ? connSubject
            : conn; // Keep the connection as is if it doesn't match
        })
        .filter((conn) => conn !== undefined); // Ensure no undefined values

      // Update the tutor's document with the new connections
      await updateDoc(tutorRef, { connections: updatedConnections });
      // console.log(
      //   `Updated tutor ${tutorId}: Removed student ID from subject ${subject}`
      // );
    } else {
      console.error(`Tutor document not found for ID: ${tutorId}`);
    }
  } catch (error) {
    console.error(`Error updating tutor's connections: ${error.message}`);
  }
};
//Function to update a users infromation to the firestore
export const updateUser = async (
  user,
  subjects,
  setEditedUser,
  fullname,
  meetingLink,
  chatLink,
  grade,
  address,
  prevConnections,
  connectionsArray,
  tutorsToDelete
) => {
  try {
    // Ensure the user is a tutor before proceeding
    if (user.status === "student") {
      try {
        // Filter out connections with a null tutor ID
        const filteredConnections = connectionsArray
          .map((conn) => {
            const [subject, tutorId] = conn.split(" "); // Split subject and tutorId
            return tutorId && tutorId !== "NoTutors" ? conn : subject; // If tutorId is null or "No Tutors", return only the subject
          })
          .filter((conn) => conn); // Remove any empty entries

        //console.log("Filtered Connections Array: ", filteredConnections);

        const combinedConnections = [
          ...prevConnections,
          ...filteredConnections,
        ];
        // console.log("Previous connections: ", prevConnections);
        // console.log("Combined Connections Array (New connections): ", combinedConnections);

        // Update the user record in Firebase, including additional fields
        const userRef = doc(FIREBASE_DB, "User", user.uid); // Correctly reference the document
        await updateDoc(userRef, {
          connections: combinedConnections,
          fullname: fullname,
          grade: grade,
          address: address,
        });

        // Update the tutor's connections with the new student ID
        await updateTutorsConnections(filteredConnections, user.uid);

        if (tutorsToDelete.length > 0) {
          //console.log("Tutors to delete: ", tutorsToDelete);

          for (const removedConnection of tutorsToDelete) {
            const [subjectForDeletion, tutorIdForDeletion] =
              removedConnection.split(" ");
            //  console.log("Subject to delete: ", subjectForDeletion);
            //  console.log("ID to delete: ", tutorIdForDeletion);
            if (subjectForDeletion && tutorIdForDeletion) {
              await removeStudentFromTutor(
                tutorIdForDeletion,
                subjectForDeletion,
                user.uid
              ); // Remove connection from tutor
            }
          }
        }

        return true;
      } catch (error) {
        throw new Error(`Failed to create user: ${error.message}`);
      }
    } else {
      // Create a copy of the user's connections to update
      const updatedConnections = [...user.connections];

      // Process each subject to manage non-connected additions or deletions
      subjects.forEach((subjectObj) => {
        const { subject, capacity, selected } = subjectObj;

        // Filter current connections for the specific subject
        const subjectConnections = updatedConnections.filter((conn) => {
          const [connSubject] = conn.includes(" ") ? conn.split(" ") : [conn];
          return connSubject === subject;
        });

        const connectedCount = subjectConnections.filter((conn) =>
          conn.includes(" ")
        ).length; // Connections with IDs
        const totalConnections = subjectConnections.length;

        // Adding non-connected subjects if selected and under capacity
        if (selected && capacity > connectedCount) {
          const toAdd = capacity - totalConnections; // Only add up to reach capacity

          for (let i = 0; i < toAdd; i++) {
            updatedConnections.push(subject); // Add non-connected subject entries only
          }
        }

        // Deleting only non-connected subjects if capacity is lower than current non-connected count
        if (selected && capacity < totalConnections) {
          const toRemove = totalConnections - capacity;
          let removedCount = 0;

          for (let i = updatedConnections.length - 1; i >= 0; i--) {
            const [connSubject, studentId] = updatedConnections[i].includes(" ")
              ? updatedConnections[i].split(" ")
              : [updatedConnections[i], null];

            // Only remove if it's a non-connected entry for the current subject
            if (
              connSubject === subject &&
              !studentId &&
              removedCount < toRemove
            ) {
              updatedConnections.splice(i, 1);
              removedCount++;
            }
          }

          // Alert if there's an attempt to go below connected capacity
          if (toRemove > removedCount) {
            alert(
              `Unable to reduce capacity further for ${subject} due to existing student connections. Remove connected students first.`
            );
          }
        }

        // Deselecting subjects (when unchecking)
        if (!selected) {
          const hasActiveConnections = updatedConnections.some((connection) => {
            const [connSubject] = connection.split(" ");
            return connSubject === subject; // Check if the connection subject matches
          });

          if (hasActiveConnections) {
            alert("Student(s) currently connected. Remove connections first.");
            return; // Prevent deselecting
          }

          // If no active connections, remove all occurrences of the subject from connections
          for (let i = updatedConnections.length - 1; i >= 0; i--) {
            const [connSubject] = updatedConnections[i].split(" ");
            if (connSubject === subject) {
              updatedConnections.splice(i, 1); // Remove all occurrences
            }
          }
        }
      });

      // Update the editedUser connections state
      setEditedUser((prevUser) => ({
        ...prevUser,
        connections: updatedConnections,
      }));

      // Update the user record in Firebase, including additional fields
      const userRef = doc(FIREBASE_DB, "User", user.uid); // Correctly reference the document
      await updateDoc(userRef, {
        connections: updatedConnections,
        fullname: fullname, // Update fullname
        chatLink: chatLink, // Update chat link
        meetingLink: meetingLink, // Update meeting link
      });

      // Handle removing subjects from tutors' connections
      for (const tutorId of tutorsToDelete) {
        const tutorRef = doc(FIREBASE_DB, "User", tutorId); // Reference tutor document

        // Fetch the tutor's current connections
        const tutorDoc = await getDoc(tutorRef);
        if (tutorDoc.exists()) {
          const tutorData = tutorDoc.data();
          const tutorConnections = tutorData.connections || [];

          // Filter out the subjects that need to be removed
          const updatedTutorConnections = tutorConnections.filter(
            (conn) => !tutorsToDelete.includes(conn.split(" ")[0]) // Assuming connection format is "Subject tutorId"
          );

          // Update the tutor's document with the new connections
          await updateDoc(tutorRef, {
            connections: updatedTutorConnections,
          });
        }
      }

      //console.log("User updated successfully in Firebase");
      return true; // Return true if successful
    }
  } catch (error) {
    console.error("Error updating user:", error);
    return false; // Return false if there was an error
  }
};
//
//Helper Function to update user connections
const updateTutorsConnections = async (connectionsArray, studentId) => {
  try {
    for (const connection of connectionsArray) {
      const [subject, tutorId] = connection.split(" "); // Split subject and tutorId

      // If tutorId exists, update their connections
      if (tutorId) {
        const tutorDocRef = doc(FIREBASE_DB, "User", tutorId);

        // Get the current tutor's data
        const tutorSnap = await getDoc(tutorDocRef);
        if (tutorSnap.exists()) {
          const tutorData = tutorSnap.data();
          //console.log("AVAIALABLE tutor: ", tutorData);
          const existingConnections = tutorData.connections || [];

          // Create a new connection with the student ID
          const newConnection = `${subject} ${studentId}`;

          // Find an existing non-connected entry for this subject
          const existingSubjectIndex = existingConnections.findIndex(
            (conn) => conn.startsWith(subject) && conn.split(" ").length === 1
          );

          if (existingSubjectIndex !== -1) {
            // Replace the non-connected entry with the new connection
            existingConnections[existingSubjectIndex] = newConnection;
          } else {
            // If there's no non-connected entry for that subject, add the new one
            existingConnections.push(newConnection);
          }

          // Update tutor's document in Firestore
          await updateDoc(tutorDocRef, {
            connections: existingConnections,
          }); // Use merge to avoid overwriting other fields
        }
      }
    }
  } catch (error) {
    console.error(`Failed to update tutor's connections: ${error.message}`);
  }
};
//=============================================================================

// Delete users (Admin Page)
//=============================================================================
//Function to delete user from all tables in firestore, aswell using the google cloud function to delete from authentication
export const deleteUser = async (userId) => {
  const functions = getFunctions();
  const deleteUserFunc = httpsCallable(functions, "deleteUser");

  try {
    // Validate userId
    if (typeof userId !== "string" || userId.trim() === "") {
      throw new Error("Invalid user ID");
    }

    const result = await deleteUserFunc({ userId });
    if (result.data.success) {
      // Delete the user document from Firestore
      const userDocRef = doc(FIREBASE_DB, "User", userId);
      const userDoc = await getDoc(userDocRef);

      let userData;
      if (userDoc.exists()) {
        userData = userDoc.data(); // Retrieve the user's data
        await deleteDoc(userDocRef); // Delete the user document
      }

      //+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
      // Deleting All homework
      let homeworkQuery;
      if (userData.status === "student") {
        homeworkQuery = query(
          collection(FIREBASE_DB, "Homework"),
          where("studentId", "==", userId)
        );
      } else if (userData.status === "tutor") {
        homeworkQuery = query(
          collection(FIREBASE_DB, "Homework"),
          where("tutorId", "==", userId)
        );
      }

      if (homeworkQuery) {
        const homeworkSnapshot = await getDocs(homeworkQuery);
        const deleteHomeworkPromises = homeworkSnapshot.docs.map(
          (docSnapshot) =>
            deleteDoc(doc(FIREBASE_DB, "Homework", docSnapshot.id))
        );
        await Promise.all(deleteHomeworkPromises);
        //console.log(`All homework associated with user ${userId} deleted.`);
      }

      //+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
      // Delete All conversations
      const messagesRef = collection(FIREBASE_DB, "Conversations");

      const fromUserQuery = query(messagesRef, where("fromId", "==", userId));
      const toUserQuery = query(messagesRef, where("toId", "==", userId));

      const [fromUserSnapshot, toUserSnapshot] = await Promise.all([
        getDocs(fromUserQuery),
        getDocs(toUserQuery),
      ]);

      const deletePromises = [
        ...fromUserSnapshot.docs.map((docSnapshot) =>
          deleteDoc(doc(FIREBASE_DB, "Conversations", docSnapshot.id))
        ),
        ...toUserSnapshot.docs.map((docSnapshot) =>
          deleteDoc(doc(FIREBASE_DB, "Conversations", docSnapshot.id))
        ),
      ];

      await Promise.all(deletePromises);
      // console.log(
      //   `All conversations involving user ${userId} have been deleted.`
      // );

      //+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
      // Delete All sessions
      const sessions =
        userData.availability?.map((entry) => {
          const segments = entry.split(", ");
          const sessionId = segments[segments.length - 1].split(" ")[0];
          return sessionId;
        }) || [];

      await Promise.all(sessions.map((sessionId) => deleteSession(sessionId)));

      //console.log(`All sessions involving user ${userId} have been deleted.`);

      //+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
      // Terminating All CONNECTIONS

      const usersQuery = query(
        collection(FIREBASE_DB, "User"),
        orderBy("status")
      );
      const querySnapshot = await getDocs(usersQuery);

      const updatePromises = querySnapshot.docs.map(async (docSnapshot) => {
        const userConnectionsData = docSnapshot.data();
        const userDocRef = doc(FIREBASE_DB, "User", docSnapshot.id);

        if (
          userConnectionsData.connections &&
          Array.isArray(userConnectionsData.connections)
        ) {
          const updatedConnections = userConnectionsData.connections.map(
            (connection) => {
              if (connection.includes(" ")) {
                const [subject, connectionUserId] = connection.split(" ");
                return connectionUserId === userId ? subject : connection;
              }
              return connection;
            }
          );

          const connectionsChanged = updatedConnections.some(
            (conn, index) => conn !== userConnectionsData.connections[index]
          );

          if (connectionsChanged) {
            await updateDoc(userDocRef, { connections: updatedConnections });
          }
        }
      });

      await Promise.all(updatePromises);

      return true;
    } else {
      console.error("Failed to delete user:", result.data.error);
    }
  } catch (error) {
    console.error("Error calling deleteUser function:", error.message);
  }
};
//Function to delete connections between users, and any exisitance between the two in firestore
export const deleteAssociations = async (studentId, tutorId) => {
  try {
    // Deleting All homework where studentId and tutorId match
    const homeworkQuery = query(
      collection(FIREBASE_DB, "Homework"),
      where("studentId", "==", studentId),
      where("tutorId", "==", tutorId)
    );

    const homeworkSnapshot = await getDocs(homeworkQuery);
    const deleteHomeworkPromises = homeworkSnapshot.docs.map((docSnapshot) =>
      deleteDoc(doc(FIREBASE_DB, "Homework", docSnapshot.id))
    );
    await Promise.all(deleteHomeworkPromises);
    // console.log(
    //   `All homework associated with student ${studentId} and tutor ${tutorId} deleted.`
    // );

    //+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    // Deleting All conversations where studentId or tutorId is in fromId or toId
    const messagesRef = collection(FIREBASE_DB, "Conversations");

    const fromStudentQuery = query(
      messagesRef,
      where("fromId", "==", studentId)
    );
    const toStudentQuery = query(messagesRef, where("toId", "==", studentId));
    const fromTutorQuery = query(messagesRef, where("fromId", "==", tutorId));
    const toTutorQuery = query(messagesRef, where("toId", "==", tutorId));

    const [
      fromStudentSnapshot,
      toStudentSnapshot,
      fromTutorSnapshot,
      toTutorSnapshot,
    ] = await Promise.all([
      getDocs(fromStudentQuery),
      getDocs(toStudentQuery),
      getDocs(fromTutorQuery),
      getDocs(toTutorQuery),
    ]);

    const deleteConversationPromises = [
      ...fromStudentSnapshot.docs.map((docSnapshot) =>
        deleteDoc(doc(FIREBASE_DB, "Conversations", docSnapshot.id))
      ),
      ...toStudentSnapshot.docs.map((docSnapshot) =>
        deleteDoc(doc(FIREBASE_DB, "Conversations", docSnapshot.id))
      ),
      ...fromTutorSnapshot.docs.map((docSnapshot) =>
        deleteDoc(doc(FIREBASE_DB, "Conversations", docSnapshot.id))
      ),
      ...toTutorSnapshot.docs.map((docSnapshot) =>
        deleteDoc(doc(FIREBASE_DB, "Conversations", docSnapshot.id))
      ),
    ];

    await Promise.all(deleteConversationPromises);
    // console.log(
    //   `All conversations involving student ${studentId} or tutor ${tutorId} have been deleted.`
    // );

    //+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    // Deleting All sessions where studentId and tutorId match
    const sessionQuery = query(
      collection(FIREBASE_DB, "Session"),
      where("studentId", "==", studentId),
      where("tutorId", "==", tutorId)
    );

    const sessionSnapshot = await getDocs(sessionQuery);
    // Since deleteSession is assumed to be an asynchronous function, use a for...of loop
    for (const docSnapshot of sessionSnapshot.docs) {
      await deleteSession(docSnapshot.id);
    }

    // console.log(
    //   `All sessions involving student ${studentId} and tutor ${tutorId} have been deleted.`
    // );
  } catch (error) {
    console.error("Error deleting associations:", error.message);
  }
};

//=============================================================================

// Sending Functionality (Conversation / [query] page)
//=============================================================================
//Functions for submitting messages to firestore
export const sendMessage = async (fromId, toId, messageContent) => {
  try {
    const newMessageRef = doc(FIREBASE_DB, "Conversations", generateId()); // Generate a new message ID
    await setDoc(newMessageRef, {
      fromId: fromId,
      message: messageContent,
      timeStamp: serverTimestamp(), // Set server-side timestamp
      toId: toId,
    });
    //console.log("Message sent successfully!");
  } catch (error) {
    console.error("Error sending message: ", error);
  }
};
// Helper function to generate a unique message ID
const generateId = () => {
  return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};
//Function to fetch messages from firestore
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

//=============================================================================

// Homework functionality (Homework Page)
//=============================================================================

//Functions for submmiting homework to firestore
export const submittingHomework = async (
  studId,
  tutorId,
  subject,
  description,
  dueDate
) => {
  try {
    const newHWRef = doc(FIREBASE_DB, "Homework", generateId()); // Generate a new message ID
    await setDoc(newHWRef, {
      description: description,
      dueDate: dueDate,
      studentId: studId,
      subject: subject,
      tutorId: tutorId,
    });
    // console.log("Homework submitted successfully!");
  } catch (error) {
    console.error("Error sending message: ", error);
  }
};
//Function for fetching homework based of user id, role, and group them together
export const fetchHomework = (userId, userRole, setGroupedHomework) => {
  const homeworkRef = collection(FIREBASE_DB, "Homework");
  const homeworkForId = query(
    homeworkRef,
    where(userRole === "student" ? "studentId" : "tutorId", "==", userId),
    orderBy("subject", "asc")
  );

  return onSnapshot(homeworkForId, async (snapshot) => {
    const homeworkPromises = snapshot.docs.map(async (doc) => {
      const data = doc.data();
      const oppositeId = userRole === "student" ? data.tutorId : data.studentId;
      const recipientInfo = await fetchRecipientInfo(oppositeId);
      return {
        id: doc.id,
        recipientName: recipientInfo ? recipientInfo.fullname : "Unknown",
        ...data,
      };
    });

    // Wait for all recipient info to be fetched
    const homework = await Promise.all(homeworkPromises);

    // Group homework by subject
    const groupedHomework = homework.reduce((groups, item) => {
      const { subject } = item;
      if (!groups[subject]) {
        groups[subject] = [];
      }
      groups[subject].push(item);
      return groups;
    }, {});

    // Set the grouped homework
    // console.log("Grouped Homework: ", groupedHomework)
    setGroupedHomework(groupedHomework);
  });
};
//function for deleting homework from firestore
export const deleteHomework = async (itemId) => {
  try {
    // Get a reference to the specific document within the Homework collection
    const homeworkDocRef = doc(FIREBASE_DB, "Homework", itemId);
    await deleteDoc(homeworkDocRef); // Delete the document using deleteDoc
    // console.log(`Homework with ID: ${itemId} deleted successfully.`);
    return true; // Optionally return true to indicate success
  } catch (error) {
    console.error("Error deleting homework: ", error);
    return false; // Optionally return false to indicate failure
  }
};
//=============================================================================

//Schedule Functionality (Timetable Page)
////=============================================================================

export const fetchSessions = (userId, userRole, setGroupedSessions) => {
  const sessionRef = collection(FIREBASE_DB, "Session");

  // Broad listener to all changes in the "Session" collection
  return onSnapshot(sessionRef, async (snapshot) => {
    // Fetch all sessions from the snapshot
    const sessionPromises = snapshot.docs.map(async (doc) => {
      const data = doc.data();

      // Check if the session involves the current user
      const isUserInvolved = userRole === "student"
        ? data.studentId === userId
        : data.tutorId === userId;

      // Only process sessions involving the current user
      if (isUserInvolved) {
        const oppositeId = userRole === "student" ? data.tutorId : data.studentId;
        const recipientInfo = await fetchRecipientInfo(oppositeId);

        return {
          id: doc.id,
          recipientName: recipientInfo ? recipientInfo.fullname : "Unknown",
          ...data,
        };
      }
      return null; // Return null if session is not relevant to the user
    });

    // Wait for all recipient info to be fetched, filter out irrelevant sessions
    const sessions = (await Promise.all(sessionPromises)).filter(session => session !== null);

    // Group sessions by `id`
    const groupedSessions = sessions.reduce((groups, session) => {
      const { id } = session;
      if (!groups[id]) {
        groups[id] = [];
      }
      groups[id].push(session);
      return groups;
    }, {});

    // Set the grouped sessions
    //console.log("Grouped Sessions by ID:", groupedSessions);
    setGroupedSessions(groupedSessions);
  });
};

//function for submitting session to firestore
export const submittingSession = async (
  submitId,
  toId,
  subject,
  timeSlot,
  type,
  userRole,
  userAddress
) => {
  try {
    let typeForSubmit;

    if (type === "Online") {
      typeForSubmit = type;
    } else {
      if (userRole === "student") {
        typeForSubmit = userAddress;
      } else {
        const recipientInfo = await fetchRecipientInfo(toId);
        typeForSubmit = recipientInfo ? recipientInfo.address : undefined;
      }
    }

    // Generate a unique session ID
    const sessionId = generateId();
    const newSessionRef = doc(FIREBASE_DB, "Session", sessionId);

    // Create the new session document
    await setDoc(newSessionRef, {
      studentId: userRole === "student" ? submitId : toId,
      tutorId: userRole === "tutor" ? submitId : toId,
      subject: subject,
      type: typeForSubmit,
    });

    // Update availability for both the student and the tutor
    const userIds = [submitId, toId];
    const updatedAvailabilityPromises = userIds.map(async (userId) => {
      const userDocRef = doc(FIREBASE_DB, "User", userId);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        const userData = userDoc.data();
        // Update each timeslot with the sessionId
        const updatedAvailability = timeSlot.map((slot) => {
          return `${slot}, ${sessionId}`;
        });

        // Combine existing and new availability
        const newAvailability = [
          ...userData.availability,
          ...updatedAvailability,
        ];

        // Update the user document
        await setDoc(
          userDocRef,
          {
            availability: newAvailability,
          },
          { merge: true }
        );
      }
    });

    // Wait for all availability updates to complete
    await Promise.all(updatedAvailabilityPromises);

    //console.log("Session submitted and availability updated successfully!");

    // Return the generated session ID
    return sessionId;
  } catch (error) {
    console.error("Error submitting session: ", error);
    throw error; // Re-throw error if needed for handling in calling function
  }
};
//function for deleting session from firestore
export const deleteSession = async (sessionId) => {
  try {
    const sessionDocRef = doc(FIREBASE_DB, "Session", sessionId);
    const sessionDoc = await getDoc(sessionDocRef);

    if (sessionDoc.exists()) {
      const sessionData = sessionDoc.data();
      const userIds = [sessionData.studentId, sessionData.tutorId];

      // Delete the session document
      await deleteDoc(sessionDocRef);

      // Sequentially update availability for both the student and the tutor
      for (const userId of userIds) {
        const userDocRef = doc(FIREBASE_DB, "User", userId);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          const userData = userDoc.data();
          // Filter out availability entries containing the session ID
          const updatedAvailability = userData.availability.filter((slot) => {
            const parts = slot.split(", ");
            return parts.length < 3 || parts[2] !== sessionId;
          });

          // Update the user document with the new availability
          await setDoc(
            userDocRef,
            {
              availability: updatedAvailability,
            },
            { merge: true }
          );
        }
      }
    } else {
      // Optional: Handle session not found
      console.warn("Session not found.");
    }
  } catch (error) {
    console.error("Error deleting session: ", error);
    return false;
  }
};


//=============================================================================
