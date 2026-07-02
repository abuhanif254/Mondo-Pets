import { getHeroSlides } from '@/app/actions';
import { Link } from '@/i18n/routing';
import { Plus, Edit, Trash2 } from 'lucide-react';

export default async function AdminHeroPage() {
  const slides = await getHeroSlides();

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black">Hero Slider Management</h1>
          <p className="text-muted-foreground mt-1">Add, edit, and reorder the homepage carousel slides.</p>
        </div>
        <button className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-2 px-4 rounded-lg flex items-center gap-2">
          <Plus className="w-5 h-5" />
          Add New Slide
        </button>
      </div>

      <div className="bg-card rounded-2xl border border-border overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-muted/50 border-b border-border">
              <th className="p-4 font-bold text-sm">Order</th>
              <th className="p-4 font-bold text-sm">Preview</th>
              <th className="p-4 font-bold text-sm">Title & Subtitle</th>
              <th className="p-4 font-bold text-sm">Status</th>
              <th className="p-4 font-bold text-sm text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {slides.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-8 text-center text-muted-foreground">
                  No slides found. Click "Add New Slide" to get started.
                </td>
              </tr>
            ) : (
              slides.map((slide) => (
                <tr key={slide.id} className="border-b border-border hover:bg-muted/30 transition-colors">
                  <td className="p-4 font-bold text-lg">{slide.order}</td>
                  <td className="p-4">
                    <div 
                      className="w-24 h-12 rounded flex items-center justify-center relative overflow-hidden shadow-sm"
                      style={{ backgroundColor: slide.backgroundColor }}
                    >
                      {slide.imageUrl && <img src={slide.imageUrl} alt="" className="h-full object-contain mix-blend-luminosity" />}
                    </div>
                  </td>
                  <td className="p-4">
                    <p className="font-bold">{slide.title}</p>
                    <p className="text-xs text-muted-foreground line-clamp-1">{slide.subtitle}</p>
                  </td>
                  <td className="p-4">
                    <span className={`inline-flex px-2 py-1 rounded-full text-xs font-bold ${slide.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {slide.isActive ? 'Active' : 'Draft'}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex justify-end gap-2">
                      <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
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
    </div>
  );
}
