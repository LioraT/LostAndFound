/**
 * Creates a new item data object matching the item schema.
 *
 * @param {Object} user - User object with _id and username
 * @param {String} phone - Telephone number (e.g., '050-1234567')
 * @param {String} category - One of the predefined item categories
 * @param {String} type - 'lost' or 'found'
 * @param {String} neighborhoodName - The neighborhood name (Hebrew or English)
 * @param {Number} index - Index of the item within the current batch
 * @param {Array} coordinates - [lng, lat] array
 * @param {Date} createdDate - Creation date (`createdAt`)
 * @param {Date} reportedDate - Reported date (`item_type.dateReported`)
 * @returns {Object} itemData object ready for insertion
 */
function createItemData(user, phone, category, type, neighborhoodName, index, coordinates, createdDate, reportedDate) {
  return {
    owner: user._id,
    owner_name: user.username,
    telephone: phone,
    title: `${neighborhoodName} ${type} item ${index + 1}`,
    item_category: category,
    item_description: `A ${category} that was ${type} in ${neighborhoodName}.`,
    item_type: {
      type: type,
      dateReported: reportedDate,
      resolved: false,
      matchedWith: null
    },
    address: `${index + 1} ${neighborhoodName} Street, Tel Aviv`,
    location: {
      type: 'Point',
      coordinates: coordinates
    },
    createdAt: createdDate
  };
}

module.exports = createItemData;
