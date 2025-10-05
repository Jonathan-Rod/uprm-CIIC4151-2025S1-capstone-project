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
        reports = ReportsDAO().getAllReports()
        reports_dict_list = [self.map_to_dict(report) for report in reports]
        return jsonify(reports_dict_list), HTTP_STATUS.OK

    def getReportById(self, report_id):
        report = ReportsDAO().getReportById(report_id)

        if not report:
            error_msg = {"error_msg": "Report not found"}
            return jsonify(error_msg), HTTP_STATUS.NOT_FOUND

        report_dict = self.map_to_dict(report)
        return jsonify(report_dict), HTTP_STATUS.OK

    def insertReport(self, data):
        data = request.get_json()

        if not data:
            error_msg = {"error_msg": "Data not found"}
            return jsonify(error_msg), HTTP_STATUS.BAD_REQUEST

        try:
            title = data["title"]
            description = data["description"]
            status = data["status"]
            created_by = data["created_by"]
            validated_by = data["validated_by"]
            resolved_by = data["resolved_by"]
            created_at = data["created_at"]
            resolved_at = data["resolved_at"]
            location = data["location"]
            image_url = data["image_url"]
            rating = data["rating"]
        except KeyError as e:
            error_msg = {"error_msg": f"Missing field: {str(e)}"}
            return jsonify(error_msg), HTTP_STATUS.BAD_REQUEST

        inserted_report = ReportsDAO().insertReport(
            title, description, status, created_by, validated_by, resolved_by, created_at, resolved_at, location, image_url, rating
        )
        if not inserted_report:
            error_msg = {"error_msg": "Report not inserted"}
            return jsonify(error_msg), HTTP_STATUS.INTERNAL_SERVER_ERROR

        inserted_report_dict = self.map_to_dict(inserted_report)
        return jsonify(inserted_report_dict), HTTP_STATUS.CREATED

    def updateReport(self, report_id):
        dao = ReportsDAO()
        data = request.get_json()

        if not data:
            return jsonify({"error_msg": "Data not found"}), HTTP_STATUS.BAD_REQUEST

        if not dao.getReportById(report_id):
            return jsonify({"error_msg": "Report not found"}), HTTP_STATUS.NOT_FOUND

        status = data.get("status")
        rating = data.get("rating")

        if status is None or rating is None:
            return jsonify({"error_msg": "Missing status or rating"}), HTTP_STATUS.BAD_REQUEST

        updated_report = dao.updateReport(report_id, status, rating)

        if not updated_report:
            return jsonify({"error_msg": "Report not updated"}), HTTP_STATUS.INTERNAL_SERVER_ERROR

        updated_report_dict = self.map_to_dict(updated_report)
        return jsonify(updated_report_dict), HTTP_STATUS.OK


    def deleteReport(self, report_id):
        dao = ReportsDAO()

        if not dao.getReportById(report_id):
            error_msg = {"error_msg": "Report not found"}
            return jsonify(error_msg), HTTP_STATUS.NOT_FOUND

        deleted_report = dao.deleteReport(report_id)

        if not deleted_report:
            error_msg = {"error_msg": "Report not deleted"}
            return jsonify(error_msg), HTTP_STATUS.INTERNAL_SERVER_ERROR

        return "", HTTP_STATUS.NO_CONTENT

