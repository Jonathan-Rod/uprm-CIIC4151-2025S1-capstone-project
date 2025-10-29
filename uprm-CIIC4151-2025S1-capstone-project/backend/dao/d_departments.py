from dotenv import load_dotenv
from load import load_db


class DepartmentsDAO:

    def __init__(self):
        load_dotenv()
        self.conn = load_db()

    def get_all_departments(self):
        query = "SELECT * FROM department_admins ORDER BY department"
        with self.conn.cursor() as cur:
            cur.execute(query)
            return cur.fetchall()

    def get_department_by_name(self, department_name):
        query = "SELECT * FROM department_admins WHERE department = %s"
        with self.conn.cursor() as cur:
            cur.execute(query, (department_name,))
            return cur.fetchone()

    def update_department(self, department_name, admin_id):
        query = """
            UPDATE department_admins
            SET admin_id = %s
            WHERE department = %s
            RETURNING *
        """
        with self.conn.cursor() as cur:
            cur.execute(query, (admin_id, department_name))
            self.conn.commit()
            return cur.fetchone()

    def delete_department(self, department_name):
        query = "DELETE FROM department_admins WHERE department = %s RETURNING *"
        with self.conn.cursor() as cur:
            cur.execute(query, (department_name,))
            self.conn.commit()
            result = cur.fetchone()
            return result is not None

    def create_department(self, department_name, admin_id=None):
        query = """
            INSERT INTO department_admins (department, admin_id)
            VALUES (%s, %s)
            RETURNING *
        """
        with self.conn.cursor() as cur:
            cur.execute(query, (department_name, admin_id))
            self.conn.commit()
            return cur.fetchone()

    def get_department_with_admin_info(self, department_name):
        """Get department information with administrator details"""
        query = """
            SELECT da.department, da.admin_id, u.email as admin_email, u.id as user_id
            FROM department_admins da
            LEFT JOIN administrators a ON da.admin_id = a.id
            LEFT JOIN users u ON a.id = u.id
            WHERE da.department = %s
        """
        with self.conn.cursor() as cur:
            cur.execute(query, (department_name,))
            return cur.fetchone()

    def get_all_departments_with_admin_info(self):
        """Get all departments with administrator details"""
        query = """
            SELECT da.department, da.admin_id, u.email as admin_email, u.id as user_id
            FROM department_admins da
            LEFT JOIN administrators a ON da.admin_id = a.id
            LEFT JOIN users u ON a.id = u.id
            ORDER BY da.department
        """
        with self.conn.cursor() as cur:
            cur.execute(query)
            return cur.fetchall()

    def get_departments_by_admin(self, admin_id):
        """Get all departments assigned to a specific administrator"""
        query = """
            SELECT da.department, da.admin_id, u.email as admin_email
            FROM department_admins da
            LEFT JOIN administrators a ON da.admin_id = a.id
            LEFT JOIN users u ON a.id = u.id
            WHERE da.admin_id = %s
            ORDER BY da.department
        """
        with self.conn.cursor() as cur:
            cur.execute(query, (admin_id,))
            return cur.fetchall()

    def get_available_departments(self):
        """Get departments that don't have an admin assigned"""
        query = """
            SELECT department, admin_id
            FROM department_admins
            WHERE admin_id IS NULL
            ORDER BY department
        """
        with self.conn.cursor() as cur:
            cur.execute(query)
            return cur.fetchall()

    def get_department_stats(self, department_name):
        """Get statistics for a specific department"""
        query = """
            SELECT
                da.department,
                COUNT(r.id) as total_reports,
                COUNT(CASE WHEN r.status = 'open' THEN 1 END) as open_reports,
                COUNT(CASE WHEN r.status = 'in_progress' THEN 1 END) as in_progress_reports,
                COUNT(CASE WHEN r.status = 'resolved' THEN 1 END) as resolved_reports,
                COUNT(CASE WHEN r.status = 'denied' THEN 1 END) as denied_reports,
                COALESCE(AVG(r.rating), 0) as avg_rating,
                COUNT(DISTINCT r.created_by) as unique_reporters
            FROM department_admins da
            LEFT JOIN administrators a ON da.admin_id = a.id
            LEFT JOIN reports r ON (r.validated_by = a.id OR r.resolved_by = a.id)
            WHERE da.department = %s
            GROUP BY da.department
        """
        with self.conn.cursor() as cur:
            cur.execute(query, (department_name,))
            return cur.fetchone()

    def get_all_departments_stats(self):
        """Get statistics for all departments"""
        query = """
            SELECT
                da.department,
                da.admin_id,
                u.email as admin_email,
                COUNT(r.id) as total_reports,
                COUNT(CASE WHEN r.status = 'open' THEN 1 END) as open_reports,
                COUNT(CASE WHEN r.status = 'in_progress' THEN 1 END) as in_progress_reports,
                COUNT(CASE WHEN r.status = 'resolved' THEN 1 END) as resolved_reports,
                COALESCE(AVG(r.rating), 0) as avg_rating
            FROM department_admins da
            LEFT JOIN administrators a ON da.admin_id = a.id
            LEFT JOIN users u ON a.id = u.id
            LEFT JOIN reports r ON (r.validated_by = a.id OR r.resolved_by = a.id)
            GROUP BY da.department, da.admin_id, u.email
            ORDER BY da.department
        """
        with self.conn.cursor() as cur:
            cur.execute(query)
            return cur.fetchall()

    def validate_department_name(self, department_name):
        """Validate if department name is in the allowed list"""
        valid_departments = ["DTOP", "LUMA", "AAA", "DDS"]
        return department_name in valid_departments

    def is_admin_assigned_to_department(self, admin_id, department_name):
        """Check if an admin is assigned to a specific department"""
        query = """
            SELECT 1 FROM department_admins
            WHERE department = %s AND admin_id = %s
        """
        with self.conn.cursor() as cur:
            cur.execute(query, (department_name, admin_id))
            return cur.fetchone() is not None

    def close(self):
        if self.conn:
            self.conn.close()
