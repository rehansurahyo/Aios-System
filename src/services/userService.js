import { db } from "../config/firebase";
import {
    collection,
    getDocs,
    addDoc,
    deleteDoc,
    doc,
    updateDoc
} from "firebase/firestore";

const USERS_COLLECTION = "studio_users";
const ROLES_COLLECTION = "studio_roles";

export const userService = {
    // --- USERS ---

    // Get all users
    getUsers: async () => {
        try {
            const snapshot = await getDocs(collection(db, USERS_COLLECTION));
            return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        } catch (error) {
            console.error("Error fetching users:", error);
            throw error;
        }
    },

    // Create new user
    createUser: async (userData) => {
        try {
            const docRef = await addDoc(collection(db, USERS_COLLECTION), {
                ...userData,
                createdAt: new Date().toISOString(),
                status: "active"
            });
            return { id: docRef.id, ...userData, status: "active" };
        } catch (error) {
            console.error("Error creating user:", error);
            throw error;
        }
    },

    // Delete user
    deleteUser: async (userId) => {
        try {
            await deleteDoc(doc(db, USERS_COLLECTION, userId));
            return userId;
        } catch (error) {
            console.error("Error deleting user:", error);
            throw error;
        }
    },

    // Update user
    updateUser: async (userId, updates) => {
        try {
            await updateDoc(doc(db, USERS_COLLECTION, userId), updates);
            return { id: userId, ...updates };
        } catch (error) {
            console.error("Error updating user:", error);
            throw error;
        }
    },

    // --- ROLES ---

    getRoles: async () => {
        try {
            const snapshot = await getDocs(collection(db, ROLES_COLLECTION));
            return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        } catch (error) {
            console.error("Error fetching roles:", error);
            throw error;
        }
    },

    createRole: async (roleData) => {
        try {
            const docRef = await addDoc(collection(db, ROLES_COLLECTION), roleData);
            return { id: docRef.id, ...roleData };
        } catch (error) {
            console.error("Error creating role:", error);
            throw error;
        }
    },

    deleteRole: async (roleId) => {
        try {
            await deleteDoc(doc(db, ROLES_COLLECTION, roleId));
            return roleId;
        } catch (error) {
            console.error("Error deleting role:", error);
            throw error;
        }
    },

    updateRole: async (roleId, updates) => {
        try {
            await updateDoc(doc(db, ROLES_COLLECTION, roleId), updates);
            return { id: roleId, ...updates };
        } catch (error) {
            console.error("Error updating role:", error);
            throw error;
        }
    }
};
