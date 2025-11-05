from dotenv import load_dotenv
from load import load_db


class ReportsDAO:
    def __init__(self):
        load_dotenv()
        self.conn = load_db()

    def get_reports_paginated(self, limit, offset):
        query = """
            SELECT id, title, description, status, category, created_by,
                   validated_by, resolved_by, created_at, resolved_at,
                   location, image_url, rating
            FROM reports
            ORDER BY created_at DESC
            LIMIT %s OFFSET %s
        """
        with self.conn.cursor() as cur:
            cur.execute(query, (limit, offset))
            return cur.fetchall()

    def get_total_report_count(self):
        query = "SELECT COUNT(*) FROM reports"
        with self.conn.cursor() as cur:
            cur.execute(query)
            return cur.fetchone()[0]

    def get_all_reports(self):
        query = """
            SELECT id, title, description, status, category, created_by,
                   validated_by, resolved_by, created_at, resolved_at,
                   location, image_url, rating
            FROM reports
            ORDER BY created_at DESC
        """
        with self.conn.cursor() as cur:
            cur.execute(query)
            return cur.fetchall()

    def get_report_by_id(self, report_id):
        query = """
            SELECT id, title, description, status, category, created_by,
                   validated_by, resolved_by, created_at, resolved_at,
                   location, image_url, rating
            FROM reports
            WHERE id = %s
        """
        with self.conn.cursor() as cur:
            cur.execute(query, (report_id,))
            return cur.fetchone()

    def create_report(
        self,
        title,
        description,
        category="other",
        location_id=None,
        image_url=None,
        created_by=None,
    ):
        query = """
            INSERT INTO reports (title, description, category, location, image_url, created_by)
            VALUES (%s, %s, %s, %s, %s, %s)
            RETURNING id, title, description, status, category, created_by,
                      validated_by, resolved_by, created_at, resolved_at,
                      location, image_url, rating
        """
        with self.conn.cursor() as cur:
            cur.execute(
                query,
                (title, description, category, location_id, image_url, created_by),
            )
            new_report = cur.fetchone()
            if created_by is not None:
                cur.execute(
                    "UPDATE users SET total_reports = total_reports + 1 WHERE id = %s",
                    (created_by,)
                )
            self.conn.commit()
            return new_report

    def update_report(
        self,
        report_id,
        status=None,
        rating=None,
        title=None,
        description=None,
        category=None,
        validated_by=None,
        resolved_by=None,
        resolved_at=None,
        location_id=None,
        image_url=None,
    ):
        # Build dynamic query based on provided fields
        fields = []
        params = []

        if status is not None:
            fields.append("status = %s")
            params.append(status)
        if rating is not None:
            fields.append("rating = %s")
            params.append(rating)
        if title is not None:
            fields.append("title = %s")
            params.append(title)
        if description is not None:
            fields.append("description = %s")
            params.append(description)
        if category is not None:
            fields.append("category = %s")
            params.append(category)
        if validated_by is not None:
            fields.append("validated_by = %s")
            params.append(validated_by)
        if resolved_by is not None:
            fields.append("resolved_by = %s")
            params.append(resolved_by)
        if resolved_at is not None:
            if resolved_at == "NOW()":
                fields.append("resolved_at = NOW()")
            else:
                fields.append("resolved_at = %s")
                params.append(resolved_at)
        if location_id is not None:
            fields.append("location = %s")
            params.append(location_id)
        if image_url is not None:
            fields.append("image_url = %s")
            params.append(image_url)

        if not fields:
            return None

        query = f"""
            UPDATE reports
            SET {', '.join(fields)}
            WHERE id = %s
            RETURNING id, title, description, status, category, created_by,
                      validated_by, resolved_by, created_at, resolved_at,
                      location, image_url, rating
        """
        params.append(report_id)

        with self.conn.cursor() as cur:
            cur.execute(query, params)
            self.conn.commit()
            return cur.fetchone()

    def delete_report(self, report_id):
        query = """
            DELETE FROM reports
            WHERE id = %s
            RETURNING id, title, description, status, category, created_by,
                      validated_by, resolved_by, created_at, resolved_at,
                      location, image_url, rating
        """
        with self.conn.cursor() as cur:
            cur.execute(query, (report_id,))
            self.conn.commit()
            result = cur.fetchone()
            return result is not None

    def search_reports(self, query, limit, offset):
        search_query = f"%{query}%"
        query_sql = """
            SELECT id, title, description, status, category, created_by,
                   validated_by, resolved_by, created_at, resolved_at,
                   location, image_url, rating
            FROM reports
            WHERE title ILIKE %s OR description ILIKE %s
            ORDER BY created_at DESC
            LIMIT %s OFFSET %s
        """
        with self.conn.cursor() as cur:
            cur.execute(query_sql, (search_query, search_query, limit, offset))
            return cur.fetchall()

    def get_search_reports_count(self, query):
        search_query = f"%{query}%"
        query_sql = """
            SELECT COUNT(*) FROM reports
            WHERE title ILIKE %s OR description ILIKE %s
        """
        with self.conn.cursor() as cur:
            cur.execute(query_sql, (search_query, search_query))
            return cur.fetchone()[0]

    def filter_reports(self, status, category, limit, offset):
        base_query = """
            SELECT id, title, description, status, category, created_by,
                   validated_by, resolved_by, created_at, resolved_at,
                   location, image_url, rating
            FROM reports
            WHERE 1=1
        """
        params = []

        if status:
            base_query += " AND status = %s"
            params.append(status)

        if category:
            base_query += " AND category = %s"
            params.append(category)

        base_query += " ORDER BY created_at DESC LIMIT %s OFFSET %s"
        params.extend([limit, offset])

        with self.conn.cursor() as cur:
            cur.execute(base_query, params)
            return cur.fetchall()

    def get_filter_reports_count(self, status, category):
        base_query = "SELECT COUNT(*) FROM reports WHERE 1=1"
        params = []

        if status:
            base_query += " AND status = %s"
            params.append(status)

        if category:
            base_query += " AND category = %s"
            params.append(category)

        with self.conn.cursor() as cur:
            cur.execute(base_query, params)
            return cur.fetchone()[0]

    def get_reports_by_user(self, user_id, limit, offset):
        query = """
            SELECT id, title, description, status, category, created_by,
                   validated_by, resolved_by, created_at, resolved_at,
                   location, image_url, rating
            FROM reports
            WHERE created_by = %s
            ORDER BY created_at DESC
            LIMIT %s OFFSET %s
        """
        with self.conn.cursor() as cur:
            cur.execute(query, (user_id, limit, offset))
            return cur.fetchall()

    def get_user_reports_count(self, user_id):
        query = "SELECT COUNT(*) FROM reports WHERE created_by = %s"
        with self.conn.cursor() as cur:
            cur.execute(query, (user_id,))
            return cur.fetchone()[0]

    def get_overview_stats(self):
        query = """
            SELECT
                COUNT(*) as total_reports,
                COUNT(CASE WHEN status = 'open' THEN 1 END) as open_reports,
                COUNT(CASE WHEN status = 'in_progress' THEN 1 END) as in_progress_reports,
                COUNT(CASE WHEN status = 'resolved' THEN 1 END) as resolved_reports,
                COUNT(CASE WHEN status = 'denied' THEN 1 END) as denied_reports,
                COUNT(DISTINCT created_by) as unique_reporters,
                COALESCE(AVG(rating), 0) as avg_rating,
                COUNT(CASE WHEN rating IS NOT NULL THEN 1 END) as rated_reports
            FROM reports
        """
        with self.conn.cursor() as cur:
            cur.execute(query)
            result = cur.fetchone()

            return {
                "total_reports": result[0],
                "open_reports": result[1],
                "in_progress_reports": result[2],
                "resolved_reports": result[3],
                "denied_reports": result[4],
                "unique_reporters": result[5],
                "avg_rating": float(result[6]) if result[6] else 0,
                "rated_reports": result[7],
            }

    def get_department_stats(self, department):
        query = """
            SELECT
                d.department,
                COUNT(r.id) as total_reports,
                COUNT(CASE WHEN r.status = 'open' THEN 1 END) as open_reports,
                COUNT(CASE WHEN r.status = 'in_progress' THEN 1 END) as in_progress_reports,
                COUNT(CASE WHEN r.status = 'resolved' THEN 1 END) as resolved_reports,
                COALESCE(AVG(r.rating), 0) as avg_rating
            FROM department_admins d
            LEFT JOIN administrators a ON d.admin_id = a.id
            LEFT JOIN reports r ON (r.validated_by = a.id OR r.resolved_by = a.id)
            WHERE d.department = %s
            GROUP BY d.department
        """
        with self.conn.cursor() as cur:
            cur.execute(query, (department,))
            result = cur.fetchone()

            if not result:
                return None

            return {
                "department": result[0],
                "total_reports": result[1],
                "open_reports": result[2],
                "in_progress_reports": result[3],
                "resolved_reports": result[4],
                "avg_rating": float(result[5]) if result[5] else 0,
            }

    def get_admin_dashboard(self):
        # Recent reports
        recent_reports_query = """
            SELECT id, title, status, category, created_at
            FROM reports
            ORDER BY created_at DESC
            LIMIT 10
        """

        # Stats by category
        category_stats_query = """
            SELECT category, COUNT(*),
                COUNT(CASE WHEN status = 'resolved' THEN 1 END) as resolved
            FROM reports
            GROUP BY category
        """

        # Stats by status
        status_stats_query = """
            SELECT status, COUNT(*)
            FROM reports
            GROUP BY status
        """

        with self.conn.cursor() as cur:
            # Get recent reports
            cur.execute(recent_reports_query)
            recent_reports = cur.fetchall()

            # Get category stats
            cur.execute(category_stats_query)
            category_stats = cur.fetchall()

            # Get status stats
            cur.execute(status_stats_query)
            status_stats = cur.fetchall()

            return {
                "recent_reports": [
                    {
                        "id": report[0],
                        "title": report[1],
                        "status": report[2],
                        "category": report[3],
                        "created_at": report[4],
                    }
                    for report in recent_reports
                ],
                "category_stats": [
                    {"category": stat[0], "total": stat[1], "resolved": stat[2]}
                    for stat in category_stats
                ],
                "status_stats": [
                    {"status": stat[0], "count": stat[1]} for stat in status_stats
                ],
            }

    def get_pending_reports(self, limit, offset):
        query = """
            SELECT id, title, description, status, category, created_by,
                validated_by, resolved_by, created_at, resolved_at,
                location, image_url, rating
            FROM reports
            WHERE status = 'open'
            ORDER BY created_at DESC
            LIMIT %s OFFSET %s
        """
        with self.conn.cursor() as cur:
            cur.execute(query, (limit, offset))
            return cur.fetchall()

    def get_pending_reports_count(self):
        query = "SELECT COUNT(*) FROM reports WHERE status = 'open'"
        with self.conn.cursor() as cur:
            cur.execute(query)
            return cur.fetchone()[0]

    def get_assigned_reports(self, admin_id, limit, offset):
        query = """
            SELECT id, title, description, status, category, created_by,
                validated_by, resolved_by, created_at, resolved_at,
                location, image_url, rating
            FROM reports
            WHERE (validated_by = %s OR resolved_by = %s) AND status != 'resolved'
            ORDER BY created_at DESC
            LIMIT %s OFFSET %s
        """
        with self.conn.cursor() as cur:
            cur.execute(query, (admin_id, admin_id, limit, offset))
            return cur.fetchall()

    def get_assigned_reports_count(self, admin_id):
        query = """
            SELECT COUNT(*) FROM reports
            WHERE (validated_by = %s OR resolved_by = %s) AND status != 'resolved'
        """
        with self.conn.cursor() as cur:
            cur.execute(query, (admin_id, admin_id))
            return cur.fetchone()[0]

    def close(self):
        if self.conn:
            self.conn.close()
