'use client';

import { useState } from 'react';
import { Plus, Edit2, Trash2, Search } from 'lucide-react';
import { deleteBlog } from '@/app/actions/blogs';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export function BlogsClient({ 
  initialBlogs, 
  totalPages = 1,
  currentPage = 1,
  currentSearch = ''
}: { 
  initialBlogs: any[],
  totalPages?: number,
  currentPage?: number,
  currentSearch?: string
}) {
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  const [search, setSearch] = useState(currentSearch);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this blog post?')) return;
    setIsProcessing(true);
    const result = await deleteBlog(id);
    if (result.success) {
      router.refresh();
    } else {
      alert(result.message);
    }
    setIsProcessing(false);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/en/admin/blogs?search=${encodeURIComponent(search)}&page=1`);
  };

  const handlePageChange = (newPage: number) => {
    router.push(`/en/admin/blogs?search=${encodeURIComponent(currentSearch)}&page=${newPage}`);
  };

  const filteredBlogs = initialBlogs;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Blog Posts</h1>
        <Link 
          href="/en/admin/blogs/new"
          className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors font-medium whitespace-nowrap"
        >
          <Plus className="w-4 h-4" />
          Create Post
        </Link>
      </div>

      <div className="bg-card border border-border rounded-lg overflow-hidden flex flex-col">
        <div className="flex flex-col sm:flex-row gap-4 bg-card p-4 border-b border-border">
          <form onSubmit={handleSearch} className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <input
              type="text"
              placeholder="Search blogs by title or author..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-background border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
            <button type="submit" className="hidden">Search</button>
          </form>
          <div className="flex items-center gap-2">
            {/* Filters will go here */}
          </div>
        </div>
        
        {/* Desktop Table View */}
        <div className="overflow-x-auto hidden md:block">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-muted/10 border-b border-border">
                <th className="px-6 py-4 font-semibold text-sm">Post Details</th>
                <th className="px-6 py-4 font-semibold text-sm">Author</th>
                <th className="px-6 py-4 font-semibold text-sm">Category</th>
                <th className="px-6 py-4 font-semibold text-sm text-center">Views</th>
                <th className="px-6 py-4 font-semibold text-sm text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredBlogs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">
                    No blogs found.
                  </td>
                </tr>
              ) : (
                filteredBlogs.map(blog => (
                  <tr key={blog.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-foreground line-clamp-1" title={blog.title}>
                        {blog.isFeatured && <span className="text-amber-500 mr-2" title="Featured">★</span>}
                        {blog.title}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1 font-mono">{blog.slug}</div>
                      <div className="text-xs text-muted-foreground mt-1">
                        Published: {new Date(blog.publishedAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 font-medium text-sm">
                      {blog.author.name}
                    </td>
                    <td className="px-6 py-4">
                      <span className="bg-secondary text-secondary-foreground px-2 py-1 rounded-md text-xs font-medium">
                        {blog.category.name}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="font-medium text-emerald-600 dark:text-emerald-400">
                        {blog.viewCount}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Link 
                          href={`/en/admin/blogs/${blog.id}/edit`}
                          className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-md transition-colors"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Link>
                        <button 
                          onClick={() => handleDelete(blog.id)}
                          disabled={isProcessing}
                          className="p-2 text-muted-foreground hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-md transition-colors disabled:opacity-50"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards View */}
        <div className="grid grid-cols-1 gap-4 p-4 md:hidden">
          {filteredBlogs.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground text-sm">
              No blogs found.
            </div>
          ) : (
            filteredBlogs.map(blog => (
              <div key={blog.id} className="bg-card rounded-2xl border border-border p-4 flex flex-col gap-3">
                <div>
                  <div className="font-bold text-foreground line-clamp-2 text-sm">
                    {blog.isFeatured && <span className="text-amber-500 mr-1.5" title="Featured">★</span>}
                    {blog.title}
                  </div>
                  <div className="text-[10px] text-muted-foreground mt-0.5 font-mono truncate">{blog.slug}</div>
                </div>

                <div className="flex items-center justify-between text-xs pt-1 border-t border-border">
                  <span className="bg-secondary text-secondary-foreground px-2 py-0.5 rounded-md text-[11px] font-medium">
                    {blog.category.name}
                  </span>
                  <div className="text-muted-foreground text-[11px]">
                    Author: <span className="font-semibold text-foreground">{blog.author.name}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <div className="text-[11px] text-muted-foreground">
                    Published: {new Date(blog.publishedAt).toLocaleDateString()}
                  </div>
                  <div className="text-xs">
                    Views: <span className="font-semibold text-emerald-600 dark:text-emerald-400">{blog.viewCount}</span>
                  </div>
                </div>

                <div className="flex gap-2 mt-2 pt-2 border-t border-border">
                  <Link 
                    href={`/en/admin/blogs/${blog.id}/edit`}
                    className="flex-grow flex items-center justify-center gap-1.5 py-2 text-xs bg-muted/30 hover:bg-primary/10 hover:text-primary rounded-xl transition-colors border border-border font-bold text-foreground"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    Edit
                  </Link>
                  <button 
                    onClick={() => handleDelete(blog.id)}
                    disabled={isProcessing}
                    className="flex-grow flex items-center justify-center gap-1.5 py-2 text-xs bg-muted/30 hover:bg-red-50 dark:hover:bg-red-950/20 hover:text-red-600 rounded-xl transition-colors border border-border disabled:opacity-50 font-bold"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
        
        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-border flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Page {currentPage} of {totalPages}
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage <= 1}
                className="px-3 py-1 border border-border rounded-md text-sm disabled:opacity-50 hover:bg-muted"
              >
                Previous
              </button>
              <button 
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage >= totalPages}
                className="px-3 py-1 border border-border rounded-md text-sm disabled:opacity-50 hover:bg-muted"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
