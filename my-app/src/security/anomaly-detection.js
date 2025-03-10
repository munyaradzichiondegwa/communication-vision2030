// security/anomaly-detection.js
const { createAnomalyDetector } = require('anomalizer');

const securityPatterns = {
  bruteForce: {
    type: 'frequency',
    threshold: 5,
    timeframe: 300000, // 5 minutes
    eventType: 'AUTH_FAILURE'
  },
  dataExfiltration: {
    type: 'volume',
    threshold: 1048576, // 1MB
    timeframe: 60000,
    eventType: 'DATA_EXPORT'
  },
  privilegeEscalation: {
    type: 'sequence',
    pattern: ['PERMISSION_UPDATE', 'SENSITIVE_ACCESS'],
    timeframe: 3600000
  }
};

const anomalyDetector = createAnomalyDetector({
  patterns: securityPatterns,
  onAnomaly: (event) => {
    logger.securityAlert(event);
    AlertService.triggerAlert(event);
  }
});

// Integration with audit system
AuditService.on('log', (entry) => {
  if(entry.actionType === 'LOGIN' && entry.metadata.status === 'failure') {
    anomalyDetector.ingestEvent('AUTH_FAILURE', entry.userId);
  }
  
  if(entry.actionType === 'DATA_MODIFICATION') {
    anomalyDetector.ingestEvent('DATA_EXPORT', entry.userId, {
      size: entry.metadata.dataSize
    });
  }
});