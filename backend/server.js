//IMPORT ALL THE NEEDED PACKAGES
const express = require('express');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;
const db = new sqlite3.Database('database.db');
app.use(cors());

//Require the server to use body parser so json data can be sent
app.use(bodyParser.json());

//CREATE ALL THE MAJOR TABLES NEEDED BY THE APPLICATION

function createUsersTable(){
    db.run(`
    CREATE TABLE IF NOT EXISTS users(
        id INTEGER PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        password TEXT NOT NULL,
        securityQuestion TEXT NOT NULL,
        securityAnswer TEXT NOT NULL
    );
    `)
}

function createTicketsTable(){
    db.run(`
    CREATE TABLE IF NOT EXISTS tickets(
        id INTEGER PRIMARY KEY,
        userID INTEGER NOT NULL,
        noOfChildren INTEGER NOT NULL,
        noOfAdults INTEGER NOT NULL,
        date TEXT NOT NULL
    );
    `)
}

function creatRoomsTable(){
    db.run(`
    CREATE TABLE IF NOT EXISTS rooms(
        roomID int NOT NULL,
        occupantID INTEGER NOT NULL,
        price REAL NOT NULL,
        status TEXT NOT NULL,
        noOfPeople INTEGER NOT NULL,
        description TEXT NOT NULL,
        currentStayDurration NOT NULL,
        dateBooked NOT NULL
    );
`)
}


//Add a new user
app.post('/register', async (req, res)=>{
    //Create the users table if it does not exist
    createUsersTable();

    //Get the needed data from the frontend
    const { name, email, password, securityQuestion, securityAnswer } = req.body;
    const hash = await bcrypt.hash(password, 13);

    //Run the sql script to insert the details of the new user into the database
    db.run('INSERT INTO users (name, email, password, securityQuestion, securityAnswer) VALUES(?,?,?,?,?)', [name, email, hash, securityQuestion, securityAnswer], function(err){
        if(err){
            return res.status(500).json({error: err.message})
        }
        res.json({ id:this.lastID })
    })
})

//Validate users login
app.post('/login', async (req, res)=>{
    //Create the users table if it does not exist
    createUsersTable();

    //Get the needed data from the frontend
    const {email, password} = req.body;

    //Run the sql script to insert the details of the new user into the database
    db.get('SELECT * FROM users WHERE email = ?', [email], async (err, rows)=>{
        if(err){
            console.error('Error executing query:', err)
            return res.status(500).json({error: 'Internal server error'})
        }
        if(rows != undefined){
            const isValid = await bcrypt.compare(password, rows.password);
            if(isValid){
                return res.send({status: true, details: rows});
            }else{
                return res.status(401).json({message: "Wrong password or user not found"});
            }
        }else{
            return res.send({status: false})
        }
    })
})

//Dashboard data tickets
app.post('/dashboard/tickets', (req,res)=>{
    //Create the tickets table if it doesn't exist
    createTicketsTable();

    //Get the needed data from the frontend
    const {userID} = req.body;

    //Run the sql script to insert the details of the new user into the database
    db.all('SELECT * FROM tickets WHERE userID = ?', [userID], async (err, rows)=>{
        if(err){
            console.error('Error executing query:', err)
            return res.status(500).json({error: 'Internal server error'})
        }
        res.send({tickets: rows})
    })
})

//Dashboard data bookings
app.post('/dashboard/rooms', (req,res)=>{
    //create the rooms table if it doesn't exist
    creatRoomsTable();

    //Get the needed data from the frontend
    const {userID} = req.body;

    //Run the sql script to insert the details of the new user into the database
    db.all('SELECT * FROM rooms WHERE occupantID = ?', [userID], async(err, rows)=>{
        if(err){
            console.error('Error executing query: ', err)
            return res.status(500).json({error: 'Internal server error'})
        }
        res.send({rooms: rows})
    })
})

//Adds a new ticket for a user
app.post('/ticket', async (req, res)=>{
    //Create the tickets table if it doesn't exist
    createTicketsTable();

    //Get the needed data from the frontend
    const { userID, noOfChildren, noOfAdults, date } = req.body;

    //Run the sql script to insert the details of the new ticket for the user
    db.run('INSERT INTO tickets (userID, noOfChildren, noOfAdults, date) VALUES(?,?,?,?)', [userID, noOfChildren, noOfAdults, date], async(err)=>{
        if(err){
            return res.status(500).json({error: err.message})
        }
        res.json({ id:this.id })
    })
})

//Adds a new room booking for a user
app.post('/room', async (req, res)=>{
    //Create the tickets table if it doesn't exist
    creatRoomsTable();

    //Get the needed data from the frontend
    const { roomID, occupantID, price, status, noOfPeople, description, currentStayDurration, dateBooked } = req.body;

    //Run the sql script to insert the details of the new ticket for the user
    db.run('INSERT INTO rooms (roomID, occupantID, price, status, noOfPeople, description, currentStayDurration, dateBooked) VALUES(?,?,?,?,?,?,?,?)', [roomID, occupantID, price, status, noOfPeople, description, currentStayDurration, dateBooked], async(err)=>{
        if(err){
            return res.status(500).json({error: err.message})
        }
        res.json({ id:this.id })
    })
})


//This is used to get all the rooms that have been booked
app.get('/booked/rooms', (req, res) =>{
    //Create the rooms table if it doesn't exist
    creatRoomsTable();
    
    //Run the sql script
    db.all('SELECT * FROM rooms', (err,rows)=>{
        if(err){
            return res.status(500).json({error: err.message});
        }
        res.json({rooms: rows});
    })
})

// app.get('/', (req, res) =>{
//     const {id} = req.body;
//     db.all('SELECT * FROM users WHERE id = ?', [id], (err,rows)=>{
//         if(err){
//             return res.status(500).json({error: err.message});
//         }
//         res.json({user: rows});
//     })
// })


//Create the room table if it doesn't exist

app.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`);
})
