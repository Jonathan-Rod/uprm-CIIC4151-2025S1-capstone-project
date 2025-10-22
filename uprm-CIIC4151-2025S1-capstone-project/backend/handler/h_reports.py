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
            "created_by": report[4],
            "validated_by": report[5],
            "resolved_by": report[6],
            "created_at": report[7],
            "resolved_at": report[8],
            "location": report[9],
            "image_url": report[10],
            "rating": report[11],
        }

    def getAllReports(self):
        page = int(request.args.get("page", 1))
        limit = int(request.args.get("limit", 10))
        offset = (page - 1) * limit

        dao = ReportsDAO()
        reports = dao.getReportsPaginated(limit, offset)
        total_count = dao.getTotalReportCount()
        total_pages = (total_count + limit - 1) // limit

        reports_dict_list = [self.map_to_dict(report) for report in reports]

        return jsonify({
            "reports": reports_dict_list,
            "totalPages": total_pages
        }), HTTP_STATUS.OK

    def getReportById(self, report_id):
        report = ReportsDAO().getReportById(report_id)
        if not report:
            return jsonify({"error_msg": "Report not found"}), HTTP_STATUS.NOT_FOUND

        return jsonify(self.map_to_dict(report)), HTTP_STATUS.OK

    def insertReport(self, user_id, data=None):
        if data is None:
            data = request.get_json()

        title = data.get("title")
        description = data.get("description")

        if not title or not description:
            return jsonify({"error_msg": "Title and description required"}), 400

        dao = ReportsDAO()
        inserted_report = dao.insertReport(title=title, description=description, created_by=user_id)

        return jsonify(self.map_to_dict(inserted_report)), 201

    def updateReport(self, report_id):
        dao = ReportsDAO()
        data = request.get_json()

        if not data:
            return jsonify({"error_msg": "Missing request data"}), HTTP_STATUS.BAD_REQUEST

        if not dao.getReportById(report_id):
            return jsonify({"error_msg": "Report not found"}), HTTP_STATUS.NOT_FOUND

        status = data.get("status")
        rating = data.get("rating")

        updated_report = dao.updateReport(report_id, status, rating)
        if not updated_report:
            return jsonify({"error_msg": "Failed to update report"}), HTTP_STATUS.INTERNAL_SERVER_ERROR

        return jsonify(self.map_to_dict(updated_report)), HTTP_STATUS.OK

    def deleteReport(self, report_id):
        dao = ReportsDAO()

        if not dao.getReportById(report_id):
            return jsonify({"error_msg": "Report not found"}), HTTP_STATUS.NOT_FOUND

        deleted_report = dao.deleteReport(report_id)
        if not deleted_report:
            return jsonify({"error_msg": "Failed to delete report"}), HTTP_STATUS.INTERNAL_SERVER_ERROR

        return "", HTTP_STATUS.NO_CONTENT
