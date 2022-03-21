const express = require("express");
const routes = require("./routes");
const sequelize = require("./config/connection");
// import sequelize connection

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(routes);

// sync sequelize models to the database, then turn on the server
sequelize.sync({ force: false }).then(() => {
  app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}!`);
  });
});

/* 
Schema.sql file-don't think need to do anything here  //
.env file, add to .gitgnore  //
models according to readme instructions //
relationships in models/index   //
routes for category/product/tag CRUD
routes for product tag? -> double check this, may not need
Create the code needed in server.js to sync the Sequelize models to the MySQL database on server start  //
*/
