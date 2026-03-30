import { AppLayout } from "@/components/layout/AppLayout";
import { SectionHeader } from "@/components/ui/LuxuryComponents";
import { motion } from "framer-motion";

export default function About() {
  return (
    <AppLayout>
      <div className="pt-32 pb-24 bg-background min-h-screen">
        <div className="container mx-auto px-4">
          <SectionHeader title="Our Story" subtitle="The Genesis of Greatness" />
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center max-w-6xl mx-auto mb-24">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <img 
                src={`${import.meta.env.BASE_URL}images/about-img.png`} 
                alt="Gym kettlebell detail" 
                className="rounded-2xl border border-border shadow-2xl w-full"
              />
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="space-y-6"
            >
              <h3 className="text-3xl font-display font-bold uppercase text-primary">Forged in Iron</h3>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Founded in 2010, Elite Fitness began with a simple philosophy: provide a space where serious athletes and beginners alike can push past their perceived limits. We aren't just another commercial gym; we are a training facility dedicated to true physical transformation.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Our founders, former professional athletes, saw a gap in the fitness industry. They built a sanctuary equipped with the finest tools, staffed by unparalleled experts, and fueled by a community that refuses to settle for mediocrity.
              </p>
              <div className="grid grid-cols-2 gap-6 pt-6 border-t border-border">
                <div>
                  <h4 className="font-display font-bold text-2xl text-foreground">Mission</h4>
                  <p className="text-sm text-muted-foreground mt-2">To empower individuals to achieve their absolute physical and mental peak.</p>
                </div>
                <div>
                  <h4 className="font-display font-bold text-2xl text-foreground">Vision</h4>
                  <p className="text-sm text-muted-foreground mt-2">To be the undisputed standard of fitness excellence globally.</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
