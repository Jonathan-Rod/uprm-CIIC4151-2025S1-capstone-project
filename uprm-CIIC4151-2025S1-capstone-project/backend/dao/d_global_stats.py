from load import load_db
class GlobalStatsDAO:
    def __init__(self): self.conn = load_db()

    def avg_resolution_days(self):
        q = """SELECT AVG(EXTRACT(EPOCH FROM (resolved_at - created_at))/86400.0) FROM reports WHERE status='RESOLVED'"""
        with self.conn, self.conn.cursor() as cur: cur.execute(q); return float(cur.fetchone()[0] or 0)

    def top_departments_resolved(self, n):
        q = """SELECT department, COUNT(*) FROM reports WHERE status='RESOLVED' GROUP BY department ORDER BY 2 DESC LIMIT %s"""
        with self.conn, self.conn.cursor() as cur: cur.execute(q, (n,)); return [{"department": r[0], "count": r[1]} for r in cur.fetchall()]

    def top_users_reports(self, n):
        q = """SELECT created_by, COUNT(*) FROM reports GROUP BY created_by ORDER BY 2 DESC LIMIT %s"""
        with self.conn, self.conn.cursor() as cur: cur.execute(q, (n,)); return [{"user_id": r[0], "count": r[1]} for r in cur.fetchall()]

    def top_admins_validated(self, n):
        q = """SELECT validated_by, COUNT(*) FROM reports WHERE validated_by IS NOT NULL GROUP BY validated_by ORDER BY 2 DESC LIMIT %s"""
        with self.conn, self.conn.cursor() as cur: cur.execute(q, (n,)); return [{"admin_id": r[0], "count": r[1]} for r in cur.fetchall()]

    def top_admins_resolved(self, n):
        q = """SELECT resolved_by, COUNT(*) FROM reports WHERE status='RESOLVED' GROUP BY resolved_by ORDER BY 2 DESC LIMIT %s"""
        with self.conn, self.conn.cursor() as cur: cur.execute(q, (n,)); return [{"admin_id": r[0], "count": r[1]} for r in cur.fetchall()]
