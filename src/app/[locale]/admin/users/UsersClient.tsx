'use client';

import { useState } from 'react';
import { Search, Shield, Trash2, Award, X } from 'lucide-react';
import { deleteUser, addBadgeToUser, removeBadgeFromUser } from '@/app/actions/users';
import { useRouter } from 'next/navigation';

const AVAILABLE_BADGES = [
  { id: 'top_reviewer', label: 'Top Reviewer', color: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200' },
  { id: 'pet_parent', label: 'Pro Pet Parent', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200' },
  { id: 'deal_hunter', label: 'Deal Hunter', color: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200' },
  { id: 'expert', label: 'Community Expert', color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400 border-purple-200' }
];

export function UsersClient({ initialUsers }: { initialUsers: any[] }) {
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  const [search, setSearch] = useState('');
  const [manageBadgesUserId, setManageBadgesUserId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this user? This will remove all their data and pets permanently.')) return;
    setIsProcessing(true);
    const result = await deleteUser(id);
    if (result.success) {
      router.refresh();
    } else {
      alert(result.message);
    }
    setIsProcessing(false);
  };

  const handleAddBadge = async (userId: string, badge: string) => {
    setIsProcessing(true);
    await addBadgeToUser(userId, badge);
    setIsProcessing(false);
    router.refresh();
  };

  const handleRemoveBadge = async (userId: string, badge: string) => {
    setIsProcessing(true);
    await removeBadgeFromUser(userId, badge);
    setIsProcessing(false);
    router.refresh();
  };

  const filteredUsers = initialUsers.filter(u => 
    u.name.toLowerCase().includes(search.toLowerCase()) || 
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
      </div>

      <div className="bg-card border border-border rounded-lg overflow-hidden flex flex-col">
        <div className="p-4 border-b border-border bg-muted/30">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Search by name or email..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-muted/10 border-b border-border">
                <th className="px-6 py-4 font-semibold text-sm">User Details</th>
                <th className="px-6 py-4 font-semibold text-sm">Pets</th>
                <th className="px-6 py-4 font-semibold text-sm">Badges</th>
                <th className="px-6 py-4 font-semibold text-sm">Joined</th>
                <th className="px-6 py-4 font-semibold text-sm text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">
                    No users found.
                  </td>
                </tr>
              ) : (
                filteredUsers.map(user => (
                  <tr key={user.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-foreground flex items-center gap-2">
                        {user.name}
                        {user.email === 'admin@mondopets.com' && <span title="Admin"><Shield className="w-4 h-4 text-primary" /></span>}
                      </div>
                      <div className="text-sm text-muted-foreground mt-1">{user.email}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {user.pets.length === 0 ? (
                          <span className="text-xs text-muted-foreground italic">None</span>
                        ) : (
                          user.pets.map((pet: any) => (
                            <span key={pet.id} className="bg-muted text-muted-foreground px-2 py-1 rounded text-xs font-medium border border-border">
                              {pet.name} ({pet.type})
                            </span>
                          ))
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {user.badges.length === 0 ? (
                          <span className="text-xs text-muted-foreground italic">None</span>
                        ) : (
                          user.badges.map((badgeId: string) => {
                            const badgeInfo = AVAILABLE_BADGES.find(b => b.id === badgeId);
                            if (!badgeInfo) return null;
                            return (
                              <span key={badgeId} className={`px-2 py-1 rounded-full text-[10px] font-bold border uppercase tracking-wider ${badgeInfo.color}`}>
                                {badgeInfo.label}
                              </span>
                            );
                          })
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={() => setManageBadgesUserId(user.id)}
                          className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-md transition-colors"
                          title="Manage Badges"
                        >
                          <Award className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(user.id)}
                          disabled={isProcessing}
                          className="p-2 text-muted-foreground hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-md transition-colors disabled:opacity-50"
                          title="Delete User"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Badge Management Modal */}
      {manageBadgesUserId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
          <div className="bg-card border border-border shadow-xl rounded-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Award className="w-5 h-5 text-primary" />
                Manage Badges
              </h2>
              <button 
                onClick={() => setManageBadgesUserId(null)}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              {AVAILABLE_BADGES.map(badge => {
                const user = initialUsers.find(u => u.id === manageBadgesUserId);
                const hasBadge = user?.badges.includes(badge.id);
                
                return (
                  <div key={badge.id} className="flex items-center justify-between p-3 border border-border rounded-lg bg-muted/30">
                    <span className={`px-2 py-1 rounded-full text-xs font-bold border uppercase tracking-wider ${badge.color}`}>
                      {badge.label}
                    </span>
                    
                    {hasBadge ? (
                      <button 
                        onClick={() => handleRemoveBadge(manageBadgesUserId, badge.id)}
                        disabled={isProcessing}
                        className="text-xs font-medium text-red-600 bg-red-50 dark:bg-red-950/30 px-3 py-1.5 rounded-md hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors disabled:opacity-50"
                      >
                        Remove
                      </button>
                    ) : (
                      <button 
                        onClick={() => handleAddBadge(manageBadgesUserId, badge.id)}
                        disabled={isProcessing}
                        className="text-xs font-medium text-primary bg-primary/10 px-3 py-1.5 rounded-md hover:bg-primary/20 transition-colors disabled:opacity-50"
                      >
                        Assign
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
