import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card } from "@/components/ui/LuxuryComponents";
import { useGetAdminStats } from "@workspace/api-client-react";
import { getAuthHeaders } from "@/lib/auth-utils";
import { Users, DollarSign, Dumbbell, MessageSquare, AlertCircle, FileText } from "lucide-react";

export default function AdminDashboard() {
  const { data: stats, isLoading } = useGetAdminStats({ request: getAuthHeaders() });

  if (isLoading) return <DashboardLayout requiredRole="admin"><div className="p-8">Loading stats...</div></DashboardLayout>;

  return (
    <DashboardLayout requiredRole="admin">
      <div className="mb-8">
        <h1 className="text-3xl font-display font-black uppercase">Command Center</h1>
        <p className="text-muted-foreground mt-1">Gym overview and statistics.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="p-6 border-l-4 border-l-primary">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-sm text-muted-foreground">Total Members</h3>
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
              <Users className="w-5 h-5 text-primary" />
            </div>
          </div>
          <p className="text-4xl font-display font-black text-foreground">{stats?.totalMembers || 0}</p>
          <p className="text-xs text-green-500 mt-2">+{stats?.newMembersThisMonth || 0} this month</p>
        </Card>

        <Card className="p-6 border-l-4 border-l-green-500">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-sm text-muted-foreground">Monthly Revenue</h3>
            <div className="w-10 h-10 bg-green-500/10 rounded-full flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-green-500" />
            </div>
          </div>
          <p className="text-4xl font-display font-black text-foreground">${stats?.totalRevenue?.toLocaleString() || 0}</p>
          <p className="text-xs text-muted-foreground mt-2">Current billing cycle</p>
        </Card>

        <Card className="p-6 border-l-4 border-l-destructive">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-sm text-muted-foreground">Pending Payments</h3>
            <div className="w-10 h-10 bg-destructive/10 rounded-full flex items-center justify-center">
              <AlertCircle className="w-5 h-5 text-destructive" />
            </div>
          </div>
          <p className="text-4xl font-display font-black text-foreground">{stats?.pendingPayments || 0}</p>
          <p className="text-xs text-muted-foreground mt-2">Requires attention</p>
        </Card>

        <Card className="p-6 border-l-4 border-l-blue-500">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-sm text-muted-foreground">Unread Messages</h3>
            <div className="w-10 h-10 bg-blue-500/10 rounded-full flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-blue-500" />
            </div>
          </div>
          <p className="text-4xl font-display font-black text-foreground">{stats?.unreadMessages || 0}</p>
          <p className="text-xs text-muted-foreground mt-2">From contact form</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6 flex items-center justify-between">
          <div>
            <h3 className="text-xl font-display font-bold uppercase mb-1">Trainers</h3>
            <p className="text-muted-foreground text-sm">Active staff members</p>
          </div>
          <div className="flex items-center gap-4">
            <p className="text-3xl font-display font-black">{stats?.totalTrainers || 0}</p>
            <div className="w-12 h-12 bg-secondary rounded-lg flex items-center justify-center">
              <Dumbbell className="w-6 h-6 text-foreground" />
            </div>
          </div>
        </Card>
        
        <Card className="p-6 flex items-center justify-between">
          <div>
            <h3 className="text-xl font-display font-bold uppercase mb-1">Blog Posts</h3>
            <p className="text-muted-foreground text-sm">Published articles</p>
          </div>
          <div className="flex items-center gap-4">
            <p className="text-3xl font-display font-black">{stats?.totalBlogPosts || 0}</p>
            <div className="w-12 h-12 bg-secondary rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6 text-foreground" />
            </div>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
