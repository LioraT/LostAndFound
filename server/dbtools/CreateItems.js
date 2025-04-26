const User = require("../models/user");
const Item = require("../models/item");
const Neighborhood = require("../models/neighborhoodModel");
const { hebrewStr } = require('../utils/hebrewUtils');
const createItemData = require('../utils/createItemData');
const randomPointInPolygon = require('../utils/randomPointInPolygon');


// Helper functions
function randomDateInLastDays(days = 10) {
  const now = Date.now();
  const offset = Math.floor(Math.random() * days * 24 * 60 * 60 * 1000);
  return new Date(now - offset);
}

function randomDateBetween(from, to) {
  const fromTime = from.getTime();
  const toTime = to.getTime();
  const randomTime = Math.floor(Math.random() * (toTime - fromTime)) + fromTime;
  return new Date(randomTime);
}

function randomPhone() {
  const suffix = Math.floor(1000000 + Math.random() * 9000000);
  const prefix = Math.floor(50 + Math.random() * 10);
  return `0${prefix}-${suffix}`;
}

function randomFrom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// Main function
async function CreateItems(itemTypes, categories, maxItems) {

  await Item.deleteMany({});
  if (maxItems < 0) {
    return;
  }

  const users = await User.find().select('username first_name family_name email _id').lean();
  if (users.length === 0) throw new Error("No users found. Cannot assign items.");
  for (const us of users) us.phone = randomPhone();

  const neighborhoods = await Neighborhood.find();

  for (const n of neighborhoods) {
    const rawName = n.properties?.shemshchun || '[Unnamed]';
    const name = hebrewStr(rawName);
    const geojson = { type: 'Feature', geometry: n.geometry, properties: {} };

    try {
      const itemCount = Math.floor(Math.random() * (maxItems - 2 + 1)) + 2;
      console.log(`generating for ${name}  with ${itemCount} items `);
      for (let i = 0; i < itemCount; i++) {
        const user = randomFrom(users);
        const item_type = randomFrom(itemTypes);
        const item_category = randomFrom(categories);
        const coords = randomPointInPolygon(n.geometry);

        const reportedDate = randomDateInLastDays(10);
        const createdDate = randomDateBetween(reportedDate, new Date());
        const phone = user.phone;

        const itemData = createItemData(user, phone, item_category, item_type, rawName, i, coords, createdDate, reportedDate);
        await Item.create(itemData);

        if (i < 3) {
          console.log(`     - ${item_type.toUpperCase()} | ${item_category} | user: ${user.username} | loc: [${coords[1].toFixed(6)}, ${coords[0].toFixed(6)}]`);
        }
      }
    } catch (err) {
      console.error(`❌ Error in neighborhood "${name}": ${err.message}`);
    }
  }
}

module.exports = { CreateItems };
