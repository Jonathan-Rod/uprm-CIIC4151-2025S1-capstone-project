from flask import request, jsonify
from dao.d_reports import ReportsDAO
from constants import HTTP_STATUS


class ReportsHandler:
    def map_to_dict(self, report):
        return {
            "id": report[0],
            "title": report[1],
            "description": report[2],
            "status": report[3],
            "category": report[4],
            "created_by": report[5],
            "validated_by": report[6],
            "resolved_by": report[7],
            "created_at": report[8],
            "resolved_at": report[9],
            "location": report[10],
            "image_url": report[11],
            "rating": report[12],
        }

    def get_all_reports(self, page=1, limit=10):
        try:
            offset = (page - 1) * limit

            dao = ReportsDAO()
            reports = dao.get_reports_paginated(limit, offset)
            total_count = dao.get_total_report_count()
            total_pages = (total_count + limit - 1) // limit

            reports_dict_list = [self.map_to_dict(report) for report in reports]

            return (
                jsonify(
                    {
                        "reports": reports_dict_list,
                        "totalPages": total_pages,
                        "currentPage": page,
                        "totalCount": total_count,
                    }
                ),
                HTTP_STATUS.OK,
            )
        except Exception as e:
            return jsonify({"error_msg": str(e)}), HTTP_STATUS.INTERNAL_SERVER_ERROR

    def get_report_by_id(self, report_id):
        try:
            dao = ReportsDAO()
            report = dao.get_report_by_id(report_id)
            if not report:
                return jsonify({"error_msg": "Report not found"}), HTTP_STATUS.NOT_FOUND

            return jsonify(self.map_to_dict(report)), HTTP_STATUS.OK
        except Exception as e:
            return jsonify({"error_msg": str(e)}), HTTP_STATUS.INTERNAL_SERVER_ERROR

    def create_report(self, data):
        try:
            # Extract all fields from the request data
            title = data.get("title")
            description = data.get("description")
            category = data.get("category", "other")
            location_id = data.get("location_id")
            image_url = data.get("image_url")
            created_by = data.get("user_id")  # Get user_id from request body

            # Required fields validation
            if not title or not description:
                return (
                    jsonify({"error_msg": "Title and description are required"}),
                    HTTP_STATUS.BAD_REQUEST,
                )

            # Validate user_id is provided
            if not created_by:
                return (
                    jsonify({"error_msg": "User ID is required"}),
                    HTTP_STATUS.BAD_REQUEST,
                )

            # Validate category
            valid_categories = [
                "pothole",
                "street_light",
                "traffic_signal",
                "road_damage",
                "sanitation",
                "other",
            ]
            if category not in valid_categories:
                return (
                    jsonify(
                        {
                            "error_msg": f"Invalid category. Must be one of: {valid_categories}"
                        }
                    ),
                    HTTP_STATUS.BAD_REQUEST,
                )

            dao = ReportsDAO()
            inserted_report = dao.create_report(
                title=title,
                description=description,
                category=category,
                location_id=location_id,
                image_url=image_url,
                created_by=created_by,
            )

            if not inserted_report:
                return (
                    jsonify({"error_msg": "Failed to create report"}),
                    HTTP_STATUS.INTERNAL_SERVER_ERROR,
                )

            return jsonify(self.map_to_dict(inserted_report)), HTTP_STATUS.CREATED
        except Exception as e:
            return jsonify({"error_msg": str(e)}), HTTP_STATUS.INTERNAL_SERVER_ERROR

    def update_report(self, report_id, data):
        try:
            dao = ReportsDAO()

            if not data:
                return (
                    jsonify({"error_msg": "Missing request data"}),
                    HTTP_STATUS.BAD_REQUEST,
                )

            # Check if report exists
            if not dao.get_report_by_id(report_id):
                return jsonify({"error_msg": "Report not found"}), HTTP_STATUS.NOT_FOUND

            # Extract updatable fields
            status = data.get("status")
            rating = data.get("rating")
            title = data.get("title")
            description = data.get("description")
            category = data.get("category")
            validated_by = data.get("validated_by")
            resolved_by = data.get("resolved_by")
            resolved_at = data.get("resolved_at")
            location_id = data.get("location_id")
            image_url = data.get("image_url")

            # Validate status if provided
            if status and status not in ["resolved", "denied", "in_progress", "open"]:
                return jsonify({"error_msg": "Invalid status"}), HTTP_STATUS.BAD_REQUEST

            # Validate category if provided
            if category and category not in [
                "pothole",
                "street_light",
                "traffic_signal",
                "road_damage",
                "sanitation",
                "other",
            ]:
                return (
                    jsonify({"error_msg": "Invalid category"}),
                    HTTP_STATUS.BAD_REQUEST,
                )

            # Validate rating if provided
            if rating and (rating < 1 or rating > 5):
                return (
                    jsonify({"error_msg": "Rating must be between 1 and 5"}),
                    HTTP_STATUS.BAD_REQUEST,
                )

            updated_report = dao.update_report(
                report_id=report_id,
                status=status,
                rating=rating,
                title=title,
                description=description,
                category=category,
                validated_by=validated_by,
                resolved_by=resolved_by,
                resolved_at=resolved_at,
                location_id=location_id,
                image_url=image_url,
            )

            if not updated_report:
                return (
                    jsonify({"error_msg": "Failed to update report"}),
                    HTTP_STATUS.INTERNAL_SERVER_ERROR,
                )

            return jsonify(self.map_to_dict(updated_report)), HTTP_STATUS.OK
        except Exception as e:
            return jsonify({"error_msg": str(e)}), HTTP_STATUS.INTERNAL_SERVER_ERROR

    def delete_report(self, report_id):
        try:
            dao = ReportsDAO()

            if not dao.get_report_by_id(report_id):
                return jsonify({"error_msg": "Report not found"}), HTTP_STATUS.NOT_FOUND

            success = dao.delete_report(report_id)
            if not success:
                return (
                    jsonify({"error_msg": "Failed to delete report"}),
                    HTTP_STATUS.INTERNAL_SERVER_ERROR,
                )

            return "", HTTP_STATUS.NO_CONTENT
        except Exception as e:
            return jsonify({"error_msg": str(e)}), HTTP_STATUS.INTERNAL_SERVER_ERROR

    def search_reports(self, query, page=1, limit=10):
        try:
            if not query or len(query.strip()) == 0:
                return (
                    jsonify({"error_msg": "Search query is required"}),
                    HTTP_STATUS.BAD_REQUEST,
                )

            offset = (page - 1) * limit
            dao = ReportsDAO()

            reports = dao.search_reports(query, limit, offset)
            total_count = dao.get_search_reports_count(query)
            total_pages = (total_count + limit - 1) // limit

            reports_dict_list = [self.map_to_dict(report) for report in reports]

            return (
                jsonify(
                    {
                        "reports": reports_dict_list,
                        "totalPages": total_pages,
                        "currentPage": page,
                        "totalCount": total_count,
                        "query": query,
                    }
                ),
                HTTP_STATUS.OK,
            )
        except Exception as e:
            return jsonify({"error_msg": str(e)}), HTTP_STATUS.INTERNAL_SERVER_ERROR

    def filter_reports(self, status, category, page=1, limit=10):
        try:
            offset = (page - 1) * limit
            dao = ReportsDAO()

            # Validate status and category if provided
            if status and status not in ["resolved", "denied", "in_progress", "open"]:
                return jsonify({"error_msg": "Invalid status"}), HTTP_STATUS.BAD_REQUEST

            if category and category not in [
                "pothole",
                "street_light",
                "traffic_signal",
                "road_damage",
                "sanitation",
                "other",
            ]:
                return (
                    jsonify({"error_msg": "Invalid category"}),
                    HTTP_STATUS.BAD_REQUEST,
                )

            reports = dao.filter_reports(status, category, limit, offset)
            total_count = dao.get_filter_reports_count(status, category)
            total_pages = (total_count + limit - 1) // limit

            reports_dict_list = [self.map_to_dict(report) for report in reports]

            return (
                jsonify(
                    {
                        "reports": reports_dict_list,
                        "totalPages": total_pages,
                        "currentPage": page,
                        "totalCount": total_count,
                        "filters": {"status": status, "category": category},
                    }
                ),
                HTTP_STATUS.OK,
            )
        except Exception as e:
            return jsonify({"error_msg": str(e)}), HTTP_STATUS.INTERNAL_SERVER_ERROR

    def get_reports_by_user(self, user_id, page=1, limit=10):
        try:
            offset = (page - 1) * limit
            dao = ReportsDAO()

            reports = dao.get_reports_by_user(user_id, limit, offset)
            total_count = dao.get_user_reports_count(user_id)
            total_pages = (total_count + limit - 1) // limit

            reports_dict_list = [self.map_to_dict(report) for report in reports]

            return (
                jsonify(
                    {
                        "reports": reports_dict_list,
                        "totalPages": total_pages,
                        "currentPage": page,
                        "totalCount": total_count,
                        "user_id": user_id,
                    }
                ),
                HTTP_STATUS.OK,
            )
        except Exception as e:
            return jsonify({"error_msg": str(e)}), HTTP_STATUS.INTERNAL_SERVER_ERROR

    def validate_report(self, report_id, data):
        try:
            dao = ReportsDAO()

            if not dao.get_report_by_id(report_id):
                return jsonify({"error_msg": "Report not found"}), HTTP_STATUS.NOT_FOUND

            try:
                admin_id = data["admin_id"]
            except KeyError:
                return (
                    jsonify({"error_msg": "Missing admin_id"}),
                    HTTP_STATUS.BAD_REQUEST,
                )

            updated_report = dao.update_report(
                report_id=report_id, validated_by=admin_id, status="in_progress"
            )

            if not updated_report:
                return (
                    jsonify({"error_msg": "Failed to validate report"}),
                    HTTP_STATUS.INTERNAL_SERVER_ERROR,
                )

            return jsonify(self.map_to_dict(updated_report)), HTTP_STATUS.OK
        except Exception as e:
            return jsonify({"error_msg": str(e)}), HTTP_STATUS.INTERNAL_SERVER_ERROR

    def resolve_report(self, report_id, data):
        try:
            dao = ReportsDAO()

            if not dao.get_report_by_id(report_id):
                return jsonify({"error_msg": "Report not found"}), HTTP_STATUS.NOT_FOUND

            try:
                admin_id = data["admin_id"]
            except KeyError:
                return (
                    jsonify({"error_msg": "Missing admin_id"}),
                    HTTP_STATUS.BAD_REQUEST,
                )

            updated_report = dao.update_report(
                report_id=report_id,
                resolved_by=admin_id,
                status="resolved",
                resolved_at="NOW()",  # This will use PostgreSQL's NOW() function
            )

            if not updated_report:
                return (
                    jsonify({"error_msg": "Failed to resolve report"}),
                    HTTP_STATUS.INTERNAL_SERVER_ERROR,
                )

            return jsonify(self.map_to_dict(updated_report)), HTTP_STATUS.OK
        except Exception as e:
            return jsonify({"error_msg": str(e)}), HTTP_STATUS.INTERNAL_SERVER_ERROR

    def rate_report(self, report_id, data):
        try:
            dao = ReportsDAO()

            if not dao.get_report_by_id(report_id):
                return jsonify({"error_msg": "Report not found"}), HTTP_STATUS.NOT_FOUND

            try:
                rating = data["rating"]
            except KeyError:
                return jsonify({"error_msg": "Missing rating"}), HTTP_STATUS.BAD_REQUEST

            # Validate rating
            if rating < 1 or rating > 5:
                return (
                    jsonify({"error_msg": "Rating must be between 1 and 5"}),
                    HTTP_STATUS.BAD_REQUEST,
                )

            updated_report = dao.update_report(report_id=report_id, rating=rating)

            if not updated_report:
                return (
                    jsonify({"error_msg": "Failed to rate report"}),
                    HTTP_STATUS.INTERNAL_SERVER_ERROR,
                )

            return jsonify(self.map_to_dict(updated_report)), HTTP_STATUS.OK
        except Exception as e:
            return jsonify({"error_msg": str(e)}), HTTP_STATUS.INTERNAL_SERVER_ERROR

    def get_overview_stats(self):
        try:
            dao = ReportsDAO()
            stats = dao.get_overview_stats()
            return jsonify(stats), HTTP_STATUS.OK
        except Exception as e:
            return jsonify({"error_msg": str(e)}), HTTP_STATUS.INTERNAL_SERVER_ERROR

    def get_department_stats(self, department):
        try:
            dao = ReportsDAO()
            stats = dao.get_department_stats(department)

            if not stats:
                return (
                    jsonify({"error_msg": "Department not found"}),
                    HTTP_STATUS.NOT_FOUND,
                )

            return jsonify(stats), HTTP_STATUS.OK
        except Exception as e:
            return jsonify({"error_msg": str(e)}), HTTP_STATUS.INTERNAL_SERVER_ERROR

    def get_admin_dashboard(self):
        try:
            dao = ReportsDAO()
            dashboard_data = dao.get_admin_dashboard()
            return jsonify(dashboard_data), HTTP_STATUS.OK
        except Exception as e:
            return jsonify({"error_msg": str(e)}), HTTP_STATUS.INTERNAL_SERVER_ERROR

    def get_pending_reports(self, page=1, limit=10):
        try:
            offset = (page - 1) * limit
            dao = ReportsDAO()

            reports = dao.get_pending_reports(limit, offset)
            total_count = dao.get_pending_reports_count()
            total_pages = (total_count + limit - 1) // limit

            reports_dict_list = [self.map_to_dict(report) for report in reports]

            return (
                jsonify(
                    {
                        "reports": reports_dict_list,
                        "totalPages": total_pages,
                        "currentPage": page,
                        "totalCount": total_count,
                    }
                ),
                HTTP_STATUS.OK,
            )
        except Exception as e:
            return jsonify({"error_msg": str(e)}), HTTP_STATUS.INTERNAL_SERVER_ERROR

    def get_assigned_reports(self, admin_id, page=1, limit=10):
        try:
            offset = (page - 1) * limit
            dao = ReportsDAO()

            reports = dao.get_assigned_reports(admin_id, limit, offset)
            total_count = dao.get_assigned_reports_count(admin_id)
            total_pages = (total_count + limit - 1) // limit

            reports_dict_list = [self.map_to_dict(report) for report in reports]

            return (
                jsonify(
                    {
                        "reports": reports_dict_list,
                        "totalPages": total_pages,
                        "currentPage": page,
                        "totalCount": total_count,
                        "admin_id": admin_id,
                    }
                ),
                HTTP_STATUS.OK,
            )
        except Exception as e:
            return jsonify({"error_msg": str(e)}), HTTP_STATUS.INTERNAL_SERVER_ERROR
