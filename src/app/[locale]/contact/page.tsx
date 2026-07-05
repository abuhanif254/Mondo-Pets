import { Metadata } from 'next';
import { Mail, MapPin, MessageSquare, Clock, Phone } from 'lucide-react';
import { ContactForm } from '@/components/ContactForm';

export const metadata: Metadata = {
  title: 'Contact Us | Mondo Pets',
  description: 'Get in touch with the Mondo Pets team. We are here to answer your questions about pet care, product reviews, and more.',
};

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-background">
      
      {/* ── HEADER ── */}
      <section className="bg-muted/30 border-b border-border py-16 md:py-24">
        <div className="max-w-3xl mx-auto px-4 md:px-8 text-center space-y-6">
          <div className="w-16 h-16 mx-auto bg-indigo-100 dark:bg-indigo-900/30 rounded-2xl flex items-center justify-center text-indigo-600 dark:text-indigo-400">
            <MessageSquare className="w-8 h-8" />
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-foreground">
            Let's Talk
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed">
            Have a question about a product? Want to partner with us? Just want to share a picture of your dog? We'd love to hear from you.
          </p>
        </div>
      </section>

      {/* ── CONTENT ── */}
      <section className="max-w-[1440px] mx-auto px-4 md:px-8 py-16 md:py-24">
        <div className="grid lg:grid-cols-[1fr_1.5fr] gap-12 lg:gap-24">
          
          {/* Contact Info Sidebar */}
          <div className="space-y-12">
            <div>
              <h2 className="text-3xl font-black tracking-tight text-foreground mb-6">
                Get in Touch
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Fill out the form and our team will get back to you within 24-48 business hours. We review every message personally.
              </p>
            </div>

            <div className="space-y-8">
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center text-indigo-600 dark:text-indigo-400 flex-shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-foreground mb-1">Email Us</h3>
                  <a href="mailto:mohammadbitullah@gmail.com" className="text-muted-foreground hover:text-indigo-500 transition-colors">
                    mohammadbitullah@gmail.com
                  </a>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/30 rounded-xl flex items-center justify-center text-blue-600 dark:text-blue-400 flex-shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-foreground mb-1">Call Us</h3>
                  <a href="tel:+8801724010261" className="text-muted-foreground hover:text-blue-500 transition-colors">
                    +8801724010261
                  </a>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-12 h-12 bg-amber-50 dark:bg-amber-900/30 rounded-xl flex items-center justify-center text-amber-600 dark:text-amber-400 flex-shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-foreground mb-1">Office</h3>
                  <p className="text-muted-foreground">
                    2300 Kishoreganj Sadar,<br />
                    Dhaka, Bangladesh.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-900/30 rounded-xl flex items-center justify-center text-emerald-600 dark:text-emerald-400 flex-shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-foreground mb-1">Working Hours</h3>
                  <p className="text-muted-foreground">
                    Monday - Friday: 9AM - 5PM PST<br />
                    Weekend: Closed (Walking the dogs)
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-zinc-950 text-white p-8 rounded-3xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/20 rounded-full blur-[40px] -translate-y-1/2 translate-x-1/3" />
              <h3 className="text-xl font-black mb-2 relative z-10">Press & Media</h3>
              <p className="text-sm text-zinc-400 leading-relaxed mb-4 relative z-10">
                For press inquiries, interviews, or media resources, please reach out to our PR team.
              </p>
              <a href="mailto:mohammadbitullah@gmail.com" className="text-indigo-400 font-bold text-sm hover:text-indigo-300 transition-colors relative z-10">
                mohammadbitullah@gmail.com &rarr;
              </a>
            </div>
          </div>

          {/* Form Container */}
          <div className="bg-card border border-border shadow-xl shadow-indigo-900/5 rounded-3xl p-6 md:p-12">
            <h2 className="text-2xl font-black tracking-tight text-foreground mb-8">Send a Message</h2>
            <ContactForm />
          </div>

        </div>
      </section>

    </main>
  );
}
