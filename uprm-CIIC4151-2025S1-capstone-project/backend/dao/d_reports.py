from dotenv import load_dotenv
from load import load_db

class ReportsDAO:
    def __init__(self):
        load_dotenv()
        self.conn = load_db()

    def getReportsPaginated(self, limit, offset):
        query = """
            SELECT * FROM reports
            ORDER BY created_at DESC
            LIMIT %s OFFSET %s
        """
        with self.conn.cursor() as cur:
            cur.execute(query, (limit, offset))
            return cur.fetchall()

    def getTotalReportCount(self):
        query = "SELECT COUNT(*) FROM reports"
        with self.conn.cursor() as cur:
            cur.execute(query)
            return cur.fetchone()[0]

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

    def insertReport(self, title, description, created_by):
        query = """
            INSERT INTO reports (title, description, created_by)
            VALUES (%s, %s, %s)
            RETURNING id, title, description, status, created_by, validated_by, resolved_by,
                      created_at, resolved_at, location, image_url, rating;
        """
        with self.conn.cursor() as cur:
            cur.execute(query, (title, description, created_by))
            self.conn.commit()
            return cur.fetchone()

    def updateReport(self, report_id, status=None, rating=None):
        query = """
            UPDATE reports
            SET status = COALESCE(%s, status),
                rating = COALESCE(%s, rating)
            WHERE id = %s
            RETURNING id, title, description, status, created_by, validated_by, resolved_by,
                      created_at, resolved_at, location, image_url, rating;
        """
        with self.conn.cursor() as cur:
            cur.execute(query, (status, rating, report_id))
            self.conn.commit()
            return cur.fetchone()

    def deleteReport(self, report_id):
        query = """
            DELETE FROM reports WHERE id = %s
            RETURNING id, title, description, status, created_by, validated_by, resolved_by,
                      created_at, resolved_at, location, image_url, rating;
        """
        with self.conn.cursor() as cur:
            cur.execute(query, (report_id,))
            self.conn.commit()
            return cur.fetchone()

    def close(self):
        self.conn.close()
