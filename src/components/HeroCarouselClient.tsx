'use client';

import * as React from 'react';
import { Link } from '@/i18n/routing';
import { Play, Pause, ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';

interface HeroSlide {
  id: string;
  title: string;
  subtitle: string | null;
  ctaText: string;
  ctaUrl: string;
  imageUrl: string | null;
  backgroundColor: string;
}

interface HeroCarouselClientProps {
  slides: HeroSlide[];
}

export function HeroCarouselClient({ slides }: HeroCarouselClientProps) {
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [isPlaying, setIsPlaying] = React.useState(true);
  const [progress, setProgress] = React.useState(0);
  const SLIDE_DURATION = 3000; // 3 seconds per slide

  React.useEffect(() => {
    let interval: NodeJS.Timeout;
    let progressInterval: NodeJS.Timeout;

    if (isPlaying && slides.length > 1) {
      // Rotate slide
      interval = setInterval(() => {
        setCurrentIndex((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
        setProgress(0);
      }, SLIDE_DURATION);

      // Update progress bar smooth animation
      const updateInterval = 50; // Update every 50ms for smooth progress
      progressInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) return 100;
          return prev + (100 / (SLIDE_DURATION / updateInterval));
        });
      }, updateInterval);
    }

    return () => {
      clearInterval(interval);
      clearInterval(progressInterval);
    };
  }, [isPlaying, currentIndex, slides.length]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    setProgress(0);
    setIsPlaying(false); // Pause when user interacts
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    setProgress(0);
    setIsPlaying(false);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
    setProgress(0);
    setIsPlaying(false);
  };

  if (!slides || slides.length === 0) return null;

  const currentSlide = slides[currentIndex];
  // Determine if background color is dark or light to adjust text color
  const isDarkBackground = currentSlide.backgroundColor === '#1d4ed8' || currentSlide.backgroundColor === '#e11d48';

  return (
    <div className="relative w-full rounded-xl overflow-hidden shadow-2xl group min-h-[300px] md:min-h-[360px]">
      
      {/* Slide Content */}
      <div 
        className="absolute inset-0 transition-colors duration-500 ease-in-out flex flex-col-reverse md:flex-row items-center justify-between"
        style={{ backgroundColor: currentSlide.backgroundColor }}
      >
        {/* Left/Middle Content */}
        <div className="relative z-10 w-full md:w-1/2 p-10 md:p-14 lg:p-20 flex flex-col items-center md:items-start text-center md:text-left">
          <h2 
            className={`text-4xl md:text-5xl lg:text-6xl font-black tracking-tight mb-4 transition-all duration-700 transform translate-y-0 opacity-100 ${isDarkBackground ? 'text-white' : 'text-slate-900'}`}
            key={`title-${currentIndex}`}
          >
            {currentSlide.title}
          </h2>
          
          {currentSlide.subtitle && (
            <p 
              className={`text-lg md:text-xl font-medium mb-8 max-w-md transition-all duration-700 delay-100 transform translate-y-0 opacity-100 ${isDarkBackground ? 'text-white/90' : 'text-slate-700'}`}
              key={`subtitle-${currentIndex}`}
            >
              {currentSlide.subtitle}
            </p>
          )}

          <Link 
            href={currentSlide.ctaUrl}
            className={`inline-block px-8 py-4 font-bold text-lg rounded-full transition-all hover:scale-105 active:scale-95 shadow-lg ${
              isDarkBackground 
                ? 'bg-white text-slate-900 hover:bg-slate-50' 
                : 'bg-blue-700 text-white hover:bg-blue-800'
            }`}
          >
            {currentSlide.ctaText}
          </Link>
        </div>

        {/* Right Image Content */}
        {currentSlide.imageUrl && (
          <div className="relative w-full md:w-1/2 h-48 md:h-full flex items-end md:items-center justify-center p-4">
            <Image 
              src={currentSlide.imageUrl} 
              alt={currentSlide.title}
              key={`image-${currentIndex}`}
              fill
              className="object-contain object-bottom md:object-center animate-in fade-in zoom-in duration-700"
            />
          </div>
        )}
      </div>

      {/* Navigation Arrows (Hidden by default, shown on hover) */}
      <button onClick={prevSlide} className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/20 hover:bg-black/40 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm z-20">
        <ChevronLeft className="w-8 h-8" />
      </button>
      <button onClick={nextSlide} className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/20 hover:bg-black/40 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm z-20">
        <ChevronRight className="w-8 h-8" />
      </button>

      {/* Bottom Controls / Progress Bar */}
      {slides.length > 1 && (
        <div className="absolute bottom-6 left-0 right-0 flex justify-center items-center gap-4 z-20 px-4">
          <button 
            onClick={() => setIsPlaying(!isPlaying)}
            className={`w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-md transition-colors ${isDarkBackground ? 'bg-white/20 text-white hover:bg-white/30' : 'bg-black/10 text-slate-900 hover:bg-black/20'}`}
          >
            {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-1" />}
          </button>
          
          <div className="flex gap-2">
            {slides.map((_, index) => (
              <button 
                key={index}
                onClick={() => goToSlide(index)}
                className={`relative h-1.5 rounded-full overflow-hidden transition-all ${
                  index === currentIndex ? 'w-16' : 'w-8 opacity-50 hover:opacity-100'
                } ${isDarkBackground ? 'bg-white/30' : 'bg-black/20'}`}
              >
                {index === currentIndex && (
                  <div 
                    className={`absolute top-0 left-0 bottom-0 ${isDarkBackground ? 'bg-white' : 'bg-blue-700'}`} 
                    style={{ width: `${isPlaying ? progress : 100}%`, transition: 'width 50ms linear' }}
                  />
                )}
                {index < currentIndex && (
                  <div className={`absolute top-0 left-0 bottom-0 w-full ${isDarkBackground ? 'bg-white' : 'bg-blue-700'}`} />
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
