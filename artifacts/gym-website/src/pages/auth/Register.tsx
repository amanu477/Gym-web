import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Input, Button, Card } from "@/components/ui/LuxuryComponents";
import { useRegister } from "@workspace/api-client-react";
import { setAuthToken } from "@/lib/auth-utils";
import { Dumbbell } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";

export default function Register() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const mutation = useRegister();
  
  const [formData, setFormData] = useState({ firstName: '', lastName: '', email: '', password: '', phone: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate({ data: formData }, {
      onSuccess: (res) => {
        setAuthToken(res.token);
        queryClient.invalidateQueries();
        toast({ title: "Registration successful!" });
        setLocation('/dashboard');
      },
      onError: (err: any) => {
        toast({ 
          title: "Registration failed", 
          description: err?.message || "Please check your inputs", 
          variant: "destructive" 
        });
      }
    });
  };

  return (
    <div className="min-h-screen flex bg-background">
      <div className="w-full flex items-center justify-center p-8 relative z-10">
        <div className="w-full max-w-lg">
          <Link href="/" className="flex items-center justify-center gap-2 mb-8 hover:opacity-80 transition-opacity">
            <Dumbbell className="h-8 w-8 text-primary" />
            <span className="font-display font-black text-3xl tracking-tighter uppercase">
              Elite<span className="text-primary">Fitness</span>
            </span>
          </Link>
          
          <Card className="p-8 border-primary/20 shadow-[0_0_50px_rgba(245,158,11,0.05)]">
            <div className="mb-8 text-center">
              <h2 className="text-2xl font-display font-bold uppercase mb-2">Join The Elite</h2>
              <p className="text-muted-foreground text-sm">Start your transformation today.</p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Input required label="First Name" value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} />
                <Input required label="Last Name" value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} />
              </div>
              <Input required type="email" label="Email Address" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
              <Input label="Phone Number" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
              <Input required type="password" label="Password" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} />
              
              <Button type="submit" className="w-full mt-6" isLoading={mutation.isPending}>Create Account</Button>
            </form>
            
            <p className="mt-8 text-center text-sm text-muted-foreground">
              Already a member? <Link href="/login" className="text-primary hover:underline">Sign In</Link>
            </p>
          </Card>
        </div>
      </div>
      {/* Background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-1/4 -right-1/4 w-1/2 h-1/2 bg-primary/10 blur-[120px] rounded-full"></div>
        <div className="absolute -bottom-1/4 -left-1/4 w-1/2 h-1/2 bg-primary/10 blur-[120px] rounded-full"></div>
      </div>
    </div>
  );
}
