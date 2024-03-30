-- Create Files table
CREATE TABLE IF NOT EXISTS Files (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    filePath TEXT UNIQUE NOT NULL,
    lastEdited TEXT
);

-- Create CodeSnapshots table
CREATE TABLE IF NOT EXISTS CodeSnapshots (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    fileID INTEGER,
    codeContent TEXT NOT NULL,
    timestamp TEXT NOT NULL,
    FOREIGN KEY (fileID) REFERENCES Files(id) ON DELETE CASCADE
);
