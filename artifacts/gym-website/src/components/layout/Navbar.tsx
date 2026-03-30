import { Link, useLocation } from "wouter";
import { useGetMe, useLogout } from "@workspace/api-client-react";
import { getAuthHeaders, removeAuthToken } from "@/lib/auth-utils";
import { Button, cn } from "@/components/ui/LuxuryComponents";
import { Dumbbell, Menu, X, LogOut, User as UserIcon, ChevronDown } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";

const dropdownGroups = [
  {
    label: "Membership",
    items: [
      { label: "Pricing Plans", path: "/pricing" },
      { label: "About Us", path: "/about" },
    ],
  },
  {
    label: "Explore",
    items: [
      { label: "Our Trainers", path: "/trainers" },
      { label: "Gallery", path: "/gallery" },
    ],
  },
  {
    label: "Community",
    items: [
      { label: "Blog", path: "/blog" },
      { label: "Testimonials", path: "/testimonials" },
    ],
  },
];

function DropdownMenu({ group, location }: { group: typeof dropdownGroups[0]; location: string }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const isActive = group.items.some((i) => i.path === location);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className={cn(
          "flex items-center gap-1 text-sm font-medium transition-colors hover:text-primary px-1 py-2",
          isActive ? "text-primary" : "text-foreground/60"
        )}
      >
        {group.label}
        <ChevronDown className={cn("w-3.5 h-3.5 transition-transform duration-200", open && "rotate-180")} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full left-0 mt-1.5 w-48 bg-card border border-border rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] overflow-hidden z-50 py-1"
          >
            {group.items.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                onClick={() => setOpen(false)}
                className={cn(
                  "block px-4 py-2.5 text-sm transition-colors hover:bg-secondary hover:text-primary",
                  location === item.path ? "text-primary bg-primary/10 font-medium" : "text-foreground/80"
                )}
              >
                {item.label}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function Navbar() {
  const [location, setLocation] = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data: user } = useGetMe({
    request: getAuthHeaders(),
    query: { retry: false },
  });

  const logoutMutation = useLogout({
    request: getAuthHeaders(),
    mutation: {
      onSuccess: () => {
        removeAuthToken();
        queryClient.clear();
        setLocation("/");
      },
    },
  });

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  function getDashboardPath() {
    if (!user) return "/login";
    if (user.role === "admin") return "/admin";
    if (user.role === "trainer") return "/trainer-dashboard";
    return "/dashboard";
  }

  return (
    <header
      className={cn(
        "fixed top-0 w-full z-50 transition-all duration-500",
        isScrolled
          ? "bg-background/90 backdrop-blur-xl shadow-[0_1px_0_rgba(255,255,255,0.06)] border-b border-border/60 py-3"
          : "bg-transparent border-transparent py-5"
      )}
    >
      <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group cursor-pointer shrink-0">
          <motion.div
            whileHover={{ scale: 1.08, rotate: -5 }}
            transition={{ type: "spring", stiffness: 400 }}
            className="w-9 h-9 bg-primary rounded-lg flex items-center justify-center shadow-[0_0_20px_rgba(66,153,255,0.3)]"
          >
            <Dumbbell className="h-5 w-5 text-primary-foreground" />
          </motion.div>
          <span className="font-display font-bold text-2xl text-foreground tracking-wide">
            Elite<span className="text-primary">Fitness</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-1">
          <Link
            href="/"
            className={cn(
              "px-3 py-2 text-sm font-medium transition-colors hover:text-primary rounded-md",
              location === "/" ? "text-primary" : "text-foreground/60"
            )}
          >
            Home
          </Link>
          {dropdownGroups.map((group) => (
            <DropdownMenu key={group.label} group={group} location={location} />
          ))}
          <Link
            href="/contact"
            className={cn(
              "px-3 py-2 text-sm font-medium transition-colors hover:text-primary rounded-md",
              location === "/contact" ? "text-primary" : "text-foreground/60"
            )}
          >
            Contact
          </Link>
        </nav>

        {/* Desktop Actions */}
        <div className="hidden lg:flex items-center gap-3">
          {user ? (
            <>
              <Link href={getDashboardPath()}>
                <Button variant="outline" size="sm" className="gap-2 border-border/60">
                  <UserIcon className="w-4 h-4" />
                  Dashboard
                </Button>
              </Link>
              <button
                onClick={() => logoutMutation.mutate()}
                className="text-muted-foreground hover:text-destructive transition-colors p-2 rounded-lg hover:bg-secondary"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="text-sm font-medium text-foreground/60 hover:text-primary transition-colors px-2">
                Log In
              </Link>
              <Link href="/register">
                <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
                  <Button size="sm" className="bg-primary text-primary-foreground shadow-[0_0_20px_rgba(66,153,255,0.25)] hover:shadow-[0_0_30px_rgba(66,153,255,0.45)]">
                    Join Now
                  </Button>
                </motion.div>
              </Link>
            </>
          )}
        </div>

        {/* Mobile toggle */}
        <button
          className="lg:hidden text-foreground p-2 hover:bg-secondary rounded-lg transition-colors"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <AnimatePresence mode="wait">
            {mobileMenuOpen ? (
              <motion.span key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}>
                <X className="h-5 w-5" />
              </motion.span>
            ) : (
              <motion.span key="open" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }}>
                <Menu className="h-5 w-5" />
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="lg:hidden overflow-hidden bg-background/95 backdrop-blur-xl border-b border-border shadow-xl"
          >
            <ul className="flex flex-col py-3">
              <li>
                <Link href="/" onClick={() => setMobileMenuOpen(false)} className="block px-5 py-3 text-sm font-medium text-foreground/80 hover:bg-secondary hover:text-primary">
                  Home
                </Link>
              </li>
              {dropdownGroups.map((group) => (
                <li key={group.label}>
                  <div className="px-5 pt-3 pb-1 text-xs font-bold uppercase tracking-widest text-muted-foreground">{group.label}</div>
                  {group.items.map((item) => (
                    <Link key={item.path} href={item.path} onClick={() => setMobileMenuOpen(false)} className={cn("block px-8 py-2.5 text-sm transition-colors hover:bg-secondary hover:text-primary", location === item.path && "text-primary font-medium")}>
                      {item.label}
                    </Link>
                  ))}
                </li>
              ))}
              <li>
                <Link href="/contact" onClick={() => setMobileMenuOpen(false)} className="block px-5 py-3 text-sm font-medium text-foreground/80 hover:bg-secondary hover:text-primary">
                  Contact
                </Link>
              </li>
              <li className="px-5 py-4 border-t border-border mt-2 flex flex-col gap-3">
                {user ? (
                  <>
                    <Link href={getDashboardPath()} onClick={() => setMobileMenuOpen(false)}>
                      <Button variant="outline" className="w-full">My Dashboard</Button>
                    </Link>
                    <Button variant="ghost" onClick={() => { logoutMutation.mutate(); setMobileMenuOpen(false); }} className="w-full text-destructive">
                      Logout
                    </Button>
                  </>
                ) : (
                  <>
                    <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                      <Button variant="outline" className="w-full">Log In</Button>
                    </Link>
                    <Link href="/register" onClick={() => setMobileMenuOpen(false)}>
                      <Button className="w-full">Join Now</Button>
                    </Link>
                  </>
                )}
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
