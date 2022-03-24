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
Create the code needed in server.js to sync the Sequelize models to the MySQL database on server start  //
*/

//THINGS THAT DON'T WORK YET
//
//GET all/one products works but including loads of stuff i don't need -> look at attributes
//
//GET all/one tag works if don't include models
