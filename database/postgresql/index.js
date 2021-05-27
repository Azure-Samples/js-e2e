const { Client } = require('pg')
    
const query = async (connectionString) => {
    
    // create connection
    const connection = new Client(connectionString);
    connection.connect();
    
    // show tables in the postgres database
    const tables = await connection.query('SELECT table_name FROM information_schema.tables where table_type=\'BASE TABLE\';');
    console.log(tables.rows);

    // show users configured for the server
    const users = await connection.query('select pg_user.usename FROM pg_catalog.pg_user;');
    console.log(users.rows);
    
    // close connection
    connection.end();
}

const server='YOURRESOURCENAME';
const user='YOUR-ADMIN-USER';
const password='YOUR-PASSWORD';
const database='postgres';

const connectionString = `postgres://${user}@${server}:${password}@${server}.postgres.database.azure.com:5432/${database}`;

query(connectionString)
.then(() => console.log('done'))
.catch((err) => console.log(err));