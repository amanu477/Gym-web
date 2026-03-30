import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useGetTrainerStats, useGetTrainerMembers } from "@workspace/api-client-react";
import { getAuthHeaders } from "@/lib/auth-utils";
import { Card } from "@/components/ui/LuxuryComponents";
import { Users, FileText, Dumbbell, Star } from "lucide-react";
import { Link } from "wouter";

export default function TrainerDashboard() {
  const { data: stats, isLoading } = useGetTrainerStats({ request: getAuthHeaders() });
  const { data: members } = useGetTrainerMembers({ request: getAuthHeaders() });

  return (
    <DashboardLayout requiredRole="trainer">
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground">
            Welcome back, {stats?.trainerName || "Trainer"}
          </h1>
          <p className="text-muted-foreground mt-1">{stats?.specialty}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            { icon: Users, label: "Assigned Members", value: isLoading ? "—" : String(stats?.assignedMembers ?? 0), color: "text-blue-600 bg-blue-50" },
            { icon: FileText, label: "Blog Posts", value: isLoading ? "—" : String(stats?.totalBlogPosts ?? 0), color: "text-emerald-600 bg-emerald-50" },
            { icon: Dumbbell, label: "Specialty", value: stats?.specialty ?? "—", color: "text-purple-600 bg-purple-50" },
            { icon: Star, label: "Role", value: "Certified Trainer", color: "text-amber-600 bg-amber-50" },
          ].map((item) => (
            <Card key={item.label} className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{item.label}</p>
                  <p className="text-2xl font-display font-bold mt-1 text-foreground">{item.value}</p>
                </div>
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${item.color}`}>
                  <item.icon className="w-5 h-5" />
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-display font-bold text-lg">My Members</h3>
              <Link href="/trainer-dashboard/members" className="text-sm text-primary hover:underline">View all</Link>
            </div>
            {members && members.length > 0 ? (
              <ul className="space-y-3">
                {members.slice(0, 5).map((m) => (
                  <li key={m.id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-secondary transition-colors">
                    <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary text-sm">
                      {m.firstName[0]}{m.lastName[0]}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{m.firstName} {m.lastName}</p>
                      <p className="text-xs text-muted-foreground">{m.email}</p>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground text-sm py-4 text-center">No members assigned yet.</p>
            )}
          </Card>

          <Card className="p-6">
            <h3 className="font-display font-bold text-lg mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <Link href="/trainer-dashboard/members">
                <div className="flex items-center gap-3 p-4 border border-border rounded-lg hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer group">
                  <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
                    <Users className="w-5 h-5 text-blue-600 group-hover:text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">View My Members</p>
                    <p className="text-xs text-muted-foreground">See all your assigned clients</p>
                  </div>
                </div>
              </Link>
              <Link href="/trainer-dashboard/blog">
                <div className="flex items-center gap-3 p-4 border border-border rounded-lg hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer group">
                  <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
                    <FileText className="w-5 h-5 text-emerald-600 group-hover:text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">Write a Blog Post</p>
                    <p className="text-xs text-muted-foreground">Share training tips with the community</p>
                  </div>
                </div>
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
