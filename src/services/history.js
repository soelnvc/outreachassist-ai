import { collection, addDoc, getDocs, query, where, orderBy, doc, updateDoc } from 'firebase/firestore';
import { db } from './firebase.js';

const HISTORY_COLLECTION = 'message_history';

/**
 * Saves a generated message and its input data to Firestore.
 * Adds createdAt and expireAt (30 days later) for TTL auto-deletion.
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
    expireAt: expireAt,
    isSavedToLogs: false
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
 * Updates the 'isSavedToLogs' status for a specific history item.
 */
export async function updateHistorySavedStatus(historyId, isSaved) {
  try {
    const docRef = doc(db, HISTORY_COLLECTION, historyId);
    await updateDoc(docRef, { isSavedToLogs: isSaved });
  } catch (error) {
    console.error("Error updating history saved status: ", error);
    throw error;
  }
}

/**
 * Retrieves the history for a specific user, ordered by newest first.
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
