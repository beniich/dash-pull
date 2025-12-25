const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret';

// SECURITY MIDDLEWARES
app.use(helmet()); // Sécurise les headers HTTP
app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(morgan('dev'));

// Rate Limiting : Limite les requêtes pour prévenir les attaques DoS et Brute-force
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limite chaque IP à 100 requêtes par fenêtre
    message: { error: 'Trop de requêtes, veuillez réessayer plus tard.' }
});
app.use('/api/', limiter);

// Database Setup
const dbPath = path.resolve(__dirname, 'school_genius.db');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) console.error('Database connection error:', err);
    else console.log('Connected to SQLite database at', dbPath);
});

// Initialize Tables
db.serialize(() => {
    const tables = [
        `CREATE TABLE IF NOT EXISTS users (
            id TEXT PRIMARY KEY,
            school_id TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL,
            role TEXT NOT NULL,
            first_name TEXT,
            last_name TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`,
        `CREATE TABLE IF NOT EXISTS schools (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            email TEXT,
            address TEXT,
            logo TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`,
        `CREATE TABLE IF NOT EXISTS students (
            local_id TEXT PRIMARY KEY,
            school_id TEXT NOT NULL,
            first_name TEXT,
            last_name TEXT,
            class_id TEXT,
            status TEXT,
            data TEXT,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY(school_id) REFERENCES schools(id)
        )`,
        `CREATE TABLE IF NOT EXISTS teachers (
            local_id TEXT PRIMARY KEY,
            school_id TEXT NOT NULL,
            first_name TEXT,
            last_name TEXT,
            email TEXT,
            data TEXT,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY(school_id) REFERENCES schools(id)
        )`,
        `CREATE TABLE IF NOT EXISTS classes (
            local_id TEXT PRIMARY KEY,
            school_id TEXT NOT NULL,
            name TEXT,
            level TEXT,
            data TEXT,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY(school_id) REFERENCES schools(id)
        )`,
        `CREATE TABLE IF NOT EXISTS attendance (
            local_id TEXT PRIMARY KEY,
            school_id TEXT NOT NULL,
            student_id TEXT,
            class_id TEXT,
            date TEXT,
            status TEXT,
            data TEXT,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY(school_id) REFERENCES schools(id)
        )`,
        `CREATE TABLE IF NOT EXISTS grades (
            local_id TEXT PRIMARY KEY,
            school_id TEXT NOT NULL,
            student_id TEXT,
            subject_id TEXT,
            value REAL,
            data TEXT,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY(school_id) REFERENCES schools(id)
        )`,
        `CREATE TABLE IF NOT EXISTS messages (
            local_id TEXT PRIMARY KEY,
            school_id TEXT NOT NULL,
            sender_id TEXT,
            subject TEXT,
            content TEXT,
            data TEXT,
            sent_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY(school_id) REFERENCES schools(id)
        )`,
        `CREATE TABLE IF NOT EXISTS school_profile (
            local_id TEXT PRIMARY KEY,
            school_id TEXT NOT NULL,
            data TEXT,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY(school_id) REFERENCES schools(id)
        )`,
        `CREATE TABLE IF NOT EXISTS sync_logs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            school_id TEXT,
            action TEXT,
            entity TEXT,
            entity_id TEXT,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
        )`
    ];

    tables.forEach(sql => db.run(sql));

    // Seed a default school & user for demo if not exists
    db.run("INSERT OR IGNORE INTO schools (id, name, email) VALUES (?, ?, ?)",
        ['school_001', 'Ecole Primaire Al-Farabi', 'contact@alfarabi.edu.ma']);

    const adminEmail = 'direction@ecole.ma';
    db.get("SELECT id FROM users WHERE email = ?", [adminEmail], async (err, row) => {
        if (!row) {
            const hash = await bcrypt.hash('admin123', 10);
            db.run("INSERT INTO users (id, school_id, email, password_hash, role, first_name, last_name) VALUES (?, ?, ?, ?, ?, ?, ?)",
                ['usr_001', 'school_001', adminEmail, hash, 'direction', 'Mohamed', 'Directeur']);
            console.log('Seed: Admin user created (direction@ecole.ma / admin123)');
        }
    });
});

// AUTHENTICATION MIDDLEWARE
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.status(401).json({ error: 'Accès refusé. Token manquant.' });

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ error: 'Token invalide ou expiré.' });
        req.user = user;
        req.schoolId = user.schoolId; // Isolation forcée par le token
        next();
    });
};

// MULTI-TENANCY MIDDLEWARE (Legacy support if needed, but JWT is better)
const checkSchool = (req, res, next) => {
    const schoolId = req.headers['x-school-id'] || (req.user && req.user.schoolId);
    if (!schoolId) {
        return res.status(401).json({ error: 'X-School-Id header or valid token is required' });
    }
    req.schoolId = schoolId;
    next();
};

