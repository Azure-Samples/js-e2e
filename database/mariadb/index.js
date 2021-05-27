// To install npm package,
// run following command at terminal
// npm install mariadb

// get mariadb SDK
const mariadb = require('mariadb');

// query server and close connection
const query = async (config) => {
  // creation connection
  const connection = await mariadb.createConnection(config);

  // show databases on server
  const databases = await connection.query('SHOW DATABASES;');
  console.log(databases);

  // show tables in the mysql database
  const tables = await connection.query('SHOW TABLES FROM mysql;');
  console.log(tables);

  // show users configured for the server
  const rows = await connection.query('select User from mysql.user;');
  console.log(rows);

  // close connection
  connection.end();
};

const config = {
  host: 'YOUR-RESOURCE_NAME.mariadb.database.azure.com',
  user: 'YOUR-ADMIN-NAME@YOUR-RESOURCE_NAME',
  password: 'YOUR-ADMIN-PASSWORD',
  port: 3306,
};

query(config)
  .then(() => console.log('done'))
  .catch((err) => console.log(err));