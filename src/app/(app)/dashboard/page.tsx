import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Leaf, Fuel, TrendingUp, Trophy } from 'lucide-react';
import { shipmentsData } from '@/lib/mock-data';

const ecoMetrics = [
  {
    title: 'EcoScore',
    value: '98',
    icon: Leaf,
    description: 'Top 5% of drivers',
  },
  {
    title: 'CO₂ Saved',
    value: '120.5 kg',
    icon: TrendingUp,
    description: 'This month',
  },
  {
    title: 'Fuel Saved',
    value: '45.2 L',
    icon: Fuel,
    description: 'This month',
  },
  {
    title: 'Leaderboard Rank',
    value: '#1',
    icon: Trophy,
    description: 'Overall ranking',
  },
];

const getStatusVariant = (status: string) => {
  switch (status) {
    case 'In Transit':
      return 'default';
    case 'Delivered':
      return 'secondary';
    case 'Delayed':
      return 'destructive';
    case 'Pending':
      return 'outline';
    default:
      return 'default';
  }
};

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold font-headline">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back! Here&apos;s your green logistics overview.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {ecoMetrics.map((metric) => (
          <Card key={metric.title} className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {metric.title}
              </CardTitle>
              <metric.icon className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metric.value}</div>
              <p className="text-xs text-muted-foreground">
                {metric.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Shipments</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Shipment ID</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Origin</TableHead>
                <TableHead>Destination</TableHead>
                <TableHead>ETA</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {shipmentsData.map((shipment) => (
                <TableRow key={shipment.id}>
                  <TableCell className="font-medium">{shipment.id}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusVariant(shipment.status) as any}>
                      {shipment.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{shipment.origin}</TableCell>
                  <TableCell>{shipment.destination}</TableCell>
                  <TableCell>{shipment.eta}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
