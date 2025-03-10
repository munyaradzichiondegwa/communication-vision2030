// frontend/components/SecurityDashboard.jsx
import { useAuth } from '../context/AuthContext';
import { useApi } from '../hooks/useApi';

const SecurityDashboard = () => {
  const { user } = useAuth();
  const { data: metrics } = useApi('/admin/metrics');
  const { data: alerts } = useApi('/admin/alerts');

  return (
    <SecureLayout roles={['admin']}>
      <div className="grid grid-cols-4 gap-4">
        <MetricCard 
          title="Active Users" 
          value={metrics?.activeUsers}
          trend={metrics?.userGrowth}
        />
        <AlertFeed items={alerts} />
        <TrafficMap data={metrics?.geoDistribution} />
        <AuditLogPreview logs={metrics?.recentLogs} />
      </div>
    </SecureLayout>
  );
};

// Backend API endpoints
router.get('/admin/metrics', 
  auth.requireRole('admin'),
  auditMiddleware('ADMIN_ACCESS'),
  async (req, res) => {
    const metrics = await MonitoringService.getClusterMetrics();
    res.json({
      activeUsers: await User.getActiveCount(),
      recentLogs: await AuditLog.find().limit(10),
      geoDistribution: await getGeoDistribution(),
      ...metrics
    });
  });