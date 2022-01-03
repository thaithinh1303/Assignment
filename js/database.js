var db = window.openDatabase("NTT_Shop", "1.0", "NTTShop", 20000);

function initialize_database() {
    db.transaction(function (tx) {
      var query = `CREATE TABLE IF NOT EXISTS city (
          id INTEGER PRIMARY KEY,
          name TEXT UNIQUE NOT NULL)`;
  
      tx.executeSql(query, [], table_transaction_success(`city`), transaction_error);
  
      var query = `CREATE TABLE IF NOT EXISTS district (
          id INTEGER PRIMARY KEY,
          name TEXT UNIQUE NOT NULL,
          city_id INTEGER NOT NULL,
          FOREIGN KEY (city_id) REFERENCES city(id))`;
  
      tx.executeSql(query, [], table_transaction_success(`district`), transaction_error);
  
      var query = `CREATE TABLE IF NOT EXISTS ward (
          id INTEGER PRIMARY KEY,
          name TEXT UNIQUE NOT NULL,
          district_id INTEGER NOT NULL,
          FOREIGN KEY (district_id) REFERENCES district(id))`;
  
      tx.executeSql(query, [], table_transaction_success(`ward`), transaction_error);
  
      var query = `CREATE TABLE IF NOT EXISTS account (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          username TEXT UNIQUE NOT NULL,
          password TEXT NOT NULL,
          firstname TEXT NULL,
          lastname TEXT NULL,
          birthday REAL NULL,
          phone TEXT NULL,
          street TEXT NULL,
          ward_id INTEGER NULL,
          district_id INTEGER NULL,
          city_id INTEGER NULL,
          status INTEGER NOT NULL,
          FOREIGN KEY (ward_id) REFERENCES ward(id),
          FOREIGN KEY (district_id) REFERENCES district(id),
          FOREIGN KEY (city_id) REFERENCES city(id))`;
  
      tx.executeSql( query, [], table_transaction_success(`account`), transaction_error);
  
      var query = `CREATE TABLE IF NOT EXISTS category (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT UNIQUE NOT NULL,
          description TEXT NULL,
          parent_id INTEGER NULL,
          FOREIGN KEY (parent_id) REFERENCES category(id))`;
  
      tx.executeSql(query, [], table_transaction_success(`category`), transaction_error);
  
      var query = `CREATE TABLE IF NOT EXISTS product (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT UNIQUE NOT NULL,
          description TEXT NULL,
          price REAL NOT NULL,
          image TEXT NULL,
          category_id INTEGER NOT NULL,
          FOREIGN KEY (category_id) REFERENCES category(id))`;
  
      tx.executeSql(query, [], table_transaction_success(`product`), transaction_error);
  
      var query = `CREATE TABLE IF NOT EXISTS cart (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          account_id INTEGER NOT NULL,
          product_id INTEGER NOT NULL,
          quantity INTEGER NOT NULL,
          FOREIGN KEY (account_id) REFERENCES account(id)
          FOREIGN KEY (product_id) REFERENCES product(id))`;
  
      tx.executeSql(query, [], table_transaction_success(`cart`), transaction_error);
  
    });
  }
  
  function fetch_database() {
      db.transaction(function (tx) {
          var query = "INSERT INTO category (name) VALUES (?)";
  
          tx.executeSql(query, ["For kids"], fetch_transaction_success("For kids"),transaction_error);
          tx.executeSql(query, ["For men"], fetch_transaction_success("For men"),transaction_error);
          tx.executeSql(query, ["For women"], fetch_transaction_success("For women"),transaction_error);
  
          var query = "INSERT INTO product (name, price, category_id, image) VALUES (?, ?, ?, ?)";
  
          tx.executeSql(query, ["Preschool Backpack Kids Cartoon Design", 500000, 1, "/image/shopping_1 for kids.webp"], fetch_transaction_success("Product 1"), transaction_error);
          tx.executeSql(query, ["Backpack Men Japanese Streetwear", 1100000, 2, "/image/shopping_2 for men.jpg"], fetch_transaction_success("Product 2"), transaction_error);
          tx.executeSql(query, ["Women Backpack for Travel", 5500000, 3, "/image/shopping_3 for women.jpg"], fetch_transaction_success("Product 3"), transaction_error);
          tx.executeSql(query, ["3D Dinosaur Backpack For Boys Children", 590000, 1, "/image/Shopping_4 for kids.webp"], fetch_transaction_success("Product 4"), transaction_error);
          tx.executeSql(query, ["Grey Rucksack Vintage Distressed Leather", 2800000, 2, "/image/shopping_5 for men.jpg"], fetch_transaction_success("Product 5"), transaction_error);
          tx.executeSql(query, ["Backpack Men Canvas / Backpack Men", 2400000, 2, "/image/shopping_6 for men.jpg"], fetch_transaction_success("Product 6"), transaction_error);
          tx.executeSql(query, ["Kid Hand Drawn Unique Large Backpack", 1750000, 1, "/image/shopping_7 for kids.jpg"], fetch_transaction_success("Product 7"), transaction_error);
          tx.executeSql(query, ["Vintage Canvas Backpack, School bag", 1050000, 3, "/image/shopping_8 for women.jpg"], fetch_transaction_success("Product 8"), transaction_error);
          tx.executeSql(query, ["Canvas Backpack For Women, Travel Backpack", 870000, 3, "/image/shopping_9 for women.jpg"], fetch_transaction_success("Product 9"), transaction_error);
          tx.executeSql(query, ["Kid Backpack for Girl, Boy, Nursery Bag", 610000, 1, "/image/shopping_10 for kids.jpg"], fetch_transaction_success("Product 10"), transaction_error);
          tx.executeSql(query, ["Personalized Leather Backpack, Full Grain Leather Rucksack Men", 3400000, 2, "/image/shopping_11 for men.jpg"], fetch_transaction_success("Product 11"), transaction_error);         
          tx.executeSql(query, ["Daisy Flower School Backpack, Large Capacity Backpack, Nylon Backpack", 865000, 3, "/image/shopping_12 for women.jpg"], fetch_transaction_success("Product 12"), transaction_error);

          var query = "INSERT INTO account (username, password, status) VALUES (?, ?, ?)";

          tx.executeSql(
              query, 
              ["test_01@test.com", "123", 1], 
              fetch_transaction_success("test_01@test.com"), 
              transaction_error
          );
      });
  }
  
  function fetch_transaction_success(name) {
      log("INFO", `Create table "${name}" successfully.`);
  }
  
  function table_transaction_success (table_name) {
      log("INFO", `Create table "${table_name}" successfully.`);
  }
  
  function log(type, message) {
      var current_time = new Date(); 
      console.log(`${current_time}  [${type}] ${message}`);
  }
  
  function transaction_error(tx, error) {
      log("ERROR", `SQL ERROR ${error.code}: ${error.message}.`);
  }