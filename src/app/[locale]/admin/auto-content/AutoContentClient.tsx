'use client';

import { useState } from 'react';
import { Sparkles, Tag, FileText, Loader2, CheckCircle2, AlertCircle, ExternalLink, HelpCircle } from 'lucide-react';

interface AutoContentClientProps {
  categories: any[];
  authors: any[];
}

export function AutoContentClient({ categories, authors }: AutoContentClientProps) {
  const [activeTab, setActiveTab] = useState<'product' | 'blog'>('product');

  // Product Enhancer State
  const [productUrl, setProductUrl] = useState('');
  const [productTitle, setProductTitle] = useState('');
  const [productCatId, setProductCatId] = useState(categories[0]?.id || '');
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [enhancedProduct, setEnhancedProduct] = useState<any | null>(null);
  const [isSavingProduct, setIsSavingProduct] = useState(false);
  const [productStatus, setProductStatus] = useState<{ success?: boolean; message?: string } | null>(null);

  // Blog Generator State
  const [blogTopic, setBlogTopic] = useState('');
  const [blogKeywords, setBlogKeywords] = useState('');
  const [blogCatId, setBlogCatId] = useState(categories[0]?.id || '');
  const [blogAuthorId, setBlogAuthorId] = useState(authors[0]?.id || '');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedBlog, setGeneratedBlog] = useState<any | null>(null);
  const [isSavingBlog, setIsSavingBlog] = useState(false);
  const [blogStatus, setBlogStatus] = useState<{ success?: boolean; message?: string } | null>(null);

  // --- Product Functions ---
  const handleEnhance = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productUrl) return;

    setIsEnhancing(true);
    setProductStatus(null);
    setEnhancedProduct(null);

    try {
      const res = await fetch('/api/admin/auto-content/product-enhance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: productUrl, title: productTitle })
      });

      const json = await res.json();
      if (json.success) {
        setEnhancedProduct({
          ...json.data,
          categoryId: productCatId
        });
      } else {
        setProductStatus({ success: false, message: json.message || 'Enhancement failed.' });
      }
    } catch (err: any) {
      setProductStatus({ success: false, message: 'An error occurred during generation.' });
    } finally {
      setIsEnhancing(false);
    }
  };

  const handleSaveProduct = async () => {
    if (!enhancedProduct) return;
    setIsSavingProduct(true);
    setProductStatus(null);

    try {
      const res = await fetch('/api/admin/auto-content/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'product', data: enhancedProduct })
      });

      const json = await res.json();
      if (json.success) {
        setProductStatus({ success: true, message: 'Product added successfully to catalog!' });
        setEnhancedProduct(null);
        setProductUrl('');
        setProductTitle('');
      } else {
        setProductStatus({ success: false, message: json.message || 'Failed to save product.' });
      }
    } catch (err: any) {
      setProductStatus({ success: false, message: 'Error saving product to database.' });
    } finally {
      setIsSavingProduct(false);
    }
  };

  // --- Blog Functions ---
  const handleGenerateBlog = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!blogTopic) return;

    setIsGenerating(true);
    setBlogStatus(null);
    setGeneratedBlog(null);

    try {
      const res = await fetch('/api/admin/auto-content/blog-generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: blogTopic, keywords: blogKeywords })
      });

      const json = await res.json();
      if (json.success) {
        setGeneratedBlog({
          ...json.data,
          categoryId: blogCatId,
          authorId: blogAuthorId
        });
      } else {
        setBlogStatus({ success: false, message: json.message || 'Generation failed.' });
      }
    } catch (err: any) {
      setBlogStatus({ success: false, message: 'An error occurred during article generation.' });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveBlog = async () => {
    if (!generatedBlog) return;
    setIsSavingBlog(true);
    setBlogStatus(null);

    try {
      const res = await fetch('/api/admin/auto-content/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'blog', data: generatedBlog })
      });

      const json = await res.json();
      if (json.success) {
        setBlogStatus({ success: true, message: 'Blog post published successfully as a draft!' });
        setGeneratedBlog(null);
        setBlogTopic('');
        setBlogKeywords('');
      } else {
        setBlogStatus({ success: false, message: json.message || 'Failed to save article.' });
      }
    } catch (err: any) {
      setBlogStatus({ success: false, message: 'Error saving article to database.' });
    } finally {
      setIsSavingBlog(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Tabs Switcher */}
      <div className="flex border-b border-border">
        <button
          onClick={() => setActiveTab('product')}
          className={`flex items-center gap-2 px-6 py-3 border-b-2 font-bold text-sm transition-colors ${
            activeTab === 'product'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          <Tag className="w-4 h-4" />
          ✨ Product Enhancer
        </button>
        <button
          onClick={() => setActiveTab('blog')}
          className={`flex items-center gap-2 px-6 py-3 border-b-2 font-bold text-sm transition-colors ${
            activeTab === 'blog'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          <FileText className="w-4 h-4" />
          ✍️ AI Blog Writer
        </button>
      </div>

      {/* Product Enhancer Tab */}
      {activeTab === 'product' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Input Form Column */}
            <div className="lg:col-span-1 bg-card border border-border p-6 rounded-2xl shadow-sm space-y-4">
              <div>
                <h3 className="font-bold text-lg">Enhance Product</h3>
                <p className="text-xs text-muted-foreground">Import items and automatically format affiliate URLs</p>
              </div>

              <form onSubmit={handleEnhance} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-foreground">Amazon URL or ASIN *</label>
                  <input
                    type="url"
                    placeholder="https://www.amazon.com/dp/..."
                    value={productUrl}
                    onChange={(e) => setProductUrl(e.target.value)}
                    required
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-foreground">Title Suggestion (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. Blue Buffalo Treats"
                    value={productTitle}
                    onChange={(e) => setProductTitle(e.target.value)}
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-foreground">Target Category</label>
                  <select
                    value={productCatId}
                    onChange={(e) => setProductCatId(e.target.value)}
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm"
                  >
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={isEnhancing || !productUrl}
                  className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground py-2.5 rounded-lg text-sm font-bold hover:bg-primary/95 transition-colors disabled:opacity-50"
                >
                  {isEnhancing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Analyzing Listing...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      Generate Catalog Data
                    </>
                  )}
                </button>
              </form>

              {productStatus && (
                <div
                  className={`p-4 rounded-xl border flex items-start gap-2.5 text-xs ${
                    productStatus.success
                      ? 'bg-green-50 border-green-200 text-green-800 dark:bg-green-950/20 dark:border-green-900 dark:text-green-400'
                      : 'bg-red-50 border-red-200 text-red-800 dark:bg-red-950/20 dark:border-red-900 dark:text-red-400'
                  }`}
                >
                  {productStatus.success ? (
                    <CheckCircle2 className="w-4 h-4 flex-shrink-0 animate-bounce" />
                  ) : (
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  )}
                  <div>{productStatus.message}</div>
                </div>
              )}
            </div>

            {/* Generated / Editing Result Column */}
            <div className="lg:col-span-2 space-y-4">
              {!enhancedProduct && !isEnhancing && (
                <div className="bg-card border border-border rounded-2xl p-8 flex flex-col items-center justify-center text-center text-muted-foreground h-full min-h-[300px]">
                  <HelpCircle className="w-12 h-12 text-muted-foreground/50 mb-3" />
                  <p className="font-semibold text-sm">No data generated yet</p>
                  <p className="text-xs max-w-sm mt-1">Enter an Amazon link to automatically extract prices, write affiliate copy, and build specifications.</p>
                </div>
              )}

              {isEnhancing && (
                <div className="bg-card border border-border rounded-2xl p-8 flex flex-col items-center justify-center text-center text-muted-foreground h-full min-h-[300px] animate-pulse">
                  <Loader2 className="w-12 h-12 text-primary mb-3 animate-spin" />
                  <p className="font-bold text-foreground">AI Scraper Writing Description...</p>
                  <p className="text-xs max-w-sm mt-1">Fetching metadata, calculating commission margins, and compiling ingredient stats...</p>
                </div>
              )}

              {enhancedProduct && (
                <div className="bg-card border border-border rounded-2xl p-6 shadow-sm space-y-6">
                  <div className="flex justify-between items-center border-b border-border pb-4">
                    <div>
                      <h3 className="font-bold text-lg text-foreground">Verify & Edit Generated Details</h3>
                      <p className="text-xs text-muted-foreground">Adjust properties before committing to the database</p>
                    </div>
                    <button
                      onClick={handleSaveProduct}
                      disabled={isSavingProduct}
                      className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors disabled:opacity-50"
                    >
                      {isSavingProduct ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                      Add to Catalog
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-muted-foreground">Generated Title</label>
                      <input
                        type="text"
                        value={enhancedProduct.title}
                        onChange={(e) => setEnhancedProduct({ ...enhancedProduct, title: e.target.value })}
                        className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm font-semibold"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-muted-foreground">Slug</label>
                      <input
                        type="text"
                        value={enhancedProduct.slug}
                        onChange={(e) => setEnhancedProduct({ ...enhancedProduct, slug: e.target.value })}
                        className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm font-mono text-xs"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-muted-foreground">Brand</label>
                      <input
                        type="text"
                        value={enhancedProduct.brand || ''}
                        onChange={(e) => setEnhancedProduct({ ...enhancedProduct, brand: e.target.value })}
                        className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-muted-foreground">Price ($)</label>
                        <input
                          type="number"
                          step="0.01"
                          value={enhancedProduct.price}
                          onChange={(e) => setEnhancedProduct({ ...enhancedProduct, price: parseFloat(e.target.value) || 0.0 })}
                          className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-muted-foreground">Editor Rating (0 - 5.0)</label>
                        <input
                          type="number"
                          step="0.1"
                          value={enhancedProduct.editorRating || 4.5}
                          onChange={(e) => setEnhancedProduct({ ...enhancedProduct, editorRating: parseFloat(e.target.value) || 4.5 })}
                          className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 border-t border-border pt-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-muted-foreground">Pet Type</label>
                      <input
                        type="text"
                        value={enhancedProduct.petType || ''}
                        onChange={(e) => setEnhancedProduct({ ...enhancedProduct, petType: e.target.value })}
                        className="w-full px-3 py-1.5 bg-background border border-border rounded-lg text-xs"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-muted-foreground">Type</label>
                      <select
                        value={enhancedProduct.type}
                        onChange={(e) => setEnhancedProduct({ ...enhancedProduct, type: e.target.value })}
                        className="w-full px-3 py-1.5 bg-background border border-border rounded-lg text-xs"
                      >
                        <option value="food">Food</option>
                        <option value="toy">Toy</option>
                        <option value="accessory">Accessory</option>
                        <option value="medicine">Medicine</option>
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-muted-foreground">ASIN</label>
                      <input
                        type="text"
                        value={enhancedProduct.amazonASIN || ''}
                        onChange={(e) => setEnhancedProduct({ ...enhancedProduct, amazonASIN: e.target.value })}
                        className="w-full px-3 py-1.5 bg-background border border-border rounded-lg text-xs font-mono"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-muted-foreground">Commission (%)</label>
                      <input
                        type="number"
                        step="0.1"
                        value={enhancedProduct.commissionRate || 4.5}
                        onChange={(e) => {
                          const rate = parseFloat(e.target.value) || 0.0;
                          setEnhancedProduct({
                            ...enhancedProduct,
                            commissionRate: rate,
                            estimatedMargin: parseFloat(((enhancedProduct.price * rate) / 100).toFixed(2))
                          });
                        }}
                        className="w-full px-3 py-1.5 bg-background border border-border rounded-lg text-xs"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-muted-foreground flex items-center justify-between">
                      <span>Affiliate Target Link (Embedded Tag)</span>
                      <a href={enhancedProduct.amazonUrl} target="_blank" rel="noopener noreferrer" className="text-[10px] text-blue-500 hover:underline flex items-center gap-0.5">
                        Link Preview <ExternalLink className="w-2.5 h-2.5" />
                      </a>
                    </label>
                    <input
                      type="text"
                      readOnly
                      value={enhancedProduct.amazonUrl || ''}
                      className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-xs font-mono text-muted-foreground select-all"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-muted-foreground">Affiliate Description (HTML)</label>
                    <textarea
                      rows={5}
                      value={enhancedProduct.description}
                      onChange={(e) => setEnhancedProduct({ ...enhancedProduct, description: e.target.value })}
                      className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm resize-none"
                    />
                  </div>

                  {enhancedProduct.type === 'food' && (
                    <div className="space-y-3 border-t border-border pt-4">
                      <h4 className="text-xs font-bold text-foreground">Nutritional Profile (Food only)</h4>
                      <div className="grid grid-cols-4 gap-2">
                        <div className="space-y-1">
                          <label className="text-[9px] font-bold text-muted-foreground">Protein %</label>
                          <input
                            type="number"
                            step="0.1"
                            value={enhancedProduct.proteinPercent || ''}
                            onChange={(e) => setEnhancedProduct({ ...enhancedProduct, proteinPercent: parseFloat(e.target.value) || null })}
                            className="w-full px-2 py-1 bg-background border border-border rounded-lg text-xs"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[9px] font-bold text-muted-foreground">Fat %</label>
                          <input
                            type="number"
                            step="0.1"
                            value={enhancedProduct.fatPercent || ''}
                            onChange={(e) => setEnhancedProduct({ ...enhancedProduct, fatPercent: parseFloat(e.target.value) || null })}
                            className="w-full px-2 py-1 bg-background border border-border rounded-lg text-xs"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[9px] font-bold text-muted-foreground">Fiber %</label>
                          <input
                            type="number"
                            step="0.1"
                            value={enhancedProduct.fiberPercent || ''}
                            onChange={(e) => setEnhancedProduct({ ...enhancedProduct, fiberPercent: parseFloat(e.target.value) || null })}
                            className="w-full px-2 py-1 bg-background border border-border rounded-lg text-xs"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[9px] font-bold text-muted-foreground">Moisture %</label>
                          <input
                            type="number"
                            step="0.1"
                            value={enhancedProduct.moisturePercent || ''}
                            onChange={(e) => setEnhancedProduct({ ...enhancedProduct, moisturePercent: parseFloat(e.target.value) || null })}
                            className="w-full px-2 py-1 bg-background border border-border rounded-lg text-xs"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* AI Blog Writer Tab */}
      {activeTab === 'blog' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Input Form Column */}
            <div className="lg:col-span-1 bg-card border border-border p-6 rounded-2xl shadow-sm space-y-4">
              <div>
                <h3 className="font-bold text-lg">Write Article Outline</h3>
                <p className="text-xs text-muted-foreground">Input topic and search queries to write optimized drafts</p>
              </div>

              <form onSubmit={handleGenerateBlog} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-foreground">Blog Topic / Title *</label>
                  <input
                    type="text"
                    placeholder="e.g. Best Joint Supplements for Dogs"
                    value={blogTopic}
                    onChange={(e) => setBlogTopic(e.target.value)}
                    required
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-foreground">SEO Target Keywords</label>
                  <input
                    type="text"
                    placeholder="dog joint supplements, best dog arthritis remedies"
                    value={blogKeywords}
                    onChange={(e) => setBlogKeywords(e.target.value)}
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-foreground">Target Category</label>
                  <select
                    value={blogCatId}
                    onChange={(e) => setBlogCatId(e.target.value)}
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm"
                  >
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-foreground">Author Profile</label>
                  <select
                    value={blogAuthorId}
                    onChange={(e) => setBlogAuthorId(e.target.value)}
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm"
                  >
                    {authors.map((auth) => (
                      <option key={auth.id} value={auth.id}>
                        {auth.name} ({auth.credentials})
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={isGenerating || !blogTopic}
                  className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground py-2.5 rounded-lg text-sm font-bold hover:bg-primary/95 transition-colors disabled:opacity-50"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Drafting Content...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      Generate Affiliate Article
                    </>
                  )}
                </button>
              </form>

              {blogStatus && (
                <div
                  className={`p-4 rounded-xl border flex items-start gap-2.5 text-xs ${
                    blogStatus.success
                      ? 'bg-green-50 border-green-200 text-green-800 dark:bg-green-950/20 dark:border-green-900 dark:text-green-400'
                      : 'bg-red-50 border-red-200 text-red-800 dark:bg-red-950/20 dark:border-red-900 dark:text-red-400'
                  }`}
                >
                  {blogStatus.success ? (
                    <CheckCircle2 className="w-4 h-4 flex-shrink-0 animate-bounce" />
                  ) : (
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  )}
                  <div>{blogStatus.message}</div>
                </div>
              )}
            </div>

            {/* Generated / Editing Result Column */}
            <div className="lg:col-span-2 space-y-4">
              {!generatedBlog && !isGenerating && (
                <div className="bg-card border border-border rounded-2xl p-8 flex flex-col items-center justify-center text-center text-muted-foreground h-full min-h-[300px]">
                  <HelpCircle className="w-12 h-12 text-muted-foreground/50 mb-3" />
                  <p className="font-semibold text-sm">No draft generated yet</p>
                  <p className="text-xs max-w-sm mt-1">Specify a target topic and keywords. The engine will draft listicles embedded with affiliate recommendation cards.</p>
                </div>
              )}

              {isGenerating && (
                <div className="bg-card border border-border rounded-2xl p-8 flex flex-col items-center justify-center text-center text-muted-foreground h-full min-h-[300px] animate-pulse">
                  <Loader2 className="w-12 h-12 text-primary mb-3 animate-spin" />
                  <p className="font-bold text-foreground">AI Writing SEO Article Copy...</p>
                  <p className="text-xs max-w-sm mt-1">Generating outlines, building headings, and adding affiliate placeholder tokens...</p>
                </div>
              )}

              {generatedBlog && (
                <div className="bg-card border border-border rounded-2xl p-6 shadow-sm space-y-6">
                  <div className="flex justify-between items-center border-b border-border pb-4">
                    <div>
                      <h3 className="font-bold text-lg text-foreground">Verify & Edit Blog Article</h3>
                      <p className="text-xs text-muted-foreground">Adjust text and headers before saving as a draft</p>
                    </div>
                    <button
                      onClick={handleSaveBlog}
                      disabled={isSavingBlog}
                      className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors disabled:opacity-50"
                    >
                      {isSavingBlog ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                      Publish Draft
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-muted-foreground">Article Title</label>
                      <input
                        type="text"
                        value={generatedBlog.title}
                        onChange={(e) => setGeneratedBlog({ ...generatedBlog, title: e.target.value })}
                        className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm font-semibold"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-muted-foreground">URL Slug</label>
                      <input
                        type="text"
                        value={generatedBlog.slug}
                        onChange={(e) => setGeneratedBlog({ ...generatedBlog, slug: e.target.value })}
                        className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm font-mono text-xs"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-muted-foreground">SEO Meta Excerpt</label>
                    <textarea
                      rows={2}
                      value={generatedBlog.excerpt}
                      onChange={(e) => setGeneratedBlog({ ...generatedBlog, excerpt: e.target.value })}
                      className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm resize-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-muted-foreground">Article Body (HTML/Markdown)</label>
                    <textarea
                      rows={12}
                      value={generatedBlog.content}
                      onChange={(e) => setGeneratedBlog({ ...generatedBlog, content: e.target.value })}
                      className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm font-mono text-xs resize-none"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
