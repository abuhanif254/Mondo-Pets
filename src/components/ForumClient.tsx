'use client';

import * as React from 'react';
import { AskQuestionModal } from './AskQuestionModal';
import { MessageSquarePlus } from 'lucide-react';

export function ForumClient() {
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  return (
    <>
      <button 
        onClick={() => setIsModalOpen(true)}
        className="bg-primary text-primary-foreground px-6 py-3 rounded-full font-bold hover:bg-primary/90 transition-colors flex items-center gap-2 shadow-lg"
      >
        <MessageSquarePlus className="h-5 w-5" />
        Ask a Vet
      </button>

      <AskQuestionModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </>
  );
}
