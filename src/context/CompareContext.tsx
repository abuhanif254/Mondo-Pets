'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface CompareItem {
  id: string;
  title: string;
  imageUrl: string;
}

interface CompareContextType {
  items: CompareItem[];
  addItem: (item: CompareItem) => void;
  removeItem: (id: string) => void;
  clearItems: () => void;
  isComparing: (id: string) => boolean;
}

const CompareContext = createContext<CompareContextType | undefined>(undefined);

export function CompareProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CompareItem[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const saved = localStorage.getItem('mondopets_compare');
      if (saved) {
        setItems(JSON.parse(saved));
      }
    } catch (e) {
      console.error("Failed to load compare list", e);
    }
  }, []);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem('mondopets_compare', JSON.stringify(items));
    }
  }, [items, mounted]);

  const addItem = (item: CompareItem) => {
    setItems((prev) => {
      if (prev.find(i => i.id === item.id)) return prev;
      
      // Keep only up to 3 items. If we have 3, remove the oldest (first) and append new.
      const newItems = [...prev, item];
      if (newItems.length > 3) {
        return newItems.slice(newItems.length - 3);
      }
      return newItems;
    });
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter(i => i.id !== id));
  };

  const clearItems = () => {
    setItems([]);
  };

  const isComparing = (id: string) => {
    return items.some(i => i.id === id);
  };

  return (
    <CompareContext.Provider value={{ items, addItem, removeItem, clearItems, isComparing }}>
      {children}
    </CompareContext.Provider>
  );
}

export function useCompare() {
  const context = useContext(CompareContext);
  if (context === undefined) {
    throw new Error('useCompare must be used within a CompareProvider');
  }
  return context;
}
