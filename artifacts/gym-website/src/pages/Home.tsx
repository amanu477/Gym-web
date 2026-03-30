import { Link } from "wouter";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button, SectionHeader } from "@/components/ui/LuxuryComponents";
import { motion, useInView, useMotionValue, useSpring } from "framer-motion";
import { Dumbbell, Users, Trophy, Clock, ArrowRight, CheckCircle2, Zap, Star } from "lucide-react";
import { useGetPricingPlans } from "@workspace/api-client-react";
import { useRef, useEffect, useState } from "react";

function AnimatedCounter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const motionVal = useMotionValue(0);
  const spring = useSpring(motionVal, { duration: 2000, bounce: 0 });
  const [display, setDisplay] = useState("0");

  useEffect(() => {
    if (inView) motionVal.set(target);
  }, [inView, target, motionVal]);

  useEffect(() => {
    return spring.on("change", (v) => {
      setDisplay(Math.round(v).toLocaleString());
    });
  }, [spring]);

  return <span ref={ref}>{display}{suffix}</span>;
}

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

export default function Home() {
  const { data: plans } = useGetPricingPlans();

  const features = [
    { icon: Dumbbell, title: "Elite Equipment", desc: "State-of-the-art machines and free weights for serious lifters.", color: "from-blue-500/20 to-blue-600/5" },
    { icon: Users, title: "Expert Trainers", desc: "Certified professionals dedicated to pushing your limits.", color: "from-violet-500/20 to-violet-600/5" },
    { icon: Trophy, title: "Proven Results", desc: "Track your progress and achieve the impossible.", color: "from-amber-500/20 to-amber-600/5" },
    { icon: Clock, title: "24/7 Access", desc: "Train on your schedule, day or night, no excuses.", color: "from-cyan-500/20 to-cyan-600/5" },
  ];

  const stats = [
    { num: 10000, suffix: "+", label: "Active Members" },
    { num: 50, suffix: "+", label: "Elite Trainers" },
    { num: 15, suffix: "+", label: "Years Experience" },
    { num: 100, suffix: "%", label: "Commitment" },
  ];

  return (
    <AppLayout>
      {/* ── Hero ── */}
      <section className="relative h-screen min-h-[650px] flex items-center justify-center overflow-hidden">
        {/* Background image + overlays */}
        <div className="absolute inset-0 z-0">
          <img
            src={`${import.meta.env.BASE_URL}images/hero-bg.png`}
            alt="Elite Gym Interior"
            className="w-full h-full object-cover opacity-25"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-background/30" />
          <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-transparent to-background/60" />
        </div>

        {/* Animated grid */}
        <div className="absolute inset-0 z-0 navy-grid-bg opacity-30" />

        {/* Spotlight blobs */}
        <div className="spotlight top-[-100px] left-[-100px]" />
        <div className="spotlight bottom-[-150px] right-[-50px]" style={{ animationDelay: "2.5s" }} />

        {/* Floating badges */}
        <motion.div
          className="absolute top-1/3 right-[8%] hidden xl:flex items-center gap-2 bg-card/80 backdrop-blur-md border border-border px-4 py-2.5 rounded-2xl shadow-lg animate-float"
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1.2, duration: 0.8 }}
        >
          <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center">
            <Star className="w-4 h-4 text-amber-400" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Rating</p>
            <p className="text-sm font-bold text-foreground">4.9 / 5.0</p>
          </div>
        </motion.div>

        <motion.div
          className="absolute bottom-1/3 left-[6%] hidden xl:flex items-center gap-2 bg-card/80 backdrop-blur-md border border-border px-4 py-2.5 rounded-2xl shadow-lg animate-float-delayed"
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1.5, duration: 0.8 }}
        >
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
            <Zap className="w-4 h-4 text-primary" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">New Members Today</p>
            <p className="text-sm font-bold text-foreground">+24 Joined</p>
          </div>
        </motion.div>

        {/* Hero content */}
        <motion.div
          className="container relative z-10 mx-auto px-4 text-center mt-20"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.span
            variants={itemVariants}
            className="inline-flex items-center gap-2 text-primary font-display font-bold tracking-[0.25em] uppercase mb-5 text-sm"
          >
            <span className="w-8 h-px bg-primary inline-block" />
            Redefine Your Limits
            <span className="w-8 h-px bg-primary inline-block" />
          </motion.span>

          <motion.h1
            variants={itemVariants}
            className="text-5xl md:text-7xl lg:text-8xl font-display font-black uppercase tracking-tighter mb-6 leading-none text-foreground"
          >
            Forge Your <br />
            <span className="animated-gradient-text">Legacy</span>
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10"
          >
            Join the elite. Train in a facility designed for those who demand greatness from themselves every single day.
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link href="/register">
              <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
                <Button
                  size="lg"
                  className="w-full sm:w-auto text-lg px-12 py-5 animate-glow-pulse bg-primary text-primary-foreground shadow-[0_0_40px_rgba(66,153,255,0.3)] hover:shadow-[0_0_60px_rgba(66,153,255,0.5)] transition-shadow"
                >
                  Start Your Journey
                </Button>
              </motion.div>
            </Link>
            <Link href="/about">
              <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
                <Button variant="outline" size="lg" className="w-full sm:w-auto text-lg px-12 py-5 border-primary/40 text-foreground hover:bg-primary/10">
                  Explore Facility
                </Button>
              </motion.div>
            </Link>
          </motion.div>
        </motion.div>

        {/* Bottom scroll cue */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-muted-foreground"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.5 }}
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-5 h-8 border-2 border-border rounded-full flex justify-center pt-1.5"
          >
            <div className="w-1 h-2 bg-primary rounded-full" />
          </motion.div>
        </motion.div>
      </section>

      {/* ── Stats Banner ── */}
      <section className="border-y border-border bg-card relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-border">
            {stats.map((stat, i) => (
              <motion.div
                key={i}
                className="py-12 text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
              >
                <h3 className="text-3xl md:text-5xl font-display font-black text-primary mb-2">
                  <AnimatedCounter target={stat.num} suffix={stat.suffix} />
                </h3>
                <p className="text-xs md:text-sm text-muted-foreground uppercase tracking-widest font-bold">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="py-24 bg-background relative overflow-hidden">
        <div className="absolute inset-0 navy-grid-bg opacity-20" />
        <div className="container mx-auto px-4 relative z-10">
          <SectionHeader title="The Elite Experience" subtitle="Why Choose Us" />

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
          >
            {features.map((feature, i) => (
              <motion.div
                key={i}
                variants={itemVariants}
                whileHover={{ y: -6, transition: { duration: 0.25 } }}
                className="card-glow bg-card p-8 rounded-2xl border border-border hover:border-primary/50 transition-all duration-300 group cursor-default"
              >
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.color} border border-border flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-xl font-display font-bold uppercase mb-3 text-foreground">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed text-sm">{feature.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Pricing ── */}
      <section className="py-24 bg-secondary/30 border-y border-border relative overflow-hidden">
        <div className="spotlight top-0 left-1/2 -translate-x-1/2" style={{ animationDelay: "1s" }} />
        <div className="container mx-auto px-4 relative z-10">
          <SectionHeader title="Membership Plans" subtitle="Commit To Greatness" />

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
          >
            {plans?.slice(0, 3).map((plan, i) => (
              <motion.div
                key={plan.id}
                variants={itemVariants}
                whileHover={{ y: -4 }}
                className={`relative bg-card rounded-2xl p-8 border flex flex-col transition-all duration-300 ${
                  plan.highlighted
                    ? "border-primary shadow-[0_0_50px_rgba(66,153,255,0.2)] scale-105 z-10"
                    : "border-border hover:border-primary/40"
                }`}
              >
                {plan.highlighted && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary text-primary-foreground px-5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-lg">
                    Most Popular
                  </div>
                )}
                <h3 className="text-2xl font-display font-bold uppercase mb-2 text-foreground">{plan.name}</h3>
                <p className="text-muted-foreground text-sm mb-6 min-h-[40px]">{plan.description}</p>
                <div className="mb-8">
                  <span className="text-5xl font-display font-black text-foreground">${plan.price}</span>
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
                  <Button
                    variant={plan.highlighted ? "primary" : "outline"}
                    className="w-full"
                  >
                    Select Plan
                  </Button>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-28 relative overflow-hidden">
        <div className="absolute inset-0 navy-grid-bg opacity-30" />
        <div className="spotlight top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" style={{ width: "900px", height: "900px" }} />

        <motion.div
          className="container relative z-10 mx-auto px-4 text-center"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="inline-block text-primary font-semibold uppercase tracking-widest text-xs mb-4 px-3 py-1 bg-primary/10 rounded-full border border-primary/20">
            The Time Is Now
          </span>
          <h2 className="text-4xl md:text-6xl font-display font-black uppercase mb-6 text-foreground">
            Ready to <span className="shimmer-text">Transform?</span>
          </h2>
          <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
            Stop waiting for tomorrow. The best version of yourself starts today.
          </p>
          <Link href="/register">
            <motion.div
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              className="inline-block"
            >
              <Button
                size="lg"
                className="px-14 py-5 text-lg shadow-[0_0_40px_rgba(66,153,255,0.3)] hover:shadow-[0_0_70px_rgba(66,153,255,0.5)] inline-flex items-center gap-3 transition-all"
              >
                Join Elite Fitness
                <motion.span
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
                >
                  <ArrowRight className="w-5 h-5" />
                </motion.span>
              </Button>
            </motion.div>
          </Link>
        </motion.div>
      </section>
    </AppLayout>
  );
}
