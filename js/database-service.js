import { db, collection, addDoc, getDocs, doc, updateDoc, deleteDoc, onSnapshot, query, where, orderBy } from './firebase-config.js';

// Database Service - Replaces localStorage
class DatabaseService {
    constructor() {
        this.itemsCollection = 'marketplaceItems';
        this.usersCollection = 'users';
    }

    // Save item (replaces localStorage.setItem)
    async saveItem(itemData) {
        try {
            const docRef = await addDoc(collection(db, this.itemsCollection), {
                ...itemData,
                createdAt: new Date(),
                updatedAt: new Date()
            });
            console.log('Item saved with ID:', docRef.id);
            return { success: true, id: docRef.id };
        } catch (error) {
            console.error('Error saving item:', error);
            return { success: false, error };
        }
    }

    // Get all items (replaces localStorage.getItem)
    async getAllItems() {
        try {
            const q = query(collection(db, this.itemsCollection), orderBy('createdAt', 'desc'));
            const querySnapshot = await getDocs(q);
            const items = [];
            querySnapshot.forEach((doc) => {
                items.push({ id: doc.id, ...doc.data() });
            });
            return items;
        } catch (error) {
            console.error('Error getting items:', error);
            return [];
        }
    }

    // Get user's items
    async getUserItems(sellerId) {
        try {
            const q = query(
                collection(db, this.itemsCollection), 
                where('sellerId', '==', sellerId),
                orderBy('createdAt', 'desc')
            );
            const querySnapshot = await getDocs(q);
            const items = [];
            querySnapshot.forEach((doc) => {
                items.push({ id: doc.id, ...doc.data() });
            });
            return items;
        } catch (error) {
            console.error('Error getting user items:', error);
            return [];
        }
    }

    // Update item
    async updateItem(itemId, updates) {
        try {
            const itemRef = doc(db, this.itemsCollection, itemId);
            await updateDoc(itemRef, {
                ...updates,
                updatedAt: new Date()
            });
            return { success: true };
        } catch (error) {
            console.error('Error updating item:', error);
            return { success: false, error };
        }
    }

    // Delete item
    async deleteItem(itemId) {
        try {
            await deleteDoc(doc(db, this.itemsCollection, itemId));
            return { success: true };
        } catch (error) {
            console.error('Error deleting item:', error);
            return { success: false, error };
        }
    }

    // Real-time listener for items
    listenToItems(callback) {
        const q = query(collection(db, this.itemsCollection), orderBy('createdAt', 'desc'));
        return onSnapshot(q, (querySnapshot) => {
            const items = [];
            querySnapshot.forEach((doc) => {
                items.push({ id: doc.id, ...doc.data() });
            });
            callback(items);
        });
    }

    // Save user profile
    async saveUserProfile(userId, userData) {
        try {
            const userRef = doc(db, this.usersCollection, userId);
            await updateDoc(userRef, {
                ...userData,
                updatedAt: new Date()
            });
            return { success: true };
        } catch (error) {
            console.error('Error saving user profile:', error);
            return { success: false, error };
        }
    }
}

// Export singleton instance
export const dbService = new DatabaseService();
