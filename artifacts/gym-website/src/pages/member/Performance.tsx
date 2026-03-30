import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, Input, Button } from "@/components/ui/LuxuryComponents";
import { useGetPerformanceEntries, useCreatePerformanceEntry } from "@workspace/api-client-react";
import { getAuthHeaders } from "@/lib/auth-utils";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

export default function Performance() {
  const { data: entries, isLoading } = useGetPerformanceEntries({ request: getAuthHeaders() });
  const mutation = useCreatePerformanceEntry({ request: getAuthHeaders() });
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    weight: '',
    height: '', // used to calc BMI locally
    bodyFat: '',
    notes: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const weightNum = parseFloat(formData.weight);
    const heightNum = parseFloat(formData.height); // in cm
    
    let bmi;
    if (weightNum && heightNum) {
      const heightM = heightNum / 100;
      bmi = weightNum / (heightM * heightM);
    }

    mutation.mutate({
      data: {
        date: new Date().toISOString(),
        weight: weightNum,
        bmi,
        bodyFat: formData.bodyFat ? parseFloat(formData.bodyFat) : undefined,
        notes: formData.notes
      }
    }, {
      onSuccess: () => {
        toast({ title: "Performance logged!" });
        queryClient.invalidateQueries();
        setFormData({ weight: '', height: '', bodyFat: '', notes: '' });
      }
    });
  };

  const chartData = [...(entries || [])].reverse().map(entry => ({
    date: format(new Date(entry.date), 'MMM d'),
    weight: entry.weight,
    bmi: entry.bmi
  }));

  return (
    <DashboardLayout requiredRole="member">
      <div className="mb-8">
        <h1 className="text-3xl font-display font-black uppercase">Performance Tracking</h1>
        <p className="text-muted-foreground mt-1">Measure what matters.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="p-6 lg:col-span-1 h-fit">
          <h3 className="text-xl font-display font-bold uppercase mb-6">Log New Entry</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input 
              required 
              type="number" 
              step="0.1" 
              label="Weight (kg)" 
              value={formData.weight}
              onChange={e => setFormData({...formData, weight: e.target.value})}
            />
            <Input 
              type="number" 
              label="Height (cm) - For BMI calc" 
              value={formData.height}
              onChange={e => setFormData({...formData, height: e.target.value})}
            />
            <Input 
              type="number" 
              step="0.1" 
              label="Body Fat % (Optional)" 
              value={formData.bodyFat}
              onChange={e => setFormData({...formData, bodyFat: e.target.value})}
            />
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-muted-foreground">Notes</label>
              <textarea 
                className="w-full px-4 py-3 bg-input border border-border rounded-sm text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary min-h-[100px]"
                value={formData.notes}
                onChange={e => setFormData({...formData, notes: e.target.value})}
                placeholder="How did you feel today?"
              />
            </div>
            <Button type="submit" className="w-full" isLoading={mutation.isPending}>Save Entry</Button>
          </form>
        </Card>

        <div className="lg:col-span-2 space-y-8">
          <Card className="p-6">
            <h3 className="text-xl font-display font-bold uppercase mb-6">Weight Over Time</h3>
            <div className="h-[300px] w-full">
              {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(220,40%,18%)" vertical={false} />
                    <XAxis dataKey="date" stroke="hsl(215,20%,52%)" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="hsl(215,20%,52%)" fontSize={12} tickLine={false} axisLine={false} domain={['dataMin - 5', 'dataMax + 5']} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: 'hsl(220,58%,9%)', borderColor: 'hsl(220,40%,18%)', borderRadius: '8px' }}
                    />
                    <Line type="monotone" dataKey="weight" name="Weight (kg)" stroke="hsl(213,94%,62%)" strokeWidth={3} dot={{ fill: 'hsl(213,94%,62%)', r: 4 }} activeDot={{ r: 6 }} />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-muted-foreground">
                  No data to display. Log your first entry.
                </div>
              )}
            </div>
          </Card>

          <Card className="p-6 overflow-hidden">
            <h3 className="text-xl font-display font-bold uppercase mb-6">History</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-border text-muted-foreground uppercase tracking-wider text-xs">
                    <th className="pb-3 pr-4">Date</th>
                    <th className="pb-3 pr-4">Weight (kg)</th>
                    <th className="pb-3 pr-4">BMI</th>
                    <th className="pb-3 pr-4">Body Fat %</th>
                    <th className="pb-3">Notes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {isLoading ? (
                    <tr><td colSpan={5} className="py-4 text-center">Loading...</td></tr>
                  ) : entries?.length === 0 ? (
                    <tr><td colSpan={5} className="py-4 text-center text-muted-foreground">No entries found</td></tr>
                  ) : (
                    entries?.map((entry) => (
                      <tr key={entry.id} className="hover:bg-secondary/30 transition-colors">
                        <td className="py-4 pr-4 font-medium">{format(new Date(entry.date), 'MMM d, yyyy')}</td>
                        <td className="py-4 pr-4 text-primary font-bold">{entry.weight}</td>
                        <td className="py-4 pr-4">{entry.bmi?.toFixed(1) || '-'}</td>
                        <td className="py-4 pr-4">{entry.bodyFat || '-'}</td>
                        <td className="py-4 truncate max-w-[200px] text-muted-foreground">{entry.notes || '-'}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
