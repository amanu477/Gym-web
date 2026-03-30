import { Link } from "wouter";
import { Dumbbell, MapPin, Phone, Mail, Instagram, Facebook, Twitter } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-zinc-950 border-t border-border pt-20 pb-10">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          <div className="space-y-6">
            <Link href="/" className="flex items-center gap-2 group cursor-pointer inline-flex">
              <Dumbbell className="h-8 w-8 text-primary group-hover:rotate-12 transition-transform" />
              <span className="font-display font-black text-2xl tracking-tighter uppercase text-foreground">
                Elite<span className="text-primary">Fitness</span>
              </span>
            </Link>
            <p className="text-muted-foreground leading-relaxed">
              Forge your legacy with world-class equipment, elite trainers, and a community dedicated to greatness.
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-foreground hover:bg-primary hover:text-primary-foreground transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-foreground hover:bg-primary hover:text-primary-foreground transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-foreground hover:bg-primary hover:text-primary-foreground transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-display font-bold uppercase text-lg mb-6">Quick Links</h4>
            <ul className="space-y-3">
              {['About', 'Trainers', 'Pricing', 'Blog', 'Gallery'].map((link) => (
                <li key={link}>
                  <Link href={`/${link.toLowerCase()}`} className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2">
                    <span className="w-1 h-1 bg-primary rounded-full"></span>
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-display font-bold uppercase text-lg mb-6">Contact Info</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-muted-foreground">
                <MapPin className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <span>123 Elite Athlete Way<br />Iron City, IC 90210</span>
              </li>
              <li className="flex items-center gap-3 text-muted-foreground">
                <Phone className="w-5 h-5 text-primary shrink-0" />
                <span>(555) 123-4567</span>
              </li>
              <li className="flex items-center gap-3 text-muted-foreground">
                <Mail className="w-5 h-5 text-primary shrink-0" />
                <span>ignite@elitefitness.com</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-display font-bold uppercase text-lg mb-6">Working Hours</h4>
            <ul className="space-y-3 text-muted-foreground">
              <li className="flex justify-between border-b border-border/50 pb-2">
                <span>Mon - Fri</span>
                <span className="text-foreground font-medium">5:00 AM - 11:00 PM</span>
              </li>
              <li className="flex justify-between border-b border-border/50 pb-2">
                <span>Saturday</span>
                <span className="text-foreground font-medium">6:00 AM - 10:00 PM</span>
              </li>
              <li className="flex justify-between border-b border-border/50 pb-2">
                <span>Sunday</span>
                <span className="text-foreground font-medium">7:00 AM - 8:00 PM</span>
              </li>
            </ul>
          </div>

        </div>
        
        <div className="pt-8 border-t border-border text-center text-muted-foreground text-sm flex flex-col md:flex-row justify-between items-center gap-4">
          <p>&copy; {new Date().getFullYear()} Elite Fitness. All rights reserved.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
