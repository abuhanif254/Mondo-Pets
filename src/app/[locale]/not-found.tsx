'use client';

import { motion } from 'framer-motion';
import { Cat, Search, Home, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-4 relative overflow-hidden bg-background">
      {/* Huge Background 404 */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03]">
        <h1 className="text-[20rem] md:text-[35rem] font-black tracking-tighter">404</h1>
      </div>

      <div className="relative z-10 flex flex-col items-center text-center max-w-2xl mx-auto mt-10">
        {/* Animated Cat */}
        <motion.div
          animate={{ 
            y: [0, -15, 0],
            rotate: [0, 4, -4, 0] 
          }}
          transition={{ 
            duration: 4, 
            repeat: Infinity,
            ease: "easeInOut" 
          }}
          className="relative text-blue-600 mb-10"
        >
          <Cat className="w-32 h-32 md:w-48 md:h-48 drop-shadow-2xl" strokeWidth={1.5} />
          
          {/* Animated Question Marks */}
          <motion.div 
            animate={{ opacity: [0, 1, 0], y: [0, -30], x: [0, 15], scale: [0.8, 1.2, 1] }}
            transition={{ duration: 2.5, repeat: Infinity, delay: 0 }}
            className="absolute -top-4 right-4 md:-top-6 md:right-8 text-4xl md:text-5xl font-black text-blue-400 drop-shadow-md"
          >
            ?
          </motion.div>
          <motion.div 
            animate={{ opacity: [0, 1, 0], y: [0, -20], x: [0, -15], scale: [0.8, 1.1, 1] }}
            transition={{ duration: 2.5, repeat: Infinity, delay: 1.2 }}
            className="absolute top-4 -left-4 md:top-8 md:-left-8 text-3xl md:text-4xl font-black text-blue-300 drop-shadow-md"
          >
            ?
          </motion.div>
        </motion.div>

        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-5xl font-black tracking-tight mb-4 text-foreground"
        >
          Oops! You found a dead end.
        </motion.h2>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-lg md:text-xl text-muted-foreground mb-10 leading-relaxed"
        >
          It looks like the page you are looking for has wandered off. Don't worry, even the best explorers get lost sometimes.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col sm:flex-row gap-4 w-full justify-center"
        >
          <a href="/" className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-8 py-4 font-bold text-lg flex items-center justify-center gap-2 transition-transform hover:scale-105 active:scale-95 shadow-lg shadow-blue-600/25">
            <Home className="w-5 h-5" />
            Back to Home
          </a>
          <button 
            onClick={() => window.location.href = '/'}
            className="bg-background hover:bg-muted text-foreground border-2 border-border rounded-full px-8 py-4 font-bold text-lg flex items-center justify-center gap-2 transition-transform hover:scale-105 active:scale-95 shadow-sm"
          >
            <ArrowLeft className="w-5 h-5" />
            Go Back
          </button>
        </motion.div>
      </div>
    </div>
  );
}
