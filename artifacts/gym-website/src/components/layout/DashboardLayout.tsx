import React from "react";
import { Link, useLocation } from "wouter";
import { useGetMe, useLogout } from "@workspace/api-client-react";
import { getAuthHeaders, removeAuthToken } from "@/lib/auth-utils";
import {
  Dumbbell, LayoutDashboard, Activity, Calendar, CreditCard,
  Users, Image as ImageIcon, MessageSquare, LogOut, FileText, Menu, X
} from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { cn } from "@/components/ui/LuxuryComponents";
import { useState } from "react";

type Role = "admin" | "member" | "trainer";

export function DashboardLayout({ children, requiredRole }: { children: React.ReactNode; requiredRole?: Role }) {
  const [location, setLocation] = useLocation();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data: user, isLoading } = useGetMe({
    request: getAuthHeaders(),
    query: { retry: false },
  });

  const logoutMutation = useLogout({
    request: getAuthHeaders(),
    mutation: {
      onSuccess: () => {
        removeAuthToken();
        queryClient.clear();
        setLocation("/login");
      },
    },
  });

  React.useEffect(() => {
    if (!isLoading && !user) {
      setLocation("/login");
    } else if (!isLoading && user && requiredRole && user.role !== requiredRole) {
      if (user.role === "admin") setLocation("/admin");
      else if (user.role === "trainer") setLocation("/trainer-dashboard");
      else setLocation("/dashboard");
    }
  }, [user, isLoading, setLocation, requiredRole]);

  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
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

  const trainerLinks = [
    { icon: LayoutDashboard, label: "Overview", path: "/trainer-dashboard" },
    { icon: Users, label: "My Members", path: "/trainer-dashboard/members" },
    { icon: FileText, label: "Post Blog", path: "/trainer-dashboard/blog" },
  ];

  const links = user.role === "admin" ? adminLinks : user.role === "trainer" ? trainerLinks : memberLinks;

  const portalLabel = user.role === "admin" ? "Admin Panel" : user.role === "trainer" ? "Trainer Portal" : "Member Dashboard";

  const Sidebar = () => (
    <aside className="w-64 border-r border-border bg-card flex flex-col h-full">
      <div className="h-16 flex items-center px-5 border-b border-border">
        <Link href="/" className="flex items-center gap-2 cursor-pointer">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <Dumbbell className="h-4 w-4 text-white" />
          </div>
          <span className="font-display font-bold text-xl text-foreground tracking-wide">
            Elite<span className="text-primary">Fitness</span>
          </span>
        </Link>
      </div>

      <div className="flex-1 py-6 px-3 flex flex-col gap-1 overflow-y-auto">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest px-3 mb-3">
          {portalLabel}
        </p>
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = location === link.path;
          return (
            <Link key={link.path} href={link.path} onClick={() => setMobileSidebarOpen(false)}>
              <div className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all cursor-pointer",
                isActive
                  ? "bg-primary text-white shadow-sm"
                  : "text-muted-foreground hover:bg-secondary hover:text-primary"
              )}>
                <Icon className="w-4 h-4" />
                {link.label}
              </div>
            </Link>
          );
        })}
      </div>

      <div className="p-4 border-t border-border">
        <div className="flex items-center gap-3 mb-3 px-2">
          <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary text-sm">
            {user.firstName[0]}{user.lastName[0]}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-foreground truncate">{user.firstName} {user.lastName}</p>
            <p className="text-xs text-muted-foreground capitalize">{user.role}</p>
          </div>
        </div>
        <button
          onClick={() => logoutMutation.mutate()}
          className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors w-full"
        >
          <LogOut className="w-4 h-4" />
          Log Out
        </button>
      </div>
    </aside>
  );

  return (
    <div className="min-h-screen flex bg-background">
      <div className="hidden md:flex md:w-64 md:flex-shrink-0 md:flex-col h-screen sticky top-0">
        <Sidebar />
      </div>

      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileSidebarOpen(false)} />
          <div className="relative w-64 h-full flex flex-col">
            <Sidebar />
          </div>
        </div>
      )}

      <main className="flex-1 flex flex-col min-w-0 min-h-screen">
        <header className="h-14 border-b border-border bg-card flex items-center px-4 md:hidden justify-between sticky top-0 z-30">
          <button onClick={() => setMobileSidebarOpen(true)} className="p-1.5 text-foreground hover:bg-secondary rounded-lg">
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <Dumbbell className="h-5 w-5 text-primary" />
            <span className="font-display font-bold text-base">{portalLabel}</span>
          </div>
          <button onClick={() => logoutMutation.mutate()} className="p-1.5 text-muted-foreground hover:text-destructive hover:bg-secondary rounded-lg">
            <LogOut className="w-4 h-4" />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
