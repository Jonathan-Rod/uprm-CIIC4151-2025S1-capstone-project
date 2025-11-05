from dotenv import load_dotenv
from load import load_db


class UsersDAO:

    def __init__(self):
        load_dotenv()
        self.conn = load_db()

    def get_users_paginated(self, limit, offset):
        query = """
            SELECT id, email, password, admin, suspended, pinned, created_at
            FROM users
            ORDER BY created_at DESC
            LIMIT %s OFFSET %s
        """
        with self.conn.cursor() as cur:
            cur.execute(query, (limit, offset))
            return cur.fetchall()

    def get_total_user_count(self):
        query = "SELECT COUNT(*) FROM users"
        with self.conn.cursor() as cur:
            cur.execute(query)
            return cur.fetchone()[0]

    def get_all_users(self):
        query = """
            SELECT id, email, password, admin, suspended, pinned, created_at
            FROM users
            ORDER BY created_at DESC
        """
        with self.conn.cursor() as cur:
            cur.execute(query)
            return cur.fetchall()

    def get_user_by_email(self, email):
        query = """
            SELECT id, email, password, admin, suspended, pinned, created_at
            FROM users
            WHERE email = %s
        """
        with self.conn.cursor() as cur:
            cur.execute(query, (email,))
            return cur.fetchone()

    def get_user_by_id(self, user_id):
        query = """
            SELECT id, email, password, admin, suspended, pinned, created_at
            FROM users
            WHERE id = %s
        """
        with self.conn.cursor() as cur:
            cur.execute(query, (user_id,))
            return cur.fetchone()

    def create_user(self, email, password, admin=False):
        query = """
            INSERT INTO users (email, password, admin)
            VALUES (%s, %s, %s)
            RETURNING id, email, password, admin, suspended, pinned, created_at
        """
        with self.conn.cursor() as cur:
            cur.execute(query, (email, password, admin))
            self.conn.commit()
            return cur.fetchone()

    def update_user(
        self,
        user_id,
        email=None,
        password=None,
        admin=None,
        suspended=None,
        pinned=None,
    ):
        # Build dynamic query based on provided fields
        fields = []
        params = []

        if email is not None:
            fields.append("email = %s")
            params.append(email)
        if password is not None:
            fields.append("password = %s")
            params.append(password)
        if admin is not None:
            fields.append("admin = %s")
            params.append(admin)
        if suspended is not None:
            fields.append("suspended = %s")
            params.append(suspended)
        if pinned is not None:
            fields.append("pinned = %s")
            params.append(pinned)

        if not fields:
            return None

        query = f"""
            UPDATE users
            SET {', '.join(fields)}
            WHERE id = %s
            RETURNING id, email, password, admin, suspended, pinned, created_at
        """
        params.append(user_id)

        with self.conn.cursor() as cur:
            cur.execute(query, params)
            self.conn.commit()
            return cur.fetchone()

    def delete_user(self, user_id):
        query = """
            DELETE FROM users
            WHERE id = %s
            RETURNING id, email, password, admin, suspended, pinned, created_at
        """
        with self.conn.cursor() as cur:
            cur.execute(query, (user_id,))
            self.conn.commit()
            return cur.fetchone()

    def suspend_user(self, user_id):
        query = """
            UPDATE users
            SET suspended = TRUE
            WHERE id = %s
            RETURNING id, email, password, admin, suspended, pinned, created_at
        """
        with self.conn.cursor() as cur:
            cur.execute(query, (user_id,))
            self.conn.commit()
            return cur.fetchone()

    def unsuspend_user(self, user_id):
        query = """
            UPDATE users
            SET suspended = FALSE
            WHERE id = %s
            RETURNING id, email, password, admin, suspended, pinned, created_at
        """
        with self.conn.cursor() as cur:
            cur.execute(query, (user_id,))
            self.conn.commit()
            return cur.fetchone()

    def pin_user(self, user_id):
        query = """
            UPDATE users
            SET pinned = TRUE
            WHERE id = %s
            RETURNING id, email, password, admin, suspended, pinned, created_at
        """
        with self.conn.cursor() as cur:
            cur.execute(query, (user_id,))
            self.conn.commit()
            return cur.fetchone()

    def unpin_user(self, user_id):
        query = """
            UPDATE users
            SET pinned = FALSE
            WHERE id = %s
            RETURNING id, email, password, admin, suspended, pinned, created_at
        """
        with self.conn.cursor() as cur:
            cur.execute(query, (user_id,))
            self.conn.commit()
            return cur.fetchone()

    def get_user_stats(self, user_id):  # TODO add last date report
        query = """
            SELECT
                u.id, u.email, u.created_at,
                COALESCE(u.total_reports, 0)                 AS total_reports,        -- lifetime (immutable)
                COALESCE(r.current_reports, 0)               AS current_reports,      -- live count in reports table
                COALESCE(r.open_reports, 0)                  AS open_reports,
                COALESCE(r.resolved_reports, 0)              AS resolved_reports,
                COALESCE(r.in_progress_reports, 0)           AS in_progress_reports,
                COALESCE(pr.pinned_reports_count, 0)         AS pinned_reports_count,
                COALESCE(r.avg_rating_given, 0)              AS avg_rating_given,
                COALESCE(r.last_report_date, NULL)           AS last_report_date
            FROM users u
            LEFT JOIN (
                SELECT
                    created_by,
                    COUNT(*)                                           AS current_reports,
                    COUNT(*) FILTER (WHERE status='open')              AS open_reports,
                    COUNT(*) FILTER (WHERE status='resolved')          AS resolved_reports,
                    COUNT(*) FILTER (WHERE status='in_progress')       AS in_progress_reports,
                    AVG(rating)                                        AS avg_rating_given,
                    MAX(created_at)                                    AS last_report_date
                FROM reports
                GROUP BY created_by
            ) r ON r.created_by = u.id
            LEFT JOIN (
                SELECT user_id, COUNT(*) AS pinned_reports_count
                FROM pinned_reports
                GROUP BY user_id
            ) pr ON pr.user_id = u.id
            WHERE u.id = %s;
            """
        with self.conn.cursor() as cur:
            cur.execute(query, (user_id,))
            result = cur.fetchone()

            if not result:
                return None

            return {
                "user_id": result[0],
                "email": result[1],
                "created_at": result[2],
                "total_reports": result[3],           # ← lifetime “Filed”
                "current_reports": result[4],         # optional: current live count in reports
                "open_reports": result[5],
                "resolved_reports": result[6],
                "in_progress_reports": result[7],
                "pinned_reports_count": result[8],
                "avg_rating_given": float(result[9]) if result[9] else 0,
                "last_report_date": result[10],
            }


    def validate_credentials(self, email, password):
        """Validate user credentials without returning password"""
        query = """
            SELECT id, email, admin, suspended, pinned, created_at
            FROM users
            WHERE email = %s AND password = %s
        """
        with self.conn.cursor() as cur:
            cur.execute(query, (email, password))
            return cur.fetchone()

    def close(self):
        if self.conn:
            self.conn.close()
