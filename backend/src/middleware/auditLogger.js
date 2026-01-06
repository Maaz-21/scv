const AuditLog = require("../models/AuditLog");
/**
Logs important actions into the AuditLog collection.*
actorId   - user performing action
action    - WHAT happened (APPROVED_LISTING, REJECTED_ORDER, etc)
entity    - WHICH type (Listing, Order, User, etc)
entityId  - ID of that entity
notes     - optional extra info*/
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