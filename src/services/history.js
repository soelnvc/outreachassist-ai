import { collection, addDoc, getDocs, query, where, orderBy } from 'firebase/firestore';
import { db } from './firebase.js';

const HISTORY_COLLECTION = 'message_history';

/**
 * Saves a generated message and its input data to Firestore.
 * Adds createdAt and expireAt (30 days later) for TTL auto-deletion.
 * 
 * @param {string} userId - The Firebase UID of the logged-in user
 * @param {Object} formData - The inputs used to generate the message
 * @param {string} generatedMessage - The resulting message
 * @returns {Promise<string>} The ID of the created document
 */
export async function saveHistory(userId, formData, generatedMessage) {
  if (!userId) throw new Error("User must be logged in to save history");

  const now = new Date();
  const expireAt = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 days from now

  const docData = {
    userId,
    formData,
    generatedMessage,
    createdAt: now,
    expireAt: expireAt
  };

  try {
    const docRef = await addDoc(collection(db, HISTORY_COLLECTION), docData);
    return docRef.id;
  } catch (error) {
    console.error("Error adding document to history: ", error);
    throw error;
  }
}

/**
 * Retrieves the history for a specific user, ordered by newest first.
 * 
 * @param {string} userId - The Firebase UID of the logged-in user
 * @returns {Promise<Array>} Array of history document objects
 */
export async function getUserHistory(userId) {
  if (!userId) return [];

  try {
    const q = query(
      collection(db, HISTORY_COLLECTION),
      where("userId", "==", userId)
    );
    
    const querySnapshot = await getDocs(q);
    const results = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      // Convert Firestore Timestamps back to JS Dates for the UI
      createdAt: doc.data().createdAt?.toDate() || new Date(),
      expireAt: doc.data().expireAt?.toDate() || new Date()
    }));

    // Sort client-side to avoid needing a Firestore composite index
    return results.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  } catch (error) {
    console.error("Error fetching user history: ", error);
    throw error;
  }
}
