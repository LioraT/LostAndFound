import api from '../services/axios';

export const getUserPageSize = async () => {
  try {
    const { data } = await api.get('/protected/profile');
    return data.preferences?.page_size || 5;
  } catch (err) {
    console.error("Failed to get user page size:", err);
    return 5; // fallback default
  }
};
