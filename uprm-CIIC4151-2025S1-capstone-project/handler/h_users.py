from flask import request, jsonify
from dao.d_users import UsersDAO
from constants import HTTP_STATUS


class UsersHandler:

    def map_to_dict(self, user):
        return {
            "id": user[0],
            "username": user[1],
            "position": user[2],
            "email": user[3],
        }

    def getAllUsers(self):
        users = UsersDAO().getAllUsers()
        users_dict_list = [self.map_to_dict(user) for user in users]
        return jsonify(users_dict_list), HTTP_STATUS.OK
    
    def loginUser(self, data):
        if not data:
            return jsonify({"success": False, "error_msg": "Missing login data"}), HTTP_STATUS.BAD_REQUEST

        try:
            username = data["username"]
            password = data["password"]
            position = data["position"]
            email = data["email"]
        except KeyError as e:
            return jsonify({"success": False, "error_msg": f"Missing field: {str(e)}"}), HTTP_STATUS.BAD_REQUEST

        dao = UsersDAO()
        user = dao.getUserByUsername(username)

        if not user:
            return jsonify({"success": False, "error_msg": "User not found"}), HTTP_STATUS.NOT_FOUND

        # Validate credentials
        if user[2] != password or user[3] != position or user[4] != email:
            return jsonify({"success": False, "error_msg": "Invalid credentials"}), HTTP_STATUS.UNAUTHORIZED

        return jsonify({"success": True}), HTTP_STATUS.OK


    def getUserById(self, user_id):
        user = UsersDAO().getUserById(user_id)

        if not user:
            error_msg = {"error_msg": "User not found"}
            return jsonify(error_msg), HTTP_STATUS.NOT_FOUND

        user_dict = self.map_to_dict(user)
        return jsonify(user_dict), HTTP_STATUS.OK

    def insertUser(self, data):
        data = request.get_json()

        if not data:
            error_msg = {"error_msg": "Data not found"}
            return jsonify(error_msg), HTTP_STATUS.BAD_REQUEST

        try:
            username = data["username"]
            password = data["password"]
            position = data["position"]
            email = data["email"]
        except KeyError as e:
            error_msg = {"error_msg": f"Missing field: {str(e)}"}
            return jsonify(error_msg), HTTP_STATUS.BAD_REQUEST

        inserted_user = UsersDAO().insertUser(
            username, password, position, email
        )
        if not inserted_user:
            error_msg = {"error_msg": "User not inserted"}
            return jsonify(error_msg), HTTP_STATUS.INTERNAL_SERVER_ERROR

        inserted_user_dict = self.map_to_dict(inserted_user)
        return jsonify(inserted_user_dict), HTTP_STATUS.CREATED

    def updateUser(self, user_id):
        dao = UsersDAO()
        data = request.get_json()

        if not data:
            return jsonify({"error_msg": "Data not found"}), HTTP_STATUS.BAD_REQUEST

        if not dao.getUserById(user_id):
            return jsonify({"error_msg": "User not found"}), HTTP_STATUS.NOT_FOUND

        username = data.get("username")
        password = data.get("password")
        position = data.get("position")
        email = data.get("email")

        if username is None or password is None or position is None or email is None:
            return jsonify({"error_msg": "Missing username, password, position, or email"}), HTTP_STATUS.BAD_REQUEST

        updated_user = dao.updateUser(user_id, username, password, position, email)

        if not updated_user:
            return jsonify({"error_msg": "User not updated"}), HTTP_STATUS.INTERNAL_SERVER_ERROR

        updated_user_dict = self.map_to_dict(updated_user)
        return jsonify(updated_user_dict), HTTP_STATUS.OK


    def deleteUser(self, user_id):
        dao = UsersDAO()

        if not dao.getUserById(user_id):
            error_msg = {"error_msg": "User not found"}
            return jsonify(error_msg), HTTP_STATUS.NOT_FOUND

        deleted_user = dao.deleteUser(user_id)

        if not deleted_user:
            error_msg = {"error_msg": "User not deleted"}
            return jsonify(error_msg), HTTP_STATUS.INTERNAL_SERVER_ERROR

        return "", HTTP_STATUS.NO_CONTENT

