import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Input, Button, Card } from "@/components/ui/LuxuryComponents";
import { useLogin } from "@workspace/api-client-react";
import { setAuthToken } from "@/lib/auth-utils";
import { Dumbbell } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";

export default function Login() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const mutation = useLogin();
  
  const [formData, setFormData] = useState({ email: '', password: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate({ data: formData }, {
      onSuccess: (res) => {
        setAuthToken(res.token);
        queryClient.invalidateQueries();
        toast({ title: "Welcome back!" });
        setLocation(res.user.role === 'admin' ? '/admin' : '/dashboard');
      },
      onError: (err: any) => {
        toast({ 
          title: "Login failed", 
          description: err?.message || "Invalid credentials", 
          variant: "destructive" 
        });
      }
    });
  };

  return (
    <div className="min-h-screen flex">
      {/* Image Side */}
      <div className="hidden lg:block w-1/2 relative">
        <img 
          src={`${import.meta.env.BASE_URL}images/auth-bg.png`} 
          alt="Gym background" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-background/60 backdrop-blur-sm flex items-center justify-center p-12">
          <div className="text-center">
            <h1 className="text-5xl font-display font-black uppercase tracking-tighter mb-4 text-white">
              Forge Your <span className="text-primary">Legacy</span>
            </h1>
            <p className="text-xl text-zinc-300">Enter the portal to track your greatness.</p>
          </div>
        </div>
      </div>

      {/* Form Side */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-background p-8">
        <div className="w-full max-w-md">
          <Link href="/" className="flex items-center justify-center gap-2 mb-12 hover:opacity-80 transition-opacity">
            <Dumbbell className="h-8 w-8 text-primary" />
            <span className="font-display font-black text-3xl tracking-tighter uppercase">
              Elite<span className="text-primary">Fitness</span>
            </span>
          </Link>
          
          <Card className="p-8">
            <div className="mb-8 text-center">
              <h2 className="text-2xl font-display font-bold uppercase mb-2">Member Login</h2>
              <p className="text-muted-foreground text-sm">Welcome back to the grind.</p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <Input 
                required 
                type="email" 
                label="Email Address" 
                value={formData.email} 
                onChange={e => setFormData({...formData, email: e.target.value})} 
              />
              <Input 
                required 
                type="password" 
                label="Password" 
                value={formData.password} 
                onChange={e => setFormData({...formData, password: e.target.value})} 
              />
              <Button type="submit" className="w-full" isLoading={mutation.isPending}>Sign In</Button>
            </form>
            
            <p className="mt-8 text-center text-sm text-muted-foreground">
              Don't have an account? <Link href="/register" className="text-primary hover:underline">Join Now</Link>
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
