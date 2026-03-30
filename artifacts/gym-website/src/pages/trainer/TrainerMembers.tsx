import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useGetTrainerMembers } from "@workspace/api-client-react";
import { getAuthHeaders } from "@/lib/auth-utils";
import { Card } from "@/components/ui/LuxuryComponents";
import { Users, Mail, Phone, Calendar } from "lucide-react";

export default function TrainerMembers() {
  const { data: members, isLoading } = useGetTrainerMembers({ request: getAuthHeaders() });

  return (
    <DashboardLayout requiredRole="trainer">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-display font-bold">My Members</h1>
          <p className="text-muted-foreground mt-1">Members assigned to you for training</p>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : members && members.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {members.map((member) => (
              <Card key={member.id} className="p-5">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary text-base shrink-0">
                    {member.firstName[0]}{member.lastName[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-foreground">{member.firstName} {member.lastName}</h3>
                    <div className="mt-2 space-y-1.5">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Mail className="w-3.5 h-3.5 shrink-0" />
                        <span className="truncate">{member.email}</span>
                      </div>
                      {member.phone && (
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Phone className="w-3.5 h-3.5 shrink-0" />
                          <span>{member.phone}</span>
                        </div>
                      )}
                      {member.memberSince && (
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Calendar className="w-3.5 h-3.5 shrink-0" />
                          <span>Member since {new Date(member.memberSince).toLocaleDateString("en-US", { month: "short", year: "numeric" })}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="p-12 text-center">
            <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-display font-bold text-lg mb-2">No members yet</h3>
            <p className="text-muted-foreground text-sm">The admin will assign members to you soon.</p>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
