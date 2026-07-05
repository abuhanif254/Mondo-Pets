'use client';

import { useState } from 'react';
import { Plus, Edit2, Trash2, Loader2, X } from 'lucide-react';
import { createAuthor, updateAuthor, deleteAuthor } from '@/app/actions/authors';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export function AuthorClient({ initialAuthors }: { initialAuthors: any[] }) {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [name, setName] = useState('');
  const [credentials, setCredentials] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [bio, setBio] = useState('');
  const [twitterUrl, setTwitterUrl] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [expertise, setExpertise] = useState(''); // Comma separated

  const openModal = (author?: any) => {
    setError(null);
    if (author) {
      setEditingId(author.id);
      setName(author.name);
      setCredentials(author.credentials || '');
      setAvatarUrl(author.avatarUrl || '');
      setBio(author.bio || '');
      setTwitterUrl(author.twitterUrl || '');
      setWebsiteUrl(author.websiteUrl || '');
      setExpertise(author.expertise?.join(', ') || '');
    } else {
      setEditingId(null);
      setName('');
      setCredentials('');
      setAvatarUrl('');
      setBio('');
      setTwitterUrl('');
      setWebsiteUrl('');
      setExpertise('');
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setError(null);

    const expertiseArray = expertise.split(',').map(s => s.trim()).filter(Boolean);
    const data = { 
      name, 
      credentials, 
      avatarUrl, 
      bio, 
      twitterUrl, 
      websiteUrl, 
      expertise: expertiseArray 
    };

    let result;
    if (editingId) {
      result = await updateAuthor(editingId, data);
    } else {
      result = await createAuthor(data);
    }

    if (result.success) {
      setIsModalOpen(false);
      router.refresh();
    } else {
      setError(result.message);
    }
    setIsProcessing(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this author?')) return;
    setIsProcessing(true);
    const result = await deleteAuthor(id);
    if (result.success) {
      router.refresh();
    } else {
      alert(result.message);
    }
    setIsProcessing(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Authors</h1>
        <button 
          onClick={() => openModal()}
          className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors font-medium"
        >
          <Plus className="w-4 h-4" />
          Add Author
        </button>
      </div>

      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-muted/30 border-b border-border">
              <th className="px-6 py-4 font-semibold text-sm w-16">Avatar</th>
              <th className="px-6 py-4 font-semibold text-sm">Info</th>
              <th className="px-6 py-4 font-semibold text-sm hidden md:table-cell">Expertise</th>
              <th className="px-6 py-4 font-semibold text-sm text-center">Blogs</th>
              <th className="px-6 py-4 font-semibold text-sm text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {initialAuthors.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">
                  No authors found. Add one to start blogging!
                </td>
              </tr>
            ) : (
              initialAuthors.map(author => (
                <tr key={author.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="w-10 h-10 rounded-full bg-muted overflow-hidden relative border border-border flex-shrink-0">
                      <Image src={author.avatarUrl || '/placeholder.jpg'} alt={author.name} fill className="object-cover" />
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-bold text-foreground">{author.name}</div>
                    {author.credentials && (
                      <div className="text-xs font-medium text-emerald-600 dark:text-emerald-400 mt-1">{author.credentials}</div>
                    )}
                  </td>
                  <td className="px-6 py-4 hidden md:table-cell">
                    <div className="flex flex-wrap gap-1">
                      {author.expertise?.map((exp: string) => (
                        <span key={exp} className="bg-muted px-2 py-1 rounded text-xs font-medium">
                          {exp}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="font-bold text-primary">{author._count.blogs}</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button 
                        onClick={() => openModal(author)}
                        className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-md transition-colors"
                        title="Edit"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(author.id)}
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

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-card border border-border shadow-xl rounded-xl w-full max-w-2xl my-8 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h2 className="text-xl font-bold">{editingId ? 'Edit Author' : 'New Author'}</h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              {error && (
                <div className="p-3 bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 text-sm font-medium rounded-md border border-red-200 dark:border-red-900">
                  {error}
                </div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold">Name *</label>
                  <input type="text" value={name} onChange={(e) => setName(e.target.value)} required className="w-full px-3 py-2 bg-background border border-border rounded-md" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold">Credentials (e.g. DVM)</label>
                  <input type="text" value={credentials} onChange={(e) => setCredentials(e.target.value)} className="w-full px-3 py-2 bg-background border border-border rounded-md" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold">Avatar URL</label>
                <input type="url" value={avatarUrl} onChange={(e) => setAvatarUrl(e.target.value)} className="w-full px-3 py-2 bg-background border border-border rounded-md" />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold">Bio</label>
                <textarea value={bio} onChange={(e) => setBio(e.target.value)} rows={3} className="w-full px-3 py-2 bg-background border border-border rounded-md resize-none" />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold">Expertise (Comma separated)</label>
                <input type="text" value={expertise} onChange={(e) => setExpertise(e.target.value)} placeholder="Nutrition, Orthopedics" className="w-full px-3 py-2 bg-background border border-border rounded-md" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold">Twitter URL</label>
                  <input type="url" value={twitterUrl} onChange={(e) => setTwitterUrl(e.target.value)} className="w-full px-3 py-2 bg-background border border-border rounded-md" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold">Website URL</label>
                  <input type="url" value={websiteUrl} onChange={(e) => setWebsiteUrl(e.target.value)} className="w-full px-3 py-2 bg-background border border-border rounded-md" />
                </div>
              </div>

              <div className="pt-4 flex gap-3 justify-end border-t border-border mt-6">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={isProcessing}
                  className="flex items-center gap-2 px-4 py-2 font-medium bg-primary text-primary-foreground hover:bg-primary/90 rounded-md transition-colors disabled:opacity-50"
                >
                  {isProcessing && <Loader2 className="w-4 h-4 animate-spin" />}
                  {editingId ? 'Save Changes' : 'Create Author'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
