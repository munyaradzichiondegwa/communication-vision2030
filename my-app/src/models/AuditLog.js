// models/AuditLog.js
const auditLogSchema = new mongoose.Schema({
  timestamp: { type: Date, default: Date.now },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  actionType: { 
    type: String, 
    enum: ['LOGIN', 'DATA_MODIFICATION', 'ACCESS', 'CONFIG_CHANGE'] 
  },
  targetEntity: String,
  targetId: mongoose.Schema.Types.ObjectId,
  ipAddress: String,
  userAgent: String,
  metadata: mongoose.Schema.Types.Mixed
});

// Audit service
class AuditService {
  static async log(event) {
    await AuditLog.create({
      userId: event.userId,
      actionType: event.actionType,
      targetEntity: event.targetEntity,
      targetId: event.targetId,
      ipAddress: event.ipAddress,
      userAgent: event.userAgent,
      metadata: event.metadata
    });
  }

  static async queryEvents(criteria) {
    return AuditLog.find(criteria)
      .sort('-timestamp')
      .populate('userId', 'email role');
  }
}

// Audit middleware
function auditMiddleware(actionType) {
  return async (req, res, next) => {
    const afterResponse = () => {
      res.removeListener('finish', afterResponse);
      AuditService.log({
        userId: req.user?.id,
        actionType,
        targetEntity: req.baseUrl,
        targetId: req.params.id,
        ipAddress: req.ip,
        userAgent: req.get('User-Agent'),
        metadata: {
          method: req.method,
          statusCode: res.statusCode,
          params: req.params,
          body: sanitize(req.body)
        }
      });
    };
    res.on('finish', afterResponse);
    next();
  };
}