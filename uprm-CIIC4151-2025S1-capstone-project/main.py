from flask import Flask, request, jsonify
from flask_cors import CORS
from handler.h_reports import ReportsHandler
from handler.h_users import UsersHandler


app = Flask(__name__)
CORS(app)


@app.route("/report", methods=["POST"])
def handleReport():
    handler = ReportsHandler()
    return handler.insertReport(request.json)

@app.route("/report", methods=["GET"])
def getReports():
    handler = ReportsHandler()
    return handler.getAllReports()

@app.route("/login", methods=["POST"])
def login():
    handler = UsersHandler()
    return handler.loginUser(request.json)

@app.route("/registration", methods=["POST"])
def register():
    handler = UsersHandler()
    return handler.insertUser(request.json)


if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)
