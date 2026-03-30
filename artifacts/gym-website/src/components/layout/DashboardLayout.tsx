import React from "react";
import { Link, useLocation } from "wouter";
import { useGetMe, useLogout } from "@workspace/api-client-react";
import { getAuthHeaders, removeAuthToken } from "@/lib/auth-utils";
import { Dumbbell, LayoutDashboard, Activity, Calendar, CreditCard, Users, Image as ImageIcon, MessageSquare, LogOut, FileText } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { cn } from "@/components/ui/LuxuryComponents";

export function DashboardLayout({ children, requiredRole }: { children: React.ReactNode, requiredRole?: 'admin' | 'member' }) {
  const [location, setLocation] = useLocation();
  const queryClient = useQueryClient();

  const { data: user, isLoading } = useGetMe({
    request: getAuthHeaders(),
    query: { retry: false }
  });

  const logoutMutation = useLogout({
    request: getAuthHeaders(),
    mutation: {
      onSuccess: () => {
        removeAuthToken();
        queryClient.clear();
        setLocation("/login");
      }
    }
  });

  React.useEffect(() => {
    if (!isLoading && !user) {
      setLocation("/login");
    } else if (!isLoading && user && requiredRole && user.role !== requiredRole) {
      setLocation(user.role === 'admin' ? '/admin' : '/dashboard');
    }
  }, [user, isLoading, location, setLocation, requiredRole]);

  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const memberLinks = [
    { icon: LayoutDashboard, label: "Overview", path: "/dashboard" },
    { icon: Activity, label: "Performance", path: "/dashboard/performance" },
    { icon: Calendar, label: "Calendar", path: "/dashboard/calendar" },
    { icon: CreditCard, label: "Payments", path: "/dashboard/payments" },
  ];

  const adminLinks = [
    { icon: LayoutDashboard, label: "Overview", path: "/admin" },
    { icon: Users, label: "Members", path: "/admin/users" },
    { icon: Dumbbell, label: "Trainers", path: "/admin/trainers" },
    { icon: FileText, label: "Blog", path: "/admin/blog" },
    { icon: ImageIcon, label: "Gallery", path: "/admin/gallery" },
    { icon: MessageSquare, label: "Messages", path: "/admin/messages" },
  ];

  const links = user.role === 'admin' ? adminLinks : memberLinks;

  return (
    <div className="min-h-screen flex bg-background">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border bg-card hidden md:flex flex-col">
        <div className="h-20 flex items-center px-6 border-b border-border">
          <Link href="/" className="flex items-center gap-2 group cursor-pointer">
            <Dumbbell className="h-6 w-6 text-primary" />
            <span className="font-display font-black text-xl tracking-tighter uppercase text-foreground">
              Elite<span className="text-primary">Fitness</span>
            </span>
          </Link>
        </div>
        
        <div className="flex-1 py-8 px-4 flex flex-col gap-2">
          <div className="px-4 mb-4">
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              {user.role === 'admin' ? 'Admin Panel' : 'Member Dashboard'}
            </p>
          </div>
          
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = location === link.path;
            return (
              <Link key={link.path} href={link.path}>
                <div className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-md font-medium transition-colors cursor-pointer",
                  isActive 
                    ? "bg-primary text-primary-foreground shadow-[0_0_15px_rgba(245,158,11,0.2)]" 
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                )}>
                  <Icon className="w-5 h-5" />
                  {link.label}
                </div>
              </Link>
            );
          })}
        </div>
        
        <div className="p-4 border-t border-border">
          <div className="flex items-center gap-3 mb-4 px-2">
            <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center font-display font-bold text-primary">
              {user.firstName[0]}{user.lastName[0]}
            </div>
            <div>
              <p className="text-sm font-bold text-foreground">{user.firstName} {user.lastName}</p>
              <p className="text-xs text-muted-foreground capitalize">{user.role}</p>
            </div>
          </div>
          <button 
            onClick={() => logoutMutation.mutate()}
            className="flex items-center gap-3 px-4 py-3 rounded-md font-medium text-destructive hover:bg-destructive/10 transition-colors w-full"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Mobile Header */}
        <header className="h-16 border-b border-border bg-card flex items-center px-4 md:hidden justify-between shrink-0">
          <div className="flex items-center gap-2">
            <Dumbbell className="h-6 w-6 text-primary" />
            <span className="font-display font-bold text-lg">DASHBOARD</span>
          </div>
          <button onClick={() => logoutMutation.mutate()} className="p-2 text-muted-foreground hover:text-destructive">
            <LogOut className="w-5 h-5" />
          </button>
        </header>
        
        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
