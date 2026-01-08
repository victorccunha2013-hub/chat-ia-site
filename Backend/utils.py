import sqlite3
from werkzeug.security import generate_password_hash, check_password_hash

DB = "db.sqlite"

def connect():
    return sqlite3.connect(DB)

def init_db():
    con = connect()
    cur = con.cursor()
    cur.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT UNIQUE,
            password TEXT
        )
    """)
    con.commit()
    con.close()

def create_user(email, password):
    con = connect()
    cur = con.cursor()
    cur.execute(
        "INSERT INTO users (email, password) VALUES (?, ?)",
        (email, generate_password_hash(password))
    )
    con.commit()
    con.close()

def check_user(email, password):
    con = connect()
    cur = con.cursor()
    cur.execute("SELECT password FROM users WHERE email=?", (email,))
    row = cur.fetchone()
    con.close()
    if not row:
        return False
    return check_password_hash(row[0], password)
