from flask import request, jsonify
from dao.d_users import UsersDAO
from constants import HTTP_STATUS
from jwt_helper import create_token

class UsersHandler:

    def map_to_dict(self, user):
        # users table = id, email, admin
        return {
            "id": user[0],
            "email": user[1],
            "admin": user[2],
        }

    def getAllUsers(self):
        dao = UsersDAO()
        users = dao.getAllUsers()
        users_dict_list = [self.map_to_dict(user) for user in users]
        return jsonify(users_dict_list), HTTP_STATUS.OK

    def loginUser(self, data):
        if not data:
            return jsonify({"success": False, "error_msg": "Missing login data"}), 400

        try:
            email = data["email"]
            password = data["password"]
        except KeyError as e:
            return jsonify({"success": False, "error_msg": f"Missing field: {str(e)}"}), 400

        dao = UsersDAO()
        user = dao.getUserByEmail(email)

        if not user:
            return jsonify({"success": False, "error_msg": "User not found"}), 404

        # Validate password (no hashing for now)
        if user[2] != password:
            return jsonify({"success": False, "error_msg": "Invalid password"}), 401

        # Success — create token
        user_info = {
            "id": user[0],
            "email": user[1],
            "admin": user[3]  # assuming your user tuple = (id, email, password, admin)
        }

        token = create_token(user_info["id"])

        return jsonify({"success": True, "user": user_info, "token": token}), 200

    def getUserById(self, user_id):
        dao = UsersDAO()
        user = dao.getUserById(user_id)

        if not user:
            return jsonify({"error_msg": "User not found"}), HTTP_STATUS.NOT_FOUND

        user_dict = self.map_to_dict(user)
        return jsonify(user_dict), HTTP_STATUS.OK

    def insertUser(self, data):
        if not data:
            return jsonify({"error_msg": "Missing registration data"}), HTTP_STATUS.BAD_REQUEST

        try:
            email = data["email"]
            password = data["password"]
            admin = data["admin"]
        except KeyError as e:
            return jsonify({"error_msg": f"Missing field: {str(e)}"}), HTTP_STATUS.BAD_REQUEST

        dao = UsersDAO()
        inserted_user = dao.insertUser(email, password, admin)

        if not inserted_user:
            return jsonify({"error_msg": "User not inserted"}), HTTP_STATUS.INTERNAL_SERVER_ERROR

        inserted_user_dict = self.map_to_dict(inserted_user)
        return jsonify(inserted_user_dict), HTTP_STATUS.CREATED

    def updateUser(self, user_id):
        dao = UsersDAO()
        data = request.get_json()

        if not data:
            return jsonify({"error_msg": "Missing data"}), HTTP_STATUS.BAD_REQUEST

        if not dao.getUserById(user_id):
            return jsonify({"error_msg": "User not found"}), HTTP_STATUS.NOT_FOUND

        email = data.get("email")
        password = data.get("password")
        admin = data.get("admin")

        if not all([email, password, admin]):
            return jsonify({"error_msg": "Missing required fields"}), HTTP_STATUS.BAD_REQUEST

        updated_user = dao.updateUser(user_id, email, password, admin)

        if not updated_user:
            return jsonify({"error_msg": "User not updated"}), HTTP_STATUS.INTERNAL_SERVER_ERROR

        updated_user_dict = self.map_to_dict(updated_user)
        return jsonify(updated_user_dict), HTTP_STATUS.OK

    def deleteUser(self, user_id):
        dao = UsersDAO()

        if not dao.getUserById(user_id):
            return jsonify({"error_msg": "User not found"}), HTTP_STATUS.NOT_FOUND

        deleted_user = dao.deleteUser(user_id)

        if not deleted_user:
            return jsonify({"error_msg": "User not deleted"}), HTTP_STATUS.INTERNAL_SERVER_ERROR

        return "", HTTP_STATUS.NO_CONTENT
