const AuditLog = require("../models/AuditLog");

/**
 
Logs important actions into the AuditLog collection.*
@param {String} actorId   - user performing action
@param {String} action    - WHAT happened (APPROVED_LISTING, REJECTED_ORDER, etc)
@param {String} entity    - WHICH type (Listing, Order, User, etc)
@param {String} entityId  - ID of that entity
@param {String} notes     - optional extra info*/
module.exports = async function auditLogger(
  actorId,
  action,
  entity,
  entityId,
  notes = ""
) {
  try {
    await AuditLog.create({
      actorId,
      action,
      entity,
      entityId,
      notes,
      timestamp: new Date()
    });
  } catch (err) {
    // Do NOT crash app for logging failures — just print
    console.error("Audit log failed:", err.message);
  }
};