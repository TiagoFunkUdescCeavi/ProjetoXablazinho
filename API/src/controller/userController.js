const express = require('express');
const router = express.Router();
const database = require('../database/databaseConfig');

function uuidv4() {
    return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
        (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    );
}

router.get('/', async (req, res) => {        
    const results = database.query('SELECT * FROM USER ORDER BY ID ASC');
    res.status(200).send(results.rows);
});

router.get('/token', async (req, res) => {
    const name = req.query.name;
    let token = uuidv4();
    const results = database.query('UPDATE USER SET TOKEN = $1 WHERE NAME = $2 RETURNING ID', [token, name]);
    if (results.rows[0]){
        res.status(200).json({token: token});        
    }else res.status(200).json({error: 'Não foi possível gerar um token'});
});

router.post('/update', async(req, res) => {
    const {name, password, newName, newPassword, isAdmin, expirationDate} = req.query;

    const results = database.query('UPDATE USER SET NAME = $1, PASSWORD = $2, ISADMIN = $3, EXPIRATIONDATE = $4 WHERE NAME = $5 AND PASSWORD = $6 RETURNING ID', [newName, newPassword, isAdmin, expirationDate, name, password]);
    if (results.rows[0])
        res.status(200).json(results.rows[0]);
    else res.status(200).json({error: 'Não foi possível alterar o usuário.'});
});

router.put('/register', async (req, res) => {    
    const { name, password, isAdmin, expirationDate, databaseName } = req.body;
    const databaseQuery = database.query('SELECT ID FROM TABLEDBS WHERE NAME = $1', [databaseName]);
    if (!databaseQuery.rows[0]){
        res.status(200).json({error: "Banco de dados não encontrado!"});
    }else{
        const results = database.query('INSERT INTO USER (NAME, PASSWORD, ISADMIN, EXPIRATIONDATE, DBID) VALUES ($1,$2,$3,$4,$5) RETURNING ID', [name, password, isAdmin, expirationDate, databaseQuery.rows[0].id]);
        if (results.rows[0]) 
            res.status(201).json(results.rows[0]);
        else res.status(200).json({error: "Não foi possível inserir um usuário novo no sistema."});
    }
});

module.exports = app => app.use('/users', router);