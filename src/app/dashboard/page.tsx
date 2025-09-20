import StatsCards from '@/components/dashboard/stats-cards';
import ThreatLogPriorityChart from '@/components/dashboard/threat-log-priority-chart';
import ThreatLogTable from '@/components/threat-log/threat-log-table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getIncidents, getThreatLogs } from '@/lib/actions';
import { Incident, ThreatLog } from '@/lib/definitions';

async function getDashboardData() {
  const incidents: Incident[] = await getIncidents();
  const threatLogs: ThreatLog[] = await getThreatLogs();
  return { incidents, threatLogs };
}

export default async function DashboardPage() {
  const { incidents, threatLogs } = await getDashboardData();

  // Ordenar logs y obtener los 5 más recientes
  const recentThreatLogs = [...threatLogs]
    .sort((a, b) => new Date(b.fecha_incidente).getTime() - new Date(a.fecha_incidente).getTime())
    .slice(0, 5);

  // Calcular el total de amenazas para el mes actual para la tarjeta de estadísticas
  const today = new Date();
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const threatsThisMonth = threatLogs.filter(log => new Date(log.fecha_incidente) >= startOfMonth).length;


  return (
    <div className="grid gap-6">
        <StatsCards 
            incidents={incidents} 
            threatLogs={threatLogs} 
            totalThreats={threatsThisMonth} 
        />

        <div className="grid lg:grid-cols-2 gap-6">
            <ThreatLogPriorityChart threatLogs={threatLogs} />
            {/* Aquí puedes añadir otro gráfico o componente */}
        </div>

        <Card>
            <CardHeader>
                <CardTitle>Registros de Amenazas Recientes</CardTitle>
            </CardHeader>
            <CardContent>
                <ThreatLogTable threatLogs={recentThreatLogs} />
            </CardContent>
        </Card>

    </div>
  );
}
