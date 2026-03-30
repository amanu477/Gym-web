import { AppLayout } from "@/components/layout/AppLayout";
import { SectionHeader } from "@/components/ui/LuxuryComponents";
import { useGetGalleryImages } from "@workspace/api-client-react";
import { useState } from "react";

export default function Gallery() {
  const { data: images, isLoading } = useGetGalleryImages();
  const [activeCategory, setActiveCategory] = useState<string>("All");

  const categories = ["All", ...Array.from(new Set(images?.map(img => img.category).filter(Boolean)))];
  
  const filteredImages = activeCategory === "All" 
    ? images 
    : images?.filter(img => img.category === activeCategory);

  return (
    <AppLayout>
      <div className="pt-32 pb-24 bg-background min-h-screen">
        <div className="container mx-auto px-4">
          <SectionHeader title="Our Facility" subtitle="Inside Elite Fitness" />
          
          {isLoading ? (
            <div className="text-center">Loading gallery...</div>
          ) : (
            <>
              <div className="flex flex-wrap justify-center gap-2 mb-12">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat as string)}
                    className={`px-6 py-2 text-sm font-bold uppercase tracking-wider rounded-full transition-colors ${
                      activeCategory === cat ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
                {filteredImages?.map((img) => (
                  <div key={img.id} className="break-inside-avoid relative group overflow-hidden rounded-xl bg-secondary">
                    <img 
                      src={img.url} 
                      alt={img.title} 
                      className="w-full object-cover" 
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-background/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                      <div className="text-center p-4">
                        <p className="text-primary font-bold uppercase tracking-widest text-xs mb-1">{img.category}</p>
                        <h4 className="text-foreground font-display font-bold text-xl">{img.title}</h4>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
