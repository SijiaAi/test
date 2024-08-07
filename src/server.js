const express = require('express');
const mysql = require('mysql2/promise');
const app = express();
const cors = require('cors');
const port = 3001;

app.use(cors()); // Enable CORS for all routes

const dbConfig = {
    host: 'database-1.cv48awe0i2v2.ap-southeast-2.rds.amazonaws.com',
    user: 'admin',
    password: '123123yy',
    database: 't05ONBOARDING'
};

app.get('/api/bicycle-accidents', async (req, res) => {
    try {
        const connection = await mysql.createConnection(dbConfig);
        const [rows] = await connection.execute('SELECT * FROM accidents');
        await connection.end();
        res.json(rows);
    } catch (error) {
        console.error('Error connecting to the database:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
