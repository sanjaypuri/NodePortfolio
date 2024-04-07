const database = require('better-sqlite3');

const db = new database('trading.sqlite');

if(db){
  console.log(`Connected to database: ${db.name}`)
} else{
  console.log('Could not conect to the databse');
};

module.exports = db;