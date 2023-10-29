const mongoose = require("mongoose");

const dbUrl = process.env.DB_URL || "mongodb://localhost/vidly";
const db2Url = process.env.DB2_URL || "mongodb://localhost/vidly2";
const connection_config = {
  useUnifiedTopology: true,
  useNewUrlParser: true,
};

const connect_databases = async () => {
  await mongoose.connect(dbUrl, connection_config);
  console.log("Connected to MongoDB: " + dbUrl);

  mongoose.createConnection(db2Url, connection_config);
  console.log("Connected to MongoDB: " + db2Url);
};

const close = (index) => mongoose.connections[index].close();

module.exports = { connect_databases, close, url: dbUrl, url2: db2Url };
