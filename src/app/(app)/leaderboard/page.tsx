import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Card,
  CardContent,
  CardDescription,
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
import { leaderboardData } from '@/lib/mock-data';
import { Trophy } from 'lucide-react';

export default function LeaderboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold font-headline">Driver Leaderboard</h1>
        <p className="text-muted-foreground">
          Ranking drivers by their commitment to green logistics.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Top Eco-Drivers</CardTitle>
          <CardDescription>
            These drivers are leading the charge in reducing our carbon footprint.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px]">Rank</TableHead>
                <TableHead>Driver</TableHead>
                <TableHead className="text-right">EcoScore</TableHead>
                <TableHead className="text-right">CO₂ Saved (kg)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {leaderboardData.map((entry) => (
                <TableRow key={entry.rank}>
                  <TableCell className="font-bold text-lg text-muted-foreground">
                    <div className="flex items-center justify-center h-10 w-10 rounded-full bg-muted">
                        {entry.rank === 1 ? <Trophy className="text-yellow-500"/> : entry.rank}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={entry.avatarUrl} alt={entry.driver} data-ai-hint="person portrait" />
                        <AvatarFallback>
                          {entry.driver.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{entry.driver}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-medium text-primary">
                    {entry.ecoScore}
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {entry.co2Saved}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
