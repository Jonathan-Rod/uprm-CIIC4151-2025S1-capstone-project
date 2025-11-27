from dotenv import load_dotenv
from load import load_db


class PinnedReportsDAO:

    def __init__(self):
        load_dotenv()
        self.conn = load_db()

    def get_pinned_report(self, user_id, report_id):
        query = "SELECT * FROM pinned_reports WHERE user_id = %s AND report_id = %s"
        with self.conn.cursor() as cur:
            cur.execute(query, (user_id, report_id))
            return cur.fetchone()

    def pin_report(self, user_id, report_id):
        query = """
            INSERT INTO pinned_reports (user_id, report_id)
            VALUES (%s, %s)
            RETURNING *
        """
        with self.conn.cursor() as cur:
            cur.execute(query, (user_id, report_id))
            self.conn.commit()
            return cur.fetchone()

    def unpin_report(self, user_id, report_id):
        query = """
            DELETE FROM pinned_reports
            WHERE user_id = %s AND report_id = %s
            RETURNING *
        """
        with self.conn.cursor() as cur:
            cur.execute(query, (user_id, report_id))
            self.conn.commit()
            result = cur.fetchone()
            return result is not None

    def get_pinned_reports_by_user(self, user_id, limit, offset):
        query = """
            SELECT pr.*, r.title, r.description, r.status, r.category, r.created_at
            FROM pinned_reports pr
            JOIN reports r ON pr.report_id = r.id
            WHERE pr.user_id = %s
            ORDER BY pr.pinned_at DESC
            LIMIT %s OFFSET %s
        """
        with self.conn.cursor() as cur:
            cur.execute(query, (user_id, limit, offset))
            return cur.fetchall()

    def get_pinned_reports_count_by_user(self, user_id):
        query = "SELECT COUNT(*) FROM pinned_reports WHERE user_id = %s"
        with self.conn.cursor() as cur:
            cur.execute(query, (user_id,))
            return cur.fetchone()[0]

    def get_all_pinned_reports(self, limit, offset):
        query = """
            SELECT pr.*, r.title, r.description, r.status, r.category, r.created_at
            FROM pinned_reports pr
            JOIN reports r ON pr.report_id = r.id
            ORDER BY pr.pinned_at DESC
            LIMIT %s OFFSET %s
        """
        with self.conn.cursor() as cur:
            cur.execute(query, (limit, offset))
            return cur.fetchall()

    def get_total_pinned_reports_count(self):
        query = "SELECT COUNT(*) FROM pinned_reports"
        with self.conn.cursor() as cur:
            cur.execute(query)
            return cur.fetchone()[0]

    def get_user_pinned_reports(self, user_id, limit, offset):
        """Alias for get_pinned_reports_by_user for consistency"""
        return self.get_pinned_reports_by_user(user_id, limit, offset)

    def is_report_pinned_by_user(self, user_id, report_id):
        """Check if a specific report is pinned by a user"""
        query = "SELECT 1 FROM pinned_reports WHERE user_id = %s AND report_id = %s"
        with self.conn.cursor() as cur:
            cur.execute(query, (user_id, report_id))
            return cur.fetchone() is not None

    def get_pinned_report_details(self, user_id, report_id):
        """Get detailed information about a specific pinned report"""
        query = """
            SELECT pr.*, r.title, r.description, r.status, r.category,
                   r.created_at, r.location, r.image_url, r.rating
            FROM pinned_reports pr
            JOIN reports r ON pr.report_id = r.id
            WHERE pr.user_id = %s AND pr.report_id = %s
        """
        with self.conn.cursor() as cur:
            cur.execute(query, (user_id, report_id))
            return cur.fetchone()

    def close(self):
        if self.conn:
            self.conn.close()
