const express = require('express');
const router = express.Router();
const database = require('../database/databaseConfig');

function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

router.get('/', async (req, res) => {        
    const results = await database.query('SELECT * FROM USERS ORDER BY ID ASC');
    res.status(200).send(results.rows);
});

router.get('/token', async (req, res) => {
    const {name, db} = req.query;
    const databaseQuery = await database.query('SELECT ID FROM TABLEDBS WHERE NAME = $1', [db]);
    if (!databaseQuery.rows[0]){
        res.status(200).json({error: 'Banco de dados não encontrado!'});
    }else{
        let token = await uuidv4();
        const results = await database.query('UPDATE USERS SET TOKEN = $1 WHERE NAME = $2 RETURNING ID', [token, name]);
        if (results.rows[0]){
            res.status(200).json({token: token});        
        }else res.status(200).json({error: 'Não foi possível gerar um token'});
    }
});

router.post('/update', async(req, res) => {
    const {name, password, newName, newPassword, isAdmin, expirationDate, databaseName} = req.body;
    const databaseQuery = await database.query('SELECT ID FROM TABLEDBS WHERE NAME = $1', [databaseName]);
    
    if (!databaseQuery.rows[0]){
        res.status(200).json({error: "Banco de dados não encontrado!"});
    }else{    
        const results = await database.query('UPDATE USERS SET NAME = $1, PASSWORD = $2, ISADMIN = $3, EXPIRATIONDATE = $4 WHERE NAME = $5 AND PASSWORD = $6 RETURNING ID', [newName, newPassword, isAdmin, expirationDate, name, password]);
        if (results.rows[0])
            res.status(200).json(results.rows[0]);
        else res.status(200).json({error: 'Não foi possível alterar o usuário.'});
    }
});

router.put('/register', async (req, res) => {    
    const {name, password, isAdmin, expirationDate, databaseName} = req.body;
    const databaseQuery = await database.query('SELECT ID FROM TABLEDBS WHERE NAME = $1', [databaseName]);
    if (!databaseQuery.rows[0]){
        res.status(200).json({error: "Banco de dados não encontrado!"});
    }else{
        const results = await database.query('INSERT INTO USERS (NAME, PASSWORD, ISADMIN, EXPIRATIONDATE, DBID) VALUES ($1,$2,$3,$4,$5) RETURNING ID', [name, password, isAdmin, expirationDate, databaseQuery.rows[0].id]);
        if (results.rows[0]) 
            res.status(201).json(results.rows[0]);
        else res.status(200).json({error: "Não foi possível inserir um usuário novo no sistema."});
    }
});

module.exports = app => app.use('/users', router);