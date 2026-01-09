const express = require('express');
const path = require('path');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// 🛡️ PROTEÇÃO ANTI-FLOOD (Limita a 3 solicitações a cada 1 hora por IP)
const orcamentoLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hora
    max: 3, // limite de 3 requisições por IP
    message: { success: false, message: "Muitas solicitações vindas deste IP. Tente novamente em 1 hora." },
    standardHeaders: true,
    legacyHeaders: false,
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// API Routes
app.post('/api/orcamento', orcamentoLimiter, async (req, res) => {
    const { name, email, project, message, _honeypot } = req.body;

    // 🛡️ PROTEÇÃO HONEYPOT (Se o campo invisível for preenchido, é um BOT)
    if (_honeypot) {
        console.log('🤖 Spam detectado via Honeypot!');
        return res.status(400).json({ success: false, message: "Spam detectado." });
    }

    console.log('📬 Novo orçamento recebido:', { name, email, project, message });

    // --- CONFIGURAÇÃO DE E-MAIL ---
    // Para funcionar, você precisará configurar as variáveis no arquivo .env na VM
    // Exemplo: SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS
    if (process.env.SMTP_HOST) {
        try {
            const transporter = nodemailer.createTransport({
                host: process.env.SMTP_HOST,
                port: process.env.SMTP_PORT,
                secure: process.env.SMTP_PORT == 465,
                auth: {
                    user: process.env.SMTP_USER,
                    pass: process.env.SMTP_PASS,
                },
            });

            await transporter.sendMail({
                from: `"MSARTS Site" <${process.env.SMTP_USER}>`,
                to: process.env.RECEIVER_EMAIL || process.env.SMTP_USER,
                subject: `Novo Orçamento: ${name} - ${project}`,
                text: `Nome: ${name}\nE-mail: ${email}\nProjeto: ${project}\nMensagem: ${message}`,
                html: `<h3>Novo Orçamento Recebido</h3>
                       <p><strong>Nome:</strong> ${name}</p>
                       <p><strong>E-mail:</strong> ${email}</p>
                       <p><strong>Projeto:</strong> ${project}</p>
                       <p><strong>Mensagem:</strong> ${message}</p>`
            });
            console.log('✅ E-mail enviado com sucesso!');
        } catch (error) {
            console.error('❌ Erro ao enviar e-mail:', error);
            // Retornamos sucesso pro usuário para não travar a experiência, 
            // mas logamos o erro no servidor.
        }
    }

    res.status(200).json({ success: true, message: 'Solicitação enviada com sucesso! Entraremos em contato em breve.' });
});

// Admin Route (placeholder)
app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

app.listen(PORT, () => {
    console.log(`Servidor MSARTS rodando em http://localhost:${PORT}`);
});
