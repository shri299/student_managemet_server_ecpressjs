const express = require('express');
const app = express();
const port = 3030;

const mysql = require('mysql2')
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Runjhun2626$',
  database: 'studentdb'
})

connection.connect()


app.get('/students', (req, res) => {
    connection.query('SELECT * FROM StudentDetail', (err, rows, fields) => {
      if (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
      } else {
        res.json(rows);
      }
    });
  });


const server = app.listen(port,()=>{
    console.log(`listening on port ${port}`);
})


server.on('close', () => {
    connection.end(err => {
      if (err) {
        console.error('Error closing the connection:', err.message);
      } else {
        console.log('Database connection closed.');
      }
    });
  });