const User = require("../models/user");
const bcrypt = require('bcrypt');

// Async function to create a user
async function userCreate(username, password, first_name, family_name, date_of_birth, email, is_admin = false) {
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({
    username,
    password: hashedPassword,
    first_name,
    family_name,
    date_of_birth,
    email,
    is_admin,
    // preferences will default to { page_size: 12 } in the model
  });
  await user.save();
  console.log(`Added user: ${username}`);
}

const userConfigs = [
  { name: "Alice", familyName: "Smith" },
  { name: "Bob", familyName: "Johnson" },
  { name: "Carol", familyName: "Williams" },
  { name: "David", familyName: "Brown" },
  { name: "Eve", familyName: "Jones" },
  { name: "Frank", familyName: "Miller" },
  { name: "Grace", familyName: "Davis" },
  { name: "Hank", familyName: "Garcia" },
  { name: "Ivy", familyName: "Martinez" },
  { name: "Jack", familyName: "Robinson" },
  { name: "Karen", familyName: "Clark" },
  { name: "Leo", familyName: "Rodriguez" },
  { name: "Mona", familyName: "Lewis" },
  { name: "Nick", familyName: "Lee" },
  { name: "Olive", familyName: "Walker" },
  { name: "Paul", familyName: "Hall" },
  { name: "Quinn", familyName: "Allen" },
  { name: "Rose", familyName: "Young" },
  { name: "Sam", familyName: "Hernandez" },
  { name: "Tina", familyName: "King" }
].map(({ name, familyName }) => ({
  username: `${name.toLowerCase()}${familyName[0].toLowerCase()}`,
  name,
  familyName
}));

const getRandomBool = (p) => Math.random() < p;
const getRandomDate = () => {
    const start = new Date(1965, 0, 1);
    const end = new Date(200, 11, 31);
    const d = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
    return d.toISOString().slice(0, 10);
};


// Async function to create multiple users
async function createUsers(cnt) {
  await User.deleteMany({});
  console.log("removed all users");
  await userCreate("admin", "admin", "ad", "min", "2001-06-06", "admin@lostnfound.com", is_admin=true);
  if (cnt < 0) {
    return;
  }
  await   userCreate("chen", "2005", "Chen", "Nissan", "1974-06-06", "chen@lostnfound.com", is_admin=true);
  await   userCreate("liora", "2006", "Liora", "Twig", "1975-05-05", "liora@lostnfound.com", is_admin=true);
  for (let i = 0; i < cnt; i++) {
    const { username, name, familyName } = userConfigs[i];
    const email = `${username}@lostfound.com`;
    const isAdmin = getRandomBool(0.1);
    const dob = getRandomDate();

    await userCreate(username, username, name, familyName, dob, email, isAdmin);
  }
}

module.exports = { createUsers, userCreate };
