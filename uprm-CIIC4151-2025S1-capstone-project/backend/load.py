import psycopg2
import bcrypt
from dotenv import load_dotenv
import os

# Load environment variables from .env file
load_dotenv()

def load_db():
    return psycopg2.connect(
        dbname=os.getenv("DATABASE"),
        user=os.getenv("USER"),
        password=os.getenv("PASSWORD"),
        host=os.getenv("HOST"),
        port=os.getenv("PORT"),
        connect_timeout=5
    )

def close_db(conn, cursor):
    conn.commit()
    cursor.close()
    conn.close()

def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()
