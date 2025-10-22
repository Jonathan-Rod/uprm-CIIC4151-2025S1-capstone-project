from dotenv import load_dotenv
from load import load_db


class UsersDAO:

    def __init__(self):
        load_dotenv()
        self.conn = load_db()

    def getAllUsers(self):
        query = "SELECT * FROM users"
        with self.conn.cursor() as cur:
            cur.execute(query)
            return cur.fetchall()

    def getUserByEmail(self, email):
        query = "SELECT * FROM users WHERE email = %s"
        with self.conn.cursor() as cur:
            cur.execute(query, (email,))
            return cur.fetchone()

    def getUserById(self, user_id):
        query = "SELECT * FROM users WHERE id = %s"
        with self.conn.cursor() as cur:
            cur.execute(query, (user_id,))
            return cur.fetchone()

    def insertUser(self, email, password, admin):
        # Reset sequence (for safety on manual inserts)
        query = """
            SELECT setval('users_id_seq', (SELECT MAX(id) FROM users), true);
            INSERT INTO users (email, password, admin)
            VALUES (%s, %s, %s)
            RETURNING id, email, admin;
        """
        with self.conn.cursor() as cur:
            cur.execute(query, (email, password, admin))
            self.conn.commit()
            return cur.fetchone()

    def updateUser(self, user_id, email, password, admin):
        query = """
            UPDATE users
            SET email = %s, password = %s, admin = %s
            WHERE id = %s
            RETURNING id, email, admin;
        """
        values = (email, password, admin, user_id)

        with self.conn.cursor() as cur:
            cur.execute(query, values)
            self.conn.commit()
            return cur.fetchone()

    def deleteUser(self, user_id):
        query = """
            DELETE FROM users WHERE id = %s
            RETURNING id, email, admin;
        """
        with self.conn.cursor() as cur:
            cur.execute(query, (user_id,))
            self.conn.commit()
            return cur.fetchone()

    def close(self):
        self.conn.close()
