import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import type { Sport } from '../types';

export const useSports = () => {
  return useQuery({
    queryKey: ['sports'],
    queryFn: async (): Promise<Sport[]> => {
      const { data, error } = await supabase
        .from('sports')
        .select('*')
        .order('name');
      
      if (error) throw error;
      return data || [];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useSportBySlug = (slug: string) => {
  return useQuery({
    queryKey: ['sport', slug],
    queryFn: async (): Promise<Sport | null> => {
      const { data, error } = await supabase
        .from('sports')
        .select('*')
        .eq('slug', slug)
        .single();
      
      if (error) {
        if (error.code === 'PGRST116') return null; // Not found
        throw error;
      }
      return data;
    },
    enabled: !!slug,
    staleTime: 5 * 60 * 1000,
  });
};
