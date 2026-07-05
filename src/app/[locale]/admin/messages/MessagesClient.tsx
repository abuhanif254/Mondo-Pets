'use client';

import { useState } from 'react';
import { MailOpen, Mail, Trash2, Search, Loader2 } from 'lucide-react';
import { markMessageAsRead, deleteMessage } from '@/app/actions/contact';
import { useRouter } from 'next/navigation';

export function MessagesClient({ initialMessages }: { initialMessages: any[] }) {
  const [isProcessing, setIsProcessing] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter();

  const handleToggleRead = async (id: string) => {
    setIsProcessing(`read-${id}`);
    await markMessageAsRead(id);
    setIsProcessing(null);
    router.refresh();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this message?')) return;
    setIsProcessing(`delete-${id}`);
    await deleteMessage(id);
    setIsProcessing(null);
    router.refresh();
  };

  const filteredMessages = initialMessages.filter(msg => 
    msg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    msg.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    msg.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    msg.message.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Contact Messages</h1>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input 
            type="text" 
            placeholder="Search messages..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 pr-4 py-2 bg-background border border-border rounded-md text-sm w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>

      <div className="bg-card border border-border rounded-lg overflow-hidden">
        {filteredMessages.length === 0 ? (
          <div className="p-12 text-center text-muted-foreground">
            No messages found.
          </div>
        ) : (
          <div className="divide-y divide-border">
            {filteredMessages.map((msg) => (
              <div 
                key={msg.id} 
                className={`p-6 transition-colors ${!msg.isRead ? 'bg-primary/5 dark:bg-primary/10' : 'hover:bg-muted/50'}`}
              >
                <div className="flex flex-col md:flex-row gap-4 justify-between items-start">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-3">
                      {!msg.isRead && (
                        <span className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />
                      )}
                      <h3 className={`text-lg ${!msg.isRead ? 'font-bold text-foreground' : 'font-medium text-foreground/80'}`}>
                        {msg.subject || 'No Subject'}
                      </h3>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span className="font-medium text-foreground/70">{msg.name}</span>
                      <span>&bull;</span>
                      <a href={`mailto:${msg.email}`} className="hover:text-primary transition-colors">
                        {msg.email}
                      </a>
                      <span>&bull;</span>
                      <span>{new Date(msg.createdAt).toLocaleString()}</span>
                    </div>

                    <p className={`text-sm mt-3 ${!msg.isRead ? 'text-foreground/90' : 'text-muted-foreground'} whitespace-pre-wrap`}>
                      {msg.message}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 pt-2 md:pt-0">
                    <button 
                      onClick={() => handleToggleRead(msg.id)}
                      disabled={isProcessing !== null}
                      className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-md transition-colors disabled:opacity-50"
                      title={msg.isRead ? 'Mark as unread' : 'Mark as read'}
                    >
                      {isProcessing === `read-${msg.id}` ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : msg.isRead ? (
                        <Mail className="w-4 h-4" />
                      ) : (
                        <MailOpen className="w-4 h-4" />
                      )}
                    </button>
                    <button 
                      onClick={() => handleDelete(msg.id)}
                      disabled={isProcessing !== null}
                      className="p-2 text-muted-foreground hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-md transition-colors disabled:opacity-50"
                      title="Delete message"
                    >
                      {isProcessing === `delete-${msg.id}` ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
