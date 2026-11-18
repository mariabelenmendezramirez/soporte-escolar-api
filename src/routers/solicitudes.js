
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
        const {
            nombre,
            correo,
            categoria,
            prioridad,
            descripcion,
            origen_timestamp
        } = req.body;

        // Validar campos obligatorios
        if (
            !nombre ||
            !correo ||
            !categoria ||
            !prioridad ||
            !descripcion ||
            !origen_timestamp
        ) {
            return res.status(400).json({
                mensaje: 'Todos los campos son obligatorios'
            });
        }

        // Generar folio automático
        const folio = `SE-${new Date().getFullYear()}-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;

        // Insertar solicitud evitando duplicados
        const resultado = await pool.query(
            `INSERT INTO solicitudes_soporte
            (
                folio,
                nombre,
                correo,
                categoria,
                prioridad,
                descripcion,
                origen_timestamp
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            ON CONFLICT (origen_timestamp) DO NOTHING
            RETURNING *`,
            [
                folio,
                nombre,
                correo,
                categoria,
                prioridad,
                descripcion,
                origen_timestamp
            ]
        );

        // Comprobar si la solicitud ya existía
        if (resultado.rows.length === 0) {
            return res.status(200).json({
                mensaje: 'Esta solicitud ya fue registrada'
            });
        }

        // Respuesta exitosa
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
