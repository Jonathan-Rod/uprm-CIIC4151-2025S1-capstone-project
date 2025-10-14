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
        administrators = AdministratorsDAO().getAllAdministrators()
        administrators_dict_list = [self.map_to_dict(administrator) for administrator in administrators]
        return jsonify(administrators_dict_list), HTTP_STATUS.OK

    def getAdministratorById(self, administrator_id):
        administrator = AdministratorsDAO().getAdministratorById(administrator_id)

        if not administrator:
            error_msg = {"error_msg": "Administrator not found"}
            return jsonify(error_msg), HTTP_STATUS.NOT_FOUND

        administrator_dict = self.map_to_dict(administrator)
        return jsonify(administrator_dict), HTTP_STATUS.OK

    def insertAdministrator(self, data):
        data = request.get_json()

        if not data:
            error_msg = {"error_msg": "Data not found"}
            return jsonify(error_msg), HTTP_STATUS.BAD_REQUEST

        try:
            department = data["department"]
        except KeyError as e:
            error_msg = {"error_msg": f"Missing field: {str(e)}"}
            return jsonify(error_msg), HTTP_STATUS.BAD_REQUEST

        inserted_administrator = AdministratorsDAO().insertAdministrator(
            department
        )
        if not inserted_administrator:
            error_msg = {"error_msg": "Administrator not inserted"}
            return jsonify(error_msg), HTTP_STATUS.INTERNAL_SERVER_ERROR

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
            error_msg = {"error_msg": "Administrator not found"}
            return jsonify(error_msg), HTTP_STATUS.NOT_FOUND

        deleted_administrator = dao.deleteAdministrator(administrator_id)

        if not deleted_administrator:
            error_msg = {"error_msg": "Administrator not deleted"}
            return jsonify(error_msg), HTTP_STATUS.INTERNAL_SERVER_ERROR

        return "", HTTP_STATUS.NO_CONTENT

