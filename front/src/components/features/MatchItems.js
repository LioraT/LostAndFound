import api from "../../api/axios";

export async function findMatchingItems(params) {
  const { type, category, coordinates, radius = 1500 } = params;
  
  try {
    const { data } = await api.post("/items/matching", {
      type,
      category,
      coordinates,
      radius,
    });
    return data;
  } catch (err) {
    console.error("Error finding matching items:", err);
    return [];
  }
}