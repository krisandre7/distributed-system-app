const mongoose = require("mongoose");

const dbUrl = process.env.DB_URL || "mongodb://localhost/vidly";
const db2Url = process.env.DB_URL || "mongodb://localhost/vidly";
const connection_config = {
  useUnifiedTopology: true,
  useNewUrlParser: true,
};

const connect_databases = async () => {
  await mongoose.connect(dbUrl, connection_config);

  mongoose.createConnection(db2Url, connection_config);
  console.log("Connected to MongoDB: " + dbUrl);
};

const close = (index) => mongoose.connections[index].close();

module.exports = { connect_databases, close, url: dbUrl, url2: db2Url };
