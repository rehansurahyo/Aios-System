export const API_BASE = "https://backend-two-orpin-12.vercel.app";

export const fetchJSON = async (url, options = {}) => {
    const res = await fetch(url, options);
    if (!res.ok) {
        // Try to parse error message from JSON, fallback to status text
        let errorMessage = `HTTP error! status: ${res.status}`;
        try {
            const data = await res.json();
            if (data.message) errorMessage = data.message;
            else if (data.error) errorMessage = data.error;
        } catch (e) {
            // ignore
        }
        throw new Error(errorMessage);
    }
    return res;
};
