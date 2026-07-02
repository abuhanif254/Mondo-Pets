'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from '@/i18n/routing';
import { FadeIn } from '@/components/FadeIn';
import { Plus, User as UserIcon, Bone, MapPin, Package, Settings, Star, Trash2 } from 'lucide-react';
import { Link } from '@/i18n/routing';
import { addPetProfile, deletePetProfile } from '@/app/actions';

export default function AccountPage() {
  const { user, refreshUser, logout, loading } = useAuth();
  const router = useRouter();
  
  const [showAddPet, setShowAddPet] = useState(false);
  const [petName, setPetName] = useState('');
  const [petType, setPetType] = useState('Dog');
  const [petBreed, setPetBreed] = useState('');
  const [petAge, setPetAge] = useState('');
  const [addingPet, setAddingPet] = useState(false);

  // If loading is done and no user, we could redirect, but let's just show a prompt.
  if (!loading && !user) {
    router.push('/login');
    return null;
  }

  const handleAddPet = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setAddingPet(true);
    try {
      const res = await addPetProfile({
        userId: user.id,
        name: petName,
        type: petType,
        breed: petBreed,
        age: petAge ? parseInt(petAge) : undefined
      });
      
      if (res.success) {
        setShowAddPet(false);
        setPetName('');
        setPetBreed('');
        setPetAge('');
        await refreshUser();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setAddingPet(false);
    }
  };

  const handleDeletePet = async (petId: string) => {
    if (!user) return;
    if (confirm('Are you sure you want to remove this pet?')) {
      const res = await deletePetProfile(petId, user.id);
      if (res.success) {
        await refreshUser();
      }
    }
  };

  if (loading) {
    return <div className="min-h-[50vh] flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="flex flex-col md:flex-row min-h-[70vh] max-w-7xl mx-auto px-4 lg:px-8 py-10 gap-10">
      
      {/* Sidebar */}
      <div className="w-full md:w-64 space-y-2">
        <div className="p-6 bg-card border border-border rounded-3xl mb-6 shadow-sm text-center">
          <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full mx-auto flex items-center justify-center text-3xl font-bold mb-4">
            {user?.name.charAt(0).toUpperCase()}
          </div>
          <h2 className="font-bold text-lg">{user?.name}</h2>
          <p className="text-sm text-muted-foreground">{user?.email}</p>
        </div>

        <nav className="flex flex-col gap-1">
          <Link href="/account" className="flex items-center gap-3 px-4 py-3 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 font-bold rounded-xl transition-colors">
            <UserIcon className="w-5 h-5" /> Profile & Pets
          </Link>
          <Link href="/orders" className="flex items-center gap-3 px-4 py-3 text-muted-foreground hover:bg-muted font-semibold rounded-xl transition-colors">
            <Package className="w-5 h-5" /> My Orders
          </Link>
          <Link href="/wishlist" className="flex items-center gap-3 px-4 py-3 text-muted-foreground hover:bg-muted font-semibold rounded-xl transition-colors">
            <Star className="w-5 h-5" /> Wishlist
          </Link>
          <Link href="/addresses" className="flex items-center gap-3 px-4 py-3 text-muted-foreground hover:bg-muted font-semibold rounded-xl transition-colors">
            <MapPin className="w-5 h-5" /> Addresses
          </Link>
          <Link href="/settings" className="flex items-center gap-3 px-4 py-3 text-muted-foreground hover:bg-muted font-semibold rounded-xl transition-colors">
            <Settings className="w-5 h-5" /> Settings
          </Link>
          <button onClick={logout} className="flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 font-semibold rounded-xl transition-colors text-left mt-4">
            Log Out
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 space-y-12">
        
        {/* Achievements Section */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold tracking-tight">My Achievements</h3>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className={`p-4 rounded-3xl border-2 flex flex-col items-center justify-center text-center gap-2 transition-all \${user?.badges?.includes('pet_parent') ? 'bg-emerald-50 border-emerald-500 text-emerald-700 shadow-md' : 'bg-card border-border text-muted-foreground opacity-60 grayscale'}`}>
              <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl \${user?.badges?.includes('pet_parent') ? 'bg-emerald-200' : 'bg-muted'}`}>
                🐶
              </div>
              <p className="font-bold text-sm">Pet Parent</p>
            </div>
            
            <div className={`p-4 rounded-3xl border-2 flex flex-col items-center justify-center text-center gap-2 transition-all \${user?.badges?.includes('top_reviewer') ? 'bg-amber-50 border-amber-500 text-amber-700 shadow-md' : 'bg-card border-border text-muted-foreground opacity-60 grayscale'}`}>
              <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl \${user?.badges?.includes('top_reviewer') ? 'bg-amber-200' : 'bg-muted'}`}>
                ⭐
              </div>
              <p className="font-bold text-sm">Top Reviewer</p>
            </div>

            <div className={`p-4 rounded-3xl border-2 flex flex-col items-center justify-center text-center gap-2 transition-all \${user?.badges?.includes('deal_hunter') ? 'bg-blue-50 border-blue-500 text-blue-700 shadow-md' : 'bg-card border-border text-muted-foreground opacity-60 grayscale'}`}>
              <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl \${user?.badges?.includes('deal_hunter') ? 'bg-blue-200' : 'bg-muted'}`}>
                🏷️
              </div>
              <p className="font-bold text-sm">Deal Hunter</p>
            </div>
            
            <div className={`p-4 rounded-3xl border-2 flex flex-col items-center justify-center text-center gap-2 transition-all \${user?.badges?.includes('early_adopter') ? 'bg-purple-50 border-purple-500 text-purple-700 shadow-md' : 'bg-card border-border text-muted-foreground opacity-60 grayscale'}`}>
              <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl \${user?.badges?.includes('early_adopter') ? 'bg-purple-200' : 'bg-muted'}`}>
                🚀
              </div>
              <p className="font-bold text-sm">Early Adopter</p>
            </div>
          </div>
        </section>

        {/* Pets Section */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold tracking-tight">My Pets</h3>
            <button 
              onClick={() => setShowAddPet(!showAddPet)}
              className="flex items-center gap-1 text-sm font-bold bg-emerald-600 text-white px-4 py-2 rounded-full hover:bg-emerald-500 transition-colors shadow-sm"
            >
              <Plus className="w-4 h-4" /> Add Pet
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {user?.pets?.map(pet => (
              <div key={pet.id} className="p-6 bg-card border border-border rounded-3xl shadow-sm flex items-start gap-4 relative group">
                <div className="w-12 h-12 bg-primary/10 text-primary rounded-2xl flex items-center justify-center flex-shrink-0">
                  <Bone className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-lg">{pet.name}</h4>
                  <p className="text-sm text-muted-foreground">
                    {pet.breed ? `${pet.breed} • ` : ''}{pet.type} {pet.age ? `• ${pet.age} years old` : ''}
                  </p>
                </div>
                <button 
                  onClick={() => handleDeletePet(pet.id)}
                  className="absolute top-4 right-4 p-2 text-muted-foreground hover:bg-red-50 hover:text-red-600 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                  title="Remove Pet"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
            
            {(!user?.pets || user.pets.length === 0) && !showAddPet && (
              <div className="col-span-full p-10 border-2 border-dashed border-border rounded-3xl text-center text-muted-foreground">
                <Bone className="w-10 h-10 mx-auto mb-3 opacity-50" />
                <p className="font-semibold text-lg text-foreground mb-1">No pets added yet</p>
                <p className="text-sm">Add your pets to get personalized product recommendations!</p>
              </div>
            )}
          </div>

          {showAddPet && (
            <FadeIn>
              <form onSubmit={handleAddPet} className="mt-6 p-6 bg-muted/30 border border-border rounded-3xl space-y-4">
                <h4 className="font-bold text-lg mb-4">Add a New Pet</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Pet Name *</label>
                    <input required value={petName} onChange={(e) => setPetName(e.target.value)} type="text" className="w-full h-11 px-4 bg-background border border-border rounded-xl" placeholder="Buster" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Pet Type *</label>
                    <select required value={petType} onChange={(e) => setPetType(e.target.value)} className="w-full h-11 px-4 bg-background border border-border rounded-xl">
                      <option>Dog</option>
                      <option>Cat</option>
                      <option>Bird</option>
                      <option>Fish</option>
                      <option>Small Pet</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Breed (Optional)</label>
                    <input value={petBreed} onChange={(e) => setPetBreed(e.target.value)} type="text" className="w-full h-11 px-4 bg-background border border-border rounded-xl" placeholder="Golden Retriever" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Age in Years (Optional)</label>
                    <input value={petAge} onChange={(e) => setPetAge(e.target.value)} type="number" className="w-full h-11 px-4 bg-background border border-border rounded-xl" placeholder="4" />
                  </div>
                </div>
                <div className="flex justify-end gap-3 pt-4">
                  <button type="button" onClick={() => setShowAddPet(false)} className="px-6 py-2 rounded-xl font-bold text-muted-foreground hover:bg-muted transition-colors">Cancel</button>
                  <button type="submit" disabled={addingPet} className="px-6 py-2 rounded-xl font-bold bg-emerald-600 text-white hover:bg-emerald-500 transition-colors disabled:opacity-50">Save Pet</button>
                </div>
              </form>
            </FadeIn>
          )}
        </section>

      </div>
    </div>
  );
}
