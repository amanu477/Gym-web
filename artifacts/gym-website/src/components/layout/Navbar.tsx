import { Link, useLocation } from "wouter";
import { useGetMe, useLogout } from "@workspace/api-client-react";
import { getAuthHeaders, removeAuthToken } from "@/lib/auth-utils";
import { Button } from "@/components/ui/LuxuryComponents";
import { Dumbbell, Menu, X, LogOut, User as UserIcon } from "lucide-react";
import { useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";

export function Navbar() {
  const [location, setLocation] = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data: user } = useGetMe({
    request: getAuthHeaders(),
    query: {
      retry: false, // Don't retry if not logged in
    }
  });

  const logoutMutation = useLogout({
    request: getAuthHeaders(),
    mutation: {
      onSuccess: () => {
        removeAuthToken();
        queryClient.clear();
        setLocation("/");
      }
    }
  });

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: "Home", path: "/" },
    { label: "About", path: "/about" },
    { label: "Trainers", path: "/trainers" },
    { label: "Pricing", path: "/pricing" },
    { label: "Testimonials", path: "/testimonials" },
    { label: "Blog", path: "/blog" },
    { label: "Gallery", path: "/gallery" },
    { label: "Contact", path: "/contact" },
  ];

  return (
    <header 
      className={`fixed top-0 w-full z-50 transition-all duration-300 border-b ${
        isScrolled 
          ? "bg-background/95 backdrop-blur-md border-border py-4 shadow-lg" 
          : "bg-transparent border-transparent py-6"
      }`}
    >
      <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group cursor-pointer">
          <Dumbbell className="h-8 w-8 text-primary group-hover:rotate-12 transition-transform" />
          <span className="font-display font-black text-2xl tracking-tighter uppercase text-foreground">
            Elite<span className="text-primary">Fitness</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-8">
          <ul className="flex items-center gap-6">
            {navLinks.map((link) => (
              <li key={link.path}>
                <Link 
                  href={link.path}
                  className={`text-sm font-semibold uppercase tracking-wider transition-colors hover:text-primary ${
                    location === link.path ? "text-primary" : "text-muted-foreground"
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          
          <div className="flex items-center gap-4 border-l border-border pl-8">
            {user ? (
              <div className="flex items-center gap-4">
                <Link href={user.role === 'admin' ? '/admin' : '/dashboard'}>
                  <Button variant="outline" size="sm" className="gap-2">
                    <UserIcon className="w-4 h-4" />
                    Dashboard
                  </Button>
                </Link>
                <button 
                  onClick={() => logoutMutation.mutate()}
                  className="text-muted-foreground hover:text-destructive transition-colors p-2"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <>
                <Link href="/login" className="text-sm font-semibold uppercase tracking-wider text-foreground hover:text-primary transition-colors">
                  Login
                </Link>
                <Link href="/register">
                  <Button size="sm">Join Now</Button>
                </Link>
              </>
            )}
          </div>
        </nav>

        {/* Mobile Toggle */}
        <button 
          className="lg:hidden text-foreground p-2"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 w-full bg-background border-b border-border shadow-xl">
          <ul className="flex flex-col py-4">
            {navLinks.map((link) => (
              <li key={link.path}>
                <Link 
                  href={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-6 py-3 text-sm font-semibold uppercase tracking-wider ${
                    location === link.path ? "bg-secondary text-primary" : "text-muted-foreground hover:bg-secondary/50 hover:text-primary"
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li className="px-6 py-4 border-t border-border mt-2 flex flex-col gap-3">
              {user ? (
                <>
                  <Link href={user.role === 'admin' ? '/admin' : '/dashboard'} onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="outline" className="w-full justify-center">Dashboard</Button>
                  </Link>
                  <Button variant="ghost" onClick={() => { logoutMutation.mutate(); setMobileMenuOpen(false); }} className="w-full justify-center text-destructive">
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="outline" className="w-full justify-center">Login</Button>
                  </Link>
                  <Link href="/register" onClick={() => setMobileMenuOpen(false)}>
                    <Button className="w-full justify-center">Join Now</Button>
                  </Link>
                </>
              )}
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
