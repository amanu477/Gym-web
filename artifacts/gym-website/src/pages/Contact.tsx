import { AppLayout } from "@/components/layout/AppLayout";
import { SectionHeader, Card, Input, Button } from "@/components/ui/LuxuryComponents";
import { useSendContactMessage } from "@workspace/api-client-react";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { MapPin, Phone, Mail } from "lucide-react";

export default function Contact() {
  const { toast } = useToast();
  const mutation = useSendContactMessage();
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate({ data: formData }, {
      onSuccess: () => {
        toast({ title: "Message sent", description: "We will get back to you shortly." });
        setFormData({ name: '', email: '', subject: '', message: '' });
      }
    });
  };

  return (
    <AppLayout>
      <div className="pt-32 pb-24 bg-background min-h-screen">
        <div className="container mx-auto px-4">
          <SectionHeader title="Contact Us" subtitle="Get in touch" />
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            <div>
              <h3 className="text-3xl font-display font-bold uppercase mb-6">Drop us a line</h3>
              <p className="text-muted-foreground mb-10">Have questions about memberships, personal training, or facilities? We're here to help.</p>
              
              <div className="space-y-8 mb-12">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-secondary rounded-lg flex items-center justify-center shrink-0">
                    <MapPin className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold">Location</h4>
                    <p className="text-muted-foreground">123 Elite Athlete Way, Iron City, IC 90210</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-secondary rounded-lg flex items-center justify-center shrink-0">
                    <Phone className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold">Phone</h4>
                    <p className="text-muted-foreground">(555) 123-4567</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-secondary rounded-lg flex items-center justify-center shrink-0">
                    <Mail className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold">Email</h4>
                    <p className="text-muted-foreground">ignite@elitefitness.com</p>
                  </div>
                </div>
              </div>
            </div>

            <Card className="p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input required label="Your Name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                  <Input required type="email" label="Your Email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                </div>
                <Input label="Subject" value={formData.subject} onChange={e => setFormData({...formData, subject: e.target.value})} />
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-muted-foreground">Message</label>
                  <textarea 
                    required 
                    className="w-full px-4 py-3 bg-input border border-border rounded-sm text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary min-h-[150px]"
                    value={formData.message}
                    onChange={e => setFormData({...formData, message: e.target.value})}
                  />
                </div>
                <Button type="submit" size="lg" className="w-full" isLoading={mutation.isPending}>Send Message</Button>
              </form>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
