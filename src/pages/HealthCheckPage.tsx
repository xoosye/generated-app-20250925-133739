import React, { useEffect, useState } from 'react';
import { Layout } from '@/components/Layout';
import { api } from '@/lib/api-client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { CheckCircle2, XCircle, AlertTriangle, Database, Power } from 'lucide-react';
interface HealthStatus {
  databaseUrlConfigured: boolean;
  databaseConnected: boolean;
  timestamp: string;
}
const StatusIndicator = ({ status, text }: { status: 'loading' | 'success' | 'error', text: string }) => (
  <div className="flex items-center space-x-4">
    {status === 'loading' && <Skeleton className="h-8 w-8 rounded-full bg-muted/50" />}
    {status === 'success' && <CheckCircle2 className="h-8 w-8 text-cyan-400" />}
    {status === 'error' && <XCircle className="h-8 w-8 text-magenta" />}
    <p className="text-xl text-gray-300">{text}</p>
  </div>
);
export function HealthCheckPage() {
  const [status, setStatus] = useState<HealthStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    const checkHealth = async () => {
      try {
        setLoading(true);
        const data = await api<HealthStatus>('/api/health-check');
        setStatus(data);
      } catch (err) {
        setError('Failed to connect to the health check endpoint. The backend might be offline.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    checkHealth();
  }, []);
  const isHealthy = status?.databaseUrlConfigured && status.databaseConnected;
  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-8">
        <header>
          <h1 className="text-6xl font-bold text-cyan-400 tracking-wider">System Health</h1>
          <p className="text-xl text-gray-400 mt-2">Diagnostic panel for EchoWave services.</p>
        </header>
        <Card className="bg-black/30 border-2 border-cyan-400/30">
          <CardHeader>
            <CardTitle className="text-3xl text-cyan-400 flex items-center gap-3">
              <Power /> Backend Status
            </CardTitle>
            <CardDescription className="text-gray-400 text-lg">
              Verifying connectivity to critical backend services.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {error ? (
              <div className="text-center text-magenta text-2xl p-8 border-2 border-magenta rounded-md">{error}</div>
            ) : (
              <>
                <div className="p-6 bg-black/50 rounded-md border border-cyan-400/20 space-y-4">
                  <div className="flex items-center gap-3">
                    <Database className="h-6 w-6 text-yellow-300" />
                    <h3 className="text-2xl font-semibold text-yellow-300">Database</h3>
                  </div>
                  <StatusIndicator
                    status={loading ? 'loading' : status?.databaseUrlConfigured ? 'success' : 'error'}
                    text="DATABASE_URL secret configured"
                  />
                  <StatusIndicator
                    status={loading ? 'loading' : status?.databaseConnected ? 'success' : 'error'}
                    text="Database connection successful"
                  />
                </div>
                {!loading && (
                  isHealthy ? (
                    <div className="p-6 border-2 border-cyan-400 rounded-md flex items-center gap-4 bg-cyan-400/10">
                      <CheckCircle2 className="h-10 w-10 text-cyan-400" />
                      <div>
                        <h3 className="text-2xl font-bold text-cyan-400">All Systems Operational</h3>
                        <p className="text-gray-300">The application is correctly configured and connected to the database.</p>
                      </div>
                    </div>
                  ) : (
                    <div className="p-6 border-2 border-magenta rounded-md flex items-center gap-4 bg-magenta/10">
                      <AlertTriangle className="h-10 w-10 text-magenta" />
                      <div>
                        <h3 className="text-2xl font-bold text-magenta">Action Required</h3>
                        <p className="text-gray-300">
                          The application is not correctly configured. Please ensure the `DATABASE_URL` secret is set in your Cloudflare Worker deployment settings.
                        </p>
                      </div>
                    </div>
                  )
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}