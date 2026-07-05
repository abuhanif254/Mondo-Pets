import { Metadata } from 'next';
import { Heart, ShieldCheck, Search, Users, Award, Zap, ArrowRight, Phone, Mail, Globe, Star } from 'lucide-react';
import { Link } from '@/i18n/routing';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'About Us | Mondo Pets',
  description: 'Learn about Mondo Pets, our mission, our dedicated team of pet experts, and why over 50,000 readers trust our independent product reviews and care advice.',
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-background">
      
      {/* ── HERO SECTION ── */}
      <section className="relative overflow-hidden bg-zinc-950 text-white py-24 md:py-32">
        {/* Decorative Gradients */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-500/20 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-emerald-500/20 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/3 pointer-events-none" />
        
        <div className="relative max-w-[1440px] mx-auto px-4 md:px-8 text-center z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-sm font-bold uppercase tracking-widest text-indigo-200 mb-8 backdrop-blur-md">
            <Heart className="w-4 h-4 text-emerald-400" />
            Our Mission
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-6 max-w-4xl mx-auto leading-[1.1]">
            Empowering Pet Parents With <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-emerald-400 to-amber-400">Honest Answers.</span>
          </h1>
          <p className="text-xl md:text-2xl text-zinc-300 max-w-2xl mx-auto leading-relaxed">
            We cut through the marketing noise to bring you independent, vet-reviewed advice and product recommendations you can actually trust.
          </p>
        </div>
      </section>

      {/* ── IMPACT STATS ── */}
      <section className="border-b border-border bg-card">
        <div className="max-w-[1440px] mx-auto px-4 md:px-8 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4 divide-x-0 md:divide-x divide-border">
            {[
              { value: '50K+', label: 'Monthly Readers', icon: Users },
              { value: '500+', label: 'Products Tested', icon: Search },
              { value: '100%', label: 'Independent',     icon: ShieldCheck },
              { value: '5 Yrs',label: 'Of Expertise',    icon: Award },
            ].map(({ value, label, icon: Icon }, i) => (
              <div key={i} className="flex flex-col items-center text-center px-4">
                <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-950/50 rounded-2xl flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-4">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-3xl font-black text-foreground mb-1">{value}</h3>
                <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── OUR STORY ── */}
      <section className="py-24 max-w-[1440px] mx-auto px-4 md:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="relative">
            <div className="absolute -inset-4 bg-gradient-to-tr from-indigo-100 to-emerald-50 dark:from-indigo-950/50 dark:to-emerald-950/50 rounded-[2.5rem] transform -rotate-3 -z-10" />
            <div className="aspect-[4/3] rounded-[2rem] overflow-hidden bg-zinc-100 dark:bg-zinc-800 border-8 border-background shadow-2xl relative">
              {/* Replace with actual team/office/dogs image later. Using a nice gradient/pattern placeholder for now */}
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-emerald-500/20" />
              <Image 
                src="https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&q=80&w=1000" 
                alt="Happy dogs playing" 
                fill 
                className="object-cover"
              />
            </div>
            
            <div className="absolute -bottom-8 -right-8 bg-card border border-border p-6 rounded-3xl shadow-xl max-w-[280px]">
              <div className="flex gap-2 text-amber-500 mb-3">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
              </div>
              <p className="font-bold text-foreground text-sm italic">
                "Mondo Pets changed how I shop for my golden retriever. Finally, a site that tells the truth!"
              </p>
              <p className="text-xs text-muted-foreground mt-2 font-medium">— Sarah M., Reader</p>
            </div>
          </div>
          
          <div className="space-y-8">
            <div>
              <h2 className="text-4xl font-black tracking-tight text-foreground mb-6">
                Born out of frustration. Built for pet lovers.
              </h2>
              <div className="prose prose-lg dark:prose-invert prose-zinc text-muted-foreground">
                <p>
                  A few years ago, our founder was searching for a reliable dog food for a pet with severe allergies. Hours of research led to nothing but confusing marketing jargon, paid endorsements masquerading as reviews, and conflicting advice.
                </p>
                <p>
                  <strong>We realized the pet industry had a transparency problem.</strong>
                </p>
                <p>
                  That's why we created Mondo Pets. We assembled a team of passionate pet owners, researchers, and consulting veterinarians to build the ultimate resource we wished we had. Our goal is simple: test rigorously, research deeply, and review honestly.
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link href="/methodology" className="btn btn-primary btn-lg">
                <Search className="w-5 h-5" />
                Read Our Methodology
              </Link>
              <Link href="/contact" className="btn btn-outline btn-lg">
                Contact the Team
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── CORE VALUES ── */}
      <section className="bg-zinc-50 dark:bg-zinc-900/50 py-24 border-y border-border">
        <div className="max-w-[1440px] mx-auto px-4 md:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-indigo-600 dark:text-indigo-400 font-bold tracking-widest uppercase text-sm mb-2 block">Our DNA</span>
            <h2 className="text-4xl font-black tracking-tight text-foreground mb-4">Core Values We Live By</h2>
            <p className="text-lg text-muted-foreground">We don't just write about pets; we advocate for them. These principles guide everything we publish.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: 'Radical Transparency',
                desc: 'If a popular product is terrible, we say so. We disclose all our affiliate relationships and never accept payment for positive reviews.',
                icon: Search,
                color: 'text-indigo-500',
                bg: 'bg-indigo-50 dark:bg-indigo-500/10'
              },
              {
                title: 'Vet-Reviewed Accuracy',
                desc: 'Health and nutrition advice is strictly reviewed by our panel of consulting veterinarians. We never compromise on medical safety.',
                icon: ShieldCheck,
                color: 'text-emerald-500',
                bg: 'bg-emerald-50 dark:bg-emerald-500/10'
              },
              {
                title: 'Pets Before Profits',
                desc: 'Our allegiance is to your pet’s wellbeing, not a brand’s bottom line. We only recommend products we’d give to our own animals.',
                icon: Heart,
                color: 'text-rose-500',
                bg: 'bg-rose-50 dark:bg-rose-500/10'
              },
              {
                title: 'Relentless Testing',
                desc: 'We buy the products we review, tear them apart, let our pets destroy them, and analyze the results. Real-world data drives our scores.',
                icon: Zap,
                color: 'text-amber-500',
                bg: 'bg-amber-50 dark:bg-amber-500/10'
              },
              {
                title: 'Inclusive Community',
                desc: 'Whether you have a purebred show dog or a beloved rescue mutt, our community welcomes every type of pet parent.',
                icon: Users,
                color: 'text-violet-500',
                bg: 'bg-violet-50 dark:bg-violet-500/10'
              },
              {
                title: 'Continuous Improvement',
                desc: 'As veterinary science evolves, so do we. We regularly update our older articles to ensure they reflect the latest research and recalls.',
                icon: Award,
                color: 'text-blue-500',
                bg: 'bg-blue-50 dark:bg-blue-500/10'
              },
            ].map((val, i) => (
              <div key={i} className="bg-card border border-border p-8 rounded-3xl shadow-sm hover:shadow-md transition-shadow">
                <div className={`w-14 h-14 rounded-2xl ${val.bg} flex items-center justify-center mb-6`}>
                  <val.icon className={`w-7 h-7 ${val.color}`} />
                </div>
                <h3 className="text-xl font-black text-foreground mb-3">{val.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{val.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── DEVELOPER IDENTITY ── */}
      <section className="py-24 max-w-4xl mx-auto px-4 md:px-8">
        <div className="text-center mb-16">
          <span className="text-rose-600 dark:text-rose-400 font-bold tracking-widest uppercase text-sm mb-2 block">Developer Identity</span>
          <h2 className="text-4xl font-black tracking-tight text-foreground mb-4">Platform Architect</h2>
          <p className="text-lg text-muted-foreground">
            The robust technology and high-performance infrastructure powering Mondo Pets was designed and developed by:
          </p>
        </div>

        <div className="bg-card border border-border rounded-3xl p-8 md:p-12 shadow-sm flex flex-col md:flex-row items-center gap-8 md:gap-12">
          <div className="relative w-48 h-48 flex-shrink-0 rounded-full overflow-hidden border-4 border-rose-500 shadow-xl shadow-rose-500/20">
            <Image 
              src="https://ik.imagekit.io/ubwpdqyav/my_photo-removebg-preview.png?updatedAt=1776774813574" 
              alt="MD Abu Hanif Mia"
              fill
              className="object-cover bg-zinc-100 dark:bg-zinc-800"
            />
          </div>
          
          <div className="text-center md:text-left space-y-4">
            <div>
              <h3 className="text-3xl font-black text-foreground mb-1">MD Abu Hanif Mia</h3>
              <p className="text-rose-600 dark:text-rose-400 font-bold text-lg">Full Stack Web Architect</p>
            </div>
            
            <p className="text-muted-foreground leading-relaxed">
              Specializing in high-performance web applications, scalable cloud architecture, and user-centric UI/UX design. Driven by a passion for delivering enterprise-level products to the global market.
            </p>

            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 md:gap-6 text-sm text-muted-foreground font-medium pt-2">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                <span>+8801724010261</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <span>mohammadbitullah@gmail.com</span>
              </div>
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4" />
                <a href="https://abu-hanif-mia.vercel.app" target="_blank" rel="noopener noreferrer" className="hover:text-rose-500 transition-colors">
                  abu-hanif-mia.vercel.app
                </a>
              </div>
            </div>

            <div className="flex items-center justify-center md:justify-start gap-4 pt-4">
              <a href="https://www.facebook.com/bitulla" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-blue-600 transition-colors" aria-label="Facebook">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="https://x.com/MohammadBitull1" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-sky-500 transition-colors" aria-label="Twitter">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="https://www.youtube.com/@MohammadBitullah" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-red-600 transition-colors" aria-label="YouTube">
                <Youtube className="w-5 h-5" />
              </a>
              <a href="https://www.instagram.com/bitullah_aj" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-pink-600 transition-colors" aria-label="Instagram">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="https://www.linkedin.com/in/md-abu-hanif-mia" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-blue-700 transition-colors" aria-label="LinkedIn">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="https://github.com/abuhanif254" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors" aria-label="GitHub">
                <Github className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="max-w-[1440px] mx-auto px-4 md:px-8 py-12 mb-12">
        <div className="bg-gradient-to-r from-indigo-600 to-violet-700 rounded-[2.5rem] p-12 md:p-20 text-center text-white relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-white/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/3" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-indigo-900/40 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/3" />
          
          <div className="relative z-10 max-w-3xl mx-auto space-y-8">
            <h2 className="text-4xl md:text-5xl font-black tracking-tight">Ready to join the pack?</h2>
            <p className="text-xl text-indigo-100 leading-relaxed">
              Dive into our extensive library of care guides, or join our newsletter to get weekly tips delivered straight to your inbox.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link href="/blog" className="btn bg-white text-indigo-600 hover:bg-indigo-50 btn-lg shadow-lg">
                Explore Pet Advice
              </Link>
              <Link href="/products" className="btn bg-indigo-800/50 hover:bg-indigo-800/70 border border-indigo-400/30 text-white btn-lg backdrop-blur-sm">
                Browse Products
              </Link>
            </div>
          </div>
        </div>
      </section>

    </main>
  );
}

function Facebook(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
    </svg>
  );
}

function Twitter(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.747l7.73-8.835L1.254 2.25H8.08l4.259 5.63 5.905-5.63Zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </svg>
  );
}

function Youtube(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
    </svg>
  );
}

function Instagram(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
    </svg>
  );
}

function Linkedin(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
    </svg>
  );
}

function Github(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
    </svg>
  );
}
