const express = require('express');
const router = express.Router();
const database = require('../database/databaseConfig');

router.get('/', async (req, res) => {        
    const results = await database.query('SELECT * FROM USERS ORDER BY ID ASC');
    res.status(200).send(results.rows);
});

router.put('/register', async (req, res) => {    
    const name = req.body.name;
    const databaseQuery = await database.query('SELECT ID FROM TABLEDBS WHERE NAME = $1', [name]);
    if (databaseQuery.rows[0]){
        res.status(200).json({error: "Banco de dados já existe!"});
    }else{
        const results = await database.query('INSERT INTO TABLEDBS (NAME) VALUES ($1) RETURNING ID', [name]);
        if (results.rows[0]) 
            res.status(201).json(results.rows[0]);
        else res.status(200).json({error: "Não foi possível inserir um banco de dados novo no sistema."});
    }
});

module.exports = app => app.use('/dbs', router);