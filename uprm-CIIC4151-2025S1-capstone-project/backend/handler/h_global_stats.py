from flask import Blueprint, jsonify
from dao.d_global_stats import GlobalStatsDAO
bp = Blueprint("global_stats", __name__)

@bp.get("/stats/summary")
def summary():
    dao = GlobalStatsDAO()
    return jsonify({
      "avg_resolution_days": dao.avg_resolution_days(),
      "top_departments_resolved": dao.top_departments_resolved(5),
      "top_users_reports": dao.top_users_reports(5),
      "top_admins_validated": dao.top_admins_validated(5),
      "top_admins_resolved": dao.top_admins_resolved(5),
    })
