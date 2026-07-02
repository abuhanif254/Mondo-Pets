'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Save, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function NewProductPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [categories, setCategories] = React.useState<{id: string, name: string}[]>([]);
  
  React.useEffect(() => {
    // Fetch categories on mount
    fetch('/api/admin/categories')
      .then(res => res.json())
      .then(data => {
        if (data.categories) setCategories(data.categories);
      })
      .catch(console.error);
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());
    
    try {
      const res = await fetch('/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      
      if (res.ok) {
        router.push('/admin/products');
      } else {
        alert('Failed to create product');
      }
    } catch (error) {
      console.error(error);
      alert('An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="flex-1 p-6 lg:p-8 max-w-5xl mx-auto w-full">
      <div className="mb-8 flex items-center gap-4">
        <Link href="/admin/products" className="p-2 rounded-full hover:bg-muted transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Add New Product</h2>
          <p className="text-muted-foreground mt-1">Manually enter product details and nutritional analysis.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8 bg-card border border-border p-6 rounded-xl shadow-sm">
        {/* Basic Info */}
        <div>
          <h3 className="text-lg font-semibold mb-4 border-b border-border pb-2">Basic Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium">Title *</label>
              <input required name="title" type="text" className="border border-border rounded-md px-3 py-2 bg-background" />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium">Category *</label>
              <select required name="categoryId" className="border border-border rounded-md px-3 py-2 bg-background">
                <option value="">Select a category</option>
                {categories.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium">Pet Type</label>
              <select name="petType" className="border border-border rounded-md px-3 py-2 bg-background">
                <option value="">Any</option>
                <option value="Dog">Dog</option>
                <option value="Cat">Cat</option>
                <option value="Bird">Bird</option>
                <option value="Small Pet">Small Pet</option>
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium">Product Type</label>
              <select name="type" className="border border-border rounded-md px-3 py-2 bg-background">
                <option value="food">Food</option>
                <option value="toy">Toy</option>
                <option value="accessory">Accessory</option>
              </select>
            </div>
          </div>
        </div>

        {/* Affiliate Info */}
        <div>
          <h3 className="text-lg font-semibold mb-4 border-b border-border pb-2">Affiliate & Pricing</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium">Price ($) *</label>
              <input required name="price" type="number" step="0.01" className="border border-border rounded-md px-3 py-2 bg-background" />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium">Commission Rate (%)</label>
              <input name="commissionRate" type="number" step="0.01" className="border border-border rounded-md px-3 py-2 bg-background" />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium">Amazon URL</label>
              <input name="amazonUrl" type="url" className="border border-border rounded-md px-3 py-2 bg-background" />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium">Chewy URL</label>
              <input name="chewyUrl" type="url" className="border border-border rounded-md px-3 py-2 bg-background" />
            </div>
            <div className="flex flex-col gap-1 md:col-span-2">
              <label className="text-sm font-medium">Other Affiliate URL</label>
              <input name="affiliateUrl" type="url" className="border border-border rounded-md px-3 py-2 bg-background" />
            </div>
          </div>
        </div>

        {/* Nutritional Info */}
        <div>
          <h3 className="text-lg font-semibold mb-4 border-b border-border pb-2">Nutritional Analysis (Food Only)</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium">Protein (%)</label>
              <input name="proteinPercent" type="number" step="0.1" className="border border-border rounded-md px-3 py-2 bg-background" />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium">Fat (%)</label>
              <input name="fatPercent" type="number" step="0.1" className="border border-border rounded-md px-3 py-2 bg-background" />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium">Fiber (%)</label>
              <input name="fiberPercent" type="number" step="0.1" className="border border-border rounded-md px-3 py-2 bg-background" />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium">Moisture (%)</label>
              <input name="moisturePercent" type="number" step="0.1" className="border border-border rounded-md px-3 py-2 bg-background" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium">Caloric Content</label>
              <input name="caloricContent" type="text" placeholder="e.g. 350 kcal/cup" className="border border-border rounded-md px-3 py-2 bg-background" />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium">Editor Rating (out of 5)</label>
              <input name="editorRating" type="number" step="0.1" min="0" max="5" className="border border-border rounded-md px-3 py-2 bg-background" />
            </div>
            <div className="flex flex-col gap-1 md:col-span-2">
              <label className="text-sm font-medium">Ingredients</label>
              <textarea name="ingredients" rows={4} placeholder="e.g. Chicken, chicken meal, brown rice..." className="border border-border rounded-md px-3 py-2 bg-background"></textarea>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <button 
            type="submit" 
            disabled={isSubmitting}
            className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-bold hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            <Save className="w-5 h-5" />
            {isSubmitting ? 'Saving...' : 'Save Product'}
          </button>
        </div>
      </form>
    </main>
  );
}
