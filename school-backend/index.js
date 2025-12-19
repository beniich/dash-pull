const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: '50mb' })); // Allow large payloads for offline sync
app.use(morgan('dev'));

// Database Setup
const dbPath = path.resolve(__dirname, 'school_genius.db');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) console.error('Database connection error:', err);
    else console.log('Connected to SQLite database at', dbPath);
});

// Initialize Tables
db.serialize(() => {
    const tables = [
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

    // Seed a default school for demo
    db.run("INSERT OR IGNORE INTO schools (id, name, email) VALUES (?, ?, ?)",
        ['school_001', 'Ecole Primaire Al-Farabi', 'contact@alfarabi.edu.ma']);
});

// Middleware for Multi-Tenancy
const checkSchool = (req, res, next) => {
    const schoolId = req.headers['x-school-id'];
    if (!schoolId) {
        return res.status(401).json({ error: 'X-School-Id header is required for data isolation' });
    }
    req.schoolId = schoolId;
    next();
};

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

// Routes
const entities = ['students', 'teachers', 'classes', 'attendance', 'grades', 'messages', 'exams', 'invoices', 'documents', 'school_profile'];

entities.forEach(entity => {
    app.post(`/api/${entity}`, checkSchool, syncEntity(entity));
    app.put(`/api/${entity}/:id`, checkSchool, syncEntity(entity));
    app.delete(`/api/${entity}/:id`, checkSchool, syncEntity(entity));

    // GET endpoint for initial sync / pull
    app.get(`/api/${entity}`, checkSchool, (req, res) => {
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

// Specific route for school profile
app.get('/api/school/profile', checkSchool, (req, res) => {
    const sql = `SELECT * FROM school_profile WHERE school_id = ?`;
    db.get(sql, [req.schoolId], (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!row) return res.status(200).json({}); // Return empty if not set
        res.json({ localId: row.local_id, ...JSON.parse(row.data) });
    });
});

// Health check
app.get('/health', (req, res) => res.json({ status: 'ok', database: 'sqlite' }));

app.listen(PORT, () => {
    console.log(`\x1b[32m%s\x1b[0m`, `School Genius Backend running on port ${PORT}`);
    console.log(`Isolation model: Per-Header School ID`);
});
