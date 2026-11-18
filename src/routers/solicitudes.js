
const express = require('express');
const router = express.Router();
const pool = require('../config/database');

// Consultar solicitudes
router.get('/', async (req, res) => {
    try {
        const resultado = await pool.query(
            'SELECT * FROM solicitudes_soporte ORDER BY id DESC'
        );

        res.json(resultado.rows);

    } catch (error) {
        console.error(error.message);
        res.status(500).json({
            mensaje: 'Error al consultar solicitudes'
        });
    }
});

// Registrar solicitud
router.post('/', async (req, res) => {
    try {
        const { nombre, correo, categoria, prioridad, descripcion } = req.body;

        if (!nombre || !correo || !categoria || !prioridad || !descripcion) {
            return res.status(400).json({
                mensaje: 'Todos los campos son obligatorios'
            });
        }

        const folio = `SE-${new Date().getFullYear()}-${Date.now()}`;

        const resultado = await pool.query(
            `INSERT INTO solicitudes_soporte
            (folio, nombre, correo, categoria, prioridad, descripcion)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *`,
            [folio, nombre, correo, categoria, prioridad, descripcion]
        );

        res.status(201).json({
            mensaje: 'Solicitud registrada correctamente',
            solicitud: resultado.rows[0]
        });

    } catch (error) {
        console.error(error.message);
        res.status(500).json({
            mensaje: 'Error al registrar solicitud'
        });
    }
});

module.exports = router;
