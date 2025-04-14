
  require("dotenv").config();  

  // Get arguments passed on command line
  const userArgs = process.argv.slice(2);
  
  const User = require("./models/user");
   
  const mongoose = require("mongoose");
  const bcrypt = require('bcrypt');
  mongoose.set("strictQuery", false);
  
  const MONGO_URI = process.env.MONGODB_URI;
  console.log(MONGO_URI);
  const clean_db = userArgs.length > 0 && userArgs[0] == "clean";
  console.log(`URI = ${MONGO_URI} clean= ${clean_db} `);
  
  main().catch((err) => console.log(err));
  
  async function main() {
    console.log("Debug: About to connect");
    await mongoose.connect(MONGO_URI);
    console.log("Debug: Should be connected?");
    if (clean_db) {
      await User.deleteMany({});

      await userCreate("admin", "admin", "ad", "min", "2001-06-06", "admin@ponykeg.com", is_admin=true);
      console.log("cleaned");
    } else {
      console.log("would pop");
      await createUsers();

    }
    
    console.log("Debug: Closing mongoose");
    mongoose.connection.close();
  }
  
  async function createUsers() {
    console.log("Adding users");
    await Promise.all([

      userCreate("chen", "2005", "Chen", "Nissan", "1974-06-06", "chen@ponykeg.com", is_admin=true),
    
    ]);
  }
  

  async function userCreate(username, password, first_name, family_name, date_of_birth, email, is_admin=false) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
        username,
        password: hashedPassword,
        first_name,
        family_name,
        date_of_birth,
        email,
        is_admin,
        // is_admin defaults to false
        // preferences defaults to { page_size: 12 }
     });
    await user.save();
    
    console.log(`Added user: ${username}`);
  }
  

  const getRandomBool = () => Math.random() > 0.5;
  const getRandomQuantity = () => parseFloat((Math.random() * 10000).toFixed(2));
  const getRandomDate = () => {
    const start = new Date(1995, 0, 1);
    const end = new Date(2023, 11, 31);
    const d = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
    return d.toISOString().slice(0, 10);
  };
  


  
  