import { getProducts, getCategories } from '@/app/actions';
import Image from 'next/image';

export default async function AdminDashboardPage() {
  const categories = await getCategories();
  const products = await getProducts();
  
  // Need to import prisma properly since getProducts from actions uses it implicitly? 
  // No, we can just use the products and categories we fetched.
  
  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="p-6 bg-card rounded-lg border border-border">
          <h2 className="text-xl font-semibold mb-2">Total Products</h2>
          <p className="text-4xl font-bold text-primary">{products.length}</p>
        </div>
        
        <div className="p-6 bg-card rounded-lg border border-border">
          <h2 className="text-xl font-semibold mb-2">Total Categories</h2>
          <p className="text-4xl font-bold text-primary">{categories.length}</p>
        </div>
      </div>
      
      <div className="bg-card rounded-lg border border-border overflow-hidden">
        <div className="px-6 py-4 border-b border-border bg-muted/30">
          <h2 className="font-semibold">Recent Products</h2>
        </div>
        <div className="divide-y divide-border">
          {products.slice(0, 5).map(product => (
            <div key={product.id} className="px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded bg-muted overflow-hidden relative flex-shrink-0">
                  <Image src={product.imageUrl || '/placeholder.jpg'} alt={product.title} fill className="object-cover" />
                </div>
                <div>
                  <p className="font-medium">{product.title}</p>
                  <p className="text-sm text-muted-foreground">{product.type} • {product.price}</p>
                </div>
              </div>
              <div className="text-sm text-muted-foreground">
                ID: {product.id}
              </div>
            </div>
          ))}
          {products.length === 0 && (
            <div className="px-6 py-8 text-center text-muted-foreground">
              No products found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
