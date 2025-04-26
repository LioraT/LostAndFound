const mongoose = require("mongoose");

const { createUsers } = require('./dbtools/createUsers');
const { loadNeighborhoods } = require('./dbtools/createNeighborhoods');
const { loadPoliceStations } = require('./dbtools/createPoliceStations');
const { CreateItems } = require('./dbtools/CreateItems');
const path = require('path');
const scriptName = path.basename(process.argv[1]);

require("dotenv").config();

const itemTypes = ['lost', 'found'];
const categories = [ 'keys', 'wallet', 'phone', 'jewelry', 'bag'];

const MONGO_URI = process.env.MONGODB_URI;
console.log(MONGO_URI);

const userArgs = process.argv.slice(2);
const allowedKeys = ['clean', 'run', 'users', 'maxitems'];
const args = {};
userArgs.forEach(arg => {
  const [key, value] = arg.split('=');
  if (!allowedKeys.includes(key)) {
    console.error(`❌ Illegal argument: ${key}`);
    printUsageAndExit();
  }
  args[key] = value === undefined ? undefined : value;  // Track undefined explicitly for 'run'
});


// Validate optional numeric args early
const userCount = args.users ? parseInt(args.users) : 3;
const maxItems = args.maxitems ? parseInt(args.maxitems) : 10;
let clean = false;
// CLEAN option
if ('clean' in args) {
  // Only 'clean' allowed (no other keys)
  if (Object.keys(args).length > 1 || args.clean !== undefined) {
    console.error('❌ Invalid "clean" usage.');
    printUsageAndExit();
  }
  clean = true;
}
// RUN option
else if ('run' in args) {
  if (args.run !== undefined) {
    console.error('❌ "run" should not have a value.');
    printUsageAndExit();
  }

  // Validate userCount
  if (userCount > 20 || userCount < 1 || isNaN(userCount)) {
    console.error('❌ "users" must be between 1 and 20.');
    printUsageAndExit();
  }

  // Validate maxItems
  if (maxItems > 100 || maxItems < 1 || isNaN(maxItems)) {
    console.error('❌ "maxitems" must be between 1 and 100.');
    printUsageAndExit();
  }
}
// Neither 'clean' nor 'run'
else {
  console.error('❌ Missing "run" or "clean" argument.');
  printUsageAndExit();
}


// Print usage
function printUsageAndExit() {
  console.log(`
Usage:
  node ${scriptName} run [users=<2-20>] [maxitems=<2-100>]
  node ${scriptName} clean

Defaults:
  users = 3 (test users)
  maxitems = 10 (test items per neighborhood)
`);
  process.exit(1);
}

async function main() {
  try {
    await mongoose.connect(MONGO_URI);
    await createUsers(clean ? -1 : userCount);
    await loadNeighborhoods();
    await loadPoliceStations();
    await CreateItems(itemTypes, categories, clean ? -1 : maxItems);
  } catch (err) {
    console.error("💥 Global error:", err);
  } finally {
    await mongoose.disconnect();
  }
}

main();
