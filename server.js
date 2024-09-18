const express = require('express');
const request = require('request');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000; // Vercel usa el puerto 3000 por defecto

app.use(cors()); // Habilitar CORS

// Middleware para configurar los encabezados CORS
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    if (req.method === 'OPTIONS') {
        res.sendStatus(200);
    } else {
        next();
    }
});

const banghoUrls = {
    emailmarketing: 'https://www.bangho.com.ar/_v/xml/emailmarketing',
    facebook: 'https://www.bangho.com.ar/_v/xml/facebook',
    google: 'https://www.bangho.com.ar/_v/xml/google'
};

const tidiUrls = {
    emailmarketing: 'https://www.tidi.com.ar/_v/xml/emailmarketing',
    facebook: 'https://www.tidi.com.ar/_v/xml/facebook',
    google: 'https://www.tidi.com.ar/_v/xml/google'
};

app.get('/proxy/bangho/:type', (req, res) => {
    const type = req.params.type;
    const url = banghoUrls[type];
    if (url) {
        request(url).pipe(res);
    } else {
        res.status(404).send('URL no encontrada');
    }
});

app.get('/proxy/tidi/:type', (req, res) => {
    const type = req.params.type;
    const url = tidiUrls[type];
    if (url) {
        request(url).pipe(res);
    } else {
        res.status(404).send('URL no encontrada');
    }
});

app.listen(PORT, () => {
    console.log(`Proxy server is running on port ${PORT}`);
});
