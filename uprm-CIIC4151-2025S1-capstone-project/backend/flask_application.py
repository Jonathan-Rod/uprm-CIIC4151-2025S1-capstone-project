from flask import Flask, request
from flask_cors import CORS
from handler.h_reports import ReportsHandler
from handler.h_users import UsersHandler
from handler.h_administrators import AdministratorsHandler
from handler.h_locations import LocationsHandler
from handler.h_departments import DepartmentsHandler
from handler.h_pinned_reports import PinnedReportsHandler

app = Flask(__name__)
CORS(app)


# -------------------------------------------------------
# HEALTH
# -------------------------------------------------------
@app.route("/", methods=["GET"])
def health_check():
    return {"status": "OK", "message": "Report System API is running"}


# -------------------------------------------------------
# REPORTS
# -------------------------------------------------------
@app.route("/reports", methods=["GET", "POST"])
def handle_reports():
    handler = ReportsHandler()
    if request.method == "POST":
        return handler.create_report(request.json)
    elif request.method == "GET":
        page = request.args.get("page", default=1, type=int)
        limit = request.args.get("limit", default=10, type=int)
        sort = request.args.get("sort")  # 'asc' or 'desc' (created_at)
        return handler.get_all_reports(page, limit, sort)


@app.route("/reports/<int:report_id>", methods=["GET", "PUT", "DELETE"])
def handle_report(report_id):
    handler = ReportsHandler()
    if request.method == "GET":
        return handler.get_report_by_id(report_id)
    elif request.method == "PUT":
        return handler.update_report(report_id, request.json)
    elif request.method == "DELETE":
        return handler.delete_report(report_id)


@app.route("/reports/<int:report_id>/validate", methods=["POST"])
def validate_report(report_id):
    handler = ReportsHandler()
    return handler.validate_report(report_id, request.json)


@app.route("/reports/<int:report_id>/resolve", methods=["POST"])
def resolve_report(report_id):
    handler = ReportsHandler()
    return handler.resolve_report(report_id, request.json)


@app.route("/reports/<int:report_id>/rate", methods=["POST"])
def rate_report(report_id):
    handler = ReportsHandler()
    return handler.rate_report(report_id, request.json)


# -------------------------------------------------------
# REPORTS - RATING & STATUS ENHANCEMENTS
# -------------------------------------------------------
@app.route("/reports/<int:report_id>/rating-status", methods=["GET"])
def get_report_rating_status(report_id):
    handler = ReportsHandler()
    user_id = request.args.get("user_id", type=int)
    return handler.get_report_rating_status(report_id, user_id)


@app.route("/reports/<int:report_id>/rating", methods=["GET"])
def get_report_rating(report_id):
    handler = ReportsHandler()
    return handler.get_report_rating(report_id)


@app.route("/reports/<int:report_id>/status", methods=["PUT"])
def change_report_status(report_id):
    handler = ReportsHandler()
    return handler.change_report_status(report_id, request.json)


@app.route("/reports/status-options", methods=["GET"])
def get_status_options():
    handler = ReportsHandler()
    return handler.get_status_options()


# -------------------------------------------------------
# USERS
# -------------------------------------------------------
@app.route("/users", methods=["GET", "POST"])
def handle_users():
    handler = UsersHandler()
    if request.method == "POST":
        return handler.create_user(request.json)
    elif request.method == "GET":
        page = request.args.get("page", default=1, type=int)
        limit = request.args.get("limit", default=10, type=int)
        return handler.get_all_users(page, limit)


@app.route("/users/<int:user_id>", methods=["GET", "PUT", "DELETE"])
def handle_user(user_id):
    handler = UsersHandler()
    if request.method == "GET":
        return handler.get_user_by_id(user_id)
    elif request.method == "PUT":
        return handler.update_user(user_id, request.json)
    elif request.method == "DELETE":
        return handler.delete_user(user_id)


