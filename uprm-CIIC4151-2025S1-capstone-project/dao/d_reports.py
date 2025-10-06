# TODO

from dotenv import load_dotenv
from load import load_db


class ReportsDAO:

    def __init__(self):
        load_dotenv()
        self.conn = load_db()

    def getAllReports(self):
        query = "SELECT * FROM reports"
        with self.conn.cursor() as cur:
            cur.execute(query)
            return cur.fetchall()

    def getReportById(self, report_id):
        query = "SELECT * FROM reports WHERE id = %s"
        with self.conn.cursor() as cur:
            cur.execute(query, (report_id,))
            return cur.fetchone()

    def insertReport(self, title, description, status, created_by, validated_by, resolved_by, created_at, resolved_at, location, image_url, rating):
        query = """
            SELECT setval('reports_id_seq', (SELECT MAX(id) FROM reports), true);
            INSERT INTO reports (title, description, status, created_by, validated_by, resolved_by, created_at, resolved_at, location, image_url, rating)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            RETURNING id, title, description, status, created_by, validated_by, resolved_by, created_at, resolved_at, location, image_url, rating;
        """

        with self.conn.cursor() as cur:
            cur.execute(query, (title, description, status, created_by, validated_by, resolved_by, created_at, resolved_at, location, image_url, rating))
            self.conn.commit()
            return cur.fetchone()

    def updateReport(self, report_id, status, rating):
        query = """
            UPDATE reports
            SET status = %s, rating = %s 
            WHERE id = %s
            RETURNING id, title, description, status, created_by, validated_by, resolved_by, created_at, resolved_at, location, image_url, rating;
        """
        values = (status, rating, report_id)

        with self.conn.cursor() as cur:
            cur.execute(query, values)
            self.conn.commit()
            return cur.fetchone()

    def deleteReport(self, report_id):
        query = """
            DELETE FROM reports WHERE id = %s
            RETURNING id, title, description, status, created_by, validated_by, resolved_by, created_at, resolved_at, location, image_url, rating;
            """

        with self.conn.cursor() as cur:
            cur.execute(query, (report_id,))
            self.conn.commit()
            return cur.fetchone()

    def close(self):
        self.conn.close()
