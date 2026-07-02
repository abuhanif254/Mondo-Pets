import { CalorieCalculator } from '@/components/CalorieCalculator';
import type { Metadata } from 'next';
import { Stethoscope, BookOpen, Activity, Heart, Info, HelpCircle, ArrowRight } from 'lucide-react';
import { Link } from '@/i18n/routing';
import Script from 'next/script';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: 'Dog & Cat Calorie Calculator (Veterinary RER Formula)',
    description: 'Use our free interactive veterinary calorie calculator to find out exactly how much your dog or cat should eat daily. WSAVA standard formulas for RER and DER.',
    alternates: {
      canonical: `https://mondopets.com/${locale}/tool/dog-cat-calorie-calculator`
    }
  };
}

export default async function ToolsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  
  const schemaMarkup = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SoftwareApplication",
        "name": "Dog & Cat Calorie Calculator",
        "operatingSystem": "Web",
        "applicationCategory": "HealthApplication",
        "description": "Calculate your pet's exact daily calorie needs using the veterinary standard Resting Energy Requirement (RER) and Daily Energy Requirement (DER) formulas.",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD"
        }
      },
      {
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "How many calories should my 10lb dog eat?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "A neutered adult 10lb (4.5kg) dog requires approximately 342 calories per day to maintain weight. This is calculated using the formula 70 x (4.5kg)^0.75 x 1.6."
            }
          },
          {
            "@type": "Question",
            "name": "Does spaying or neutering change a pet's calorie needs?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes. Spaying or neutering reduces a pet's metabolism. Neutered dogs and cats typically require 20% to 30% fewer calories than intact animals."
            }
          },
          {
            "@type": "Question",
            "name": "How do I calculate calories from cups of food?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Check the back of your pet food bag for the kcal/cup value. If your pet's daily requirement is 600 calories and the food is 300 kcal/cup, you should feed exactly 2 cups per day."
            }
          },
          {
            "@type": "Question",
            "name": "Why does a puppy need more calories than an adult dog?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Growing puppies and kittens expend a massive amount of energy developing bones, muscles, and organs. A puppy under 4 months old requires up to 3 times the Resting Energy Requirement (RER) of an adult."
            }
          },
          {
            "@type": "Question",
            "name": "Is the RER formula accurate for weight loss?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes, but you must use the pet's IDEAL or TARGET weight, not their current overweight mass, when plugging the number into the calculator for weight loss goals."
            }
          }
        ]
      }
    ]
  };

  return (
    <div className="bg-muted/10 min-h-screen py-16">
      <Script
        id="schema-tools"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaMarkup) }}
      />
      
      {/* Hero Section */}
      <div className="max-w-5xl mx-auto px-4 lg:px-8 mb-12 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-100 text-blue-700 font-bold text-sm mb-4">
          <Stethoscope className="w-4 h-4" /> Veterinary Standard
        </div>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight mb-6">
          Dog & Cat Calorie Calculator
        </h1>
        <p className="text-muted-foreground text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
          Ensure your furry friend lives a long, healthy life. Use our clinical-grade tool to calculate exact daily energy requirements based on WSAVA guidelines.
        </p>
      </div>

      {/* The Calculator Tool */}
      <div className="px-4 lg:px-8 mb-24">
        <CalorieCalculator />
      </div>
      
      {/* Comprehensive SEO Content Section */}
      <div className="max-w-4xl mx-auto px-4 lg:px-8 space-y-16">
        
        {/* Section 1: Introduction */}
        <section className="bg-card border border-border p-8 md:p-12 rounded-[2.5rem] shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <Heart className="w-8 h-8 text-rose-500" />
            <h2 className="text-3xl font-black">Understanding Pet Caloric Needs</h2>
          </div>
          <div className="space-y-6 text-muted-foreground leading-relaxed text-lg">
            <p>
              Pet obesity has reached epidemic proportions globally, with over 50% of domestic dogs and cats classified as overweight or obese. 
              The leading cause? Generous overfeeding. While treating our pets is a form of love, exceeding their daily caloric limit by even a small margin can drastically shorten their lifespan, exacerbating joint issues like arthritis, triggering diabetes, and stressing their cardiovascular system.
            </p>
            <p>
              Many pet owners rely entirely on the feeding guidelines printed on the back of commercial pet food bags. However, these guidelines are notoriously broad and often overestimate the amount of food required. They rarely account for crucial metabolic variables like whether your pet is spayed or neutered, their exact life stage, or their baseline activity levels.
            </p>
            <p>
              That is why veterinary professionals rely on specific mathematical formulas to dial in a pet's exact nutritional requirements. 
              By calculating your pet's precise energy needs, you can measure their meals down to the calorie, ensuring they receive the vital nutrients they need without the excess energy that turns into fat.
            </p>
          </div>
        </section>

        {/* Section 2: How it Works (RER & DER) */}
        <section className="bg-card border border-border p-8 md:p-12 rounded-[2.5rem] shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <Activity className="w-8 h-8 text-blue-500" />
            <h2 className="text-3xl font-black">How the Veterinary Calorie Calculator Works</h2>
          </div>
          <div className="space-y-6 text-muted-foreground leading-relaxed text-lg">
            <p>
              Our calculator does not use guesswork. It utilizes the industry-standard formulas developed and endorsed by the <strong>World Small Animal Veterinary Association (WSAVA)</strong>. 
              The calculation is broken down into two essential steps: determining the Resting Energy Requirement (RER), and applying a Daily Energy Requirement (DER) multiplier.
            </p>
            
            <h3 className="text-xl font-bold text-foreground mt-8 mb-4">1. Resting Energy Requirement (RER)</h3>
            <p>
              The RER is the baseline number of calories your pet needs just to stay alive while at rest in a temperature-controlled environment. It fuels essential bodily functions like breathing, heart rate, digestion, and brain activity. 
              The formula for RER is universal for both dogs and cats:
            </p>
            <div className="bg-muted p-6 rounded-2xl font-mono text-center text-xl text-foreground font-bold my-6 shadow-inner">
              RER = 70 × (Body Weight in kg)<sup>0.75</sup>
            </div>
            
            <h3 className="text-xl font-bold text-foreground mt-8 mb-4">2. Daily Energy Requirement (DER) Multiplier</h3>
            <p>
              Because your pet does more than just rest all day, we must multiply the base RER by a specific factor to account for their lifestyle, metabolism, and age. This gives us the DER. 
              For example:
            </p>
            <ul className="list-disc pl-6 space-y-3">
              <li><strong>Spayed / Neutered:</strong> Altered pets experience a drop in metabolic rate. A neutered adult dog uses a multiplier of <strong>1.6</strong>, whereas an intact dog uses <strong>1.8</strong>.</li>
              <li><strong>Life Stage:</strong> Growing bodies require massive energy. A young puppy or kitten may need a multiplier as high as <strong>2.5 to 3.0</strong> times their RER. Conversely, senior pets have slower metabolisms and often drop to a <strong>1.2</strong> multiplier.</li>
              <li><strong>Weight Goals:</strong> If your pet needs to lose weight, the multiplier drops to <strong>1.0 (or 0.8 for cats)</strong> to safely create a caloric deficit.</li>
            </ul>
          </div>
        </section>

        {/* Section 3: BCS */}
        <section className="bg-card border border-border p-8 md:p-12 rounded-[2.5rem] shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <Info className="w-8 h-8 text-emerald-500" />
            <h2 className="text-3xl font-black">The Importance of Body Condition Score (BCS)</h2>
          </div>
          <div className="space-y-6 text-muted-foreground leading-relaxed text-lg">
            <p>
              While mathematical formulas are incredibly accurate baselines, every pet's metabolism is unique. The number provided by the calculator is your starting point. 
              To ensure your pet is actually maintaining a healthy weight over time, you must regularly assess their <strong>Body Condition Score (BCS)</strong>.
            </p>
            <p>
              BCS is essentially a body fat percentage scale for pets, typically graded from 1 to 9 (where 1 is emaciated, 4-5 is ideal, and 9 is severely obese). 
              You can perform a BCS check at home:
            </p>
            <ol className="list-decimal pl-6 space-y-4">
              <li><strong>The Rib Test:</strong> Run your hands gently along your pet's ribcage. You should be able to easily feel their ribs without pressing hard, similar to feeling the bones on the back of your hand. If you have to push through a layer of fat, they are overweight. If you can see the ribs visibly protruding, they are underweight.</li>
              <li><strong>The Profile View:</strong> Look at your pet from the side. They should have a visible "tuck" in their abdomen right behind their ribcage, sloping upward.</li>
              <li><strong>The Overhead View:</strong> Look at your pet from above. You should see an hourglass shape with a defined waist behind the ribs.</li>
            </ol>
            <p>
              If your pet's BCS is above a 5, you should select the "Lose Weight" goal in the calculator above. Be sure to weigh your pet every two weeks and adjust their caloric intake by 10% up or down if they are losing weight too rapidly or not at all.
            </p>
          </div>
        </section>

        {/* Section 4: Strategic Internal Links */}
        <section className="bg-blue-950 text-blue-50 p-8 md:p-12 rounded-[2.5rem] shadow-lg">
          <div className="flex items-center gap-3 mb-8">
            <BookOpen className="w-8 h-8 text-blue-400" />
            <h2 className="text-3xl font-black text-white">Further Resources & Nutrition Guides</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-white border-b border-blue-800 pb-2">Diet & Food Types</h3>
              <ul className="space-y-3">
                <li><Link href="/food" className="flex items-center gap-2 hover:text-emerald-400 transition-colors"><ArrowRight className="w-4 h-4"/> Browse All Pet Food</Link></li>
                <li><Link href="/shop/dog/food" className="flex items-center gap-2 hover:text-emerald-400 transition-colors"><ArrowRight className="w-4 h-4"/> Top Rated Dog Foods for Weight Loss</Link></li>
                <li><Link href="/shop/cat/food" className="flex items-center gap-2 hover:text-emerald-400 transition-colors"><ArrowRight className="w-4 h-4"/> High-Protein Cat Diets</Link></li>
                <li><Link href="/compare" className="flex items-center gap-2 hover:text-emerald-400 transition-colors"><ArrowRight className="w-4 h-4"/> Compare Pet Food Brands</Link></li>
              </ul>
            </div>
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-white border-b border-blue-800 pb-2">Expert Advice</h3>
              <ul className="space-y-3">
                <li><Link href="/blog" className="flex items-center gap-2 hover:text-emerald-400 transition-colors"><ArrowRight className="w-4 h-4"/> Read the Pet Care Blog</Link></li>
                <li><Link href="/care" className="flex items-center gap-2 hover:text-emerald-400 transition-colors"><ArrowRight className="w-4 h-4"/> Comprehensive Care Guides</Link></li>
                <li><Link href="/forum" className="flex items-center gap-2 hover:text-emerald-400 transition-colors"><ArrowRight className="w-4 h-4"/> Ask the Community Forum</Link></li>
                <li><Link href="/quiz" className="flex items-center gap-2 hover:text-emerald-400 transition-colors"><ArrowRight className="w-4 h-4"/> Take the Health Quiz</Link></li>
              </ul>
            </div>
          </div>
        </section>

        {/* Section 5: FAQs */}
        <section className="bg-card border border-border p-8 md:p-12 rounded-[2.5rem] shadow-sm">
          <div className="flex items-center gap-3 mb-8">
            <HelpCircle className="w-8 h-8 text-purple-500" />
            <h2 className="text-3xl font-black">Frequently Asked Questions</h2>
          </div>
          
          <div className="space-y-8">
            <div>
              <h3 className="text-xl font-bold mb-2">How many calories should my 10lb dog eat?</h3>
              <p className="text-muted-foreground leading-relaxed">
                A neutered adult 10lb (4.5kg) dog requires approximately 342 calories per day to maintain their weight. This is calculated using the standard formula: 70 x (4.5kg)^0.75 to get the RER, and then multiplying by 1.6 for a neutered adult.
              </p>
            </div>
            
            <div>
              <h3 className="text-xl font-bold mb-2">Does spaying or neutering change a pet's calorie needs?</h3>
              <p className="text-muted-foreground leading-relaxed">
                Yes, significantly. Spaying or neutering drastically reduces a pet's metabolism due to hormonal changes. Neutered dogs and cats typically require 20% to 30% fewer calories than intact animals. Failing to adjust their diet post-surgery is the leading cause of weight gain in young adult pets.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-2">How do I calculate calories from cups of food?</h3>
              <p className="text-muted-foreground leading-relaxed">
                First, use our calculator to find your pet's daily calorie requirement (e.g., 600 kcal). Next, check the back of your pet food bag near the guaranteed analysis for the "kcal/cup" or "kcal/kg" value. If the food is 300 kcal/cup, simply divide the daily requirement by the food density (600 / 300 = 2). You should feed exactly 2 cups per day.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-2">Why does a puppy need more calories than an adult dog?</h3>
              <p className="text-muted-foreground leading-relaxed">
                Growing puppies and kittens expend a massive amount of metabolic energy developing their bones, muscles, and internal organs. A puppy under 4 months old requires up to 3 times the Resting Energy Requirement (RER) of a mature adult to sustain healthy development.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-2">Is the RER formula accurate for weight loss?</h3>
              <p className="text-muted-foreground leading-relaxed">
                Yes, but there is a crucial caveat. When trying to help an obese pet lose weight, you must use their <strong>IDEAL or TARGET weight</strong>, not their current overweight mass, when plugging the number into the calculator. Otherwise, you will simply be calculating the calories required to maintain their current obesity.
              </p>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