# -------------------------------------------------------
# USERS - MANAGEMENT ACTIONS
# -------------------------------------------------------
@app.route("/users/<int:user_id>/suspend", methods=["POST"])
def suspend_user(user_id):
    handler = UsersHandler()
    return handler.suspend_user(user_id)


@app.route("/users/<int:user_id>/unsuspend", methods=["POST"])
def unsuspend_user(user_id):
    handler = UsersHandler()
    return handler.unsuspend_user(user_id)


@app.route("/users/<int:user_id>/pin", methods=["POST"])
def pin_user(user_id):
    handler = UsersHandler()
    return handler.pin_user(user_id)


@app.route("/users/<int:user_id>/unpin", methods=["POST"])
def unpin_user(user_id):
    handler = UsersHandler()
    return handler.unpin_user(user_id)


@app.route("/users/<int:user_id>/upgrade-admin", methods=["POST"])
def upgrade_admin(user_id):
    handler = UsersHandler()
    return handler.upgrade_to_admin(user_id, request.json)


# -------------------------------------------------------
# AUTH
# -------------------------------------------------------
@app.route("/login", methods=["POST"])
def login():
    handler = UsersHandler()
    return handler.login(request.json)


@app.route("/logout", methods=["POST"])
def logout():
    handler = UsersHandler()
    return handler.logout()


# -------------------------------------------------------
# LOCATIONS
# -------------------------------------------------------
@app.route("/locations", methods=["GET", "POST"])
def handle_locations():
    handler = LocationsHandler()
    if request.method == "POST":
        return handler.create_location(request.json)
    elif request.method == "GET":
        page = request.args.get("page", default=1, type=int)
        limit = request.args.get("limit", default=10, type=int)
        return handler.get_all_locations(page, limit)


@app.route("/locations/<int:location_id>", methods=["GET", "PUT", "DELETE"])
def handle_location(location_id):
    handler = LocationsHandler()
    if request.method == "GET":
        return handler.get_location_by_id(location_id)
    elif request.method == "PUT":
        return handler.update_location(location_id, request.json)
    elif request.method == "DELETE":
        return handler.delete_location(location_id)


@app.route("/locations/<int:location_id>/details", methods=["GET"])
def get_location_details(location_id):
    handler = LocationsHandler()
    return handler.get_location_details(location_id)


@app.route("/locations/nearby", methods=["GET"])
def get_locations_nearby():
    handler = LocationsHandler()
    return handler.get_locations_nearby()


@app.route("/locations/with-reports", methods=["GET"])
def get_locations_with_reports():
    handler = LocationsHandler()
    page = request.args.get("page", default=1, type=int)
    limit = request.args.get("limit", default=10, type=int)
    return handler.get_locations_with_reports(page, limit)


@app.route("/locations/stats", methods=["GET"])
def get_location_stats():
    handler = LocationsHandler()
    return handler.get_location_stats()


@app.route("/locations/search", methods=["GET"])
def search_locations():
    handler = LocationsHandler()
    return handler.search_locations()


# -------------------------------------------------------
# ADMINISTRATORS
# -------------------------------------------------------
@app.route("/administrators", methods=["GET", "POST"])
def handle_administrators():
    handler = AdministratorsHandler()
    if request.method == "POST":
        return handler.create_administrator(request.json)
    elif request.method == "GET":
        page = request.args.get("page", default=1, type=int)
        limit = request.args.get("limit", default=10, type=int)
        return handler.get_all_administrators(page, limit)


@app.route("/administrators/<int:admin_id>", methods=["GET", "PUT", "DELETE"])
def handle_administrator(admin_id):
    handler = AdministratorsHandler()
    if request.method == "GET":
        return handler.get_administrator_by_id(admin_id)
    elif request.method == "PUT":
        return handler.update_administrator(admin_id, request.json)
    elif request.method == "DELETE":
        return handler.delete_administrator(admin_id)


@app.route("/administrators/department/<string:department>", methods=["GET"])
def get_administrators_by_department(department):
    handler = AdministratorsHandler()
    return handler.get_administrators_by_department(department)


