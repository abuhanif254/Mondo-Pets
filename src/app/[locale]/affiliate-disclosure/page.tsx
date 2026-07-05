import { Metadata } from 'next';
import { DollarSign, CheckCircle, Search, Shield, Target, Link as LinkIcon } from 'lucide-react';
import { Link } from '@/i18n/routing';

export const metadata: Metadata = {
  title: 'Affiliate Disclosure | Mondo Pets',
  description: 'Learn how Mondo Pets is funded through affiliate partnerships while maintaining strict editorial independence and unbiased reviews.',
};

export default function AffiliateDisclosurePage() {
  const lastUpdated = 'July 5, 2026';

  return (
    <main className="min-h-screen bg-background pb-20">
      
      {/* ── HEADER ── */}
      <section className="bg-muted/30 border-b border-border py-16 md:py-24">
        <div className="max-w-3xl mx-auto px-4 md:px-8 text-center space-y-6">
          <div className="w-16 h-16 mx-auto bg-amber-100 dark:bg-amber-900/30 rounded-2xl flex items-center justify-center text-amber-600 dark:text-amber-500">
            <DollarSign className="w-8 h-8" />
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-foreground">
            Affiliate Disclosure
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed">
            Transparency is our core value. We believe you have the right to know exactly how we make money and how it impacts the content you read.
          </p>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-background border border-border text-sm font-medium text-muted-foreground shadow-sm">
            <CheckCircle className="w-4 h-4 text-emerald-500" />
            Last Updated: {lastUpdated}
          </div>
        </div>
      </section>

      {/* ── CONTENT ── */}
      <section className="max-w-3xl mx-auto px-4 md:px-8 py-16">
        <div className="prose prose-zinc dark:prose-invert prose-lg max-w-none 
          prose-headings:font-display prose-headings:font-bold prose-headings:tracking-tight
          prose-a:text-indigo-600 dark:prose-a:text-indigo-400 prose-a:font-medium hover:prose-a:text-indigo-500 transition-colors">
          
          <p className="lead text-xl text-foreground font-medium">
            In compliance with the Federal Trade Commission (FTC) guidelines and international transparency standards, please assume that any links on Mondo Pets leading to products or services are affiliate links.
          </p>

          <div className="flex items-center gap-3 mt-12 mb-6">
            <LinkIcon className="w-6 h-6 text-amber-500" />
            <h2 className="!m-0">What is an Affiliate Link?</h2>
          </div>
          <p>
            An affiliate link is a specific URL that contains an ID or username. When you click on an affiliate link and make a purchase on the retailer's website, we receive a small commission from that sale. 
          </p>
          <p>
            <strong>This does not cost you anything extra.</strong> The price of the product is exactly the same whether you use our affiliate link or go directly to the retailer's website. These commissions help us maintain our website, pay our writers, and fund our independent product testing.
          </p>

          <div className="flex items-center gap-3 mt-12 mb-6">
            <Shield className="w-6 h-6 text-amber-500" />
            <h2 className="!m-0">Our Editorial Independence</h2>
          </div>
          <div className="bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-900/50 rounded-xl p-6 not-prose mb-8">
            <p className="text-base text-indigo-900 dark:text-indigo-200 leading-relaxed font-medium">
              We have a strict "no-pay-for-play" policy. Brands cannot pay us to receive a favorable review or higher ranking in our buyer's guides. 
            </p>
          </div>
          <p>
            Our product reviews and recommendations are strictly driven by our editorial team's independent research, testing, and veterinary consultation. We only recommend products that we genuinely believe will add value to the lives of pets and their owners.
          </p>
          <p>
            If a product is terrible, we will say so—even if we have an affiliate relationship with the retailer that sells it. Our primary allegiance is always to our readers and their pets.
          </p>

          <div className="flex items-center gap-3 mt-12 mb-6">
            <Target className="w-6 h-6 text-amber-500" />
            <h2 className="!m-0">Programs We Participate In</h2>
          </div>
          <p>
            Mondo Pets participates in various affiliate programs, which include but are not limited to:
          </p>
          <ul>
            <li>
              <strong>Amazon Services LLC Associates Program:</strong> As an Amazon Associate, Mondo Pets earns from qualifying purchases.
            </li>
            <li>
              <strong>Chewy Affiliate Program:</strong> We earn commissions on qualifying purchases made through our links to Chewy.com.
            </li>
            <li>
              <strong>Petco, PetSmart, and other brand-direct programs:</strong> We may earn commissions when linking directly to specific manufacturers or authorized retailers.
            </li>
          </ul>

          <div className="flex items-center gap-3 mt-12 mb-6">
            <Search className="w-6 h-6 text-amber-500" />
            <h2 className="!m-0">Sponsored Content</h2>
          </div>
          <p>
            Occasionally, we may partner with a brand to publish sponsored content. If a post is sponsored (meaning a company paid us directly to write about their product), we will clearly and conspicuously mark the article as "Sponsored" at the very top of the page. Even in sponsored content, we maintain our commitment to honest assessments and will not publish false claims.
          </p>

          <h2>Questions?</h2>
          <p>
            If you have any questions regarding our affiliate relationships or how we fund our operations, please don't hesitate to contact us at:
            <br />
            <strong>Email:</strong> <a href="mailto:hello@mondopets.com">hello@mondopets.com</a>
          </p>

        </div>
      </section>

    </main>
  );
}
