from flask import request, jsonify
from dao.d_users import UsersDAO
from constants import HTTP_STATUS


class UsersHandler:

    def map_to_dict(self, user):
        """Map database tuple to dictionary (without password)"""
        return {
            "id": user[0],
            "email": user[1],
            "admin": user[3] if len(user) > 3 else False,
            "suspended": user[4] if len(user) > 4 else False,
            "pinned": user[5] if len(user) > 5 else False,
            "created_at": user[6] if len(user) > 6 else None,
        }

    def map_to_dict_no_password(self, user):
        """Map database tuple to dictionary (for queries that don't return password)"""
        return {
            "id": user[0],
            "email": user[1],
            "admin": user[2],
            "suspended": user[3],
            "pinned": user[4],
            "created_at": user[5],
        }

    def get_all_users(self, page=1, limit=10):
        try:
            offset = (page - 1) * limit

            dao = UsersDAO()
            users = dao.get_users_paginated(limit, offset)
            total_count = dao.get_total_user_count()
            total_pages = (total_count + limit - 1) // limit

            users_dict_list = [self.map_to_dict(user) for user in users]

            return (
                jsonify(
                    {
                        "users": users_dict_list,
                        "totalPages": total_pages,
                        "currentPage": page,
                        "totalCount": total_count,
                    }
                ),
                HTTP_STATUS.OK,
            )
        except Exception as e:
            return jsonify({"error_msg": str(e)}), HTTP_STATUS.INTERNAL_SERVER_ERROR

    def get_user_by_id(self, user_id):
        try:
            dao = UsersDAO()
            user = dao.get_user_by_id(user_id)

            if not user:
                return jsonify({"error_msg": "User not found"}), HTTP_STATUS.NOT_FOUND

            user_dict = self.map_to_dict(user)
            return jsonify(user_dict), HTTP_STATUS.OK
        except Exception as e:
            return jsonify({"error_msg": str(e)}), HTTP_STATUS.INTERNAL_SERVER_ERROR

    def create_user(self, data):
        try:
            if not data:
                return (
                    jsonify({"error_msg": "Missing registration data"}),
                    HTTP_STATUS.BAD_REQUEST,
                )

            required_fields = ["email", "password"]
            for field in required_fields:
                if field not in data:
                    return (
                        jsonify({"error_msg": f"Missing field: {field}"}),
                        HTTP_STATUS.BAD_REQUEST,
                    )

            email = data["email"]
            password = data["password"]
            admin = data.get("admin", False)

            # Basic validation
            if not email or not password:
                return (
                    jsonify({"error_msg": "Email and password are required"}),
                    HTTP_STATUS.BAD_REQUEST,
                )

            if len(password) < 8:
                return (
                    jsonify({"error_msg": "Password must be at least 8 characters"}),
                    HTTP_STATUS.BAD_REQUEST,
                )

            dao = UsersDAO()

            # Check if user already exists
            if dao.get_user_by_email(email):
                return (
                    jsonify({"error_msg": "User with this email already exists"}),
                    HTTP_STATUS.CONFLICT,
                )

            inserted_user = dao.create_user(email, password, admin)

            if not inserted_user:
                return (
                    jsonify({"error_msg": "User not inserted"}),
                    HTTP_STATUS.INTERNAL_SERVER_ERROR,
                )

            inserted_user_dict = self.map_to_dict(inserted_user)
            return jsonify(inserted_user_dict), HTTP_STATUS.CREATED
        except Exception as e:
            return jsonify({"error_msg": str(e)}), HTTP_STATUS.INTERNAL_SERVER_ERROR

    def update_user(self, user_id, data):
        try:
            dao = UsersDAO()

            if not data:
                return jsonify({"error_msg": "Missing data"}), HTTP_STATUS.BAD_REQUEST

            if not dao.get_user_by_id(user_id):
                return jsonify({"error_msg": "User not found"}), HTTP_STATUS.NOT_FOUND

            # Extract updatable fields
            email = data.get("email")
            password = data.get("password")
            admin = data.get("admin")
            suspended = data.get("suspended")
            pinned = data.get("pinned")

            updated_user = dao.update_user(
                user_id=user_id,
                email=email,
                password=password,
                admin=admin,
                suspended=suspended,
                pinned=pinned,
            )

            if not updated_user:
                return (
                    jsonify({"error_msg": "User not updated"}),
                    HTTP_STATUS.INTERNAL_SERVER_ERROR,
                )

            updated_user_dict = self.map_to_dict(updated_user)
            return jsonify(updated_user_dict), HTTP_STATUS.OK
        except Exception as e:
            return jsonify({"error_msg": str(e)}), HTTP_STATUS.INTERNAL_SERVER_ERROR

    def delete_user(self, user_id):
        try:
            dao = UsersDAO()

            if not dao.get_user_by_id(user_id):
                return jsonify({"error_msg": "User not found"}), HTTP_STATUS.NOT_FOUND

            deleted_user = dao.delete_user(user_id)

            if not deleted_user:
                return (
                    jsonify({"error_msg": "User not deleted"}),
                    HTTP_STATUS.INTERNAL_SERVER_ERROR,
                )

            return "", HTTP_STATUS.NO_CONTENT
        except Exception as e:
            return jsonify({"error_msg": str(e)}), HTTP_STATUS.INTERNAL_SERVER_ERROR

    def login(self, data):
        try:
            if not data:
                return (
                    jsonify({"success": False, "error_msg": "Missing login data"}),
                    HTTP_STATUS.BAD_REQUEST,
                )

            required_fields = ["email", "password"]
            for field in required_fields:
                if field not in data:
                    return (
                        jsonify(
                            {"success": False, "error_msg": f"Missing field: {field}"}
                        ),
                        HTTP_STATUS.BAD_REQUEST,
                    )

            email = data["email"]
            password = data["password"]

            if not email or not password:
                return (
                    jsonify(
                        {
                            "success": False,
                            "error_msg": "Email and password are required",
                        }
                    ),
                    HTTP_STATUS.BAD_REQUEST,
                )

            dao = UsersDAO()
            user = dao.get_user_by_email(email)

            if not user:
                return (
                    jsonify(
                        {"success": False, "error_msg": "Invalid email or password"}
                    ),
                    HTTP_STATUS.UNAUTHORIZED,
                )

            # Validate password
            if user[2] != password:  # password is at index 2
                return (
                    jsonify(
                        {"success": False, "error_msg": "Invalid email or password"}
                    ),
                    HTTP_STATUS.UNAUTHORIZED,
                )

            # Check if user is suspended
            if user[4]:  # suspended is at index 4
                return (
                    jsonify({"success": False, "error_msg": "Account suspended"}),
                    HTTP_STATUS.FORBIDDEN,
                )

            # Success - return user data without password for security
            user_info = {
                "id": user[0],
                "email": user[1],
                "admin": user[3],
                "suspended": user[4],
                "pinned": user[5],
                "created_at": user[6],
            }

            return (
                jsonify(
                    {"success": True, "user": user_info, "message": "Login successful"}
                ),
                HTTP_STATUS.OK,
            )
        except Exception as e:
            return (
                jsonify({"success": False, "error_msg": str(e)}),
                HTTP_STATUS.INTERNAL_SERVER_ERROR,
            )

    def logout(self):
        try:
            # No session to clear - just return success
            # Frontend will clear localStorage
            return (
                jsonify({"success": True, "message": "Logout successful"}),
                HTTP_STATUS.OK,
            )
        except Exception as e:
            return (
                jsonify({"success": False, "error_msg": str(e)}),
                HTTP_STATUS.INTERNAL_SERVER_ERROR,
            )

    def suspend_user(self, user_id):
        try:
            dao = UsersDAO()

            if not dao.get_user_by_id(user_id):
                return jsonify({"error_msg": "User not found"}), HTTP_STATUS.NOT_FOUND

            suspended_user = dao.suspend_user(user_id)
            if not suspended_user:
                return (
                    jsonify({"error_msg": "Failed to suspend user"}),
                    HTTP_STATUS.INTERNAL_SERVER_ERROR,
                )

            suspended_user_dict = self.map_to_dict(suspended_user)
            return jsonify(suspended_user_dict), HTTP_STATUS.OK
        except Exception as e:
            return jsonify({"error_msg": str(e)}), HTTP_STATUS.INTERNAL_SERVER_ERROR

    def unsuspend_user(self, user_id):
        try:
            dao = UsersDAO()

            if not dao.get_user_by_id(user_id):
                return jsonify({"error_msg": "User not found"}), HTTP_STATUS.NOT_FOUND

            unsuspended_user = dao.unsuspend_user(user_id)
            if not unsuspended_user:
                return (
                    jsonify({"error_msg": "Failed to unsuspend user"}),
                    HTTP_STATUS.INTERNAL_SERVER_ERROR,
                )

            unsuspended_user_dict = self.map_to_dict(unsuspended_user)
            return jsonify(unsuspended_user_dict), HTTP_STATUS.OK
        except Exception as e:
            return jsonify({"error_msg": str(e)}), HTTP_STATUS.INTERNAL_SERVER_ERROR

    def pin_user(self, user_id):
        try:
            dao = UsersDAO()

            if not dao.get_user_by_id(user_id):
                return jsonify({"error_msg": "User not found"}), HTTP_STATUS.NOT_FOUND

            pinned_user = dao.pin_user(user_id)
            if not pinned_user:
                return (
                    jsonify({"error_msg": "Failed to pin user"}),
                    HTTP_STATUS.INTERNAL_SERVER_ERROR,
                )

            pinned_user_dict = self.map_to_dict(pinned_user)
            return jsonify(pinned_user_dict), HTTP_STATUS.OK
        except Exception as e:
            return jsonify({"error_msg": str(e)}), HTTP_STATUS.INTERNAL_SERVER_ERROR

    def unpin_user(self, user_id):
        try:
            dao = UsersDAO()

            if not dao.get_user_by_id(user_id):
                return jsonify({"error_msg": "User not found"}), HTTP_STATUS.NOT_FOUND

            unpinned_user = dao.unpin_user(user_id)
            if not unpinned_user:
                return (
                    jsonify({"error_msg": "Failed to unpin user"}),
                    HTTP_STATUS.INTERNAL_SERVER_ERROR,
                )

            unpinned_user_dict = self.map_to_dict(unpinned_user)
            return jsonify(unpinned_user_dict), HTTP_STATUS.OK
        except Exception as e:
            return jsonify({"error_msg": str(e)}), HTTP_STATUS.INTERNAL_SERVER_ERROR

    def get_user_stats(self, user_id):
        try:
            dao = UsersDAO()

            if not dao.get_user_by_id(user_id):
                return jsonify({"error_msg": "User not found"}), HTTP_STATUS.NOT_FOUND

            stats = dao.get_user_stats(user_id)

            if not stats:
                return (
                    jsonify({"error_msg": "Failed to get user stats"}),
                    HTTP_STATUS.INTERNAL_SERVER_ERROR,
                )

            return jsonify(stats), HTTP_STATUS.OK
        except Exception as e:
            return jsonify({"error_msg": str(e)}), HTTP_STATUS.INTERNAL_SERVER_ERROR
