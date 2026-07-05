import { Metadata } from 'next';
import { Shield, Lock, FileText, CheckCircle, Cookie, Share2 } from 'lucide-react';
import { Link } from '@/i18n/routing';

export const metadata: Metadata = {
  title: 'Privacy Policy | Mondo Pets',
  description: 'Learn how Mondo Pets collects, uses, and protects your data.',
};

export default function PrivacyPolicyPage() {
  const lastUpdated = 'July 5, 2026'; // Auto-date can be added if preferred

  return (
    <main className="min-h-screen bg-background pb-20">
      
      {/* ── HEADER ── */}
      <section className="bg-muted/30 border-b border-border py-16 md:py-24">
        <div className="max-w-3xl mx-auto px-4 md:px-8 text-center space-y-6">
          <div className="w-16 h-16 mx-auto bg-indigo-100 dark:bg-indigo-900/30 rounded-2xl flex items-center justify-center text-indigo-600 dark:text-indigo-400">
            <Shield className="w-8 h-8" />
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-foreground">
            Privacy Policy
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed">
            We are committed to protecting your personal information and your right to privacy. Here's a transparent look at how we handle your data.
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
          
          <p>
            Welcome to Mondo Pets ("we," "our," or "us"). We respect your privacy and are committed to protecting it through our compliance with this policy. This Privacy Policy describes the types of information we may collect from you or that you may provide when you visit our website, and our practices for collecting, using, maintaining, protecting, and disclosing that information.
          </p>

          <div className="flex items-center gap-3 mt-12 mb-6">
            <FileText className="w-6 h-6 text-indigo-500" />
            <h2 className="!m-0">1. Information We Collect</h2>
          </div>
          <p>
            We collect several types of information from and about users of our Website, including:
          </p>
          <ul>
            <li><strong>Personal Data:</strong> Email addresses (if you subscribe to our newsletter or register for an account) and basic profile information.</li>
            <li><strong>Usage Data:</strong> Information about your internet connection, the equipment you use to access our Website, and usage details (like pages viewed and time spent).</li>
          </ul>

          <div className="flex items-center gap-3 mt-12 mb-6">
            <Cookie className="w-6 h-6 text-indigo-500" />
            <h2 className="!m-0">2. Cookies and Tracking</h2>
          </div>
          <p>
            We use cookies and similar tracking technologies to track activity on our service and hold certain information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, you may not be able to use some portions of our service.
          </p>

          <div className="flex items-center gap-3 mt-12 mb-6">
            <Share2 className="w-6 h-6 text-indigo-500" />
            <h2 className="!m-0">3. Affiliate Disclosures</h2>
          </div>
          <p>
            Mondo Pets participates in various affiliate marketing programs, which means we may get paid commissions on editorially chosen products purchased through our links to retailer sites. Our editorial content is not influenced by affiliate partnerships. When you click on an affiliate link and make a purchase, the retailer may place a cookie on your browser to track the sale.
          </p>

          <div className="flex items-center gap-3 mt-12 mb-6">
            <Lock className="w-6 h-6 text-indigo-500" />
            <h2 className="!m-0">4. Data Security</h2>
          </div>
          <p>
            We have implemented measures designed to secure your personal information from accidental loss and from unauthorized access, use, alteration, and disclosure. However, the transmission of information via the internet is not completely secure, and we cannot guarantee the security of your personal information transmitted to our Website.
          </p>

          <h2>5. Contact Us</h2>
          <p>
            If you have any questions or comments about this privacy policy and our privacy practices, please contact us at:
            <br />
            <strong>Email:</strong> <a href="mailto:privacy@mondopets.com">privacy@mondopets.com</a>
          </p>

        </div>
      </section>

    </main>
  );
}
