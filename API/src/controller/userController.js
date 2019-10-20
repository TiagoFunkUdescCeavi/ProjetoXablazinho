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
    const results = await database.query('SELECT * FROM USERS WHERE DBID = $1 ORDER BY ID ASC', [req.query.dbid]);
    res.status(200).json(results.rows);
});

router.get('/token', async (req, res) => {
    const {name, dbid} = req.query;
    let token = await uuidv4();
    const results = await database.query("UPDATE USERS SET TOKEN = $1 WHERE NAME = $2 AND DBID = $3 RETURNING ID", [token, name, dbid]);
    if (results.rows[0]){
        res.status(200).json({token: token});        
    }else res.status(200).json({error: 'Não foi possível gerar um token'});
});

router.post('/update', async(req, res) => {
    const {name, password, newname, newpassword, isadmin, expirationdate, dbid} = req.body;    
    const results = await database.query("UPDATE USERS SET NAME = $1, PASSWORD = $2, ISADMIN = $3, EXPIRATIONDATE = $4 WHERE NAME = $5 AND PASSWORD = $6 AND DBID = $7 RETURNING ID", [newname, newpassword, isadmin, expirationdate, name, password, dbid]);
    if (results.rows[0])
        res.status(200).json({sucess: 'Usuário alterado'});
    else res.status(200).json({error: 'Não foi possível alterar o usuário'});
});

router.put('/register', async (req, res) => {    
    const {name, password, isadmin, expirationdate, dbid} = req.body;    
    const results = await database.query("INSERT INTO USERS (NAME, PASSWORD, ISADMIN, EXPIRATIONDATE, DBID) VALUES ($1,$2,$3,$4,$5) RETURNING ID", [name, password, isadmin, expirationdate, dbid]);
    if (results.rows[0]) 
        res.status(201).json(results.rows[0]);  
    else res.status(200).json({error: "Não foi possível inserir um usuário novo no sistema."});
});

router.delete('/delete', async (req, res) => {
    const query = await database.query('DELETE FROM USERS WHERE ID = $1 RETURNING ID', [req.body.id]);
    if (query.rows[0])
        res.status(200).json({sucess: 'Usuário removido'});
    else res.status(200).json({error: 'Erro ao remover usuário'});
});

module.exports = app => app.use('/users', router);