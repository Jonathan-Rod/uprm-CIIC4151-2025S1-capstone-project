from dotenv import load_dotenv
from load import load_db


class CiviliansDAO:

    def __init__(self):
        load_dotenv()
        self.conn = load_db()

    def getAllCivilians(self):
        query = "SELECT * FROM civilians"
        with self.conn.cursor() as cur:
            cur.execute(query)
            return cur.fetchall()

    def getCivilianById(self, civilian_id):
        query = "SELECT * FROM civilians WHERE id = %s"
        with self.conn.cursor() as cur:
            cur.execute(query, (civilian_id,))
            return cur.fetchone()

    def insertCivilian(self, suspended):
        query = """
            SELECT setval('civilians_id_seq', (SELECT MAX(id) FROM civilians), true);
            INSERT INTO civilians (suspended)
            VALUES (%s)
            RETURNING id, suspended;
        """

        with self.conn.cursor() as cur:
            cur.execute(query, (suspended))
            self.conn.commit()
            return cur.fetchone()

    def updateCivilian(self, civilian_id, suspended):
        query = """
            UPDATE civilians
            SET suspended = %s 
            WHERE id = %s
            RETURNING id, suspended;
        """
        values = (suspended, civilian_id)

        with self.conn.cursor() as cur:
            cur.execute(query, values)
            self.conn.commit()
            return cur.fetchone()

    def deleteCivilian(self, civilian_id):
        query = """
            DELETE FROM civilians WHERE id = %s
            RETURNING id, suspended;
            """

        with self.conn.cursor() as cur:
            cur.execute(query, (civilian_id,))
            self.conn.commit()
            return cur.fetchone()

    def close(self):
        self.conn.close()