@app.route("/administrators/<int:admin_id>/details", methods=["GET"])
def get_administrator_with_details(admin_id):
    handler = AdministratorsHandler()
    return handler.get_administrator_with_details(admin_id)


@app.route("/administrators/available", methods=["GET"])
def get_available_administrators():
    handler = AdministratorsHandler()
    return handler.get_available_administrators()


@app.route("/administrators/stats/all", methods=["GET"])
def get_all_admin_stats():
    handler = AdministratorsHandler()
    return handler.get_all_admin_stats()


@app.route("/administrators/check/<int:user_id>", methods=["GET"])
def check_user_is_administrator(user_id):
    handler = AdministratorsHandler()
    return handler.check_user_is_administrator(user_id)


@app.route("/administrators/performance", methods=["GET"])
def get_administrator_performance_report():
    handler = AdministratorsHandler()
    return handler.get_administrator_performance_report()


# -------------------------------------------------------
# DEPARTMENTS
# -------------------------------------------------------
@app.route("/departments", methods=["GET", "POST"])
def handle_departments():
    handler = DepartmentsHandler()
    if request.method == "POST":
        return handler.create_department(request.json)
    elif request.method == "GET":
        return handler.get_all_departments()


@app.route("/departments/<string:department_name>", methods=["GET", "PUT", "DELETE"])
def handle_department(department_name):
    handler = DepartmentsHandler()
    if request.method == "GET":
        return handler.get_department_by_name(department_name)
    elif request.method == "PUT":
        return handler.update_department(department_name, request.json)
    elif request.method == "DELETE":
        return handler.delete_department(department_name)


@app.route("/departments/with-admin-info", methods=["GET"])
def get_departments_with_admin_info():
    handler = DepartmentsHandler()
    return handler.get_departments_with_admin_info()


@app.route("/departments/admin/<int:admin_id>", methods=["GET"])
def get_departments_by_admin(admin_id):
    handler = DepartmentsHandler()
    return handler.get_departments_by_admin(admin_id)


@app.route("/departments/available", methods=["GET"])
def get_available_departments():
    handler = DepartmentsHandler()
    return handler.get_available_departments()


@app.route("/departments/<string:department_name>/department-stats", methods=["GET"])
def get_department_detailed_stats(department_name):
    handler = DepartmentsHandler()
    return handler.get_department_stats(department_name)


@app.route("/departments/stats/all", methods=["GET"])
def get_all_departments_stats():
    handler = DepartmentsHandler()
    return handler.get_all_departments_stats()


@app.route(
    "/departments/check-assignment/<int:admin_id>/<string:department_name>",
    methods=["GET"],
)
def check_admin_assignment(admin_id, department_name):
    handler = DepartmentsHandler()
    return handler.check_admin_assignment(admin_id, department_name)


# -------------------------------------------------------
# PINNED REPORTS
# -------------------------------------------------------
@app.route("/pinned-reports", methods=["GET", "POST"])
def handle_pinned_reports():
    handler = PinnedReportsHandler()
    if request.method == "POST":
        return handler.pin_report(request.json)
    elif request.method == "GET":
        user_id = request.args.get("user_id", type=int)
        page = request.args.get("page", default=1, type=int)
        limit = request.args.get("limit", default=10, type=int)
        return handler.get_pinned_reports(user_id, page, limit)


@app.route("/pinned-reports/<int:report_id>", methods=["DELETE"])
def handle_pinned_report(report_id):
    handler = PinnedReportsHandler()
    user_id = request.args.get("user_id", type=int)
    if request.method == "DELETE":
        return handler.unpin_report(user_id, report_id)


@app.route("/users/<int:user_id>/pinned-reports", methods=["GET"])
def handle_user_pinned_reports(user_id):
    handler = PinnedReportsHandler()
    page = request.args.get("page", default=1, type=int)
    limit = request.args.get("limit", default=10, type=int)
    return handler.get_user_pinned_reports(user_id, page, limit)


