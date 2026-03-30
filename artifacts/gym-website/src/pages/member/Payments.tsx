import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, Button } from "@/components/ui/LuxuryComponents";
import { useGetPaymentSchedule } from "@workspace/api-client-react";
import { getAuthHeaders } from "@/lib/auth-utils";
import { format } from "date-fns";
import { CreditCard, CheckCircle2, AlertCircle, Clock } from "lucide-react";

export default function Payments() {
  const { data: payments, isLoading } = useGetPaymentSchedule({ request: getAuthHeaders() });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-green-500/10 text-green-500 border border-green-500/20 uppercase"><CheckCircle2 className="w-3.5 h-3.5" /> Paid</span>;
      case 'pending':
        return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-primary/10 text-primary border border-primary/20 uppercase"><Clock className="w-3.5 h-3.5" /> Pending</span>;
      case 'overdue':
        return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-destructive/10 text-destructive border border-destructive/20 uppercase"><AlertCircle className="w-3.5 h-3.5" /> Overdue</span>;
      default:
        return null;
    }
  };

  return (
    <DashboardLayout requiredRole="member">
      <div className="mb-8">
        <h1 className="text-3xl font-display font-black uppercase">Payment Schedule</h1>
        <p className="text-muted-foreground mt-1">Manage your membership billing.</p>
      </div>

      <Card className="overflow-hidden">
        <div className="p-6 border-b border-border flex items-center justify-between">
          <h3 className="text-xl font-display font-bold uppercase">Billing History & Upcoming</h3>
          <Button variant="outline" size="sm" className="gap-2">
            <CreditCard className="w-4 h-4" /> Update Method
          </Button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-secondary/50">
              <tr className="border-b border-border text-muted-foreground uppercase tracking-wider text-xs">
                <th className="py-4 px-6">Description</th>
                <th className="py-4 px-6">Due Date</th>
                <th className="py-4 px-6">Amount</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading ? (
                <tr><td colSpan={5} className="py-8 text-center">Loading...</td></tr>
              ) : payments?.length === 0 ? (
                <tr><td colSpan={5} className="py-8 text-center text-muted-foreground">No payments found</td></tr>
              ) : (
                payments?.map((payment) => (
                  <tr key={payment.id} className="hover:bg-secondary/20 transition-colors">
                    <td className="py-4 px-6">
                      <p className="font-bold text-foreground">{payment.description || 'Membership Fee'}</p>
                      <p className="text-xs text-muted-foreground">{payment.planName}</p>
                    </td>
                    <td className="py-4 px-6 font-medium">
                      {format(new Date(payment.dueDate), 'MMM d, yyyy')}
                    </td>
                    <td className="py-4 px-6 font-display font-bold text-lg">
                      ${payment.amount.toFixed(2)}
                    </td>
                    <td className="py-4 px-6">
                      {getStatusBadge(payment.status)}
                    </td>
                    <td className="py-4 px-6 text-right">
                      {payment.status !== 'paid' ? (
                        <Button size="sm">Pay Now</Button>
                      ) : (
                        <span className="text-xs text-muted-foreground">Paid on {payment.paidDate ? format(new Date(payment.paidDate), 'MMM d') : '-'}</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </DashboardLayout>
  );
}
