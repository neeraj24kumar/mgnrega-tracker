const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const logger = require('../utils/logger');

let db;

const initializeDatabase = () => {
  return new Promise((resolve, reject) => {
    const dbPath = path.join(__dirname, '../../data/mgnrega.db');
    
    db = new sqlite3.Database(dbPath, (err) => {
      if (err) {
        logger.error('Error opening database:', err);
        reject(err);
        return;
      }
      
      logger.info('Connected to SQLite database');
      createTables()
        .then(() => resolve())
        .catch(reject);
    });
  });
};

const createTables = () => {
  return new Promise((resolve, reject) => {
    const tables = [
      // States table
      `CREATE TABLE IF NOT EXISTS states (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        state_code TEXT UNIQUE NOT NULL,
        state_name TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`,
      
      // Districts table
      `CREATE TABLE IF NOT EXISTS districts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        district_code TEXT UNIQUE NOT NULL,
        district_name TEXT NOT NULL,
        state_code TEXT NOT NULL,
        latitude REAL,
        longitude REAL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (state_code) REFERENCES states (state_code)
      )`,
      
      // MGNREGA performance data table
      `CREATE TABLE IF NOT EXISTS mgnrega_data (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        district_code TEXT NOT NULL,
        financial_year TEXT NOT NULL,
        month TEXT NOT NULL,
        total_households INTEGER DEFAULT 0,
        households_demanding_work INTEGER DEFAULT 0,
        households_provided_work INTEGER DEFAULT 0,
        total_person_days INTEGER DEFAULT 0,
        sc_person_days INTEGER DEFAULT 0,
        st_person_days INTEGER DEFAULT 0,
        women_person_days INTEGER DEFAULT 0,
        total_works INTEGER DEFAULT 0,
        completed_works INTEGER DEFAULT 0,
        ongoing_works INTEGER DEFAULT 0,
        total_expenditure REAL DEFAULT 0,
        wage_expenditure REAL DEFAULT 0,
        material_expenditure REAL DEFAULT 0,
        admin_expenditure REAL DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (district_code) REFERENCES districts (district_code),
        UNIQUE(district_code, financial_year, month)
      )`,
      
      // API sync status table
      `CREATE TABLE IF NOT EXISTS sync_status (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        last_sync DATETIME,
        sync_status TEXT DEFAULT 'pending',
        records_updated INTEGER DEFAULT 0,
        error_message TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`
    ];
    
    let completed = 0;
    const total = tables.length;
    
    tables.forEach((sql, index) => {
      db.run(sql, (err) => {
        if (err) {
          logger.error(`Error creating table ${index + 1}:`, err);
          reject(err);
          return;
        }
        
        completed++;
        if (completed === total) {
          logger.info('All database tables created successfully');
          resolve();
        }
      });
    });
  });
};

const getDatabase = () => {
  if (!db) {
    throw new Error('Database not initialized');
  }
  return db;
};

const closeDatabase = () => {
  return new Promise((resolve) => {
    if (db) {
      db.close((err) => {
        if (err) {
          logger.error('Error closing database:', err);
        } else {
          logger.info('Database connection closed');
        }
        resolve();
      });
    } else {
      resolve();
    }
  });
};

// Database query helpers
const runQuery = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function(err) {
      if (err) {
        reject(err);
      } else {
        resolve({ id: this.lastID, changes: this.changes });
      }
    });
  });
};

const getQuery = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(row);
      }
    });
  });
};

const allQuery = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
};

module.exports = {
  initializeDatabase,
  getDatabase,
  closeDatabase,
  runQuery,
  getQuery,
  allQuery
};

