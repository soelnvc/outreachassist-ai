import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from './firebase.js';

const USERS_COLLECTION = 'users';

/**
 * Fetches the user profile from Firestore.
 *
 * @param {string} userId - The Firebase UID
 * @returns {Promise<Object|null>} The user profile data or null if not found
 */
export async function getUserProfile(userId) {
  if (!userId) return null;

  try {
    const docRef = doc(db, USERS_COLLECTION, userId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return docSnap.data();
    }
    return null;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }
}

/**
 * Creates or updates a user profile in Firestore.
 *
 * @param {string} userId - The Firebase UID
 * @param {Object} profileData - The profile data to save
 * @returns {Promise<void>}
 * @throws {Error} If the userId is missing or the write fails
 */
export async function saveUserProfile(userId, profileData) {
  if (!userId) throw new Error('User ID is required to save profile');

  try {
    const docRef = doc(db, USERS_COLLECTION, userId);
    // Use merge: true to only update the provided fields
    await setDoc(docRef, { ...profileData, updatedAt: new Date() }, { merge: true });
  } catch (error) {
    console.error('Error saving user profile:', error);
    throw error;
  }
}
