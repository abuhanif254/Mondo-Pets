'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createBlog, updateBlog } from '@/app/actions/blogs';
import { Loader2 } from 'lucide-react';
import { RichTextEditor } from '@/components/admin/RichTextEditor';
import { SearchableSelect } from '@/components/admin/SearchableSelect';

export function BlogForm({ categories, authors, initialData }: { categories: any[]; authors: any[]; initialData?: any }) {
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [content, setContent] = useState(initialData?.content || '');
  const [categoryId, setCategoryId] = useState(initialData?.categoryId || '');
  const [authorId, setAuthorId] = useState(initialData?.authorId || '');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsProcessing(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const data: Record<string, any> = {};
    formData.forEach((value, key) => {
      if (value) data[key] = value;
    });

    data.isFeatured = formData.get('isFeatured') === 'true';
    if (data.tags) {
      data.tags = (data.tags as string).split(',').map(t => t.trim()).filter(Boolean);
    }

    let result;
    if (initialData?.id) {
      result = await updateBlog(initialData.id, data);
    } else {
      result = await createBlog(data);
    }

    if (result.success) {
      router.push('/en/admin/blogs');
      router.refresh();
    } else {
      setError(result.message);
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 bg-card border border-border p-8 rounded-xl shadow-sm">
      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 font-medium rounded-lg border border-red-200 dark:border-red-900">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Main Content Area */}
        <div className="md:col-span-2 space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-bold">Title *</label>
            <input type="text" name="title" defaultValue={initialData?.title} required className="w-full px-4 py-2 bg-background border border-border rounded-lg text-lg font-medium" />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold">Slug *</label>
            <input type="text" name="slug" defaultValue={initialData?.slug} required className="w-full px-4 py-2 bg-background border border-border rounded-lg font-mono text-sm" />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold">Excerpt *</label>
            <textarea name="excerpt" defaultValue={initialData?.excerpt} required rows={3} className="w-full px-4 py-2 bg-background border border-border rounded-lg resize-none" placeholder="A short summary for the blog card..." />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold">Content (Markdown or HTML) *</label>
            <input type="hidden" name="content" value={content} />
            <RichTextEditor content={content} onChange={setContent} />
          </div>
        </div>

        {/* Sidebar Settings */}
        <div className="space-y-6">
          <div className="p-4 bg-muted/30 rounded-xl border border-border space-y-4">
            <h3 className="font-bold">Publishing</h3>
            
            <div className="space-y-2">
              <label className="text-sm font-bold">Author *</label>
              <SearchableSelect 
                options={authors} 
                value={authorId} 
                onChange={setAuthorId} 
                name="authorId" 
                placeholder="Select Author..." 
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold">Category *</label>
              <SearchableSelect 
                options={categories} 
                value={categoryId} 
                onChange={setCategoryId} 
                name="categoryId" 
                placeholder="Select Category..." 
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold">Featured Post</label>
              <select name="isFeatured" defaultValue={initialData?.isFeatured ? 'true' : 'false'} className="w-full px-3 py-2 bg-background border border-border rounded-md text-sm">
                <option value="false">No</option>
                <option value="true">Yes</option>
              </select>
            </div>
          </div>

          <div className="p-4 bg-muted/30 rounded-xl border border-border space-y-4">
            <h3 className="font-bold">Media & Meta</h3>
            
            <div className="space-y-2">
              <label className="text-sm font-bold">Cover Image URL</label>
              <input type="url" name="coverImageUrl" defaultValue={initialData?.coverImageUrl} className="w-full px-3 py-2 bg-background border border-border rounded-md text-sm" />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold">Read Time (Minutes)</label>
              <input type="number" name="readTimeMinutes" defaultValue={initialData?.readTimeMinutes} className="w-full px-3 py-2 bg-background border border-border rounded-md text-sm" />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold">Tags (Comma separated)</label>
              <input type="text" name="tags" defaultValue={initialData?.tags?.join(', ')} placeholder="health, diet, tips" className="w-full px-3 py-2 bg-background border border-border rounded-md text-sm" />
            </div>
          </div>

          <div className="p-4 bg-muted/30 rounded-xl border border-border space-y-4">
            <h3 className="font-bold">SEO Optimization</h3>
            
            <div className="space-y-2">
              <label className="text-sm font-bold">Meta Title</label>
              <input type="text" name="metaTitle" defaultValue={initialData?.metaTitle} placeholder="Custom SEO Title" className="w-full px-3 py-2 bg-background border border-border rounded-md text-sm" />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold">Meta Description</label>
              <textarea name="metaDescription" defaultValue={initialData?.metaDescription} rows={3} placeholder="Custom SEO Description" className="w-full px-3 py-2 bg-background border border-border rounded-md text-sm resize-none" />
            </div>
          </div>
        </div>
      </div>

      <div className="pt-8 border-t border-border flex justify-end gap-4">
        <button 
          type="button" 
          onClick={() => router.back()}
          className="px-6 py-3 font-bold text-muted-foreground hover:text-foreground hover:bg-muted rounded-xl transition-colors"
        >
          Cancel
        </button>
        <button 
          type="submit" 
          disabled={isProcessing}
          className="flex items-center gap-2 px-6 py-3 font-bold bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-50"
        >
          {isProcessing && <Loader2 className="w-5 h-5 animate-spin" />}
          {initialData ? 'Save Changes' : 'Publish Blog'}
        </button>
      </div>
    </form>
  );
}
