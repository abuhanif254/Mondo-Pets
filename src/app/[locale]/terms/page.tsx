import { Metadata } from 'next';
import { Scale, CheckCircle, FileText, Globe, AlertTriangle } from 'lucide-react';
import { Link } from '@/i18n/routing';

export const metadata: Metadata = {
  title: 'Terms of Service | Mondo Pets',
  description: 'Read the Terms of Service for using Mondo Pets. These terms govern your access and use of our website and services.',
};

export default function TermsOfServicePage() {
  const lastUpdated = 'July 5, 2026';

  return (
    <main className="min-h-screen bg-background pb-20">
      
      {/* ── HEADER ── */}
      <section className="bg-muted/30 border-b border-border py-16 md:py-24">
        <div className="max-w-3xl mx-auto px-4 md:px-8 text-center space-y-6">
          <div className="w-16 h-16 mx-auto bg-indigo-100 dark:bg-indigo-900/30 rounded-2xl flex items-center justify-center text-indigo-600 dark:text-indigo-400">
            <Scale className="w-8 h-8" />
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-foreground">
            Terms of Service
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed">
            Please read these terms carefully before using our platform. By accessing or using Mondo Pets, you agree to be bound by these terms.
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
            Welcome to Mondo Pets ("Company", "we", "our", "us"). These Terms of Service ("Terms") govern your use of our website located at <strong>mondopets.com</strong> (together or individually "Service") operated by Mondo Pets.
          </p>

          <p>
            Our Privacy Policy also governs your use of our Service and explains how we collect, safeguard, and disclose information that results from your use of our web pages. Please read it here: <Link href="/privacy">Privacy Policy</Link>.
          </p>

          <div className="flex items-center gap-3 mt-12 mb-6">
            <Globe className="w-6 h-6 text-indigo-500" />
            <h2 className="!m-0">1. Acceptance of Terms</h2>
          </div>
          <p>
            By accessing or using our Service, you agree to be bound by these Terms. If you disagree with any part of the terms, then you may not access the Service. These Terms apply to all visitors, users, and others who wish to access or use the Service.
          </p>

          <div className="flex items-center gap-3 mt-12 mb-6">
            <FileText className="w-6 h-6 text-indigo-500" />
            <h2 className="!m-0">2. Medical & Veterinary Disclaimer</h2>
          </div>
          <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 rounded-xl p-6 not-prose mb-8">
            <div className="flex gap-4">
              <AlertTriangle className="w-6 h-6 text-amber-600 dark:text-amber-500 flex-shrink-0" />
              <div className="text-sm text-amber-900 dark:text-amber-200 leading-relaxed space-y-2">
                <p>
                  <strong>No Veterinary Advice:</strong> The content on Mondo Pets is provided for informational and educational purposes only and does not constitute veterinary medical advice. 
                </p>
                <p>
                  Always seek the advice of a qualified veterinarian with any questions you may have regarding your pet's medical condition or health. Never disregard professional medical advice or delay in seeking it because of something you have read on this Website.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 mt-12 mb-6">
            <Scale className="w-6 h-6 text-indigo-500" />
            <h2 className="!m-0">3. Affiliate Disclosure & Monetization</h2>
          </div>
          <p>
            Mondo Pets participates in various affiliate marketing programs. This means we may earn a commission on qualifying purchases made through links on our site, at no additional cost to you. 
          </p>
          <p>
            While we receive compensation, we maintain strict editorial independence. Our reviews and recommendations are based on our own research and opinions. The inclusion of an affiliate link does not influence our product ratings or editorial content.
          </p>

          <div className="flex items-center gap-3 mt-12 mb-6">
            <FileText className="w-6 h-6 text-indigo-500" />
            <h2 className="!m-0">4. User Accounts & Content</h2>
          </div>
          <p>
            When you create an account with us, you guarantee that the information you provide is accurate, complete, and current at all times. Inaccurate, incomplete, or obsolete information may result in the immediate termination of your account on our Service.
          </p>
          <p>
            You are responsible for maintaining the confidentiality of your account and password, including but not limited to the restriction of access to your computer and/or account. You agree to accept responsibility for any and all activities or actions that occur under your account and/or password.
          </p>
          <p>
            Any user-generated content, including reviews, comments, or forum posts, must not be illegal, offensive, threatening, libelous, defamatory, or otherwise objectionable. We reserve the right to remove any content that violates these terms.
          </p>

          <div className="flex items-center gap-3 mt-12 mb-6">
            <AlertTriangle className="w-6 h-6 text-indigo-500" />
            <h2 className="!m-0">5. Limitation of Liability</h2>
          </div>
          <p>
            In no event shall Mondo Pets, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from:
          </p>
          <ul>
            <li>Your access to or use of or inability to access or use the Service.</li>
            <li>Any conduct or content of any third party on the Service.</li>
            <li>Any content obtained from the Service.</li>
            <li>Unauthorized access, use, or alteration of your transmissions or content.</li>
          </ul>

          <div className="flex items-center gap-3 mt-12 mb-6">
            <Globe className="w-6 h-6 text-indigo-500" />
            <h2 className="!m-0">6. Governing Law</h2>
          </div>
          <p>
            These Terms shall be governed and construed in accordance with the laws of the applicable jurisdiction, without regard to its conflict of law provisions. Our failure to enforce any right or provision of these Terms will not be considered a waiver of those rights.
          </p>

          <div className="flex items-center gap-3 mt-12 mb-6">
            <FileText className="w-6 h-6 text-indigo-500" />
            <h2 className="!m-0">7. Changes to Terms</h2>
          </div>
          <p>
            We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material, we will provide at least 30 days' notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion.
          </p>

          <h2>8. Contact Us</h2>
          <p>
            If you have any questions about these Terms, please contact us:
            <br />
            <strong>Email:</strong> <a href="mailto:legal@mondopets.com">legal@mondopets.com</a>
          </p>

        </div>
      </section>

    </main>
  );
}
