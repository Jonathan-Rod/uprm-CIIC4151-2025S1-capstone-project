from dotenv import load_dotenv
from load import load_db


class AdministratorsDAO:

    def __init__(self):
        load_dotenv()
        self.conn = load_db()

    def get_administrators_paginated(self, limit, offset):
        query = """
            SELECT a.*, u.email, u.suspended, u.created_at as user_created_at
            FROM administrators a
            JOIN users u ON a.id = u.id
            ORDER BY a.id
            LIMIT %s OFFSET %s
        """
        with self.conn.cursor() as cur:
            cur.execute(query, (limit, offset))
            return cur.fetchall()

    def get_total_administrator_count(self):
        query = "SELECT COUNT(*) FROM administrators"
        with self.conn.cursor() as cur:
            cur.execute(query)
            return cur.fetchone()[0]

    def get_all_administrators(self):
        query = """
            SELECT a.*, u.email, u.suspended, u.created_at as user_created_at
            FROM administrators a
            JOIN users u ON a.id = u.id
            ORDER BY a.id
        """
        with self.conn.cursor() as cur:
            cur.execute(query)
            return cur.fetchall()

    def get_administrator_by_id(self, administrator_id):
        query = """
            SELECT a.*, u.email, u.suspended, u.created_at as user_created_at
            FROM administrators a
            JOIN users u ON a.id = u.id
            WHERE a.id = %s
        """
        with self.conn.cursor() as cur:
            cur.execute(query, (administrator_id,))
            return cur.fetchone()

    def get_administrator_by_user_id(self, user_id):
        query = """
            SELECT a.*, u.email, u.suspended, u.created_at as user_created_at
            FROM administrators a
            JOIN users u ON a.id = u.id
            WHERE a.id = %s
        """
        with self.conn.cursor() as cur:
            cur.execute(query, (user_id,))
            return cur.fetchone()

    def create_administrator(self, user_id, department):
        query = """
            INSERT INTO administrators (id, department)
            VALUES (%s, %s)
            RETURNING *
        """
        with self.conn.cursor() as cur:
            cur.execute(query, (user_id, department))
            self.conn.commit()
            return cur.fetchone()

    def update_administrator(self, administrator_id, department=None):
        # Build dynamic query based on provided fields
        fields = []
        params = []

        if department is not None:
            fields.append("department = %s")
            params.append(department)

        if not fields:
            return None

        query = f"""
            UPDATE administrators
            SET {', '.join(fields)}
            WHERE id = %s
            RETURNING *
        """
        params.append(administrator_id)

        with self.conn.cursor() as cur:
            cur.execute(query, params)
            self.conn.commit()
            return cur.fetchone()

    def delete_administrator(self, administrator_id):
        query = "DELETE FROM administrators WHERE id = %s RETURNING *"
        with self.conn.cursor() as cur:
            cur.execute(query, (administrator_id,))
            self.conn.commit()
            result = cur.fetchone()
            return result is not None

    def get_administrators_by_department(self, department):
        query = """
            SELECT a.*, u.email, u.suspended, u.created_at as user_created_at
            FROM administrators a
            JOIN users u ON a.id = u.id
            WHERE a.department = %s
            ORDER BY a.id
        """
        with self.conn.cursor() as cur:
            cur.execute(query, (department,))
            return cur.fetchall()

    def get_administrator_with_department_details(self, administrator_id):
        """Get administrator info with department assignment details"""
        query = """
            SELECT
                a.*,
                u.email,
                u.suspended,
                u.created_at as user_created_at,
                da.department as assigned_department
            FROM administrators a
            JOIN users u ON a.id = u.id
            LEFT JOIN department_admins da ON a.id = da.admin_id
            WHERE a.id = %s
        """
        with self.conn.cursor() as cur:
            cur.execute(query, (administrator_id,))
            return cur.fetchone()

    def get_available_administrators(self):
        """Get administrators not currently assigned to any department"""
        query = """
            SELECT a.*, u.email, u.suspended, u.created_at as user_created_at
            FROM administrators a
            JOIN users u ON a.id = u.id
            WHERE a.id NOT IN (SELECT admin_id FROM department_admins WHERE admin_id IS NOT NULL)
            ORDER BY a.id
        """
        with self.conn.cursor() as cur:
            cur.execute(query)
            return cur.fetchall()

    def get_admin_stats(self, admin_id):
        query = """
            SELECT
                a.id,
                a.department,
                COUNT(r.id) as total_assigned_reports,
                COUNT(CASE WHEN r.status = 'in_progress' THEN 1 END) as in_progress_reports,
                COUNT(CASE WHEN r.status = 'resolved' THEN 1 END) as resolved_reports,
                COUNT(CASE WHEN r.status = 'open' THEN 1 END) as open_reports,
                COUNT(CASE WHEN r.status = 'denied' THEN 1 END) as denied_reports,
                COALESCE(AVG(r.rating), 0) as avg_rating,
                COUNT(CASE WHEN r.validated_by = a.id THEN 1 END) as validated_reports,
                COUNT(CASE WHEN r.resolved_by = a.id THEN 1 END) as resolved_personally,
                COUNT(DISTINCT r.category) as categories_handled
            FROM administrators a
            LEFT JOIN reports r ON (r.validated_by = a.id OR r.resolved_by = a.id)
            WHERE a.id = %s
            GROUP BY a.id, a.department
        """
        with self.conn.cursor() as cur:
            cur.execute(query, (admin_id,))
            result = cur.fetchone()

            if not result:
                return None

            return {
                "admin_id": result[0],
                "department": result[1],
                "total_assigned_reports": result[2],
                "in_progress_reports": result[3],
                "resolved_reports": result[4],
                "open_reports": result[5],
                "denied_reports": result[6],
                "avg_rating": float(result[7]) if result[7] else 0,
                "validated_reports": result[8],
                "resolved_personally": result[9],
                "categories_handled": result[10],
            }

    def get_all_admin_stats(self):
        """Get statistics for all administrators"""
        query = """
            SELECT
                a.id,
                a.department,
                u.email,
                COUNT(r.id) as total_assigned_reports,
                COUNT(CASE WHEN r.status = 'resolved' THEN 1 END) as resolved_reports,
                COALESCE(AVG(r.rating), 0) as avg_rating,
                COUNT(CASE WHEN r.resolved_by = a.id THEN 1 END) as resolved_personally
            FROM administrators a
            JOIN users u ON a.id = u.id
            LEFT JOIN reports r ON (r.validated_by = a.id OR r.resolved_by = a.id)
            GROUP BY a.id, a.department, u.email
            ORDER BY total_assigned_reports DESC
        """
        with self.conn.cursor() as cur:
            cur.execute(query)
            return cur.fetchall()

    def validate_department(self, department):
        """Validate if department is in the allowed list"""
        valid_departments = ["DTOP", "LUMA", "AAA", "DDS"]
        return department in valid_departments

    def is_user_administrator(self, user_id):
        """Check if a user is an administrator"""
        query = "SELECT 1 FROM administrators WHERE id = %s"
        with self.conn.cursor() as cur:
            cur.execute(query, (user_id,))
            return cur.fetchone() is not None

    def get_administrator_performance_report(self, days=30):
        """Get performance report for administrators over specified days"""
        query = """
            SELECT
                a.id,
                a.department,
                u.email,
                COUNT(r.id) as reports_handled,
                COUNT(CASE WHEN r.status = 'resolved' THEN 1 END) as reports_resolved,
                COUNT(CASE WHEN r.resolved_by = a.id THEN 1 END) as personally_resolved,
                COALESCE(AVG(r.rating), 0) as avg_rating,
                COUNT(DISTINCT r.category) as categories_handled
            FROM administrators a
            JOIN users u ON a.id = u.id
            LEFT JOIN reports r ON (r.validated_by = a.id OR r.resolved_by = a.id)
            WHERE r.created_at >= CURRENT_DATE - INTERVAL '%s days'
            GROUP BY a.id, a.department, u.email
            ORDER BY reports_handled DESC
        """
        with self.conn.cursor() as cur:
            cur.execute(query, (days,))
            return cur.fetchall()

    def close(self):
        if self.conn:
            self.conn.close()
