import { AppLayout } from "@/components/layout/AppLayout";
import { SectionHeader, Button } from "@/components/ui/LuxuryComponents";
import { useGetPricingPlans } from "@workspace/api-client-react";
import { CheckCircle2 } from "lucide-react";
import { Link } from "wouter";

export default function Pricing() {
  const { data: plans, isLoading } = useGetPricingPlans();

  return (
    <AppLayout>
      <div className="pt-32 pb-24 bg-background min-h-screen">
        <div className="container mx-auto px-4">
          <SectionHeader title="Membership Plans" subtitle="Choose Your Commitment" />
          
          {isLoading ? (
            <div className="text-center">Loading plans...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto mt-12">
              {plans?.map((plan) => (
                <div 
                  key={plan.id}
                  className={`relative bg-card rounded-2xl p-8 border ${
                    plan.highlighted ? 'border-primary shadow-[0_0_30px_rgba(245,158,11,0.15)] md:-mt-8 md:mb-8 z-10' : 'border-border'
                  } flex flex-col`}
                >
                  {plan.highlighted && (
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary text-primary-foreground px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                      Most Popular
                    </div>
                  )}
                  <h3 className="text-2xl font-display font-bold uppercase mb-2">{plan.name}</h3>
                  <p className="text-muted-foreground text-sm mb-6 min-h-[40px]">{plan.description}</p>
                  <div className="mb-8 border-b border-border pb-8">
                    <span className="text-5xl font-display font-black">${plan.price}</span>
                    <span className="text-muted-foreground">/{plan.period}</span>
                  </div>
                  <ul className="space-y-4 mb-8 flex-1">
                    {plan.features.map((feature, j) => (
                      <li key={j} className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                        <span className="text-sm text-foreground/90">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Link href="/register">
                    <Button variant={plan.highlighted ? 'primary' : 'outline'} className="w-full">
                      Select {plan.name}
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
