import { AppLayout } from "@/components/layout/AppLayout";
import { SectionHeader, Card } from "@/components/ui/LuxuryComponents";
import { useGetTestimonials } from "@workspace/api-client-react";
import { Star, Quote } from "lucide-react";

export default function Testimonials() {
  const { data: testimonials, isLoading } = useGetTestimonials();

  return (
    <AppLayout>
      <div className="pt-32 pb-24 bg-background min-h-screen">
        <div className="container mx-auto px-4">
          <SectionHeader title="Success Stories" subtitle="Real Members. Real Results." />
          
          {isLoading ? (
            <div className="text-center">Loading testimonials...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
              {testimonials?.map((t) => (
                <Card key={t.id} className="p-8 relative">
                  <Quote className="absolute top-6 right-6 w-12 h-12 text-secondary opacity-50" />
                  <div className="flex gap-1 mb-6">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-5 h-5 ${i < t.rating ? 'text-primary fill-primary' : 'text-muted'}`} />
                    ))}
                  </div>
                  <p className="text-lg text-muted-foreground leading-relaxed mb-8 italic">"{t.content}"</p>
                  <div className="flex items-center gap-4 mt-auto">
                    {t.imageUrl ? (
                      <img src={t.imageUrl} alt={t.name} className="w-12 h-12 rounded-full object-cover border-2 border-primary" />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-secondary border-2 border-primary flex items-center justify-center font-bold text-lg">
                        {t.name[0]}
                      </div>
                    )}
                    <div>
                      <p className="font-bold text-foreground">{t.name}</p>
                      <p className="text-xs text-primary font-medium">{t.role || 'Member'}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
