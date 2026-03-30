import { Link } from "wouter";
import { Dumbbell, MapPin, Phone, Mail, Instagram, Facebook, Twitter, Youtube } from "lucide-react";
import { motion } from "framer-motion";

export function Footer() {
  return (
    <footer className="bg-card border-t border-border text-foreground/70 pt-16 pb-8 relative overflow-hidden">
      {/* Subtle grid */}
      <div className="absolute inset-0 navy-grid-bg opacity-20 pointer-events-none" />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
          {/* Brand column */}
          <div className="lg:col-span-2 space-y-5">
            <Link href="/" className="flex items-center gap-2 group cursor-pointer">
              <div className="w-9 h-9 bg-primary rounded-lg flex items-center justify-center shadow-[0_0_20px_rgba(66,153,255,0.3)]">
                <Dumbbell className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="font-display font-bold text-2xl text-foreground tracking-wide">
                Elite<span className="text-primary">Fitness</span>
              </span>
            </Link>
            <p className="text-muted-foreground leading-relaxed text-sm max-w-xs">
              Elevate your performance with world-class facilities, expert coaches, and a community built on results.
            </p>
            <div className="flex items-center gap-3">
              {[Instagram, Facebook, Twitter, Youtube].map((Icon, i) => (
                <motion.a
                  key={i}
                  href="#"
                  whileHover={{ y: -3, scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 400 }}
                  className="w-9 h-9 rounded-lg bg-secondary border border-border flex items-center justify-center text-muted-foreground hover:bg-primary/20 hover:text-primary hover:border-primary/40 transition-colors duration-200"
                >
                  <Icon className="w-4 h-4" />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Company links */}
          <div>
            <h4 className="font-display font-bold text-foreground text-lg mb-5 uppercase tracking-wide">Company</h4>
            <ul className="space-y-3">
              {[
                { label: "About Us", path: "/about" },
                { label: "Our Trainers", path: "/trainers" },
                { label: "Testimonials", path: "/testimonials" },
                { label: "Blog", path: "/blog" },
                { label: "Gallery", path: "/gallery" },
              ].map((link) => (
                <li key={link.path}>
                  <Link href={link.path} className="text-muted-foreground hover:text-primary transition-colors text-sm hover:translate-x-1 inline-block">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Membership links */}
          <div>
            <h4 className="font-display font-bold text-foreground text-lg mb-5 uppercase tracking-wide">Membership</h4>
            <ul className="space-y-3">
              {[
                { label: "Pricing Plans", path: "/pricing" },
                { label: "Join Now", path: "/register" },
                { label: "Member Login", path: "/login" },
                { label: "Contact Us", path: "/contact" },
              ].map((link) => (
                <li key={link.path}>
                  <Link href={link.path} className="text-muted-foreground hover:text-primary transition-colors text-sm hover:translate-x-1 inline-block">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display font-bold text-foreground text-lg mb-5 uppercase tracking-wide">Contact</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-muted-foreground text-sm">
                <MapPin className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <span>123 Elite Athlete Way<br />Iron City, IC 90210</span>
              </li>
              <li className="flex items-center gap-3 text-muted-foreground text-sm">
                <Phone className="w-4 h-4 text-primary shrink-0" />
                <span>(555) 123-4567</span>
              </li>
              <li className="flex items-center gap-3 text-muted-foreground text-sm">
                <Mail className="w-4 h-4 text-primary shrink-0" />
                <span>info@elitefitness.com</span>
              </li>
            </ul>
            <div className="mt-6">
              <h5 className="text-foreground text-sm font-semibold mb-3">Hours</h5>
              <div className="space-y-1 text-xs text-muted-foreground">
                <div className="flex justify-between"><span>Mon–Fri</span><span className="text-foreground/80">5am – 11pm</span></div>
                <div className="flex justify-between"><span>Saturday</span><span className="text-foreground/80">6am – 10pm</span></div>
                <div className="flex justify-between"><span>Sunday</span><span className="text-foreground/80">7am – 8pm</span></div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Elite Fitness. All rights reserved.</p>
          <div className="flex gap-5">
            <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-primary transition-colors">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
