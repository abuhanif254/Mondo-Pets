'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createProduct, updateProduct } from '@/app/actions/products';
import { Loader2 } from 'lucide-react';
import { RichTextEditor } from '@/components/admin/RichTextEditor';
import { SearchableSelect } from '@/components/admin/SearchableSelect';

export function ProductForm({ categories, initialData }: { categories: any[]; initialData?: any }) {
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [description, setDescription] = useState(initialData?.description || '');
  const [categoryId, setCategoryId] = useState(initialData?.categoryId || '');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsProcessing(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const data: Record<string, any> = {};
    formData.forEach((value, key) => {
      if (value) data[key] = value;
    });

    data.inStock = formData.get('inStock') === 'true';

    let result;
    if (initialData?.id) {
      result = await updateProduct(initialData.id, data);
    } else {
      result = await createProduct(data);
    }

    if (result.success) {
      router.push('/en/admin/products');
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Basic Info */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold border-b border-border pb-2">Basic Information</h2>
          
          <div className="space-y-2">
            <label className="text-sm font-bold">Title *</label>
            <input type="text" name="title" defaultValue={initialData?.title} required className="w-full px-4 py-2 bg-background border border-border rounded-lg" />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold">Slug *</label>
            <input type="text" name="slug" defaultValue={initialData?.slug} required className="w-full px-4 py-2 bg-background border border-border rounded-lg font-mono text-sm" />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold">Category *</label>
            <SearchableSelect 
              options={categories} 
              value={categoryId} 
              onChange={setCategoryId} 
              name="categoryId" 
              placeholder="Select a category..." 
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold">Type *</label>
            <select name="type" defaultValue={initialData?.type || 'food'} required className="w-full px-4 py-2 bg-background border border-border rounded-lg">
              <option value="food">Food</option>
              <option value="toy">Toy</option>
              <option value="accessory">Accessory</option>
              <option value="medicine">Medicine</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-bold">Pet Type</label>
              <input type="text" name="petType" defaultValue={initialData?.petType} placeholder="Dog, Cat..." className="w-full px-4 py-2 bg-background border border-border rounded-lg" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold">Brand</label>
              <input type="text" name="brand" defaultValue={initialData?.brand} className="w-full px-4 py-2 bg-background border border-border rounded-lg" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold">Description</label>
            <input type="hidden" name="description" value={description} />
            <RichTextEditor content={description} onChange={setDescription} />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-bold">Image URL</label>
            <input type="url" name="imageUrl" defaultValue={initialData?.imageUrl} className="w-full px-4 py-2 bg-background border border-border rounded-lg" />
          </div>
        </div>

        {/* Affiliate & Pricing */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold border-b border-border pb-2">Pricing & Affiliate</h2>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-bold">Price</label>
              <input type="number" step="0.01" name="price" defaultValue={initialData?.price} className="w-full px-4 py-2 bg-background border border-border rounded-lg" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold">Currency</label>
              <input type="text" name="currency" defaultValue={initialData?.currency || 'USD'} className="w-full px-4 py-2 bg-background border border-border rounded-lg" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold">Amazon URL</label>
            <input type="url" name="amazonUrl" defaultValue={initialData?.amazonUrl} className="w-full px-4 py-2 bg-background border border-border rounded-lg" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-bold">Amazon ASIN</label>
              <input type="text" name="amazonASIN" defaultValue={initialData?.amazonASIN} className="w-full px-4 py-2 bg-background border border-border rounded-lg font-mono text-sm" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold">Chewy URL</label>
              <input type="url" name="chewyUrl" defaultValue={initialData?.chewyUrl} className="w-full px-4 py-2 bg-background border border-border rounded-lg" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold">Other Affiliate URL</label>
            <input type="url" name="affiliateUrl" defaultValue={initialData?.affiliateUrl} className="w-full px-4 py-2 bg-background border border-border rounded-lg" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-bold">Commission Rate (%)</label>
              <input type="number" step="0.01" name="commissionRate" defaultValue={initialData?.commissionRate} className="w-full px-4 py-2 bg-background border border-border rounded-lg" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold">Estimated Margin ($)</label>
              <input type="number" step="0.01" name="estimatedMargin" defaultValue={initialData?.estimatedMargin} className="w-full px-4 py-2 bg-background border border-border rounded-lg" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold">In Stock</label>
            <select name="inStock" defaultValue={initialData?.inStock !== false ? 'true' : 'false'} className="w-full px-4 py-2 bg-background border border-border rounded-lg">
              <option value="true">Yes</option>
              <option value="false">No</option>
            </select>
          </div>
        </div>
        
        {/* Nutritional Details (Optional) */}
        <div className="space-y-6 md:col-span-2">
          <h2 className="text-xl font-bold border-b border-border pb-2">Nutritional & Detailed Info (Optional)</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-bold">Protein (%)</label>
              <input type="number" step="0.01" name="proteinPercent" defaultValue={initialData?.proteinPercent} className="w-full px-4 py-2 bg-background border border-border rounded-lg" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold">Fat (%)</label>
              <input type="number" step="0.01" name="fatPercent" defaultValue={initialData?.fatPercent} className="w-full px-4 py-2 bg-background border border-border rounded-lg" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold">Fiber (%)</label>
              <input type="number" step="0.01" name="fiberPercent" defaultValue={initialData?.fiberPercent} className="w-full px-4 py-2 bg-background border border-border rounded-lg" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold">Moisture (%)</label>
              <input type="number" step="0.01" name="moisturePercent" defaultValue={initialData?.moisturePercent} className="w-full px-4 py-2 bg-background border border-border rounded-lg" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-bold">Caloric Content</label>
              <input type="text" name="caloricContent" defaultValue={initialData?.caloricContent} placeholder="e.g. 350 kcal/cup" className="w-full px-4 py-2 bg-background border border-border rounded-lg" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold">Life Stage</label>
              <input type="text" name="lifeStage" defaultValue={initialData?.lifeStage} placeholder="Puppy, Adult, Senior" className="w-full px-4 py-2 bg-background border border-border rounded-lg" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold">Dietary Needs</label>
              <input type="text" name="dietaryNeeds" defaultValue={initialData?.dietaryNeeds} placeholder="Grain-Free, High-Protein" className="w-full px-4 py-2 bg-background border border-border rounded-lg" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold">Ingredients</label>
            <textarea name="ingredients" defaultValue={initialData?.ingredients} rows={3} className="w-full px-4 py-2 bg-background border border-border rounded-lg resize-none" />
          </div>

          <div className="space-y-2 max-w-xs">
            <label className="text-sm font-bold">Editor Rating (out of 5.0)</label>
            <input type="number" step="0.1" min="0" max="5" name="editorRating" defaultValue={initialData?.editorRating} className="w-full px-4 py-2 bg-background border border-border rounded-lg" />
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
          {initialData ? 'Save Changes' : 'Create Product'}
        </button>
      </div>
    </form>
  );
}
