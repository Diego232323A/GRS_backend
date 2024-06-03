const express = require('express');
const xml2js = require('xml2js');
const builder = new xml2js.Builder();
const connection = require('../protocols/Connection');

const router = express.Router();

// Obtener todos los equipos
router.get('/equipos', (req, res) => {
    connection.query('SELECT * FROM teams', (err, results) => {
        if (err) {
            console.error('Error executing query:', err.message);
            res.status(500).send('<error>Error retrieving data</error>');
        } else {
            const xmlEquipos = results.map(equipo => ({
                equipo: {
                    id: equipo.id,
                    name: equipo.name,
                    stadium: equipo.stadium,
                    coach: equipo.coach,
                    yearFounded: equipo.yearFounded,
                    logoUrl: equipo.logoUrl
                }
            }));
            const xml = builder.buildObject({ equipos: xmlEquipos });
            res.type('application/xml');
            res.send(xml);
        }
    });
});

// Obtener un equipo por ID
router.get('/equipos/:id', (req, res) => {
    const { id } = req.params;
    connection.query('SELECT * FROM teams WHERE id = ?', [id], (err, results) => {
        if (err) {
            console.error('Error executing query:', err.message);
            res.status(500).send('<error>Error retrieving data</error>');
        } else if (results.length === 0) {
            res.status(404).send('<error>Team not found</error>');
        } else {
            const xml = builder.buildObject({
                equipo: {
                    id: results[0].id,
                    name: results[0].name,
                    stadium: results[0].stadium,
                    coach: results[0].coach,
                    yearFounded: results[0].yearFounded,
                    logoUrl: results[0].logoUrl
                }
            });
            res.type('application/xml');
            res.send(xml);
        }
    });
});

// Crear un nuevo equipo
router.post('/equipos', (req, res) => {
    xml2js.parseString(req.body, (err, result) => {
        if (err) {
            res.status(400).send('<error>Invalid XML</error>');
        } else {
            const { name, stadium, coach, yearFounded, logoUrl } = result.equipo;
            connection.query('INSERT INTO teams (name, stadium, coach, yearFounded, logoUrl) VALUES (?, ?, ?, ?, ?)',
                [name[0], stadium[0], coach[0], parseInt(yearFounded[0]), logoUrl[0]],
                (err, results) => {
                    if (err) {
                        console.error('Error executing query:', err.message);
                        res.status(500).send('<error>Error creating team</error>');
                    } else {
                        const newEquipo = {
                            id: results.insertId,
                            name: name[0],
                            stadium: stadium[0],
                            coach: coach[0],
                            yearFounded: parseInt(yearFounded[0]),
                            logoUrl: logoUrl[0]
                        };
                        const xml = builder.buildObject({ equipo: newEquipo });
                        res.type('application/xml');
                        res.send(xml);
                    }
                }
            );
        }
    });
});

// Actualizar un equipo existente
router.put('/equipos/:id', (req, res) => {
    xml2js.parseString(req.body, (err, result) => {
        if (err) {
            res.status(400).send('<error>Invalid XML</error>');
        } else {
            const { id } = req.params;
            const { name, stadium, coach, yearFounded, logoUrl } = result.equipo;
            connection.query('UPDATE teams SET name = ?, stadium = ?, coach = ?, yearFounded = ?, logoUrl = ? WHERE id = ?',
                [name[0], stadium[0], coach[0], parseInt(yearFounded[0]), logoUrl[0], id],
                (err, results) => {
                    if (err) {
                        console.error('Error executing query:', err.message);
                        res.status(500).send('<error>Error updating team</error>');
                    } else if (results.affectedRows === 0) {
                        res.status(404).send('<error>Team not found</error>');
                    } else {
                        const updatedEquipo = {
                            id: parseInt(id),
                            name: name[0],
                            stadium: stadium[0],
                            coach: coach[0],
                            yearFounded: parseInt(yearFounded[0]),
                            logoUrl: logoUrl[0]
                        };
                        const xml = builder.buildObject({ equipo: updatedEquipo });
                        res.type('application/xml');
                        res.send(xml);
                    }
                }
            );
        }
    });
});

// Eliminar un equipo
router.delete('/equipos/:id', (req, res) => {
    const { id } = req.params;
    connection.query('DELETE FROM teams WHERE id = ?', [id], (err, results) => {
        if (err) {
            console.error('Error executing query:', err.message);
            res.status(500).send('<error>Error deleting team</error>' );
        } else if (results.affectedRows === 0) {
            res.status(404).send('<error>Team not found</error>');
        } else {
            res.send('<success>Team deleted successfully</success>');
        }
    });
});

module.exports = router;

