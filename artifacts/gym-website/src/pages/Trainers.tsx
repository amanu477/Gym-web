import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { SectionHeader, Card, Button, Input } from "@/components/ui/LuxuryComponents";
import { useGetTrainers, useContactTrainer } from "@workspace/api-client-react";
import { Star, Mail, Award, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Trainers() {
  const { data: trainers, isLoading } = useGetTrainers();
  const [selectedTrainer, setSelectedTrainer] = useState<number | null>(null);

  if (isLoading) {
    return <AppLayout><div className="pt-32 text-center py-20">Loading trainers...</div></AppLayout>;
  }

  return (
    <AppLayout>
      <div className="pt-32 pb-24 bg-background min-h-screen">
        <div className="container mx-auto px-4">
          <SectionHeader title="Elite Trainers" subtitle="Learn from the best" />
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {trainers?.map((trainer) => (
              <Card key={trainer.id} className="overflow-hidden group hover:border-primary/50 transition-colors">
                <div className="h-64 overflow-hidden relative">
                  {trainer.imageUrl ? (
                    <img src={trainer.imageUrl} alt={trainer.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full bg-secondary flex items-center justify-center font-display text-4xl font-black text-muted-foreground">
                      {trainer.name[0]}
                    </div>
                  )}
                  <div className="absolute top-4 right-4 bg-background/90 backdrop-blur-sm px-3 py-1 rounded-full flex items-center gap-1 border border-border">
                    <Star className="w-4 h-4 text-primary fill-primary" />
                    <span className="text-sm font-bold">{trainer.rating?.toFixed(1)}</span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-2xl font-display font-bold uppercase mb-1">{trainer.name}</h3>
                  <p className="text-primary font-medium text-sm mb-4">{trainer.specialty}</p>
                  <p className="text-muted-foreground text-sm mb-6 line-clamp-3">{trainer.bio}</p>
                  
                  <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Clock className="w-4 h-4 text-primary" />
                      <span>{trainer.experience} Yrs Exp</span>
                    </div>
                    {trainer.certifications && trainer.certifications.length > 0 && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Award className="w-4 h-4 text-primary" />
                        <span className="truncate">{trainer.certifications[0]}</span>
                      </div>
                    )}
                  </div>
                  
                  <Button 
                    variant="outline" 
                    className="w-full gap-2"
                    onClick={() => setSelectedTrainer(trainer.id)}
                  >
                    <Mail className="w-4 h-4" />
                    Contact Trainer
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {selectedTrainer && (
        <ContactTrainerModal 
          trainerId={selectedTrainer} 
          onClose={() => setSelectedTrainer(null)} 
        />
      )}
    </AppLayout>
  );
}

function ContactTrainerModal({ trainerId, onClose }: { trainerId: number, onClose: () => void }) {
  const { toast } = useToast();
  const mutation = useContactTrainer();
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate({ trainerId, data: formData }, {
      onSuccess: () => {
        toast({ title: "Message sent", description: "The trainer will contact you soon." });
        onClose();
      }
    });
  };

  return (
    <div className="fixed inset-0 z-[100] bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-6 relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground">✕</button>
        <h3 className="text-2xl font-display font-bold uppercase mb-6">Send Message</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input required placeholder="Your Name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
          <Input required type="email" placeholder="Your Email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
          <Input placeholder="Your Phone (Optional)" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
          <textarea 
            required 
            placeholder="Message" 
            className="w-full px-4 py-3 bg-input border border-border rounded-sm text-foreground focus:outline-none focus:border-primary min-h-[120px]"
            value={formData.message}
            onChange={e => setFormData({...formData, message: e.target.value})}
          />
          <Button type="submit" className="w-full" isLoading={mutation.isPending}>Send Message</Button>
        </form>
      </Card>
    </div>
  );
}
