from dotenv import load_dotenv
from load import load_db


class AdministratorsDAO:

    def __init__(self):
        load_dotenv()
        self.conn = load_db()

    def getAllAdministrators(self):
        query = "SELECT * FROM administrators"
        with self.conn.cursor() as cur:
            cur.execute(query)
            return cur.fetchall()

    def getAdministratorById(self, administrator_id):
        query = "SELECT * FROM administrators WHERE id = %s"
        with self.conn.cursor() as cur:
            cur.execute(query, (administrator_id,))
            return cur.fetchone()

    def insertAdministrator(self, user_id, department):
        query = """
            SELECT setval('administrators_id_seq', (SELECT MAX(id) FROM administrators), true);
            INSERT INTO administrators (id, department)
            VALUES (%s, %s)
            RETURNING id, department;
        """
        with self.conn.cursor() as cur:
            cur.execute(query, (user_id, department))
            self.conn.commit()
            return cur.fetchone()

    def updateAdministrator(self, administrator_id, department):
        query = """
            UPDATE administrators
            SET department = %s 
            WHERE id = %s
            RETURNING id, department;
        """
        values = (department, administrator_id)

        with self.conn.cursor() as cur:
            cur.execute(query, values)
            self.conn.commit()
            return cur.fetchone()

    def deleteAdministrator(self, administrator_id):
        query = """
            DELETE FROM administrators WHERE id = %s
            RETURNING id, department;
        """
        with self.conn.cursor() as cur:
            cur.execute(query, (administrator_id,))
            self.conn.commit()
            return cur.fetchone()

    def getAdministratorByUserId(self, user_id):
        query = "SELECT * FROM administrators WHERE id = %s"
        with self.conn.cursor() as cur:
            cur.execute(query, (user_id,))
            return cur.fetchone()

    def close(self):
        self.conn.close()
