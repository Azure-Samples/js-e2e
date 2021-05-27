// install cassandra-driver SDK
// run at command line
// npm install cassandra-driver

const cassandra = require('cassandra-driver');

const config = {
  username: 'YOUR-USERNAME', // Your Cassandra user name is the resource name 
  password:
    'YOUR-PASSWORD',
  contactPoint: 'YOUR-RESOURCE-NAME.cassandra.cosmos.azure.com',
};

let client = null;

const callCassandra = async () => {

  // authentication 
  const authProvider = new cassandra.auth.PlainTextAuthProvider(
    config.username,
    config.password
  );

  // create client
  client = new cassandra.Client({
    contactPoints: [`${config.contactPoint}:10350`],
    authProvider: authProvider,
    localDataCenter: 'Central US',
    sslOptions: {
      secureProtocol: 'TLSv1_2_method',
      rejectUnauthorized: false,
    },
  });

  await client.connect();
  console.log("connected");
  
  // create keyspace
  let query =
    "CREATE KEYSPACE IF NOT EXISTS uprofile WITH replication = {\'class\': \'NetworkTopologyStrategy\', \'datacenter\' : \'1\' }";
  await client.execute(query);
  console.log('created keyspace');

  // create table
  query =
    'CREATE TABLE IF NOT EXISTS uprofile.user (name text, alias text, region text Primary Key)';
  await client.execute(query);
  console.log('created table');

  // insert 3 rows
  console.log('insert');
  const arr = [
    "INSERT INTO uprofile.user (name, alias , region) VALUES ('Tim Jones', 'TJones', 'centralus')",
    "INSERT INTO uprofile.user (name, alias , region) VALUES ('Joan Smith', 'JSmith', 'northus')",
    "INSERT INTO uprofile.user (name, alias , region) VALUES ('Bob Wright', 'BWright', 'westus')"
  ];
  for (const element of arr) {
    await client.execute(element);
  }

  // get all rows
  query = 'SELECT * FROM uprofile.user';
  const resultSelect = await client.execute(query);

  for (const row of resultSelect.rows) {
    console.log(
      'Obtained row: %s | %s | %s ',
      row.name,
      row.alias,
      row.region
    );
  }

  // get filtered row
  console.log('Getting by region');
  query = 'SELECT * FROM uprofile.user where region=\'westus\'';
  const resultSelectWhere = await client.execute(query);

  for (const row of resultSelectWhere.rows) {
    console.log(
      'Obtained row: %s | %s | %s ',
      row.name,
      row.alias,
      row.region
    );
  }

  client.shutdown();
};

callCassandra()
  .then(() => {
    console.log('done');
  })
  .catch((err) => {
    if (client) {
      client.shutdown();
    }
    console.log(err);
  });