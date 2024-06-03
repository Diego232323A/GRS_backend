const express = require('express');
const router = express.Router();
const connection = require('../protocols/Connection');

// Obtener todos los equipos
router.get('/equipos', (req, res) => {
    connection.query('SELECT * FROM teams', (err, results) => {
        if (err) {
            console.error('Error executing query:', err.message);
            res.status(500).send('Error retrieving data');
        } else {
            res.json(results);
        }
    });
});

// Obtener un equipo por ID
router.get('/equipos/:id', (req, res) => {
    const { id } = req.params;
    connection.query('SELECT * FROM teams WHERE id = ?', [id], (err, results) => {
        if (err) {
            console.error('Error executing query:', err.message);
            res.status(500).send('Error retrieving data');
        } else if (results.length === 0) {
            res.status(404).send('Team not found');
        } else {
            res.json(results[0]);
        }
    });
});

// Crear un nuevo equipo
router.post('/equipos', (req, res) => {
    const { name, stadium, coach, yearFounded, logoUrl } = req.body;
    connection.query('INSERT INTO teams (name, stadium, coach, yearFounded, logoUrl) VALUES (?, ?, ?, ?, ?)',
        [name, stadium, coach, yearFounded, logoUrl],
        (err, results) => {
            if (err) {
                console.error('Error executing query:', err.message);
                res.status(500).send('Error creating team');
            } else {
                res.status(201).json({ id: results.insertId, name, stadium, coach, yearFounded, logoUrl });
            }
        }
    );
});

// Actualizar un equipo existente
router.put('/equipos/:id', (req, res) => {
    const { id } = req.params;
    const { name, stadium, coach, yearFounded, logoUrl } = req.body;
    connection.query('UPDATE teams SET name = ?, stadium = ?, coach = ?, yearFounded = ?, logoUrl = ? WHERE id = ?',
        [name, stadium, coach, yearFounded, logoUrl, id],
        (err, results) => {
            if (err) {
                console.error('Error executing query:', err.message);
                res.status(500).send('Error updating team');
            } else if (results.affectedRows === 0) {
                res.status(404).send('Team not found');
            } else {
                res.json({ id, name, stadium, coach, yearFounded, logoUrl });
            }
        }
    );
});

// Eliminar un equipo
router.delete('/equipos/:id', (req, res) => {
    const { id } = req.params;
    connection.query('DELETE FROM teams WHERE id = ?', [id], (err, results) => {
        if (err) {
            console.error('Error executing query:', err.message);
            res.status(500).send('Error deleting team');
        } else if (results.affectedRows === 0) {
            res.status(404).send('Team not found');
        } else {
            res.send('Team deleted successfully');
        }
    });
});

module.exports = router;
