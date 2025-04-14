export const getUserPageSize = async (token) => {
    try {
      const API_URL = process.env.REACT_APP_API_URL;
      const res = await fetch(`${API_URL}/protected/profile`, {
        headers: { Authorization: token },
      });
  
      const data = await res.json();
  
      if (!res.ok) {
        throw new Error(data.error || "Failed to load profile.");
      }
  
      return data.preferences?.page_size || 5;
    } catch (err) {
      console.error("Failed to get user page size:", err);
      return 5; // fallback default
    }
  };
