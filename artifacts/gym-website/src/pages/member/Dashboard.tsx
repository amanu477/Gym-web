import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, Button } from "@/components/ui/LuxuryComponents";
import { useGetMe, useGetPerformanceEntries, useGetPaymentSchedule } from "@workspace/api-client-react";
import { getAuthHeaders } from "@/lib/auth-utils";
import { Activity, Calendar, CreditCard, Flame, MessageSquare, Target } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { format } from "date-fns";
import { Link } from "wouter";

export default function Dashboard() {
  const { data: user } = useGetMe({ request: getAuthHeaders() });
  const { data: performance } = useGetPerformanceEntries({ request: getAuthHeaders() });
  const { data: payments } = useGetPaymentSchedule({ request: getAuthHeaders() });

  const latestEntry = performance && performance.length > 0 ? performance[0] : null;
  const nextPayment = payments?.find(p => p.status === 'pending');
  const chartData = [...(performance || [])].reverse().map(entry => ({
    date: format(new Date(entry.date), 'MMM d'),
    weight: entry.weight
  })).slice(-7); // last 7 entries

  return (
    <DashboardLayout requiredRole="member">
      <div className="mb-8">
        <h1 className="text-3xl font-display font-black uppercase">Welcome Back, {user?.firstName}</h1>
        <p className="text-muted-foreground mt-1">Let's crush today's goals.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="p-6 bg-gradient-to-br from-card to-card border-border">
          <div className="flex items-center gap-4 mb-4 text-muted-foreground">
            <Activity className="w-5 h-5 text-primary" />
            <h3 className="font-semibold text-sm">Current Weight</h3>
          </div>
          <p className="text-3xl font-display font-bold text-foreground">
            {latestEntry?.weight ? `${latestEntry.weight} kg` : '--'}
          </p>
        </Card>
        
        <Card className="p-6 bg-gradient-to-br from-card to-card border-border">
          <div className="flex items-center gap-4 mb-4 text-muted-foreground">
            <Target className="w-5 h-5 text-primary" />
            <h3 className="font-semibold text-sm">Current BMI</h3>
          </div>
          <p className="text-3xl font-display font-bold text-foreground">
            {latestEntry?.bmi ? latestEntry.bmi.toFixed(1) : '--'}
          </p>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-card to-card border-border">
          <div className="flex items-center gap-4 mb-4 text-muted-foreground">
            <Flame className="w-5 h-5 text-primary" />
            <h3 className="font-semibold text-sm">Membership</h3>
          </div>
          <p className="text-xl font-display font-bold text-foreground uppercase truncate">
            {user?.planId ? `Plan #${user.planId}` : 'No Active Plan'}
          </p>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-card to-card border-border">
          <div className="flex items-center gap-4 mb-4 text-muted-foreground">
            <CreditCard className="w-5 h-5 text-primary" />
            <h3 className="font-semibold text-sm">Next Payment</h3>
          </div>
          <p className="text-2xl font-display font-bold text-foreground">
            {nextPayment ? `$${nextPayment.amount}` : '--'}
          </p>
          {nextPayment && (
            <p className="text-xs text-muted-foreground mt-1">Due {format(new Date(nextPayment.dueDate), 'MMM d, yyyy')}</p>
          )}
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-display font-bold uppercase">Weight Progress</h3>
            <Link href="/dashboard/performance">
              <Button variant="ghost" size="sm" className="text-primary">View All</Button>
            </Link>
          </div>
          
          <div className="h-[300px] w-full">
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <XAxis dataKey="date" stroke="#666" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#666" fontSize={12} tickLine={false} axisLine={false} domain={['dataMin - 2', 'dataMax + 2']} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'hsl(220,58%,9%)', borderColor: 'hsl(220,40%,18%)', borderRadius: '8px' }}
                    itemStyle={{ color: 'hsl(213,94%,62%)' }}
                  />
                  <Line type="monotone" dataKey="weight" stroke="hsl(213,94%,62%)" strokeWidth={3} dot={{ fill: 'hsl(213,94%,62%)', r: 4 }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-muted-foreground flex-col gap-4">
                <p>No performance data yet.</p>
                <Link href="/dashboard/performance">
                  <Button variant="outline" size="sm">Log Entry</Button>
                </Link>
              </div>
            )}
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-xl font-display font-bold uppercase mb-6">Quick Actions</h3>
          <div className="flex flex-col gap-4">
            <Link href="/dashboard/performance">
              <Button className="w-full justify-start gap-3" variant="secondary">
                <Activity className="w-4 h-4 text-primary" /> Log Performance
              </Button>
            </Link>
            <Link href="/dashboard/calendar">
              <Button className="w-full justify-start gap-3" variant="secondary">
                <Calendar className="w-4 h-4 text-primary" /> View Schedule
              </Button>
            </Link>
            <Link href="/dashboard/payments">
              <Button className="w-full justify-start gap-3" variant="secondary">
                <CreditCard className="w-4 h-4 text-primary" /> Make a Payment
              </Button>
            </Link>
            <Link href="/contact">
              <Button className="w-full justify-start gap-3" variant="outline">
                <MessageSquare className="w-4 h-4 text-muted-foreground" /> Contact Support
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
