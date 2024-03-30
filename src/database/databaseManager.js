const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const vscode = require('vscode');

const dbPath = path.join(__dirname, 'codeHistory.db');

let db = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
    if (err) {
        console.error('Error opening database', err.message);
        return;
    }

    db.run(`CREATE TABLE IF NOT EXISTS Files (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        filePath TEXT UNIQUE,
        lastEdited TEXT
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS CodeSnapshots (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        fileID INTEGER,
        codeContent TEXT,
        timestamp TEXT,
        FOREIGN KEY (fileID) REFERENCES Files (id)
    )`);
});

/**
 * Saves a code snapshot to the database.
 * 
 * @param {string} filePath
 * @param {string} codeContent
 * @param {string} timestamp
 */
function saveCodeSnapshot(filePath, codeContent, timestamp) {
    if (!db) {
        vscode.window.showErrorMessage('Database connection is not established.');
        return;
    }

    // Insert or update the file entry.
    const insertFile = db.prepare('INSERT OR REPLACE INTO Files (filePath, lastEdited) VALUES (?, ?)');
    insertFile.run(filePath, timestamp);
    insertFile.finalize();

    // Get the file ID for the filePath.
    db.get('SELECT id FROM Files WHERE filePath = ?', [filePath], (err, file) => {
        if (err) {
            console.error('Error finding file in database:', err.message);
            return;
        }

        // Insert the code snapshot using the file ID.
        const insertSnapshot = db.prepare('INSERT INTO CodeSnapshots (fileID, codeContent, timestamp) VALUES (?, ?, ?)');
        insertSnapshot.run(file.id, codeContent, timestamp);
        insertSnapshot.finalize();
    });
}

/**
 * Fetches the code history for a specific file.
 * 
 * @param {string} filePath
 * @returns {Promise}
 */
function fetchCodeHistory(filePath) {
    return new Promise((resolve, reject) => {
        if (!db) {
            reject('Database connection is not established.');
            return;
        }

        db.get('SELECT id FROM Files WHERE filePath = ?', [filePath], (err, file) => {
            if (err || !file) {
                reject('Error finding file in database:', err?.message || 'File not found.');
                return;
            }

            db.all('SELECT codeContent, timestamp FROM CodeSnapshots WHERE fileID = ? ORDER BY timestamp DESC', [file.id], (err, snapshots) => {
                if (err) {
                    reject('Error fetching code snapshots:', err.message);
                    return;
                }

                resolve(snapshots);
            });
        });
    });
}

module.exports = {
    saveCodeSnapshot,
    fetchCodeHistory
};
