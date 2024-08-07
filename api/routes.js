const mysql = require('mysql2/promise');

const dbConfig = {
    host: 'database-1.cv48awe0i2v2.ap-southeast-2.rds.amazonaws.com',
    user: 'admin',
    password: '123123yy',
    database: 't05ONBOARDING'
};

async function fetchAccidentStats(minLat, maxLat, minLng, maxLng) {
    const connection = await mysql.createConnection(dbConfig);
    try {
        const [results] = await connection.execute(`
            SELECT severity, COUNT(*) as count 
            FROM accidents 
            WHERE latitude BETWEEN ? AND ? AND longitude BETWEEN ? AND ?
            GROUP BY severity`,
            [minLat, maxLat, minLng, maxLng]
        );
        return results.reduce((acc, item) => {
            acc[item.severity] = item.count;
            return acc;
        }, {});
    } catch (err) {
        console.error('An error occurred while executing the query:', err);
        throw err;
    } finally {
        await connection.end();
    }
}

module.exports = async (req, res) => {
    const { minLat, maxLat, minLng, maxLng } = req.query;
    try {
        const stats = await fetchAccidentStats(parseFloat(minLat), parseFloat(maxLat), parseFloat(minLng), parseFloat(maxLng));
        res.status(200).json(stats);
    } catch (err) {
        console.error('Error retrieving accidents data:', err);
        res.status(500).json({
            message: 'Error retrieving accidents data',
            error: err.message
        });
    }
};
