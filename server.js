const express = require('express');
const path = require('path');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const nodemailer = require('nodemailer');
const helmet = require('helmet');
const createDOMPurify = require('dompurify');
const { JSDOM } = require('jsdom');
require('dotenv').config();

// Configuração para Sanitização (Prevenção de XSS - OWASP A03:2021)
const window = new JSDOM('').window;
const dompurify = createDOMPurify(window);

const app = express();
const PORT = process.env.PORT || 3000;

// 🛡️ SEGURANÇA HELMET (OWASP A05:2021 - Security Misconfiguration)
// Configura diversos cabeçalhos HTTP para proteger o site contra ataques comuns
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            ...helmet.contentSecurityPolicy.getDefaultDirectives(),
            "script-src": ["'self'", "https://unpkg.com"], // Permite Lucide Icons
            "img-src": ["'self'", "data:", "https://*"],
        },
    },
}));

// Desabilita o cabeçalho X-Powered-By (Evita que o atacante saiba que usamos Node.js/Express)
app.disable('x-powered-by');

// 🛡️ PROTEÇÃO ANTI-FLOOD (OWASP A04:2021 - Insecure Design)
const orcamentoLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hora
    max: 5, // limite de 5 requisições por IP por hora
    message: { success: false, message: "Muitas solicitações vindas deste IP. Tente novamente em 1 hora." },
    standardHeaders: true,
    legacyHeaders: false,
});

// Middleware
app.use(cors({
    origin: process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : '*',
    methods: ['GET', 'POST'],
}));
app.use(express.json({ limit: '10kb' })); // Limita o tamanho do JSON para evitar ataques de DoS
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(express.static(path.join(__dirname, 'public')));

// API Routes
app.post('/api/orcamento', orcamentoLimiter, async (req, res) => {
    let { name, email, project, message, _honeypot } = req.body;

    // 🛡️ PROTEÇÃO HONEYPOT (Bots)
    if (_honeypot) {
        console.warn('🤖 Spam detectado via Honeypot!');
        return res.status(400).json({ success: false, message: "Spam detectado." });
    }

    // 🛡️ SANITIZAÇÃO DE INPUTS (OWASP A03:2021 - Injection / XSS)
    // Remove qualquer tag HTML maliciosa enviada nos campos
    name = dompurify.sanitize(name);
    email = dompurify.sanitize(email);
    project = dompurify.sanitize(project);
    message = dompurify.sanitize(message);

    // Validação básica de campos obrigatórios
    if (!name || !email || !message) {
        return res.status(400).json({ success: false, message: "Campos obrigatórios faltando." });
    }

    console.log('📬 Novo orçamento recebido e sanitizado.');

    // --- CONFIGURAÇÃO DE E-MAIL ---
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
            console.error('❌ Erro ao enviar e-mail:', error.message);
        }
    }

    res.status(200).json({ success: true, message: 'Solicitação enviada com sucesso!' });
});

// SPA Fallback (Admin)
app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

// 🛡️ TRATAMENTO DE ERROS GLOBAL (Evita vazamento de informações do servidor em logs de erro)
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ success: false, message: 'Ocorreu um erro interno no servidor.' });
});

app.listen(PORT, () => {
    console.log(`Servidor MSARTS (OWASP Enhanced) rodando em http://localhost:${PORT}`);
});
