'use client';

import * as React from 'react';
import { Bone, Bird, Cat, Dog, Fish, Rabbit, Squirrel, Shell } from 'lucide-react';

const partners = [
  { name: 'Chewy', icon: Dog },
  { name: 'Petco', icon: Cat },
  { name: 'Royal Canin', icon: Bone },
  { name: 'Purina', icon: Bird },
  { name: 'Blue Buffalo', icon: Fish },
  { name: 'Hill\'s', icon: Rabbit },
  { name: 'KONG', icon: Squirrel },
  { name: 'Wellness', icon: Shell },
];

export function PartnersMarquee() {
  return (
    <div className="w-full overflow-hidden bg-background py-8 border-y border-border/50">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 mb-6 text-center">
        <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">
          Trusted by our Official Affiliate Partners
        </p>
      </div>
      
      {/* Marquee Wrapper */}
      <div className="relative flex overflow-hidden w-full group">
        
        {/* Gradient Masks for fading effect at edges */}
        <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none"></div>
        <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none"></div>
        
        {/* Scrolling Content - We duplicate the list to make the loop seamless */}
        <div className="flex animate-marquee w-max">
          {[...partners, ...partners].map((partner, index) => (
            <div 
              key={index} 
              className="flex items-center gap-3 px-12 md:px-16 text-muted-foreground hover:text-foreground transition-colors cursor-default"
            >
              <partner.icon className="w-8 h-8 opacity-50" />
              <span className="text-xl md:text-2xl font-black tracking-tight whitespace-nowrap">
                {partner.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
