'use client';

import { useState, useRef, useEffect } from 'react';
import { Check, ChevronsUpDown, Search } from 'lucide-react';

interface Option {
  id: string;
  name: string;
}

interface SearchableSelectProps {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  name?: string;
  placeholder?: string;
}

export function SearchableSelect({ options, value, onChange, name, placeholder = 'Select an option' }: SearchableSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  const filteredOptions = options.filter(option => 
    option.name.toLowerCase().includes(search.toLowerCase())
  );

  const selectedOption = options.find(o => o.id === value);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={containerRef}>
      {name && <input type="hidden" name={name} value={value} />}
      
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-3 py-2 bg-background border border-border rounded-md text-sm text-left focus:outline-none focus:ring-2 focus:ring-primary/50"
      >
        <span className={selectedOption ? '' : 'text-muted-foreground'}>
          {selectedOption ? selectedOption.name : placeholder}
        </span>
        <ChevronsUpDown className="w-4 h-4 opacity-50" />
      </button>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-popover border border-border rounded-md shadow-md overflow-hidden">
          <div className="flex items-center px-3 py-2 border-b border-border">
            <Search className="w-4 h-4 mr-2 opacity-50" />
            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-transparent border-none text-sm focus:outline-none"
              autoFocus
            />
          </div>
          <ul className="max-h-60 overflow-auto py-1">
            {filteredOptions.length === 0 ? (
              <li className="px-3 py-2 text-sm text-muted-foreground text-center">No results found.</li>
            ) : (
              filteredOptions.map(option => (
                <li
                  key={option.id}
                  onClick={() => {
                    onChange(option.id);
                    setIsOpen(false);
                    setSearch('');
                  }}
                  className={`flex items-center justify-between px-3 py-2 text-sm cursor-pointer hover:bg-muted ${value === option.id ? 'bg-muted/50 font-medium' : ''}`}
                >
                  {option.name}
                  {value === option.id && <Check className="w-4 h-4" />}
                </li>
              ))
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
