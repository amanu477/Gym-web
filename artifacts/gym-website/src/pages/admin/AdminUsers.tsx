import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, Input, Button } from "@/components/ui/LuxuryComponents";
import { useGetAdminUsers } from "@workspace/api-client-react";
import { getAuthHeaders } from "@/lib/auth-utils";
import { useState } from "react";
import { Search, MoreVertical } from "lucide-react";
import { format } from "date-fns";

export default function AdminUsers() {
  const { data: users, isLoading } = useGetAdminUsers({ request: getAuthHeaders() });
  const [search, setSearch] = useState("");

  const filteredUsers = users?.filter(u => 
    u.firstName.toLowerCase().includes(search.toLowerCase()) || 
    u.lastName.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DashboardLayout requiredRole="admin">
      <div className="mb-8 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div>
          <h1 className="text-3xl font-display font-black uppercase">Member Management</h1>
          <p className="text-muted-foreground mt-1">View and manage gym members.</p>
        </div>
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            className="pl-10 py-2 text-sm" 
            placeholder="Search members..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-secondary/50">
              <tr className="border-b border-border text-muted-foreground uppercase tracking-wider text-xs">
                <th className="py-4 px-6">Name</th>
                <th className="py-4 px-6">Contact</th>
                <th className="py-4 px-6">Role</th>
                <th className="py-4 px-6">Plan ID</th>
                <th className="py-4 px-6">Joined</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading ? (
                <tr><td colSpan={6} className="py-8 text-center">Loading members...</td></tr>
              ) : filteredUsers?.length === 0 ? (
                <tr><td colSpan={6} className="py-8 text-center text-muted-foreground">No members found matching "{search}"</td></tr>
              ) : (
                filteredUsers?.map((user) => (
                  <tr key={user.id} className="hover:bg-secondary/20 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center font-bold text-primary text-xs">
                          {user.firstName[0]}{user.lastName[0]}
                        </div>
                        <span className="font-bold text-foreground">{user.firstName} {user.lastName}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <p className="text-foreground">{user.email}</p>
                      <p className="text-xs text-muted-foreground">{user.phone || 'No phone'}</p>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${
                        user.role === 'admin' ? 'bg-primary/20 text-primary' : 'bg-secondary text-foreground'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-muted-foreground">
                      {user.planId ? `#${user.planId}` : 'None'}
                    </td>
                    <td className="py-4 px-6 text-muted-foreground">
                      {user.createdAt ? format(new Date(user.createdAt), 'MMM d, yyyy') : '-'}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <Button variant="ghost" size="sm" className="px-2">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
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
