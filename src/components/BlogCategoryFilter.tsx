'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';

const CATEGORIES = [
  { key: 'all',       labelKey: 'filterAll',       dot: 'bg-indigo-500',  active: 'bg-indigo-600 text-white border-indigo-600 shadow-indigo-200/60 dark:shadow-indigo-900/40',  idle: 'bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100 dark:bg-indigo-950/40 dark:text-indigo-300 dark:border-indigo-800' },
  { key: 'dogs',      labelKey: 'filterDogs',      dot: 'bg-amber-500',   active: 'bg-amber-500 text-white border-amber-500 shadow-amber-200/60 dark:shadow-amber-900/40',        idle: 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800' },
  { key: 'cats',      labelKey: 'filterCats',      dot: 'bg-purple-500',  active: 'bg-purple-600 text-white border-purple-600 shadow-purple-200/60 dark:shadow-purple-900/40',    idle: 'bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100 dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-800' },
  { key: 'nutrition', labelKey: 'filterNutrition', dot: 'bg-emerald-500', active: 'bg-emerald-600 text-white border-emerald-600 shadow-emerald-200/60 dark:shadow-emerald-900/40', idle: 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800' },
  { key: 'health',    labelKey: 'filterHealth',    dot: 'bg-rose-500',    active: 'bg-rose-600 text-white border-rose-600 shadow-rose-200/60 dark:shadow-rose-900/40',            idle: 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800' },
  { key: 'training',  labelKey: 'filterTraining',  dot: 'bg-blue-500',    active: 'bg-blue-600 text-white border-blue-600 shadow-blue-200/60 dark:shadow-blue-900/40',            idle: 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800' },
  { key: 'grooming',  labelKey: 'filterGrooming',  dot: 'bg-pink-500',    active: 'bg-pink-600 text-white border-pink-600 shadow-pink-200/60 dark:shadow-pink-900/40',            idle: 'bg-pink-50 text-pink-700 border-pink-200 hover:bg-pink-100 dark:bg-pink-950/40 dark:text-pink-300 dark:border-pink-800' },
];

interface BlogCategoryFilterProps {
  totalCount: number;
}

export function BlogCategoryFilter({ totalCount }: BlogCategoryFilterProps) {
  const t = useTranslations('BlogPage');
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const activeKey = searchParams.get('category') || 'all';

  const handleFilter = (key: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (key === 'all') {
      params.delete('category');
    } else {
      params.set('category', key);
    }
    router.push(`${pathname}${params.toString() ? `?${params.toString()}` : ''}`, { scroll: false });
  };

  return (
    <div className="flex items-center gap-2 py-2.5 overflow-x-auto scrollbar-hide px-4 sm:px-0">
      {CATEGORIES.map((cat) => {
        const isActive = activeKey === cat.key;
        return (
          <motion.button
            key={cat.key}
            role="tab"
            aria-selected={isActive}
            id={`filter-tab-${cat.key}`}
            onClick={() => handleFilter(cat.key)}
            whileTap={{ scale: 0.95 }}
            className={`
              flex-shrink-0 inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-semibold 
              transition-all duration-200 border cursor-pointer whitespace-nowrap
              ${isActive
                ? `${cat.active} shadow-md scale-105`
                : `${cat.idle}`
              }
            `}
          >
            <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${cat.dot}`} aria-hidden="true" />
            {t(cat.labelKey as any)}
          </motion.button>
        );
      })}

      <div className="ml-auto flex-shrink-0 flex items-center gap-1.5 text-muted-foreground text-xs font-semibold pl-4 border-l border-border pr-4 sm:pr-0">
        <span className="tabular-nums">{totalCount}</span>
        <span>articles</span>
      </div>
    </div>
  );
}
