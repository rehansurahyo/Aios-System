import { initializeApp } from "firebase/app";

console.log("Attempting to load Firebase...");
try {
    const app = initializeApp({
        apiKey: "test-api-key",
        projectId: "test-project"
    });
    console.log("SUCCESS: Firebase SDK loaded and app initialized.");
} catch (error) {
    console.error("ERROR: Failed to initialize Firebase:", error);
}
