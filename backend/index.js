const app = require("./app");
const db = require("./db");

db.connect_databases().then(() => {
  console.log("Connected to databases");
});

const port = process.env.PORT || 3001;
app.listen(port, () => console.log(`Server started on port ${port}...`));
