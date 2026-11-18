
const pool = require('./config/database');

async function probarConexion() {
    try {
        const resultado = await pool.query('SELECT NOW()');

        console.log('CONEXION EXITOSA CON NEON');
        console.log('Fecha del servidor:', resultado.rows[0].now);

    } catch (error) {
        console.error('ERROR DE CONEXION:', error.message);

    } finally {
        await pool.end();
    }
}

probarConexion();
