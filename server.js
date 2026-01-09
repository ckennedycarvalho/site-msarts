const express = require('express');
const path = require('path');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// API Routes
app.post('/api/orcamento', (req, res) => {
    const { name, email, project, message } = req.body;
    console.log('Novo orçamento recebido:', { name, email, project, message });

    // Aqui depois conectaremos ao Supabase ou envio de e-mail
    res.status(200).json({ success: true, message: 'Solicitação recebida com sucesso!' });
});

// Admin Route (placeholder)
app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});



app.listen(PORT, () => {
    console.log(`Servidor MSARTS rodando em http://localhost:${PORT}`);
});
