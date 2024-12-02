const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema({
  action: {
    type: String,
    enum: ['create', 'update', 'delete'], // Actions to track
    required: true,
  },
  model: {
    type: String,
    enum: ['Item', 'Table'], // Models to track
    required: true,
  },
  modelId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    refPath: 'model', // Reference the model dynamically (Item or Table)
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the user who performed the action
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now, // Timestamp of the transaction
  },
});

const AuditLog = mongoose.model('AuditLog', auditLogSchema);

module.exports = AuditLog;
