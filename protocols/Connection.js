const mysql = require('mysql');

const connection = mysql.createConnection({
    host: 'mysql-diego232323a.alwaysdata.net',
    user: '357679_ddd',
    password: 'diego220',
    database: 'diego232323a_ligacampeon'
});

connection.connect(err => {
    if (err) {
        console.error('Error connecting to the database:', err.message);
    } else {
        console.log('Connected to the MySQL database.');
    }
});

module.exports = connection;
