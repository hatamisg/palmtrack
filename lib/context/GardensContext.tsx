"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Garden } from '@/types';
import * as gardensApi from '@/lib/supabase/api/gardens';
import { gardens as mockGardens } from '@/lib/data/mock-data';
import { toast } from 'sonner';
import { generateUUID, generateSlug } from '@/lib/utils';

interface GardensContextType {
  gardens: Garden[];
  loading: boolean;
  error: string | null;
  refreshGardens: () => Promise<void>;
  createGarden: (garden: Omit<Garden, 'id' | 'createdAt' | 'updatedAt' | 'slug'>) => Promise<boolean>;
  updateGarden: (id: string, garden: Omit<Garden, 'id' | 'createdAt' | 'updatedAt' | 'slug'>) => Promise<boolean>;
  deleteGarden: (id: string) => Promise<boolean>;
  getGardenById: (id: string) => Garden | undefined;
  getGardenBySlug: (slug: string) => Garden | undefined;
}

const GardensContext = createContext<GardensContextType | undefined>(undefined);

interface GardensProviderProps {
  children: ReactNode;
  useSupabase?: boolean; // Toggle between Supabase and mock data
}

export function GardensProvider({ children, useSupabase = false }: GardensProviderProps) {
  const [gardens, setGardens] = useState<Garden[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Determine if we should use Supabase
  const shouldUseSupabase = useSupabase;

  // Fetch gardens on mount
  useEffect(() => {
    refreshGardens();
  }, [shouldUseSupabase]);

  const refreshGardens = async () => {
    setLoading(true);
    setError(null);

    try {
      if (shouldUseSupabase) {
        // Fetch from Supabase
        console.log('📡 Fetching gardens from Supabase...');
        const { data, error } = await gardensApi.getAllGardens();

        if (error) {
          throw new Error(error);
        }

        setGardens(data || []);
        console.log(`✅ Successfully loaded ${data?.length || 0} gardens from Supabase`);
      } else {
        // Use mock data
        console.log('📋 Using mock data (Supabase not configured)');
        setGardens(mockGardens);
      }
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to fetch gardens';
      setError(errorMessage);
      console.error('❌ Error fetching gardens:', err);

      // Fallback to mock data if Supabase fails
      if (shouldUseSupabase) {
        console.log('⚠️ Falling back to mock data due to error');
        setGardens(mockGardens);
      }
    } finally {
      setLoading(false);
    }
  };

  const createGarden = async (gardenData: Omit<Garden, 'id' | 'createdAt' | 'updatedAt' | 'slug'>): Promise<boolean> => {
    // Generate slug from nama
    const gardenDataWithSlug = {
      ...gardenData,
      slug: generateSlug(gardenData.nama),
    };

    try {
      if (shouldUseSupabase) {
        // Create in Supabase
        console.log('📡 Creating garden in Supabase...');
        const { data, error } = await gardensApi.createGarden(gardenDataWithSlug);

        if (error) {
          throw new Error(error);
        }

        if (data) {
          setGardens(prev => [data, ...prev]);
          toast.success('Kebun berhasil ditambahkan ke database!');
          console.log('✅ Garden created in Supabase:', data.id);
          return true;
        }
      } else {
        // Create in local state (mock)
        console.log('📋 Creating garden in mock data (not persisted)');
        const newGarden: Garden = {
          ...gardenDataWithSlug,
          id: generateUUID(),
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        setGardens(prev => [newGarden, ...prev]);
        toast.success('Kebun berhasil ditambahkan! (Mock data - tidak tersimpan di database)');
        return true;
      }

      return false;
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to create garden';
      toast.error(errorMessage);
      console.error('❌ Error creating garden:', err);
      return false;
    }
  };

  const updateGarden = async (idOrSlug: string, gardenData: Omit<Garden, 'id' | 'createdAt' | 'updatedAt' | 'slug'>): Promise<boolean> => {
    // Generate new slug if nama changed
    const gardenDataWithSlug = {
      ...gardenData,
      slug: generateSlug(gardenData.nama),
    };

    try {
      // Try to find garden in local state first
      let actualId = idOrSlug;
      const garden = gardens.find(g => g.id === idOrSlug || g.slug === idOrSlug);
      if (garden) {
        actualId = garden.id;
      }
      // If not found in state, assume idOrSlug is already a valid UUID
      // This handles cases where the garden data was fetched separately

      if (shouldUseSupabase) {
        // Update in Supabase
        console.log('📡 Updating garden in Supabase:', actualId);
        const { data, error } = await gardensApi.updateGarden(actualId, gardenDataWithSlug);

        if (error) {
          throw new Error(error);
        }

        if (data) {
          setGardens(prev => {
            // Check if garden exists in state
            const exists = prev.some(g => g.id === actualId);
            if (exists) {
              return prev.map(g => g.id === actualId ? data : g);
            }
            // If not in state, add it
            return [data, ...prev];
          });
          toast.success('Kebun berhasil diperbarui di database!');
          console.log('✅ Garden updated in Supabase');
          return true;
        }
      } else {
        // Update in local state (mock)
        console.log('📋 Updating garden in mock data (not persisted):', actualId);
        setGardens(prev => prev.map(g =>
          g.id === actualId
            ? { ...g, ...gardenDataWithSlug, updatedAt: new Date() }
            : g
        ));
        toast.success('Kebun berhasil diperbarui! (Mock data - tidak tersimpan di database)');
        return true;
      }

      return false;
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to update garden';
      toast.error(errorMessage);
      console.error('❌ Error updating garden:', err);
      return false;
    }
  };

  const deleteGarden = async (id: string): Promise<boolean> => {
    try {
      if (shouldUseSupabase) {
        // Delete from Supabase
        console.log('📡 Deleting garden from Supabase:', id);
        const { success, error } = await gardensApi.deleteGarden(id);

        if (error) {
          throw new Error(error);
        }

        if (success) {
          setGardens(prev => prev.filter(g => g.id !== id));
          toast.success('Kebun berhasil dihapus dari database!');
          console.log('✅ Garden deleted from Supabase');
          return true;
        }
      } else {
        // Delete from local state (mock)
        console.log('📋 Deleting garden from mock data (not persisted):', id);
        setGardens(prev => prev.filter(g => g.id !== id));
        toast.success('Kebun berhasil dihapus! (Mock data - tidak tersimpan di database)');
        return true;
      }

      return false;
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to delete garden';
      toast.error(errorMessage);
      console.error('❌ Error deleting garden:', err);
      return false;
    }
  };

  const getGardenById = (id: string): Garden | undefined => {
    return gardens.find(g => g.id === id);
  };

  const getGardenBySlug = (slug: string): Garden | undefined => {
    return gardens.find(g => g.slug === slug);
  };

  const value: GardensContextType = {
    gardens,
    loading,
    error,
    refreshGardens,
    createGarden,
    updateGarden,
    deleteGarden,
    getGardenById,
    getGardenBySlug,
  };

  return (
    <GardensContext.Provider value={value}>
      {children}
    </GardensContext.Provider>
  );
}

// Custom hook to use the GardensContext
export function useGardens() {
  const context = useContext(GardensContext);
  if (context === undefined) {
    throw new Error('useGardens must be used within a GardensProvider');
  }
  return context;
}
