const mysql = require('mysql2/promise');

async function testDatabaseConnection() {
    try {
        const connection = await mysql.createConnection({
            host: 'database-1.cv48awe0i2v2.ap-southeast-2.rds.amazonaws.com',
            user: 'admin',
            password: '123123yy',
            database: 't05ONBOARDING'
        });

        console.log('Connected to MySQL database successfully.');

        const [rows] = await connection.execute('SHOW TABLES');
        console.log('Tables in the database:', rows);

        await connection.end();
        console.log('Connection closed.');
    } catch (error) {
        console.error('Error connecting to the database:', error);
    }
}

testDatabaseConnection();