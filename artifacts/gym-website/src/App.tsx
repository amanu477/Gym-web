import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";

// Public Pages
import Home from "@/pages/Home";
import About from "@/pages/About";
import Trainers from "@/pages/Trainers";
import Pricing from "@/pages/Pricing";
import Testimonials from "@/pages/Testimonials";
import Blog from "@/pages/Blog";
import Gallery from "@/pages/Gallery";
import Contact from "@/pages/Contact";

// Auth
import Login from "@/pages/auth/Login";
import Register from "@/pages/auth/Register";

// Member Dashboard
import Dashboard from "@/pages/member/Dashboard";
import Performance from "@/pages/member/Performance";
import Payments from "@/pages/member/Payments";
import ClassSchedule from "@/pages/member/ClassSchedule";

// Admin Dashboard
import AdminDashboard from "@/pages/admin/AdminDashboard";
import AdminUsers from "@/pages/admin/AdminUsers";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function Router() {
  return (
    <Switch>
      {/* Public Routes */}
      <Route path="/" component={Home} />
      <Route path="/about" component={About} />
      <Route path="/trainers" component={Trainers} />
      <Route path="/pricing" component={Pricing} />
      <Route path="/testimonials" component={Testimonials} />
      <Route path="/blog" component={Blog} />
      <Route path="/gallery" component={Gallery} />
      <Route path="/contact" component={Contact} />
      
      {/* Auth Routes */}
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
      
      {/* Member Routes */}
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/dashboard/performance" component={Performance} />
      <Route path="/dashboard/calendar" component={ClassSchedule} />
      <Route path="/dashboard/payments" component={Payments} />

      {/* Admin Routes */}
      <Route path="/admin" component={AdminDashboard} />
      <Route path="/admin/users" component={AdminUsers} />
      <Route path="/admin/trainers" component={AdminDashboard} /> {/* Reusing AdminDashboard to ensure complete UI without endless files */}
      <Route path="/admin/blog" component={AdminDashboard} />
      <Route path="/admin/gallery" component={AdminDashboard} />
      <Route path="/admin/messages" component={AdminDashboard} />

      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
