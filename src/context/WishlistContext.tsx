'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { getWishlist, addToWishlist, removeFromWishlist } from '@/app/actions';

export interface WishlistItem {
  id: string; // We'll use title as ID for now since we didn't pass ID to ProductCard previously, or we can update ProductCard to accept ID.
  title: string;
  price: string;
  imageUrl: string;
  affiliateUrl: string;
}

interface WishlistContextType {
  items: WishlistItem[];
  addItem: (item: WishlistItem) => void;
  removeItem: (id: string) => void;
  isFavorite: (id: string) => boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [mounted, setMounted] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Sync with DB if user is logged in, else use local storage
  useEffect(() => {
    if (!mounted) return;

    const loadWishlist = async () => {
      if (user) {
        // Fetch from DB
        const dbItems = await getWishlist(user.id);
        setItems(dbItems as any[]);
        
        // Optionally merge local storage items into DB here (omitted for simplicity)
        localStorage.removeItem('mondopets_wishlist');
      } else {
        // Fetch from local storage
        try {
          const saved = localStorage.getItem('mondopets_wishlist');
          if (saved) setItems(JSON.parse(saved));
          else setItems([]);
        } catch (e) {
          console.error("Failed to load local wishlist", e);
        }
      }
    };
    
    loadWishlist();
  }, [user, mounted]);

  // Save to local storage only if NOT logged in
  useEffect(() => {
    if (mounted && !user) {
      localStorage.setItem('mondopets_wishlist', JSON.stringify(items));
    }
  }, [items, mounted, user]);

  const addItem = async (item: WishlistItem) => {
    setItems((prev) => {
      if (prev.find(i => i.id === item.id)) return prev;
      return [...prev, item];
    });

    if (user) {
      await addToWishlist(user.id, item.id);
    }
  };

  const removeItem = async (id: string) => {
    setItems((prev) => prev.filter(i => i.id !== id));

    if (user) {
      await removeFromWishlist(user.id, id);
    }
  };

  const isFavorite = (id: string) => {
    return items.some(i => i.id === id);
  };

  return (
    <WishlistContext.Provider value={{ items, addItem, removeItem, isFavorite }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
}
