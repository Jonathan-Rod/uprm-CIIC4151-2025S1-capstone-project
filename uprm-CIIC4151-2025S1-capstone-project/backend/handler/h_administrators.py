from flask import request, jsonify
from dao.d_administrators import AdministratorsDAO
from constants import HTTP_STATUS


class AdministratorsHandler:

    def map_to_dict(self, administrator):
        return {
            "id": administrator[0],
            "department": administrator[1],
        }

    def getAllAdministrators(self):
        dao = AdministratorsDAO()
        administrators = dao.getAllAdministrators()
        administrators_dict_list = [self.map_to_dict(admin) for admin in administrators]
        return jsonify(administrators_dict_list), HTTP_STATUS.OK

    def getAdministratorById(self, administrator_id):
        dao = AdministratorsDAO()
        administrator = dao.getAdministratorById(administrator_id)

        if not administrator:
            return jsonify({"error_msg": "Administrator not found"}), HTTP_STATUS.NOT_FOUND

        administrator_dict = self.map_to_dict(administrator)
        return jsonify(administrator_dict), HTTP_STATUS.OK

    def insertAdministrator(self):
        data = request.get_json()

        if not data:
            return jsonify({"error_msg": "Data not found"}), HTTP_STATUS.BAD_REQUEST

        try:
            user_id = data["id"]
            department = data["department"]
        except KeyError as e:
            return jsonify({"error_msg": f"Missing field: {str(e)}"}), HTTP_STATUS.BAD_REQUEST

        dao = AdministratorsDAO()
        inserted_administrator = dao.insertAdministrator(user_id, department)

        if not inserted_administrator:
            return jsonify({"error_msg": "Administrator not inserted"}), HTTP_STATUS.INTERNAL_SERVER_ERROR

        inserted_administrator_dict = self.map_to_dict(inserted_administrator)
        return jsonify(inserted_administrator_dict), HTTP_STATUS.CREATED

    def updateAdministrator(self, administrator_id):
        dao = AdministratorsDAO()
        data = request.get_json()

        if not data:
            return jsonify({"error_msg": "Data not found"}), HTTP_STATUS.BAD_REQUEST

        if not dao.getAdministratorById(administrator_id):
            return jsonify({"error_msg": "Administrator not found"}), HTTP_STATUS.NOT_FOUND

        department = data.get("department")

        if department is None:
            return jsonify({"error_msg": "Missing department"}), HTTP_STATUS.BAD_REQUEST

        updated_administrator = dao.updateAdministrator(administrator_id, department)

        if not updated_administrator:
            return jsonify({"error_msg": "Administrator not updated"}), HTTP_STATUS.INTERNAL_SERVER_ERROR

        updated_administrator_dict = self.map_to_dict(updated_administrator)
        return jsonify(updated_administrator_dict), HTTP_STATUS.OK

    def deleteAdministrator(self, administrator_id):
        dao = AdministratorsDAO()

        if not dao.getAdministratorById(administrator_id):
            return jsonify({"error_msg": "Administrator not found"}), HTTP_STATUS.NOT_FOUND

        deleted_administrator = dao.deleteAdministrator(administrator_id)

        if not deleted_administrator:
            return jsonify({"error_msg": "Administrator not deleted"}), HTTP_STATUS.INTERNAL_SERVER_ERROR

        return "", HTTP_STATUS.NO_CONTENT
