// 3-a. Metrics API Endpoint
router.get('/admin/metrics', 
  auth.requireRole('admin'),
  audit('DASHBOARD_ACCESS'),
  rateLimit('admin:metrics'),
  async (req, res) => {
    const metrics = await Promise.all([
      prometheus.query('http_requests_total'),
      database.getCollectionStats(),
      authService.getActiveSessions(),
      anomalyDetector.getRecentAlerts()
    ]);
    
    res.json({
      throughput: metrics[0].data,
      database: metrics[1],
      sessions: metrics[2],
      alerts: metrics[3]
    });
  }
);

// 3-b. React Visualization Component
function MetricsDashboard() {
  const [metrics, setMetrics] = useState(null);
  
  useSecureFetch('/admin/metrics', setMetrics);

  return (
    <div className="grid">
      <LatencyHeatmap data={metrics?.throughput} />
      <DatabaseHealth metrics={metrics?.database} />
      <AlertTimeline alerts={metrics?.alerts} />
      <SessionMap sessions={metrics?.sessions} />
    </div>
  );
}