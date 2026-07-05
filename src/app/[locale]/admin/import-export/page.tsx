'use client';

import { useState, useRef } from 'react';
import { Upload, FileDown, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function ImportExportPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [result, setResult] = useState<{ success?: boolean; message?: string; count?: number } | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setResult(null);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setIsUploading(true);
    setResult(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/admin/import/csv', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      
      if (res.ok) {
        setResult({ success: true, message: 'Products imported successfully!', count: data.count });
        setFile(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
        router.refresh();
      } else {
        setResult({ success: false, message: data.message || 'Failed to import products.' });
      }
    } catch (error: any) {
      setResult({ success: false, message: 'An unexpected error occurred.' });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Import / Export</h1>
        <p className="text-muted-foreground">Bulk manage your product catalog via CSV files.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Import Section */}
        <div className="bg-card border border-border p-6 rounded-xl shadow-sm space-y-6">
          <div>
            <h2 className="text-xl font-bold mb-1">Import Products</h2>
            <p className="text-sm text-muted-foreground">Upload a CSV file to bulk create or update products.</p>
          </div>

          <div 
            className="border-2 border-dashed border-border rounded-lg p-8 flex flex-col items-center justify-center text-center hover:bg-muted/50 transition-colors cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
          >
            <input 
              type="file" 
              accept=".csv" 
              className="hidden" 
              ref={fileInputRef} 
              onChange={handleFileChange}
            />
            <Upload className="w-10 h-10 text-muted-foreground mb-4" />
            <h3 className="font-semibold text-lg mb-1">Click to select a CSV</h3>
            <p className="text-sm text-muted-foreground">Maximum file size 5MB</p>
          </div>

          {file && (
            <div className="flex items-center justify-between p-3 bg-muted rounded-md border border-border text-sm">
              <span className="font-medium truncate">{file.name}</span>
              <button 
                onClick={handleUpload}
                disabled={isUploading}
                className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50"
              >
                {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Upload'}
              </button>
            </div>
          )}

          {result && (
            <div className={`p-4 rounded-md border flex items-start gap-3 ${result.success ? 'bg-green-50 border-green-200 text-green-800 dark:bg-green-950/30 dark:border-green-900 dark:text-green-400' : 'bg-red-50 border-red-200 text-red-800 dark:bg-red-950/30 dark:border-red-900 dark:text-red-400'}`}>
              {result.success ? <CheckCircle className="w-5 h-5 flex-shrink-0" /> : <AlertCircle className="w-5 h-5 flex-shrink-0" />}
              <div>
                <p className="font-medium">{result.message}</p>
                {result.count && <p className="text-sm opacity-90 mt-1">{result.count} products processed.</p>}
              </div>
            </div>
          )}
        </div>

        {/* Export Section */}
        <div className="bg-card border border-border p-6 rounded-xl shadow-sm space-y-6">
          <div>
            <h2 className="text-xl font-bold mb-1">Export Data</h2>
            <p className="text-sm text-muted-foreground">Download your current catalog as a CSV backup.</p>
          </div>

          <div className="space-y-4">
            <div className="p-4 border border-border rounded-lg flex items-center justify-between">
              <div>
                <h3 className="font-medium">All Products</h3>
                <p className="text-sm text-muted-foreground">Export complete catalog</p>
              </div>
              <a 
                href="/api/admin/products?export=csv" 
                target="_blank"
                className="flex items-center gap-2 bg-muted hover:bg-muted/80 text-foreground px-4 py-2 rounded-md transition-colors border border-border text-sm font-medium"
              >
                <FileDown className="w-4 h-4" />
                Download
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
