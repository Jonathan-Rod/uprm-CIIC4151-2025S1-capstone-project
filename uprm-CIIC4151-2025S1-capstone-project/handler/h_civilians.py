from flask import request, jsonify
from dao.d_civilians import CiviliansDAO
from constants import HTTP_STATUS


class CiviliansHandler:

    def map_to_dict(self, civilian):
        return {
            "id": civilian[0],
            "suspended": civilian[1],
        }

    def getAllCivilians(self):
        civilians = CiviliansDAO().getAllCivilians()
        civilians_dict_list = [self.map_to_dict(civilian) for civilian in civilians]
        return jsonify(civilians_dict_list), HTTP_STATUS.OK

    def getCivilianById(self, civilian_id):
        civilian = CiviliansDAO().getCivilianById(civilian_id)

        if not civilian:
            error_msg = {"error_msg": "Civilian not found"}
            return jsonify(error_msg), HTTP_STATUS.NOT_FOUND

        civilian_dict = self.map_to_dict(civilian)
        return jsonify(civilian_dict), HTTP_STATUS.OK

    def insertCivilian(self, data):
        data = request.get_json()

        if not data:
            error_msg = {"error_msg": "Data not found"}
            return jsonify(error_msg), HTTP_STATUS.BAD_REQUEST

        try:
            suspended = data["suspended"]

        except KeyError as e:
            error_msg = {"error_msg": f"Missing field: {str(e)}"}
            return jsonify(error_msg), HTTP_STATUS.BAD_REQUEST

        inserted_civilian = CiviliansDAO().insertCivilian(
            suspended
        )
        if not inserted_civilian:
            error_msg = {"error_msg": "Civilian not inserted"}
            return jsonify(error_msg), HTTP_STATUS.INTERNAL_SERVER_ERROR

        inserted_civilian_dict = self.map_to_dict(inserted_civilian)
        return jsonify(inserted_civilian_dict), HTTP_STATUS.CREATED

    def updateCivilian(self, civilian_id):
        dao = CiviliansDAO()
        data = request.get_json()

        if not data:
            return jsonify({"error_msg": "Data not found"}), HTTP_STATUS.BAD_REQUEST

        if not dao.getCivilianById(civilian_id):
            return jsonify({"error_msg": "Civilian not found"}), HTTP_STATUS.NOT_FOUND

        suspended = data.get("suspended")

        if suspended is None:
            return jsonify({"error_msg": "Missing suspended status"}), HTTP_STATUS.BAD_REQUEST

        updated_civilian = dao.updateCivilian(civilian_id, suspended)

        if not updated_civilian:
            return jsonify({"error_msg": "Civilian not updated"}), HTTP_STATUS.INTERNAL_SERVER_ERROR

        updated_civilian_dict = self.map_to_dict(updated_civilian)
        return jsonify(updated_civilian_dict), HTTP_STATUS.OK


    def deleteCivilian(self, civilian_id):
        dao = CiviliansDAO()

        if not dao.getCivilianById(civilian_id):
            error_msg = {"error_msg": "Civilian not found"}
            return jsonify(error_msg), HTTP_STATUS.NOT_FOUND

        deleted_civilian = dao.deleteCivilian(civilian_id)

        if not deleted_civilian:
            error_msg = {"error_msg": "Civilian not deleted"}
            return jsonify(error_msg), HTTP_STATUS.INTERNAL_SERVER_ERROR

        return "", HTTP_STATUS.NO_CONTENT

