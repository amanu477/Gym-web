import { Link } from "wouter";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button, SectionHeader } from "@/components/ui/LuxuryComponents";
import { motion } from "framer-motion";
import { Dumbbell, Users, Trophy, Clock, ArrowRight, CheckCircle2 } from "lucide-react";
import { useGetPricingPlans } from "@workspace/api-client-react";

export default function Home() {
  const { data: plans } = useGetPricingPlans();

  const features = [
    { icon: Dumbbell, title: "Elite Equipment", desc: "State-of-the-art machines and free weights for serious lifters." },
    { icon: Users, title: "Expert Trainers", desc: "Certified professionals dedicated to pushing your limits." },
    { icon: Trophy, title: "Proven Results", desc: "Track your progress and achieve the impossible." },
    { icon: Clock, title: "24/7 Access", desc: "Train on your schedule, day or night, no excuses." },
  ];

  return (
    <AppLayout>
      {/* Hero Section */}
      <section className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src={`${import.meta.env.BASE_URL}images/hero-bg.png`} 
            alt="Luxury Gym Interior" 
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-transparent to-background/50" />
        </div>
        
        <div className="container relative z-10 mx-auto px-4 text-center mt-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <span className="text-primary font-display font-bold tracking-[0.3em] uppercase mb-4 block">
              Redefine Your Limits
            </span>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-display font-black text-foreground uppercase tracking-tighter mb-6 leading-none">
              Forge Your <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-yellow-600">Legacy</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
              Join the elite. Train in a facility designed for those who demand greatness from themselves every single day.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/register">
                <Button size="lg" className="w-full sm:w-auto text-lg px-12 py-5 shadow-[0_0_30px_rgba(245,158,11,0.3)]">
                  Start Your Journey
                </Button>
              </Link>
              <Link href="/about">
                <Button variant="outline" size="lg" className="w-full sm:w-auto text-lg px-12 py-5">
                  Explore Facility
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Banner */}
      <section className="border-y border-border bg-card relative z-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-border">
            {[
              { num: "10K+", label: "Active Members" },
              { num: "50+", label: "Elite Trainers" },
              { num: "15+", label: "Years Experience" },
              { num: "100%", label: "Commitment" },
            ].map((stat, i) => (
              <div key={i} className="py-12 text-center">
                <h3 className="text-3xl md:text-5xl font-display font-black text-primary mb-2">{stat.num}</h3>
                <p className="text-xs md:text-sm text-muted-foreground uppercase tracking-widest font-bold">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <SectionHeader title="The Elite Experience" subtitle="Why Choose Us" />
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-card p-8 rounded-xl border border-border hover:border-primary/50 transition-colors group"
              >
                <div className="w-14 h-14 bg-secondary rounded-lg flex items-center justify-center mb-6 group-hover:bg-primary transition-colors group-hover:scale-110 duration-300">
                  <feature.icon className="w-7 h-7 text-primary group-hover:text-primary-foreground" />
                </div>
                <h3 className="text-xl font-display font-bold uppercase mb-3">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Pricing */}
      <section className="py-24 bg-secondary/30 border-y border-border">
        <div className="container mx-auto px-4">
          <SectionHeader title="Membership Plans" subtitle="Commit To Greatness" />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {plans?.slice(0, 3).map((plan, i) => (
              <div 
                key={plan.id}
                className={`relative bg-card rounded-2xl p-8 border ${
                  plan.highlighted ? 'border-primary shadow-[0_0_30px_rgba(245,158,11,0.15)] scale-105 z-10' : 'border-border'
                } flex flex-col`}
              >
                {plan.highlighted && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary text-primary-foreground px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                    Most Popular
                  </div>
                )}
                <h3 className="text-2xl font-display font-bold uppercase mb-2">{plan.name}</h3>
                <p className="text-muted-foreground text-sm mb-6 min-h-[40px]">{plan.description}</p>
                <div className="mb-8">
                  <span className="text-5xl font-display font-black">${plan.price}</span>
                  <span className="text-muted-foreground">/{plan.period}</span>
                </div>
                <ul className="space-y-4 mb-8 flex-1">
                  {plan.features.slice(0, 5).map((feature, j) => (
                    <li key={j} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                      <span className="text-sm text-foreground/90">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link href="/register">
                  <Button variant={plan.highlighted ? 'primary' : 'outline'} className="w-full">
                    Select Plan
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-primary/5"></div>
        <div className="container relative mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-6xl font-display font-black uppercase mb-6">Ready to Transform?</h2>
          <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
            Stop waiting for tomorrow. The best version of yourself starts today.
          </p>
          <Link href="/register">
            <Button size="lg" className="px-12 py-5 text-lg shadow-[0_0_30px_rgba(245,158,11,0.3)] flex items-center gap-2">
              Join Elite Fitness <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>
    </AppLayout>
  );
}
