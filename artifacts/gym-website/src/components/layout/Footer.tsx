import { Link } from "wouter";
import { Dumbbell, MapPin, Phone, Mail, Instagram, Facebook, Twitter, Youtube } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-8">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
          <div className="lg:col-span-2 space-y-5">
            <Link href="/" className="flex items-center gap-2 group cursor-pointer">
              <div className="w-9 h-9 bg-primary rounded-lg flex items-center justify-center">
                <Dumbbell className="h-5 w-5 text-white" />
              </div>
              <span className="font-display font-bold text-2xl text-white tracking-wide">
                Elite<span className="text-primary">Fitness</span>
              </span>
            </Link>
            <p className="text-slate-400 leading-relaxed text-sm max-w-xs">
              Elevate your performance with world-class facilities, expert coaches, and a community built on results.
            </p>
            <div className="flex items-center gap-3">
              {[Instagram, Facebook, Twitter, Youtube].map((Icon, i) => (
                <a key={i} href="#" className="w-9 h-9 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-primary hover:text-white transition-all duration-200">
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-display font-bold text-white text-lg mb-5 uppercase tracking-wide">Company</h4>
            <ul className="space-y-3">
              {[
                { label: "About Us", path: "/about" },
                { label: "Our Trainers", path: "/trainers" },
                { label: "Testimonials", path: "/testimonials" },
                { label: "Blog", path: "/blog" },
                { label: "Gallery", path: "/gallery" },
              ].map((link) => (
                <li key={link.path}>
                  <Link href={link.path} className="text-slate-400 hover:text-primary transition-colors text-sm">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-display font-bold text-white text-lg mb-5 uppercase tracking-wide">Membership</h4>
            <ul className="space-y-3">
              {[
                { label: "Pricing Plans", path: "/pricing" },
                { label: "Join Now", path: "/register" },
                { label: "Member Login", path: "/login" },
                { label: "Contact Us", path: "/contact" },
              ].map((link) => (
                <li key={link.path}>
                  <Link href={link.path} className="text-slate-400 hover:text-primary transition-colors text-sm">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-display font-bold text-white text-lg mb-5 uppercase tracking-wide">Contact</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-slate-400 text-sm">
                <MapPin className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <span>123 Elite Athlete Way<br />Iron City, IC 90210</span>
              </li>
              <li className="flex items-center gap-3 text-slate-400 text-sm">
                <Phone className="w-4 h-4 text-primary shrink-0" />
                <span>(555) 123-4567</span>
              </li>
              <li className="flex items-center gap-3 text-slate-400 text-sm">
                <Mail className="w-4 h-4 text-primary shrink-0" />
                <span>info@elitefitness.com</span>
              </li>
            </ul>
            <div className="mt-6">
              <h5 className="text-white text-sm font-semibold mb-3">Hours</h5>
              <div className="space-y-1 text-xs text-slate-400">
                <div className="flex justify-between"><span>Mon–Fri</span><span className="text-slate-300">5am – 11pm</span></div>
                <div className="flex justify-between"><span>Saturday</span><span className="text-slate-300">6am – 10pm</span></div>
                <div className="flex justify-between"><span>Sunday</span><span className="text-slate-300">7am – 8pm</span></div>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-500">
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
