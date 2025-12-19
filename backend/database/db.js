import Database from 'better-sqlite3'
import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Get database path from environment or use default
const DB_PATH = process.env.DB_PATH || path.join(__dirname, '..', 'data', 'eeu-cafe.db')

// Ensure data directory exists
const dataDir = path.dirname(DB_PATH)
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true })
}

// Create database connection
const db = new Database(DB_PATH, {
  verbose: process.env.NODE_ENV === 'development' ? console.log : null
})

// Enable foreign keys and WAL mode for better performance
db.pragma('journal_mode = WAL')
db.pragma('foreign_keys = ON')

// Initialize database schema
function initializeDatabase() {
  // Create menus table
  db.exec(`
    CREATE TABLE IF NOT EXISTS menus (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      date TEXT UNIQUE NOT NULL,
      slots TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `)

  // Create index on date for faster lookups
  db.exec(`
    CREATE INDEX IF NOT EXISTS idx_menus_date ON menus(date)
  `)

  // Create index on updated_at for sorting
  db.exec(`
    CREATE INDEX IF NOT EXISTS idx_menus_updated_at ON menus(updated_at DESC)
  `)

  console.log('✅ Database initialized successfully')
  console.log(`📁 Database location: ${DB_PATH}`)
}

// Initialize on import
initializeDatabase()

// Helper function to prepare statements (for better performance)
const preparedStatements = {
  findMenuByDate: db.prepare('SELECT * FROM menus WHERE date = ?'),
  insertMenu: db.prepare(`
    INSERT INTO menus (date, slots, created_at, updated_at)
    VALUES (?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
  `),
  updateMenu: db.prepare(`
    UPDATE menus 
    SET slots = ?, updated_at = CURRENT_TIMESTAMP
    WHERE date = ?
  `),
  upsertMenu: db.prepare(`
    INSERT INTO menus (date, slots, created_at, updated_at)
    VALUES (?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    ON CONFLICT(date) DO UPDATE SET
      slots = excluded.slots,
      updated_at = CURRENT_TIMESTAMP
  `),
  getAllMenus: db.prepare('SELECT * FROM menus ORDER BY date DESC'),
  deleteMenu: db.prepare('DELETE FROM menus WHERE date = ?')
}

export { db, preparedStatements, DB_PATH }


