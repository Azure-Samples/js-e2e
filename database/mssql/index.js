/*

Create Azure SQL with sample database to use this query

*/

const sql = require('mssql')

const connectionString = "Driver={ODBC Driver 18 for SQL Server};Server=tcp:YOUR-SERVER.database.windows.net,1433;Database=YOUR-DATABASE;Uid=YOUR-USER;Pwd=YOUR-PASSWORD;Encrypt=yes;TrustServerCertificate=no;Connection Timeout=30;Authentication=ActiveDirectoryPassword";

const main = async() =>{
    await sql.connect(connectionString)
    const results = await sql.query`SELECT TOP (10) * FROM [SalesLT].[Product]`
    console.dir(results.recordsets[0])

}
main().then(()=>console.log('done')).catch((err)=> console.log(err))
