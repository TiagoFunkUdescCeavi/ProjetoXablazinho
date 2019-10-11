const express = require('express');
const router = express.Router();
const database = require('../database/databaseConfig');

router.get('/', async (req, res) => {        
    const results = database.query('SELECT * FROM USER ORDER BY ID ASC');
    res.status(200).send(results.rows);
});

router.post('/update', async(req, res) => {
    
});

router.put('/register', async (req, res) => {    
    const { name, password, isAdmin, expirationDate } = req.body;
    const results = database.query('INSERT INTO USER (NAME, PASSWORD, ISADMIN, EXPIRATIONDATE) VALUES ($1,$2,$3,$4) RETURNING ID', [name, password, isAdmin, expirationDate]);
    if (results.rows[0]) 
        res.status(200).send(results.rows[0]);
    else res.status(500).send("The service was unnable to create a new User");
});

module.exports = app => app.use('/users', router);