// AUTH ROUTES
app.post('/api/auth/register', async (req, res) => {
    const { email, password, firstName, lastName, role, schoolId } = req.body;
    try {
        const hash = await bcrypt.hash(password, 10);
        const id = `usr_${Date.now()}`;
        db.run("INSERT INTO users (id, school_id, email, password_hash, role, first_name, last_name) VALUES (?, ?, ?, ?, ?, ?, ?)",
            [id, schoolId || 'school_001', email, hash, role || 'teacher', firstName, lastName],
            function (err) {
                if (err) return res.status(400).json({ error: 'Email déjà utilisé.' });
                res.status(201).json({ success: true, message: 'Utilisateur créé.' });
            }
        );
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body;
    db.get("SELECT * FROM users WHERE email = ?", [email], async (err, user) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!user) return res.status(401).json({ error: 'Identifiants invalides.' });

        const validPassword = await bcrypt.compare(password, user.password_hash);
        if (!validPassword) return res.status(401).json({ error: 'Identifiants invalides.' });

        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role, schoolId: user.school_id },
            JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
        );

        res.json({
            token,
            user: {
                id: user.id,
                email: user.email,
                role: user.role,
                schoolId: user.school_id,
                firstName: user.first_name,
                lastName: user.last_name
            }
        });
    });
});

// Generic Sync Endpoint (Simulated for all entities)
const syncEntity = (tableName) => (req, res) => {
    const { localId, ...data } = req.body;
    const schoolId = req.schoolId;

    if (req.method === 'POST' || req.method === 'PUT') {
        const sql = `INSERT OR REPLACE INTO ${tableName} (local_id, school_id, data, updated_at) VALUES (?, ?, ?, CURRENT_TIMESTAMP)`;
        db.run(sql, [localId || req.params.id, schoolId, JSON.stringify(data)], function (err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ success: true, id: localId || req.params.id });
        });
    } else if (req.method === 'DELETE') {
        const sql = `DELETE FROM ${tableName} WHERE local_id = ? AND school_id = ?`;
        db.run(sql, [req.params.id, schoolId], function (err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ success: true });
        });
    }
};

// Email Transporter Configuration
const getTransporter = () => {
    if (process.env.SMTP_HOST) {
        return nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: Number(process.env.SMTP_PORT) || 587,
            secure: false,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });
    } else {
        // Fallback: Log email to console if no SMTP config
        return {
            sendMail: (options, callback) => {
                console.log(`\x1b[36m[EMAIL MOCK] To: ${options.to} | Subject: ${options.subject}\nBody: ${options.text}\x1b[0m`);
                callback(null, { response: 'Mock email logged' });
            }
        };
    }
};

// Payment Route - Sends Email
app.post('/api/invoices/pay', (req, res) => {
    const { invoiceId, patientEmail, total } = req.body;

    if (!invoiceId || !patientEmail || !total) {
        return res.status(400).json({ error: 'Paramètres manquants' });
    }

    const transporter = getTransporter();
    const mailOptions = {
        from: process.env.SMTP_FROM || 'no-reply@cloud-hopital.fr',
        to: patientEmail,
        subject: `Paiement de la facture ${invoiceId}`,
        text: `Bonjour,\n\nNous vous confirmons la réception du paiement de ${Number(total).toFixed(2)} € pour la facture ${invoiceId}.\n\nMerci de votre confiance,\nL'équipe Cloud Hôpital`,
    };

    transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
            console.error('Email error:', err);
            return res.status(500).json({ error: 'Failed to send email' });
        }
        res.json({ success: true, message: 'Email sent', info: info.response });
    });
});

// 🔒 ROUTES PROTEGEES
const entities = ['students', 'teachers', 'classes', 'attendance', 'grades', 'messages', 'exams', 'invoices', 'documents', 'school_profile'];

entities.forEach(entity => {
    app.post(`/api/${entity}`, authenticateToken, syncEntity(entity));
    app.put(`/api/${entity}/:id`, authenticateToken, syncEntity(entity));
    app.delete(`/api/${entity}/:id`, authenticateToken, syncEntity(entity));

    app.get(`/api/${entity}`, authenticateToken, (req, res) => {
        const sql = `SELECT * FROM ${entity} WHERE school_id = ?`;
        db.all(sql, [req.schoolId], (err, rows) => {
            if (err) return res.status(500).json({ error: err.message });

            if (entity === 'school_profile' && rows.length > 0) {
                return res.json({ localId: rows[0].local_id, ...JSON.parse(rows[0].data) });
            }

            const data = rows.map(r => ({ localId: r.local_id, ...JSON.parse(r.data) }));
            res.json(data);
        });
    });
});

app.get('/api/school/profile', authenticateToken, (req, res) => {
    const sql = `SELECT * FROM school_profile WHERE school_id = ?`;
    db.get(sql, [req.schoolId], (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!row) return res.status(200).json({});
        res.json({ localId: row.local_id, ...JSON.parse(row.data) });
    });
});

// Health check
app.get('/health', (req, res) => res.json({ status: 'ok', database: 'sqlite', security: 'active' }));

app.listen(PORT, () => {
    console.log(`\x1b[32m%s\x1b[0m`, `🔒 School Genius Secure Backend running on port ${PORT}`);
    console.log(`Isolation model: JWT-based School ID`);
});
