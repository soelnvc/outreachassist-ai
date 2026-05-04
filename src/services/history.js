import { collection, addDoc, getDocs, query, where, orderBy, doc, updateDoc } from 'firebase/firestore';
import { db } from './firebase.js';

const HISTORY_COLLECTION = 'message_history';
const HISTORY_TTL_DAYS = 30;
const MS_PER_DAY = 24 * 60 * 60 * 1000;

/**
 * Saves a generated message and its input data to Firestore.
 * Adds createdAt and expireAt (30 days later) for TTL auto-deletion.
 *
 * @param {string} userId - The Firebase UID of the logged-in user
 * @param {Object} formData - The form input data used for generation
 * @param {string} generatedMessage - The AI-generated message text
 * @returns {Promise<string>} The Firestore document ID of the saved record
 * @throws {Error} If the user is not logged in or the write fails
 */
export async function saveHistory(userId, formData, generatedMessage) {
  if (!userId) throw new Error('User must be logged in to save history');

  const now = new Date();
  const expireAt = new Date(now.getTime() + HISTORY_TTL_DAYS * MS_PER_DAY);

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
    console.error('Error saving history:', error);
    throw error;
  }
}

/**
 * Updates the 'isSavedToLogs' status for a specific history item.
 *
 * @param {string} historyId - The Firestore document ID
 * @param {boolean} isSaved - Whether the item has been saved to Google Sheets
 * @returns {Promise<void>}
 * @throws {Error} If the update fails
 */
export async function updateHistorySavedStatus(historyId, isSaved) {
  try {
    const docRef = doc(db, HISTORY_COLLECTION, historyId);
    await updateDoc(docRef, { isSavedToLogs: isSaved });
  } catch (error) {
    console.error('Error updating history status:', error);
    throw error;
  }
}

/**
 * Retrieves the history for a specific user, ordered by newest first.
 *
 * @param {string} userId - The Firebase UID of the logged-in user
 * @returns {Promise<Array<Object>>} Array of history records with JS Date fields
 * @throws {Error} If the query fails
 */
export async function getUserHistory(userId) {
  if (!userId) return [];

  try {
    const q = query(
      collection(db, HISTORY_COLLECTION),
      where('userId', '==', userId)
    );

    const querySnapshot = await getDocs(q);
    const historyRecords = querySnapshot.docs.map(docSnapshot => ({
      id: docSnapshot.id,
      ...docSnapshot.data(),
      createdAt: docSnapshot.data().createdAt?.toDate() || new Date(),
      expireAt: docSnapshot.data().expireAt?.toDate() || new Date()
    }));

    // Sort client-side to avoid needing a Firestore composite index
    return historyRecords.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  } catch (error) {
    console.error('Error fetching user history:', error);
    throw error;
  }
}

/**
 * Deletes a single history item by ID.
 *
 * @param {string} historyId - The Firestore document ID to delete
 * @returns {Promise<void>}
 * @throws {Error} If the deletion fails
 */
export async function deleteHistoryItem(historyId) {
  try {
    const { deleteDoc } = await import('firebase/firestore');
    const docRef = doc(db, HISTORY_COLLECTION, historyId);
    await deleteDoc(docRef);
  } catch (error) {
    console.error('Error deleting history item:', error);
    throw error;
  }
}

/**
 * Clears all history for a specific user.
 *
 * @param {string} userId - The Firebase UID of the user whose history to clear
 * @returns {Promise<void>}
 * @throws {Error} If the batch delete fails
 */
export async function clearUserHistory(userId) {
  if (!userId) return;
  try {
    const { writeBatch } = await import('firebase/firestore');
    const q = query(collection(db, HISTORY_COLLECTION), where('userId', '==', userId));
    const snapshot = await getDocs(q);

    const batch = writeBatch(db);
    snapshot.docs.forEach((docSnapshot) => {
      batch.delete(docSnapshot.ref);
    });

    await batch.commit();
  } catch (error) {
    console.error('Error clearing user history:', error);
    throw error;
  }
}
