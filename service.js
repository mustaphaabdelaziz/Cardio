
const MongoClient = require("mongodb").MongoClient;
const fs = require("fs");
const dbName = "cardio";
const collections = ["staffs", "patients", "countries", "bcs", "materiels"];

const dbUrl = process.env.LOCAL_DB_URL;

for (let i = 0; i < collections.length; i++) {
  const client = new MongoClient("mongodb://localhost:27017");
  client.connect(function (err) {
    //assert.equal(null, err);
    console.log("Connected successfully to server");
    const db = client.db(dbName);
    getDocuments(db, i, function (docs) {
      console.log("Closing connection.");
      client.close();

      // Write to file
      try {
        fs.writeFileSync(collections[i] + ".json", JSON.stringify(docs));
        console.log("Done writing to file.");
      } catch (err) {
        console.log("Error writing to file", err);
      }
    });
  });
}

const getDocuments = function (db, i, callback) {
  const query = {}; // this is your query criteria

  db.collection(collections[i])
    .find(query)
    .toArray(function (err, result) {
      if (err) throw err;
      callback(result);
    });
};

// db.createUser({
//   user: "mustapha",
//   pwd: "intoyouramrs",
//   roles: [
//     { role: "userAdminAnyDatabase", db: "cardio" },
//     { role: "dbAdminAnyDatabase", db: "cardio" },
//     { role: "readWriteAnyDatabase", db: "cardio" },
//   ],
// });
// db.addUser({ user: "mustapha", pwd: "intoyouramrs", roles: ["root"] });
