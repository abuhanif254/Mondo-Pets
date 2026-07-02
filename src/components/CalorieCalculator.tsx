'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calculator, Utensils, Activity, Weight, ArrowRight, Flame, Info, CheckCircle2 } from 'lucide-react';
import { Link } from '@/i18n/routing';

export function CalorieCalculator() {
  const [petType, setPetType] = useState<'Dog' | 'Cat'>('Dog');
  const [weight, setWeight] = useState('');
  const [weightUnit, setWeightUnit] = useState<'lbs' | 'kg'>('lbs');
  const [lifeStage, setLifeStage] = useState<'puppy' | 'adult' | 'senior'>('adult');
  const [spayedNeutered, setSpayedNeutered] = useState<boolean>(true);
  const [weightGoal, setWeightGoal] = useState<'lose' | 'maintain' | 'gain'>('maintain');
  const [activityLevel, setActivityLevel] = useState<'low' | 'average' | 'high'>('average');
  
  const [result, setResult] = useState<number | null>(null);
  const [rer, setRer] = useState<number | null>(null);
  const [activeMultiplier, setActiveMultiplier] = useState<number | null>(null);

  useEffect(() => {
    if (!weight || isNaN(parseFloat(weight))) {
      setResult(null);
      setRer(null);
      setActiveMultiplier(null);
      return;
    }

    let w = parseFloat(weight);
    if (weightUnit === 'lbs') {
      w = w / 2.20462; // Convert to kg
    }

    // RER (Resting Energy Requirement) = 70 * (body weight in kg)^0.75
    const calculatedRER = 70 * Math.pow(w, 0.75);
    setRer(calculatedRER);

    let multiplier = 1.0;
    
    if (petType === 'Dog') {
      if (lifeStage === 'puppy') multiplier = 2.5;
      else if (weightGoal === 'lose') multiplier = 1.0;
      else if (weightGoal === 'gain') multiplier = 1.7;
      else if (lifeStage === 'senior') multiplier = 1.2;
      else {
        if (activityLevel === 'high') multiplier = 2.5;
        else if (activityLevel === 'low') multiplier = 1.2;
        else multiplier = spayedNeutered ? 1.6 : 1.8;
      }
    } else {
      if (lifeStage === 'puppy') multiplier = 2.5;
      else if (weightGoal === 'lose') multiplier = 0.8;
      else if (weightGoal === 'gain') multiplier = 1.6;
      else if (lifeStage === 'senior') multiplier = 1.0;
      else {
        if (activityLevel === 'high') multiplier = 1.6;
        else if (activityLevel === 'low') multiplier = 1.0;
        else multiplier = spayedNeutered ? 1.2 : 1.4;
      }
    }

    setActiveMultiplier(multiplier);
    setResult(Math.round(calculatedRER * multiplier));
  }, [petType, weight, weightUnit, lifeStage, spayedNeutered, weightGoal, activityLevel]);

  return (
    <div className="bg-card border border-border rounded-[2rem] shadow-xl overflow-hidden max-w-5xl mx-auto flex flex-col md:flex-row">
      
      {/* Input Section */}
      <div className="p-6 md:p-10 md:w-7/12 flex flex-col justify-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-100 text-blue-700 font-bold text-sm mb-6 w-fit">
          <Calculator className="w-4 h-4" /> WSAVA Compliant
        </div>
        <h2 className="text-3xl font-black mb-2">Pet Calorie Calculator</h2>
        <p className="text-muted-foreground mb-8 text-sm leading-relaxed">
          Discover exactly how much your pet should eat daily using the veterinary standard Resting Energy Requirement (RER) formula.
        </p>
        
        <div className="space-y-6">
          {/* Pet Type & Weight Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold mb-2">I have a...</label>
              <div className="flex bg-muted/50 p-1 rounded-xl">
                <button onClick={() => setPetType('Dog')} className={`flex-1 py-2 font-bold rounded-lg transition-all ${petType === 'Dog' ? 'bg-background shadow text-foreground' : 'text-muted-foreground hover:text-foreground'}`}>Dog 🐶</button>
                <button onClick={() => setPetType('Cat')} className={`flex-1 py-2 font-bold rounded-lg transition-all ${petType === 'Cat' ? 'bg-background shadow text-foreground' : 'text-muted-foreground hover:text-foreground'}`}>Cat 🐱</button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold mb-2 flex items-center gap-1.5"><Weight className="w-4 h-4"/> Current Weight</label>
              <div className="flex gap-2">
                <input 
                  type="number" 
                  step="0.1" min="0" value={weight} onChange={e => setWeight(e.target.value)}
                  className="flex-1 w-full min-w-0 bg-background border border-border rounded-xl px-4 py-2 font-semibold focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                  placeholder="e.g. 15.5"
                />
                <div className="flex bg-muted/50 p-1 rounded-xl shrink-0">
                  <button onClick={() => setWeightUnit('lbs')} className={`px-3 font-bold rounded-lg transition-all ${weightUnit === 'lbs' ? 'bg-background shadow text-foreground' : 'text-muted-foreground'}`}>lbs</button>
                  <button onClick={() => setWeightUnit('kg')} className={`px-3 font-bold rounded-lg transition-all ${weightUnit === 'kg' ? 'bg-background shadow text-foreground' : 'text-muted-foreground'}`}>kg</button>
                </div>
              </div>
            </div>
          </div>

          {/* Life Stage & Spayed Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold mb-2">Life Stage</label>
              <select value={lifeStage} onChange={e => setLifeStage(e.target.value as any)} className="w-full bg-background border border-border rounded-xl px-4 py-2.5 font-semibold focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none cursor-pointer">
                <option value="puppy">{petType === 'Dog' ? 'Puppy (< 1 year)' : 'Kitten (< 1 year)'}</option>
                <option value="adult">Adult (1 - 7 years)</option>
                <option value="senior">Senior (7+ years)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold mb-2">Spayed / Neutered?</label>
              <div className="flex bg-muted/50 p-1 rounded-xl">
                <button onClick={() => setSpayedNeutered(true)} className={`flex-1 py-2 font-bold rounded-lg transition-all ${spayedNeutered ? 'bg-background shadow text-foreground' : 'text-muted-foreground hover:text-foreground'}`}>Yes</button>
                <button onClick={() => setSpayedNeutered(false)} className={`flex-1 py-2 font-bold rounded-lg transition-all ${!spayedNeutered ? 'bg-background shadow text-foreground' : 'text-muted-foreground hover:text-foreground'}`}>No</button>
              </div>
            </div>
          </div>

          {/* Goal & Activity Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold mb-2">Weight Goal</label>
              <select value={weightGoal} onChange={e => setWeightGoal(e.target.value as any)} className="w-full bg-background border border-border rounded-xl px-4 py-2.5 font-semibold focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none cursor-pointer">
                <option value="lose">Lose Weight</option>
                <option value="maintain">Maintain Weight</option>
                <option value="gain">Gain Weight</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold mb-2 flex items-center gap-1.5"><Activity className="w-4 h-4"/> Activity Level</label>
              <select value={activityLevel} onChange={e => setActivityLevel(e.target.value as any)} disabled={weightGoal !== 'maintain' || lifeStage !== 'adult'} className="w-full bg-background border border-border rounded-xl px-4 py-2.5 font-semibold focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">
                <option value="low">Low (Couch Potato)</option>
                <option value="average">Average (Daily Walks)</option>
                <option value="high">High (Working/Active)</option>
              </select>
              {(weightGoal !== 'maintain' || lifeStage !== 'adult') && (
                <p className="text-[10px] text-muted-foreground mt-1.5">Activity level is auto-calculated for your selected goal and life stage.</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Result Section */}
      <div className="bg-blue-900 md:w-5/12 p-8 flex flex-col justify-center items-center text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1583337130417-3346a1be7dee')] bg-cover bg-center opacity-10 mix-blend-overlay"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-blue-950 to-transparent"></div>
        
        <div className="relative z-10 w-full">
          <AnimatePresence mode="wait">
            {result && rer && activeMultiplier ? (
              <motion.div
                key="result"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full"
              >
                <Utensils className="w-10 h-10 text-blue-300 mx-auto mb-4" />
                <h3 className="text-blue-100 font-bold mb-2 uppercase tracking-widest text-xs">Daily Requirement</h3>
                <div className="text-5xl md:text-6xl font-black text-white mb-2 flex items-end justify-center gap-2">
                  {result} <span className="text-xl font-bold text-blue-300 mb-1.5">kcal</span>
                </div>
                
                {/* Math Breakdown */}
                <div className="bg-black/20 rounded-xl p-4 mb-6 border border-white/10 text-left">
                  <h4 className="text-xs font-bold text-blue-300 mb-2 uppercase tracking-widest flex items-center gap-1.5"><Info className="w-3.5 h-3.5"/> Calculation</h4>
                  <div className="flex justify-between text-sm text-blue-100 mb-1">
                    <span>Base RER:</span>
                    <span className="font-mono font-bold">{Math.round(rer)} kcal</span>
                  </div>
                  <div className="flex justify-between text-sm text-blue-100 mb-2 border-b border-white/10 pb-2">
                    <span>WSAVA Multiplier:</span>
                    <span className="font-mono font-bold">x {activeMultiplier.toFixed(1)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-white font-bold">
                    <span>Total DER:</span>
                    <span className="font-mono text-emerald-400">{result} kcal</span>
                  </div>
                </div>
                
                {/* Affiliate Upsell */}
                <div className="bg-white/10 backdrop-blur-md rounded-xl p-5 text-left border border-white/20 hover:bg-white/15 transition-colors group cursor-pointer">
                  <div className="flex items-center gap-2 text-white font-bold mb-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Need High-Quality Food?
                  </div>
                  <p className="text-blue-100 text-xs mb-3">We've compiled the absolute best {petType.toLowerCase()} foods based on expert veterinary reviews.</p>
                  <Link href={`/shop/${petType.toLowerCase()}/food`} className="inline-flex items-center text-white font-bold text-sm hover:text-emerald-300 transition-colors">
                    Shop Best {petType} Foods <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="placeholder"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-blue-300 opacity-60 flex flex-col items-center justify-center min-h-[300px]"
              >
                <Calculator className="w-16 h-16 mb-4 opacity-50" />
                <p className="text-base font-medium">Enter your pet's details<br/>to see instant results.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
