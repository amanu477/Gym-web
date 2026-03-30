import { AppLayout } from "@/components/layout/AppLayout";
import { SectionHeader, Card, Button } from "@/components/ui/LuxuryComponents";
import { useGetBlogPosts } from "@workspace/api-client-react";
import { format } from "date-fns";
import { Link } from "wouter";

export default function Blog() {
  const { data, isLoading } = useGetBlogPosts({ page: 1, limit: 10 });

  return (
    <AppLayout>
      <div className="pt-32 pb-24 bg-background min-h-screen">
        <div className="container mx-auto px-4">
          <SectionHeader title="The Iron Desk" subtitle="News, Tips & Motivation" />
          
          {isLoading ? (
            <div className="text-center">Loading posts...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
              {data?.posts.map((post) => (
                <Card key={post.id} className="overflow-hidden flex flex-col">
                  {post.imageUrl && (
                    <div className="h-48 overflow-hidden">
                      <img src={post.imageUrl} alt={post.title} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                    </div>
                  )}
                  <div className="p-6 flex-1 flex flex-col">
                    <div className="flex items-center justify-between mb-3 text-xs font-bold uppercase tracking-wider">
                      <span className="text-primary">{post.category}</span>
                      <span className="text-muted-foreground">{post.createdAt ? format(new Date(post.createdAt), 'MMM d, yyyy') : ''}</span>
                    </div>
                    <h3 className="text-xl font-display font-bold uppercase mb-3 line-clamp-2">{post.title}</h3>
                    <p className="text-muted-foreground text-sm mb-6 line-clamp-3 flex-1">{post.excerpt}</p>
                    <Link href={`/blog/${post.id}`}>
                      <Button variant="outline" className="w-full">Read Article</Button>
                    </Link>
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
