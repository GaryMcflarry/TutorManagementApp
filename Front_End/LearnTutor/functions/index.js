const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();

exports.deleteUser = functions.https.onCall(async (data) => {
  const { userId } = data.data; // Receive the user ID from the client call

  // Validate userId
  if (typeof userId !== "string" || userId.trim() === "") {
    console.error("Invalid user ID received:", userId);
    return { success: false};
    throw new functions.https.HttpsError(
      "invalid-argument",
      "The function must be called with a valid user ID."
    );
  }

  try {
    // Delete the user from Firebase Authentication
    await admin.auth().deleteUser(userId);
    console.log(`Successfully deleted user from Auth with ID: ${userId}`);

    return { success: true};

  } catch (error) {
    console.error("Error deleting user:", error);
    return { success: false, error: error.message };
  }
});
