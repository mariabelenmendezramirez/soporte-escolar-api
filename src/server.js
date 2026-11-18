
const express = require('express');
const cors = require('cors');

const solicitudesRouter = require('./routers/solicitudes');

const app = express();

app.use(cors());
app.use(express.json());

// Página principal
app.get('/', (req, res) => {
    res.json({
        mensaje: 'API SoporteEscolar funcionando'
    });
});

// Rutas de solicitudes
app.use('/api/solicitudes', solicitudesRouter);

const PORT = process.env.API_PORT || 3000;

app.listen(PORT, () => {
    console.log(`Servidor SoporteEscolar activo en puerto ${PORT}`);
});
