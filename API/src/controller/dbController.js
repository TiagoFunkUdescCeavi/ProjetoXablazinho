const express = require('express');
const router = express.Router();
const database = require('../database/databaseConfig');

router.get('/', async (req, res) => {        
    const results = await database.query('SELECT * FROM TABLEDBS ORDER BY ID ASC');
    res.status(200).json(results.rows);
});

router.put('/register', async (req, res) => {    
    const {name, serverName} = req.body;
    const databaseQuery = await database.query("SELECT ID FROM TABLEDBS WHERE NAME = $1", [name]);
    if (databaseQuery.rows[0]){
        res.status(200).json({error: "Banco de dados já existe!"});
    }else{
        const results = await database.query("INSERT INTO TABLEDBS (NAME, SERVERNAME) VALUES ($1, $2) RETURNING ID", [name, serverName]);
        if (results.rows[0]) 
            res.status(201).json(results.rows[0]);
        else res.status(200).json({error: "Não foi possível inserir um banco de dados novo no sistema."});
    }
});

router.delete('/delete', async (req, res) => {
    const id = req.body.id;
    const deleteUsers = await database.query('DELETE FROM USERS WHERE DBID = $1', [id]);
    const databaseQuery = await database.query('DELETE FROM TABLEDBS WHERE ID = $1 RETURNING ID', [id]);
    if (databaseQuery.rows[0])
        res.status(200).json({sucess: 'Banco de dados removido'});
    else res.status(200).json({error: 'Não foi possível remover o banco de dados'})
});

router.post('/update', async (req, res) => {
    const updateQuery = await database.query("UPDATE TABLEDBS SET (NAME, SERVERNAME) = ($1, $2) WHERE ID = $3 RETURNING ID", [req.body.name, req.body.servername, req.body.id]);
    if (updateQuery.rows[0])
        res.status(200).json({sucess: 'Banco de dados alterado com sucesso'});
    else res.status(200).json({error: 'Erro ao alterar banco de dados'});
});

module.exports = app => app.use('/dbs', router);