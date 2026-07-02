import { getProductsNeedingSeo } from '@/app/actions';
import { AutoContentClient } from '@/components/AutoContentClient';

export default async function AutoContentPage() {
  const products = await getProductsNeedingSeo();

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 text-emerald-600">AI Content Automation</h1>
        <p className="text-muted-foreground">
          Automatically generate highly optimized SEO descriptions for products imported with missing or minimal content.
        </p>
      </div>
      
      <AutoContentClient initialProducts={products} />
    </div>
  );
}
