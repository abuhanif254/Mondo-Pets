'use client';

import { useState } from 'react';
import { createTopBanner, updateTopBanner, deleteTopBanner, createHeroSlide, updateHeroSlide, deleteHeroSlide, createListicle, updateListicle, deleteListicle } from '@/app/actions/layout-settings';
import { Plus, Edit2, Trash2, X, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function LayoutSettingsClient({ banners, slides, listicles }: { banners: any[], slides: any[], listicles: any[] }) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'banners' | 'slides' | 'listicles'>('banners');
  const [isProcessing, setIsProcessing] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);

  const handleSaveBanner = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsProcessing(true);
    const formData = new FormData(e.currentTarget);
    const data = {
      text: formData.get('text') as string,
      linkUrl: formData.get('linkUrl') as string,
      bgColor: formData.get('bgColor') as string,
      textColor: formData.get('textColor') as string,
      isActive: formData.get('isActive') === 'true'
    };

    if (editingItem?.id) {
      await updateTopBanner(editingItem.id, data);
    } else {
      await createTopBanner(data);
    }
    
    setEditingItem(null);
    setIsProcessing(false);
    router.refresh();
  };

  const handleSaveSlide = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsProcessing(true);
    const formData = new FormData(e.currentTarget);
    const data = {
      title: formData.get('title') as string,
      subtitle: formData.get('subtitle') as string,
      ctaText: formData.get('ctaText') as string,
      ctaUrl: formData.get('ctaUrl') as string,
      imageUrl: formData.get('imageUrl') as string,
      backgroundColor: formData.get('backgroundColor') as string,
      order: parseInt(formData.get('order') as string || '0'),
      isActive: formData.get('isActive') === 'true'
    };

    if (editingItem?.id) {
      await updateHeroSlide(editingItem.id, data);
    } else {
      await createHeroSlide(data);
    }
    
    setEditingItem(null);
    setIsProcessing(false);
    router.refresh();
  };

  const handleSaveListicle = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsProcessing(true);
    const formData = new FormData(e.currentTarget);
    const data = {
      title: formData.get('title') as string,
      slug: formData.get('slug') as string,
      description: formData.get('description') as string,
      seoTitle: formData.get('seoTitle') as string,
      seoDesc: formData.get('seoDesc') as string,
      petType: formData.get('petType') as string,
      productType: formData.get('productType') as string,
      dietaryNeeds: formData.get('dietaryNeeds') as string,
      minRating: formData.get('minRating') ? parseFloat(formData.get('minRating') as string) : null,
      isActive: formData.get('isActive') === 'true'
    };

    if (editingItem?.id) {
      await updateListicle(editingItem.id, data);
    } else {
      await createListicle(data);
    }
    
    setEditingItem(null);
    setIsProcessing(false);
    router.refresh();
  };

  const handleDelete = async (type: 'banner' | 'slide' | 'listicle', id: string) => {
    if (!confirm('Delete this layout item?')) return;
    setIsProcessing(true);
    if (type === 'banner') await deleteTopBanner(id);
    if (type === 'slide') await deleteHeroSlide(id);
    if (type === 'listicle') await deleteListicle(id);
    setIsProcessing(false);
    router.refresh();
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Layout Settings</h1>
      
      <div className="flex gap-4 border-b border-border pb-px">
        <button 
          onClick={() => setActiveTab('banners')}
          className={`pb-2 font-medium border-b-2 transition-colors ${activeTab === 'banners' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
        >
          Top Banners
        </button>
        <button 
          onClick={() => setActiveTab('slides')}
          className={`pb-2 font-medium border-b-2 transition-colors ${activeTab === 'slides' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
        >
          Hero Slides
        </button>
        <button 
          onClick={() => setActiveTab('listicles')}
          className={`pb-2 font-medium border-b-2 transition-colors ${activeTab === 'listicles' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
        >
          Dynamic Listicles
        </button>
      </div>

      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">
            {activeTab === 'banners' && 'Manage Top Banners'}
            {activeTab === 'slides' && 'Manage Hero Carousel'}
            {activeTab === 'listicles' && 'Manage Auto-Generated Listicles'}
          </h2>
          <button 
            onClick={() => setEditingItem({ type: activeTab })}
            className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors font-medium"
          >
            <Plus className="w-4 h-4" /> Add New
          </button>
        </div>

        {/* Banners List */}
        {activeTab === 'banners' && (
          <div className="space-y-4">
            {banners.map(banner => (
              <div key={banner.id} className="flex justify-between items-center p-4 border border-border rounded-lg bg-muted/30">
                <div>
                  <p className="font-bold">{banner.text}</p>
                  <p className="text-sm text-muted-foreground">{banner.linkUrl}</p>
                  <div className="mt-2 flex gap-2 items-center">
                    <span className="text-xs px-2 py-1 rounded border border-border" style={{ backgroundColor: banner.bgColor, color: banner.textColor }}>Color Preview</span>
                    <span className={`text-xs px-2 py-1 rounded ${banner.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-muted text-muted-foreground'}`}>
                      {banner.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setEditingItem({ ...banner, type: 'banners' })} className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-md"><Edit2 className="w-4 h-4" /></button>
                  <button onClick={() => handleDelete('banner', banner.id)} className="p-2 text-muted-foreground hover:text-red-600 hover:bg-red-50 rounded-md"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Slides List */}
        {activeTab === 'slides' && (
          <div className="space-y-4">
            {slides.map(slide => (
              <div key={slide.id} className="flex justify-between items-center p-4 border border-border rounded-lg bg-muted/30">
                <div>
                  <p className="font-bold">Order: {slide.order} - {slide.title}</p>
                  <p className="text-sm text-muted-foreground">{slide.subtitle}</p>
                  <div className="mt-2 flex gap-2 items-center">
                    <span className="text-xs px-2 py-1 rounded border border-border" style={{ backgroundColor: slide.backgroundColor }}>Bg Color</span>
                    <span className={`text-xs px-2 py-1 rounded ${slide.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-muted text-muted-foreground'}`}>
                      {slide.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setEditingItem({ ...slide, type: 'slides' })} className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-md"><Edit2 className="w-4 h-4" /></button>
                  <button onClick={() => handleDelete('slide', slide.id)} className="p-2 text-muted-foreground hover:text-red-600 hover:bg-red-50 rounded-md"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Listicles List */}
        {activeTab === 'listicles' && (
          <div className="space-y-4">
            {listicles.map(listicle => (
              <div key={listicle.id} className="flex justify-between items-center p-4 border border-border rounded-lg bg-muted/30">
                <div>
                  <p className="font-bold">{listicle.title}</p>
                  <p className="text-sm font-mono text-muted-foreground">/{listicle.slug}</p>
                  <div className="mt-2 flex flex-wrap gap-2 items-center">
                    {listicle.petType && <span className="text-xs px-2 py-1 rounded bg-blue-100 text-blue-800 border border-blue-200">Pet: {listicle.petType}</span>}
                    {listicle.productType && <span className="text-xs px-2 py-1 rounded bg-purple-100 text-purple-800 border border-purple-200">Type: {listicle.productType}</span>}
                    {listicle.dietaryNeeds && <span className="text-xs px-2 py-1 rounded bg-amber-100 text-amber-800 border border-amber-200">Diet: {listicle.dietaryNeeds}</span>}
                    <span className={`text-xs px-2 py-1 rounded ${listicle.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-muted text-muted-foreground'}`}>
                      {listicle.isActive ? 'Active' : 'Draft'}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setEditingItem({ ...listicle, type: 'listicles' })} className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-md"><Edit2 className="w-4 h-4" /></button>
                  <button onClick={() => handleDelete('listicle', listicle.id)} className="p-2 text-muted-foreground hover:text-red-600 hover:bg-red-50 rounded-md"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Editor Modal */}
      {editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-card border border-border shadow-xl rounded-xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-6 border-b border-border bg-muted/10">
              <h2 className="text-xl font-bold capitalize">
                {editingItem.id ? 'Edit' : 'New'} {editingItem.type.slice(0, -1)}
              </h2>
              <button onClick={() => setEditingItem(null)} className="text-muted-foreground hover:text-foreground">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={
              editingItem.type === 'banners' ? handleSaveBanner :
              editingItem.type === 'slides' ? handleSaveSlide :
              handleSaveListicle
            } className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              
              {editingItem.type === 'banners' && (
                <>
                  <div className="space-y-2">
                    <label className="text-sm font-bold">Banner Text *</label>
                    <input type="text" name="text" defaultValue={editingItem.text} required className="w-full px-3 py-2 bg-background border border-border rounded-md" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold">Link URL</label>
                    <input type="text" name="linkUrl" defaultValue={editingItem.linkUrl} className="w-full px-3 py-2 bg-background border border-border rounded-md" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-bold">Background Color</label>
                      <input type="text" name="bgColor" defaultValue={editingItem.bgColor || '#e6f4ca'} required className="w-full px-3 py-2 bg-background border border-border rounded-md font-mono" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold">Text Color</label>
                      <input type="text" name="textColor" defaultValue={editingItem.textColor || '#2c5305'} required className="w-full px-3 py-2 bg-background border border-border rounded-md font-mono" />
                    </div>
                  </div>
                </>
              )}

              {editingItem.type === 'slides' && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-bold">Title *</label>
                      <input type="text" name="title" defaultValue={editingItem.title} required className="w-full px-3 py-2 bg-background border border-border rounded-md" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold">Order (0 = first) *</label>
                      <input type="number" name="order" defaultValue={editingItem.order || 0} required className="w-full px-3 py-2 bg-background border border-border rounded-md" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold">Subtitle</label>
                    <input type="text" name="subtitle" defaultValue={editingItem.subtitle} className="w-full px-3 py-2 bg-background border border-border rounded-md" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-bold">CTA Text *</label>
                      <input type="text" name="ctaText" defaultValue={editingItem.ctaText} required className="w-full px-3 py-2 bg-background border border-border rounded-md" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold">CTA URL *</label>
                      <input type="text" name="ctaUrl" defaultValue={editingItem.ctaUrl} required className="w-full px-3 py-2 bg-background border border-border rounded-md" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-bold">Background Color *</label>
                      <input type="text" name="backgroundColor" defaultValue={editingItem.backgroundColor || '#f4f4f5'} required className="w-full px-3 py-2 bg-background border border-border rounded-md font-mono" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold">Image URL</label>
                      <input type="url" name="imageUrl" defaultValue={editingItem.imageUrl} className="w-full px-3 py-2 bg-background border border-border rounded-md" />
                    </div>
                  </div>
                </>
              )}

              {editingItem.type === 'listicles' && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-bold">Listicle Title *</label>
                      <input type="text" name="title" defaultValue={editingItem.title} required className="w-full px-3 py-2 bg-background border border-border rounded-md" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold">URL Slug *</label>
                      <input type="text" name="slug" defaultValue={editingItem.slug} required className="w-full px-3 py-2 bg-background border border-border rounded-md font-mono" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold">Description</label>
                    <textarea name="description" defaultValue={editingItem.description} rows={3} className="w-full px-3 py-2 bg-background border border-border rounded-md resize-none" />
                  </div>
                  
                  <h3 className="font-bold pt-4 border-t border-border">Auto-Query Filters (Optional)</h3>
                  <p className="text-xs text-muted-foreground mb-4">Set these to automatically pull products into this listicle.</p>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-bold">Pet Type (e.g. Dog)</label>
                      <input type="text" name="petType" defaultValue={editingItem.petType} className="w-full px-3 py-2 bg-background border border-border rounded-md" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold">Product Type (e.g. food)</label>
                      <input type="text" name="productType" defaultValue={editingItem.productType} className="w-full px-3 py-2 bg-background border border-border rounded-md" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold">Dietary Needs (e.g. Grain-Free)</label>
                      <input type="text" name="dietaryNeeds" defaultValue={editingItem.dietaryNeeds} className="w-full px-3 py-2 bg-background border border-border rounded-md" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold">Min Editor Rating</label>
                      <input type="number" step="0.1" name="minRating" defaultValue={editingItem.minRating?.toString()} className="w-full px-3 py-2 bg-background border border-border rounded-md" />
                    </div>
                  </div>

                  <h3 className="font-bold pt-4 border-t border-border">SEO Overrides (Optional)</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-bold">SEO Title</label>
                      <input type="text" name="seoTitle" defaultValue={editingItem.seoTitle} className="w-full px-3 py-2 bg-background border border-border rounded-md" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold">SEO Description</label>
                      <input type="text" name="seoDesc" defaultValue={editingItem.seoDesc} className="w-full px-3 py-2 bg-background border border-border rounded-md" />
                    </div>
                  </div>
                </>
              )}

              <div className="space-y-2 pt-4 border-t border-border">
                <label className="text-sm font-bold">Status</label>
                <select name="isActive" defaultValue={editingItem.isActive !== false ? 'true' : 'false'} className="w-full px-3 py-2 bg-background border border-border rounded-md">
                  <option value="true">Active (Visible)</option>
                  <option value="false">Inactive (Hidden)</option>
                </select>
              </div>

              <div className="pt-6 flex gap-3 justify-end">
                <button type="button" onClick={() => setEditingItem(null)} className="px-4 py-2 font-medium text-muted-foreground hover:bg-muted rounded-md transition-colors">Cancel</button>
                <button type="submit" disabled={isProcessing} className="flex items-center gap-2 px-4 py-2 font-medium bg-primary text-primary-foreground hover:bg-primary/90 rounded-md transition-colors disabled:opacity-50">
                  {isProcessing && <Loader2 className="w-4 h-4 animate-spin" />}
                  Save Settings
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
