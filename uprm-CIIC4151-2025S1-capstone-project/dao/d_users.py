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
        
    def getUserByUsername(self, username):
        query = "SELECT * FROM users WHERE username = %s"
        with self.conn.cursor() as cur:
            cur.execute(query, (username,))
            return cur.fetchone()


    def getUserById(self, user_id):
        query = "SELECT * FROM users WHERE id = %s"
        with self.conn.cursor() as cur:
            cur.execute(query, (user_id,))
            return cur.fetchone()

    def insertUser(self, username, password, position, email):
        query = """
            SELECT setval('users_id_seq', (SELECT MAX(id) FROM users), true);
            INSERT INTO users (username, password, position, email)
            VALUES (%s, %s, %s, %s)
            RETURNING id, username, position, email;
        """

        with self.conn.cursor() as cur:
            cur.execute(query, (username, password, position, email))
            self.conn.commit()
            return cur.fetchone()

    def updateUser(self, user_id, username, password, position, email):
        query = """
            UPDATE users
            SET username = %s, password = %s, position = %s, email= %s 
            WHERE id = %s
            RETURNING id, username, position, email;
        """
        values = (username, password, position, email, user_id)

        with self.conn.cursor() as cur:
            cur.execute(query, values)
            self.conn.commit()
            return cur.fetchone()

    def deleteUser(self, user_id):
        query = """
            DELETE FROM users WHERE id = %s
            RETURNING id, username, position, email;
            """

        with self.conn.cursor() as cur:
            cur.execute(query, (user_id,))
            self.conn.commit()
            return cur.fetchone()

    def close(self):
        self.conn.close()
