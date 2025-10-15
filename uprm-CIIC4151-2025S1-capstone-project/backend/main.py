from flask import Flask, request, jsonify
from flask_cors import CORS
from handler.h_reports import ReportsHandler
from handler.h_users import UsersHandler
from jwt_helper import decode_token

app = Flask(__name__)
CORS(app)

# ######################################################################################
# REPORT ROUTES

@app.route("/reports", methods=["POST"])
def handleReport():
    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        return jsonify({"error": "Missing token"}), 401

    token = auth_header.split(" ")[1]
    payload = decode_token(token)
    if not payload:
        return jsonify({"error": "Invalid or expired token"}), 401

    user_id = payload["user_id"]
    handler = ReportsHandler()
    return handler.insertReport(user_id, request.json)

@app.route("/reports", methods=["GET"])
def getReports():
    handler = ReportsHandler()
    return handler.getAllReports()

@app.route("/reports/<int:report_id>", methods=["GET"])
def getReportById(report_id):
    handler = ReportsHandler()
    return handler.getReportById(report_id)

@app.route("/reports/<int:report_id>", methods=["PUT"])
def updateReport(report_id):
    handler = ReportsHandler()
    return handler.updateReport(report_id)

@app.route("/reports/<int:report_id>", methods=["DELETE"])
def deleteReport(report_id):
    handler = ReportsHandler()
    return handler.deleteReport(report_id)

# ######################################################################################
# USER ROUTES

@app.route("/login", methods=["POST"])
def login():
    handler = UsersHandler()
    return handler.loginUser(request.json)

@app.route("/registration", methods=["POST"])
def register():
    handler = UsersHandler()
    return handler.insertUser(request.json)

@app.route("/me", methods=["GET"])
def get_current_user():
    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        return jsonify({"error": "Missing token"}), 401

    token = auth_header.split(" ")[1]
    payload = decode_token(token)
    if not payload:
        return jsonify({"error": "Invalid or expired token"}), 401

    user_id = payload["user_id"]
    handler = UsersHandler()
    return handler.getUserById(user_id)

# ######################################################################################

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)