@app.route("/pinned-reports/check/<int:user_id>/<int:report_id>", methods=["GET"])
def check_pinned_status(user_id, report_id):
    handler = PinnedReportsHandler()
    return handler.check_pinned_status(user_id, report_id)


@app.route("/reports/<int:report_id>/pinned-status", methods=["GET"])
def get_report_pinned_status(report_id):
    handler = PinnedReportsHandler()
    user_id = request.args.get("user_id", type=int)
    return handler.check_pinned_status(user_id, report_id)


@app.route("/pinned-reports/<int:user_id>/<int:report_id>/details", methods=["GET"])
def get_pinned_report_detail(user_id, report_id):
    handler = PinnedReportsHandler()
    return handler.get_pinned_report_detail(user_id, report_id)


# -------------------------------------------------------
# SEARCH & FILTER (updated to accept category + sort)
# -------------------------------------------------------
@app.route("/reports/search", methods=["GET"])
def search_reports():
    handler = ReportsHandler()
    query = request.args.get("q", "")
    status = request.args.get("status")
    category = request.args.get("category")
    sort = request.args.get("sort")  # 'asc' or 'desc'
    page = request.args.get("page", default=1, type=int)
    limit = request.args.get("limit", default=10, type=int)
    return handler.search_reports(query, page, limit, status, category, sort)


@app.route("/reports/filter", methods=["GET"])
def filter_reports():
    handler = ReportsHandler()
    status = request.args.get("status")
    category = request.args.get("category")
    sort = request.args.get("sort")  # 'asc' or 'desc'
    page = request.args.get("page", default=1, type=int)
    limit = request.args.get("limit", default=10, type=int)
    return handler.filter_reports(status, category, page, limit, sort)


@app.route("/reports/user/<int:user_id>", methods=["GET"])
def get_user_reports(user_id):
    handler = ReportsHandler()
    page = request.args.get("page", default=1, type=int)
    limit = request.args.get("limit", default=10, type=int)
    return handler.get_reports_by_user(user_id, page, limit)


# -------------------------------------------------------
# STATS & ADMIN
# -------------------------------------------------------
@app.route("/stats/overview", methods=["GET"])
def get_overview_stats():
    handler = ReportsHandler()
    return handler.get_overview_stats()


@app.route("/stats/department/<string:department>", methods=["GET"])
def get_department_overview_stats(department):
    handler = ReportsHandler()
    return handler.get_department_stats(department)


@app.route("/stats/user/<int:user_id>", methods=["GET"])
def get_user_stats(user_id):
    handler = UsersHandler()
    return handler.get_user_stats(user_id)


@app.route("/stats/admin/<int:admin_id>", methods=["GET"])
def get_admin_stats(admin_id):
    handler = AdministratorsHandler()
    return handler.get_admin_stats(admin_id)


@app.route("/admin/dashboard", methods=["GET"])
def get_admin_dashboard():
    handler = ReportsHandler()
    return handler.get_admin_dashboard()


@app.route("/admin/reports/pending", methods=["GET"])
def get_pending_reports():
    handler = ReportsHandler()
    page = request.args.get("page", default=1, type=int)
    limit = request.args.get("limit", default=10, type=int)
    return handler.get_pending_reports(page, limit)


@app.route("/admin/reports/assigned", methods=["GET"])
def get_assigned_reports():
    handler = ReportsHandler()
    admin_id = request.args.get("admin_id", type=int)
    page = request.args.get("page", default=1, type=int)
    limit = request.args.get("limit", default=10, type=int)
    return handler.get_assigned_reports(admin_id, page, limit)


# -------------------------------------------------------
# SYSTEM HEALTH
# -------------------------------------------------------
@app.route("/system/health", methods=["GET"])
def system_health():
    from datetime import datetime

    return {
        "status": "OK",
        "message": "System is running normally",
        "timestamp": datetime.utcnow().isoformat() + "Z",
        "version": "1.0.0",
    }


if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)
