import api from "../../api/axios";

export async function findMatchingItems(params) {
  const { type, category, coordinates, radius = 1500, resolved } = params;  // 🔥 Add resolved

  try {
    const { data } = await api.post("/items/matching", {
      type,
      category,
      coordinates,
      radius,
      resolved  // 🔥 Include resolved in the request body
    });
    return data;
  } catch (err) {
    console.error("Error finding matching items:", err);
    return [];
  }
}
