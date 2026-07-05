import { BlogCard } from './BlogCard';

interface BlogRelatedPostsProps {
  blogs: any[];
}

export function BlogRelatedPosts({ blogs }: BlogRelatedPostsProps) {
  if (!blogs || blogs.length === 0) return null;

  return (
    <div className="bg-muted/30 py-6 md:py-16 mt-6 md:mt-16 border-t border-border">
      <div className="max-w-6xl mx-auto px-0 sm:px-8">
        <div className="flex items-center gap-2 mb-6 px-4 sm:px-0">
          <h2 className="text-xl md:text-2xl font-black text-foreground">Read Next</h2>
          <div className="flex-1 h-px bg-border" />
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 mobile-grid-2 px-4 sm:px-0">
          {blogs.map((blog) => (
            <BlogCard
              key={blog.id}
              title={blog.title}
              excerpt={blog.excerpt}
              authorName={blog.author.name}
              authorCredential={blog.author.credentials || ''}
              date={blog.createdAt.toISOString().split('T')[0]}
              slug={blog.slug}
              coverImageUrl={blog.coverImageUrl}
              readTimeMinutes={blog.readTimeMinutes}
              tags={blog.tags}
              categoryName={blog.category?.name}
              categorySlug={blog.category?.slug}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
