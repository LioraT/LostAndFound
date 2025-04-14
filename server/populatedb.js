#! /usr/bin/env node
  console.log(
    'This script populates some products and users or creates a clean databse. run as node populatedb [clean]'
  );

  require("dotenv").config();  

  // Get arguments passed on command line
  const userArgs = process.argv.slice(2);
  
  const User = require("./models/user");
  const Product = require("./models/product");
   
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
      //await Product.deleteMany({});
      await userCreate("admin", "admin", "ad", "min", "2001-06-06", "admin@ponykeg.com", is_admin=true);
      console.log("cleaned");
    } else {
      console.log("would pop");
      await createUsers();
      //await createProducts();
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
  
  async function productCreate(id, name, date, desc, available, quantity) {
    // For example, insert into MongoDB:
    const product = new Product({
      product_id: id,
      name,
      creation_date: new Date(date),
      description: desc,
      status: available,
      current_stock_level: quantity,
    });
    return await product.save(); // ✅ returns a promise
  }

  const getRandomBool = () => Math.random() > 0.5;
  const getRandomQuantity = () => parseFloat((Math.random() * 10000).toFixed(2));
  const getRandomDate = () => {
    const start = new Date(1995, 0, 1);
    const end = new Date(2023, 11, 31);
    const d = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
    return d.toISOString().slice(0, 10);
  };
  

  async function createProducts() {

  // ----------------- 🍺 BEER -----------------
  const beerNames = [
    ["Q001", "Guinness", "Dark Irish dry stout"],
    ["Q002", "Heineken", "Dutch pale lager with a slightly bitter taste"],
    ["Q003", "Stella Artois", "Classic Belgian pilsner with a crisp finish"],
    ["Q004", "Budweiser", "Famous American-style lager"],
    ["Q005", "Corona", "Light Mexican lager best served with lime"],
    ["Q006", "Beck's", "German pilsner with a strong hop flavor"],
    ["Q007", "Leffe Blonde", "Belgian abbey beer with fruity notes"],
    ["Q008", "Blue Moon", "Belgian-style wheat ale brewed with orange peel"],
    ["Q009", "Kirin Ichiban", "Japanese malt beer with smooth flavor"],
    ["Q010", "Asahi Super Dry", "Crisp, dry Japanese lager"],
  ];
  
  // ----------------- 🍷 WINE -----------------
  const wineNames = [
    ["J001", "Cabernet Sauvignon", "Full-bodied red wine with dark fruit flavors"],
    ["J002", "Merlot", "Soft and fruity red wine, easy to drink"],
    ["J003", "Pinot Noir", "Elegant red wine with notes of cherry and spice"],
    ["J004", "Chardonnay", "Popular white wine with buttery, oaky taste"],
    ["J005", "Sauvignon Blanc", "Crisp and refreshing white wine"],
    ["J006", "Riesling", "Sweet white wine often with peachy notes"],
    ["J007", "Zinfandel", "Spicy red wine often used in blends"],
    ["J008", "Shiraz", "Bold, dark red wine with peppery flavor"],
    ["J009", "Chianti", "Italian red wine, great with pasta"],
    ["J010", "Rosé", "Light pink wine with a fruity twist"],
  ];
  
  // ----------------- 🥃 WHISKEY -----------------
  const whiskeyNames = [
    ["W001", "Jameson", "Smooth Irish whiskey triple distilled"],
    ["W002", "Jack Daniel's", "Tennessee whiskey with a sweet oak finish"],
    ["W003", "Glenfiddich", "Single malt Scotch aged in oak casks"],
    ["W004", "Macallan", "Highland Scotch known for its rich character"],
    ["W005", "Chivas Regal", "Blended Scotch whisky with a creamy taste"],
    ["W006", "Bushmills", "Classic Irish whiskey with vanilla and spice"],
    ["W007", "Johnnie Walker", "Famous blended Scotch with smoky flavors"],
    ["W008", "Bulleit Bourbon", "Kentucky bourbon with a bold spice kick"],
    ["W009", "Canadian Club", "Smooth Canadian whisky"],
    ["W010", "Yamazaki", "Premium Japanese whisky aged in oak barrels"],
  ];
  
  
  // ----------------- 🍸 VODKA -----------------
  const vodkaNames = [
    ["V001", "Absolut", "Swedish vodka made from winter wheat"],
    ["V002", "Grey Goose", "Ultra-premium French vodka"],
    ["V003", "Belvedere", "Polish rye vodka with a smooth finish"],
    ["V004", "Smirnoff", "Classic vodka used in many cocktails"],
    ["V005", "Tito’s Handmade", "American corn-based gluten-free vodka"],
    ["V006", "Ketel One", "Dutch vodka with crisp citrus finish"],
    ["V007", "Skyy", "American vodka distilled four times"],
    ["V008", "Finlandia", "Finnish vodka made from barley"],
    ["V009", "Cîroc", "Vodka distilled from French grapes"],
    ["V010", "Russian Standard", "Traditional Russian wheat vodka"],
  ];
  
  // ----------------- 🥃 TEQUILA -----------------
  const tequilaNames = [
    ["T001", "Patrón", "Premium tequila distilled from blue agave"],
    ["T002", "Jose Cuervo", "Popular tequila ideal for margaritas"],
    ["T003", "Don Julio", "Smooth tequila with citrus and vanilla notes"],
    ["T004", "1800 Silver", "Clean-tasting silver tequila"],
    ["T005", "Espolon", "Vibrant tequila from Los Altos region"],
    ["T006", "Herradura", "Tequila aged in oak barrels for depth"],
    ["T007", "Casamigos", "Tequila brand co-founded by George Clooney"],
    ["T008", "Milagro", "Award-winning silver tequila"],
    ["T009", "Cazadores", "Añejo tequila with a balanced finish"],
    ["T010", "El Jimador", "Popular tequila for cocktails and shots"],
  ];
  
  
  
    console.log("Adding Products");
    const createPromises = [];
    beerNames.forEach(([id, name, desc]) => {
      createPromises.push(
        productCreate(id, name, getRandomDate(), desc, getRandomBool(), getRandomQuantity())
      )
    }
    );
    
  

    wineNames.forEach(([id, name, desc]) => {
      createPromises.push(
        productCreate(id, name, getRandomDate(), desc, getRandomBool(), getRandomQuantity())
      )
    }
    );
    
  
    whiskeyNames.forEach(([id, name, desc]) => {
      createPromises.push(
        productCreate(id, name, getRandomDate(), desc, getRandomBool(), getRandomQuantity())
      )
    }
    );
  

    vodkaNames.forEach(([id, name, desc]) => {
      createPromises.push(
        productCreate(id, name, getRandomDate(), desc, getRandomBool(), getRandomQuantity())
      )
    }
    );
 
    tequilaNames.forEach(([id, name, desc]) => {
      createPromises.push(
        productCreate(id, name, getRandomDate(), desc, getRandomBool(), getRandomQuantity())
      )
    }
    );
    
    await Promise.all(createPromises);

  }
  
  