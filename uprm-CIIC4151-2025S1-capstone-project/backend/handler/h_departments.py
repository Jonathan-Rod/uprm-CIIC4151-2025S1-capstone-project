from flask import request, jsonify
from dao.d_departments import DepartmentsDAO
from constants import HTTP_STATUS


class DepartmentsHandler:

    def map_to_dict(self, department):
        """Map basic department info to dictionary"""
        return {
            "department": department[0],
            "admin_id": department[1],
        }

    def map_to_dict_with_admin_info(self, department):
        """Map department with admin info to dictionary"""
        base_dict = {
            "department": department[0],
            "admin_id": department[1],
        }

        # Add admin info if available
        if len(department) > 2:
            base_dict["admin_email"] = department[2]
            base_dict["admin_user_id"] = department[3]

        return base_dict

    def map_to_dict_with_stats(self, department):
        """Map department with statistics to dictionary"""
        base_dict = {
            "department": department[0],
            "admin_id": department[1],
        }

        # Add stats if available
        if len(department) > 2:
            base_dict["admin_email"] = department[2]
            if len(department) > 3:
                base_dict["total_reports"] = department[3]
                base_dict["open_reports"] = department[4]
                base_dict["in_progress_reports"] = department[5]
                base_dict["resolved_reports"] = department[6]
                base_dict["avg_rating"] = float(department[7]) if department[7] else 0

        return base_dict

    def get_all_departments(self):
        try:
            dao = DepartmentsDAO()
            departments = dao.get_all_departments()
            departments_dict_list = [self.map_to_dict(dept) for dept in departments]
            return jsonify(departments_dict_list), HTTP_STATUS.OK
        except Exception as e:
            return jsonify({"error_msg": str(e)}), HTTP_STATUS.INTERNAL_SERVER_ERROR

    def get_department_by_name(self, department_name):
        try:
            dao = DepartmentsDAO()
            department = dao.get_department_by_name(department_name)

            if not department:
                return (
                    jsonify({"error_msg": "Department not found"}),
                    HTTP_STATUS.NOT_FOUND,
                )

            department_dict = self.map_to_dict(department)
            return jsonify(department_dict), HTTP_STATUS.OK
        except Exception as e:
            return jsonify({"error_msg": str(e)}), HTTP_STATUS.INTERNAL_SERVER_ERROR

    def update_department(self, department_name, data):
        try:
            dao = DepartmentsDAO()

            if not data:
                return jsonify({"error_msg": "Missing data"}), HTTP_STATUS.BAD_REQUEST

            if not dao.get_department_by_name(department_name):
                return (
                    jsonify({"error_msg": "Department not found"}),
                    HTTP_STATUS.NOT_FOUND,
                )

            admin_id = data.get("admin_id")

            # If admin_id is provided, validate it exists
            if admin_id is not None:
                # Note: You might want to add validation that the admin_id exists in administrators table
                pass

            updated_department = dao.update_department(department_name, admin_id)

            if not updated_department:
                return (
                    jsonify({"error_msg": "Department not updated"}),
                    HTTP_STATUS.INTERNAL_SERVER_ERROR,
                )

            updated_department_dict = self.map_to_dict(updated_department)
            return jsonify(updated_department_dict), HTTP_STATUS.OK
        except Exception as e:
            return jsonify({"error_msg": str(e)}), HTTP_STATUS.INTERNAL_SERVER_ERROR

    def delete_department(self, department_name):
        try:
            dao = DepartmentsDAO()

            if not dao.get_department_by_name(department_name):
                return (
                    jsonify({"error_msg": "Department not found"}),
                    HTTP_STATUS.NOT_FOUND,
                )

            success = dao.delete_department(department_name)

            if not success:
                return (
                    jsonify({"error_msg": "Department not deleted"}),
                    HTTP_STATUS.INTERNAL_SERVER_ERROR,
                )

            return "", HTTP_STATUS.NO_CONTENT
        except Exception as e:
            return jsonify({"error_msg": str(e)}), HTTP_STATUS.INTERNAL_SERVER_ERROR

    def get_department_admin(self, department_name):
        try:
            dao = DepartmentsDAO()
            department = dao.get_department_with_admin_info(department_name)

            if not department:
                return (
                    jsonify({"error_msg": "Department not found"}),
                    HTTP_STATUS.NOT_FOUND,
                )

            if not department[1]:  # admin_id is None
                return (
                    jsonify(
                        {
                            "message": "No admin assigned to this department",
                            "admin_assigned": False,
                        }
                    ),
                    HTTP_STATUS.OK,
                )

            department_dict = self.map_to_dict_with_admin_info(department)
            department_dict["admin_assigned"] = True
            return jsonify(department_dict), HTTP_STATUS.OK
        except Exception as e:
            return jsonify({"error_msg": str(e)}), HTTP_STATUS.INTERNAL_SERVER_ERROR

    def assign_department_admin(self, department_name, data):
        try:
            dao = DepartmentsDAO()

            if not data:
                return jsonify({"error_msg": "Missing data"}), HTTP_STATUS.BAD_REQUEST

            if not dao.get_department_by_name(department_name):
                return (
                    jsonify({"error_msg": "Department not found"}),
                    HTTP_STATUS.NOT_FOUND,
                )

            try:
                admin_id = data["admin_id"]
            except KeyError:
                return (
                    jsonify({"error_msg": "Missing admin_id"}),
                    HTTP_STATUS.BAD_REQUEST,
                )

            # Validate that the admin exists (you might want to add this check)
            # if not dao.admin_exists(admin_id):
            #     return jsonify({"error_msg": "Administrator not found"}), HTTP_STATUS.NOT_FOUND

            assigned_department = dao.update_department(department_name, admin_id)

            if not assigned_department:
                return (
                    jsonify({"error_msg": "Failed to assign admin to department"}),
                    HTTP_STATUS.INTERNAL_SERVER_ERROR,
                )

            assigned_department_dict = self.map_to_dict(assigned_department)
            return jsonify(assigned_department_dict), HTTP_STATUS.OK
        except Exception as e:
            return jsonify({"error_msg": str(e)}), HTTP_STATUS.INTERNAL_SERVER_ERROR

    def remove_department_admin(self, department_name):
        try:
            dao = DepartmentsDAO()

            if not dao.get_department_by_name(department_name):
                return (
                    jsonify({"error_msg": "Department not found"}),
                    HTTP_STATUS.NOT_FOUND,
                )

            # Set admin_id to NULL
            updated_department = dao.update_department(department_name, None)

            if not updated_department:
                return (
                    jsonify({"error_msg": "Failed to remove admin from department"}),
                    HTTP_STATUS.INTERNAL_SERVER_ERROR,
                )

            updated_department_dict = self.map_to_dict(updated_department)
            return jsonify(updated_department_dict), HTTP_STATUS.OK
        except Exception as e:
            return jsonify({"error_msg": str(e)}), HTTP_STATUS.INTERNAL_SERVER_ERROR

    def create_department(self, data):
        try:
            if not data:
                return jsonify({"error_msg": "Missing data"}), HTTP_STATUS.BAD_REQUEST

            try:
                department_name = data["department"]
            except KeyError:
                return (
                    jsonify({"error_msg": "Missing department name"}),
                    HTTP_STATUS.BAD_REQUEST,
                )

            # Validate department name
            dao = DepartmentsDAO()
            if not dao.validate_department_name(department_name):
                valid_departments = ["DTOP", "LUMA", "AAA", "DDS"]
                return (
                    jsonify(
                        {
                            "error_msg": f"Invalid department name. Must be one of: {valid_departments}"
                        }
                    ),
                    HTTP_STATUS.BAD_REQUEST,
                )

            # Check if department already exists
            if dao.get_department_by_name(department_name):
                return (
                    jsonify({"error_msg": "Department already exists"}),
                    HTTP_STATUS.CONFLICT,
                )

            admin_id = data.get("admin_id")

            created_department = dao.create_department(department_name, admin_id)

            if not created_department:
                return (
                    jsonify({"error_msg": "Failed to create department"}),
                    HTTP_STATUS.INTERNAL_SERVER_ERROR,
                )

            created_department_dict = self.map_to_dict(created_department)
            return jsonify(created_department_dict), HTTP_STATUS.CREATED
        except Exception as e:
            return jsonify({"error_msg": str(e)}), HTTP_STATUS.INTERNAL_SERVER_ERROR

    def get_departments_with_admin_info(self):
        """Get all departments with detailed admin information"""
        try:
            dao = DepartmentsDAO()
            departments = dao.get_all_departments_with_admin_info()
            departments_dict_list = [
                self.map_to_dict_with_admin_info(dept) for dept in departments
            ]
            return jsonify(departments_dict_list), HTTP_STATUS.OK
        except Exception as e:
            return jsonify({"error_msg": str(e)}), HTTP_STATUS.INTERNAL_SERVER_ERROR

    def get_departments_by_admin(self, admin_id):
        """Get all departments assigned to a specific admin"""
        try:
            if not admin_id:
                return (
                    jsonify({"error_msg": "Missing admin_id"}),
                    HTTP_STATUS.BAD_REQUEST,
                )

            dao = DepartmentsDAO()
            departments = dao.get_departments_by_admin(admin_id)
            departments_dict_list = [
                self.map_to_dict_with_admin_info(dept) for dept in departments
            ]

            return (
                jsonify(
                    {
                        "admin_id": admin_id,
                        "departments": departments_dict_list,
                        "count": len(departments_dict_list),
                    }
                ),
                HTTP_STATUS.OK,
            )
        except Exception as e:
            return jsonify({"error_msg": str(e)}), HTTP_STATUS.INTERNAL_SERVER_ERROR

    def get_available_departments(self):
        """Get departments that don't have an admin assigned"""
        try:
            dao = DepartmentsDAO()
            departments = dao.get_available_departments()
            departments_dict_list = [self.map_to_dict(dept) for dept in departments]
            return jsonify(departments_dict_list), HTTP_STATUS.OK
        except Exception as e:
            return jsonify({"error_msg": str(e)}), HTTP_STATUS.INTERNAL_SERVER_ERROR

    def get_department_stats(self, department_name):
        """Get statistics for a specific department"""
        try:
            dao = DepartmentsDAO()

            if not dao.get_department_by_name(department_name):
                return (
                    jsonify({"error_msg": "Department not found"}),
                    HTTP_STATUS.NOT_FOUND,
                )

            stats = dao.get_department_stats(department_name)

            if not stats:
                return (
                    jsonify({"error_msg": "Failed to get department statistics"}),
                    HTTP_STATUS.INTERNAL_SERVER_ERROR,
                )

            stats_dict = {
                "department": stats[0],
                "total_reports": stats[1],
                "open_reports": stats[2],
                "in_progress_reports": stats[3],
                "resolved_reports": stats[4],
                "denied_reports": stats[5],
                "avg_rating": float(stats[6]) if stats[6] else 0,
                "unique_reporters": stats[7],
            }

            return jsonify(stats_dict), HTTP_STATUS.OK
        except Exception as e:
            return jsonify({"error_msg": str(e)}), HTTP_STATUS.INTERNAL_SERVER_ERROR

    def get_all_departments_stats(self):
        """Get statistics for all departments"""
        try:
            dao = DepartmentsDAO()
            departments_stats = dao.get_all_departments_stats()
            departments_dict_list = [
                self.map_to_dict_with_stats(dept) for dept in departments_stats
            ]
            return jsonify(departments_dict_list), HTTP_STATUS.OK
        except Exception as e:
            return jsonify({"error_msg": str(e)}), HTTP_STATUS.INTERNAL_SERVER_ERROR

    def check_admin_assignment(self, admin_id, department_name):
        """Check if an admin is assigned to a specific department"""
        try:
            if not admin_id or not department_name:
                return (
                    jsonify({"error_msg": "Missing admin_id or department_name"}),
                    HTTP_STATUS.BAD_REQUEST,
                )

            dao = DepartmentsDAO()
            is_assigned = dao.is_admin_assigned_to_department(admin_id, department_name)

            return (
                jsonify(
                    {
                        "admin_id": admin_id,
                        "department": department_name,
                        "is_assigned": is_assigned,
                    }
                ),
                HTTP_STATUS.OK,
            )
        except Exception as e:
            return jsonify({"error_msg": str(e)}), HTTP_STATUS.INTERNAL_SERVER_ERROR
