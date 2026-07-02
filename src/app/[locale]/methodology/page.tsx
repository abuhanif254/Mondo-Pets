import { Metadata } from 'next';
import { ShieldCheck, Scale, Microscope, HeartHandshake } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Our Methodology | Mondo Pets',
  description: 'Learn how Mondo Pets evaluates, rates, and reviews pet food and products. We prioritize unbiased, ingredient-focused analysis.',
};

export default function MethodologyPage() {
  return (
    <div className="min-h-screen bg-muted/20 pb-24 pt-12">
      <main className="container mx-auto px-6 max-w-4xl">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold text-foreground mb-4">
            How We Rate & Review
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Our mission is to help you make the safest, healthiest choices for your pets through unbiased, data-driven analysis.
          </p>
        </div>

        <div className="bg-card rounded-3xl border border-border shadow-sm p-8 md:p-12 mb-12">
          <h2 className="text-2xl font-bold mb-6">Our Core Philosophy</h2>
          <p className="text-muted-foreground leading-relaxed mb-6">
            At Mondo Pets, we believe that transparency is the most important ingredient in pet care. We are not influenced by pet food manufacturers, and we do not accept paid reviews. Our ratings are based strictly on the nutritional value, ingredient quality, and safety history of the products we analyze.
          </p>
          <div className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900 rounded-xl p-6 text-emerald-900 dark:text-emerald-100 flex items-start gap-4">
            <ShieldCheck className="w-8 h-8 flex-shrink-0 text-emerald-600 dark:text-emerald-500" />
            <div>
              <h3 className="font-bold text-lg mb-1">Our Independence Guarantee</h3>
              <p className="text-sm opacity-90">
                We purchase the products we review or rely on public ingredient databases. If you click an affiliate link and make a purchase, we may earn a small commission—but this never affects our rating algorithm.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <div className="bg-card rounded-2xl border border-border p-8 shadow-sm">
            <Microscope className="w-10 h-10 text-primary mb-4" />
            <h3 className="text-xl font-bold mb-3">1. Ingredient Analysis</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              We look at the first five ingredients of any pet food, as they make up the bulk of the product. We favor named meat meals and whole proteins over ambiguous "meat by-products" and controversial fillers.
            </p>
          </div>
          
          <div className="bg-card rounded-2xl border border-border p-8 shadow-sm">
            <Scale className="w-10 h-10 text-primary mb-4" />
            <h3 className="text-xl font-bold mb-3">2. Nutritional Balance</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              We calculate the dry matter basis of protein, fat, and carbohydrates to ensure the food meets the biological needs of your pet type. High-protein, low-filler diets naturally score higher.
            </p>
          </div>
          
          <div className="bg-card rounded-2xl border border-border p-8 shadow-sm">
            <ShieldCheck className="w-10 h-10 text-primary mb-4" />
            <h3 className="text-xl font-bold mb-3">3. Safety & Recall History</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              We actively monitor FDA and international recall databases. Brands with a history of frequent or severe recalls (e.g., melamine, salmonella, or vitamin D toxicity) receive significant rating penalties.
            </p>
          </div>
          
          <div className="bg-card rounded-2xl border border-border p-8 shadow-sm">
            <HeartHandshake className="w-10 h-10 text-primary mb-4" />
            <h3 className="text-xl font-bold mb-3">4. Manufacturer Transparency</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Brands that clearly state where their ingredients are sourced and where their products are manufactured earn higher trust scores. We penalize obscure manufacturing practices.
            </p>
          </div>
        </div>

        <div className="bg-primary/5 rounded-3xl border border-primary/20 p-8 md:p-12 text-center">
          <h2 className="text-2xl font-bold mb-4">The 5-Star Rating System</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
            Our editor ratings distill our complex analysis into a simple 1 to 5 star scale.
          </p>
          <div className="flex flex-col gap-4 max-w-xl mx-auto text-left">
            <div className="flex items-center gap-4 bg-background p-4 rounded-xl border border-border">
              <span className="font-black text-emerald-600 w-16 text-center">5 ★</span>
              <span className="text-sm font-medium">Exceptional quality, superior ingredients, highly recommended.</span>
            </div>
            <div className="flex items-center gap-4 bg-background p-4 rounded-xl border border-border">
              <span className="font-black text-amber-500 w-16 text-center">3-4 ★</span>
              <span className="text-sm font-medium">Average to above-average quality. Good budget options.</span>
            </div>
            <div className="flex items-center gap-4 bg-background p-4 rounded-xl border border-border">
              <span className="font-black text-red-500 w-16 text-center">1-2 ★</span>
              <span className="text-sm font-medium">Below average. Contains controversial ingredients or high fillers.</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
