import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useCreateTrainerBlogPost } from "@workspace/api-client-react";
import { getAuthHeaders } from "@/lib/auth-utils";
import { Button, Input, Card } from "@/components/ui/LuxuryComponents";
import { useState } from "react";
import { CheckCircle2, FileText } from "lucide-react";

const CATEGORIES = ["Training", "Nutrition", "Recovery", "Mindset", "Workout Tips", "Success Stories"];

export default function TrainerBlog() {
  const [form, setForm] = useState({ title: "", excerpt: "", content: "", imageUrl: "", category: "Training" });
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const mutation = useCreateTrainerBlogPost({
    request: getAuthHeaders(),
    mutation: {
      onSuccess: () => {
        setSuccess(true);
        setForm({ title: "", excerpt: "", content: "", imageUrl: "", category: "Training" });
        setError("");
      },
      onError: () => setError("Failed to publish post. Please try again."),
    },
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title || !form.excerpt || !form.content) {
      setError("Title, excerpt, and content are required.");
      return;
    }
    setError("");
    setSuccess(false);
    mutation.mutate({ data: form });
  }

  return (
    <DashboardLayout requiredRole="trainer">
      <div className="space-y-6 max-w-3xl">
        <div>
          <h1 className="text-3xl font-display font-bold">Write a Blog Post</h1>
          <p className="text-muted-foreground mt-1">Share your expertise with the Elite Fitness community</p>
        </div>

        {success && (
          <div className="flex items-center gap-3 p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-700">
            <CheckCircle2 className="w-5 h-5 shrink-0" />
            <p className="text-sm font-medium">Your post has been published successfully!</p>
          </div>
        )}

        <Card className="p-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="Post Title"
              placeholder="e.g. 5 Essential Exercises for Building Core Strength"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />

            <div>
              <label className="text-sm font-medium text-foreground block mb-1.5">Category</label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full px-4 py-3 bg-input border border-border rounded-lg text-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              >
                {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>

            <div>
              <label className="text-sm font-medium text-foreground block mb-1.5">Excerpt / Summary</label>
              <textarea
                className="w-full px-4 py-3 bg-input border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 resize-none"
                rows={3}
                placeholder="A brief summary of your post (shown in the blog list)"
                value={form.excerpt}
                onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
              />
            </div>

            <div>
              <label className="text-sm font-medium text-foreground block mb-1.5">Full Content</label>
              <textarea
                className="w-full px-4 py-3 bg-input border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 resize-y"
                rows={10}
                placeholder="Write your full blog post content here..."
                value={form.content}
                onChange={(e) => setForm({ ...form, content: e.target.value })}
              />
            </div>

            <Input
              label="Cover Image URL (optional)"
              placeholder="https://example.com/image.jpg"
              value={form.imageUrl}
              onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
            />

            {error && <p className="text-sm text-destructive">{error}</p>}

            <Button type="submit" isLoading={mutation.isPending} className="gap-2">
              <FileText className="w-4 h-4" />
              Publish Post
            </Button>
          </form>
        </Card>
      </div>
    </DashboardLayout>
  );
}
