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

app.use(express.json());


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

app.get('/students/:studentID',(req,res)=>{
    const id = req.params.studentID;

    connection.query('SELECT * FROM StudentDetail WHERE studentID = ?', [id], (err, rows, fields)=>{
        if(err){
            console.error(err);
            res.status(500).json({ error: 'Internal Server Error' });
        } else{
            if (rows.length>0) {
                res.json(rows[0]);
            } else {
                res.status(404).json({ error: 'Student not found' });
            }
        }
    })
})


app.post('/addstudent', (req, res) => {
    const { StudentID, LastName, FirstName, City, Phone } = req.body;
  
    // Perform a database query to insert the new student detail
    connection.query(
      'INSERT INTO StudentDetail (StudentID, LastName, FirstName, City, Phone) VALUES (?, ?, ?, ?, ?)',
      [StudentID, LastName, FirstName, City, Phone],
      (err, result) => {
        if (err) {
          console.error(err);
          res.status(500).json({ error: 'Internal Server Error' });
        } else {
          res.status(200).json({ message: 'Student detail added successfully' });
        }
      }
    );
  });

app.delete('/removestudent/:id',(req,res)=>{
    const studentid = req.params.id;

    connection.query(
        'DELETE FROM StudentDetail WHERE StudentID = ?',
        [studentid],
        (err, result) => {
          if (err) {
            console.error(err);
            res.status(500).json({ error: 'Internal Server Error' });
          } else {
            if (result.affectedRows > 0) {
              res.json({ message: `Student with ID ${studentid} deleted successfully` });
            } else {
              res.status(404).json({ error: `Student with ID ${studentid} not found` });
            }
          }
        }
      );
})


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