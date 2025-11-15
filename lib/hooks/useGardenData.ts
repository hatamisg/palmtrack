import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as gardensApi from '@/lib/supabase/api/gardens';
import * as harvestsApi from '@/lib/supabase/api/harvests';
import * as issuesApi from '@/lib/supabase/api/issues';
import * as maintenancesApi from '@/lib/supabase/api/maintenances';
import * as documentationApi from '@/lib/supabase/api/documentation';
import * as expensesApi from '@/lib/supabase/api/expenses';
import { toast } from 'sonner';

// Query Keys
export const gardenKeys = {
  all: ['gardens'] as const,
  lists: () => [...gardenKeys.all, 'list'] as const,
  list: (filters?: any) => [...gardenKeys.lists(), filters] as const,
  details: () => [...gardenKeys.all, 'detail'] as const,
  detail: (id: string) => [...gardenKeys.details(), id] as const,
  withRelations: (id: string) => [...gardenKeys.detail(id), 'relations'] as const,
};

export const harvestKeys = {
  all: ['harvests'] as const,
  byGarden: (gardenId: string) => [...harvestKeys.all, 'garden', gardenId] as const,
};

export const issueKeys = {
  all: ['issues'] as const,
  byGarden: (gardenId: string) => [...issueKeys.all, 'garden', gardenId] as const,
};

export const maintenanceKeys = {
  all: ['maintenances'] as const,
  byGarden: (gardenId: string) => [...maintenanceKeys.all, 'garden', gardenId] as const,
};

export const documentationKeys = {
  all: ['documentation'] as const,
  byGarden: (gardenId: string) => [...documentationKeys.all, 'garden', gardenId] as const,
};

export const expenseKeys = {
  all: ['expenses'] as const,
  byGarden: (gardenId: string) => [...expenseKeys.all, 'garden', gardenId] as const,
};

// Hooks

/**
 * Fetch all gardens
 */
export function useGardens() {
  return useQuery({
    queryKey: gardenKeys.lists(),
    queryFn: async () => {
      const { data, error } = await gardensApi.getAllGardens();
      if (error) throw new Error(error);
      return data || [];
    },
  });
}

/**
 * Fetch single garden with all related data (optimized single query)
 */
export function useGardenWithRelations(idOrSlug: string) {
  return useQuery({
    queryKey: gardenKeys.withRelations(idOrSlug),
    queryFn: async () => {
      const { data, error } = await gardensApi.getGardenWithRelations(idOrSlug);
      if (error) throw new Error(error);
      return data;
    },
    enabled: !!idOrSlug,
  });
}

/**
 * Fetch harvests for a garden
 */
export function useHarvests(gardenId: string) {
  return useQuery({
    queryKey: harvestKeys.byGarden(gardenId),
    queryFn: async () => {
      const { data, error } = await harvestsApi.getHarvestsByGarden(gardenId);
      if (error) throw new Error(error);
      return data || [];
    },
    enabled: !!gardenId,
  });
}

/**
 * Create harvest mutation
 */
export function useCreateHarvest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (harvest: any) => {
      const { data, error } = await harvestsApi.createHarvest(harvest);
      if (error) throw new Error(error);
      return data;
    },
    onSuccess: (data, variables) => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: harvestKeys.byGarden(variables.gardenId) });
      queryClient.invalidateQueries({ queryKey: gardenKeys.withRelations(variables.gardenId) });
      toast.success('Panen berhasil ditambahkan!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Gagal menambahkan panen');
    },
  });
}

/**
 * Update harvest mutation
 */
export function useUpdateHarvest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, harvest }: { id: string; harvest: any }) => {
      const { data, error } = await harvestsApi.updateHarvest(id, harvest);
      if (error) throw new Error(error);
      return data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: harvestKeys.byGarden(variables.harvest.gardenId) });
      queryClient.invalidateQueries({ queryKey: gardenKeys.withRelations(variables.harvest.gardenId) });
      toast.success('Panen berhasil diperbarui!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Gagal memperbarui panen');
    },
  });
}

/**
 * Delete harvest mutation
 */
export function useDeleteHarvest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, gardenId }: { id: string; gardenId: string }) => {
      const { success, error } = await harvestsApi.deleteHarvest(id);
      if (error) throw new Error(error);
      return success;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: harvestKeys.byGarden(variables.gardenId) });
      queryClient.invalidateQueries({ queryKey: gardenKeys.withRelations(variables.gardenId) });
      toast.success('Panen berhasil dihapus!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Gagal menghapus panen');
    },
  });
}

/**
 * Fetch issues for a garden
 */
export function useIssues(gardenId: string) {
  return useQuery({
    queryKey: issueKeys.byGarden(gardenId),
    queryFn: async () => {
      const { data, error } = await issuesApi.getIssuesByGarden(gardenId);
      if (error) throw new Error(error);
      return data || [];
    },
    enabled: !!gardenId,
  });
}

/**
 * Create issue mutation
 */
export function useCreateIssue() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (issue: any) => {
      const { data, error } = await issuesApi.createIssue(issue);
      if (error) throw new Error(error);
      return data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: issueKeys.byGarden(variables.gardenId) });
      queryClient.invalidateQueries({ queryKey: gardenKeys.withRelations(variables.gardenId) });
      toast.success('Masalah berhasil ditambahkan!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Gagal menambahkan masalah');
    },
  });
}

/**
 * Update issue mutation
 */
export function useUpdateIssue() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, issue }: { id: string; issue: any }) => {
      const { data, error } = await issuesApi.updateIssue(id, issue);
      if (error) throw new Error(error);
      return data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: issueKeys.byGarden(variables.issue.gardenId) });
      queryClient.invalidateQueries({ queryKey: gardenKeys.withRelations(variables.issue.gardenId) });
      toast.success('Masalah berhasil diperbarui!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Gagal memperbarui masalah');
    },
  });
}

/**
 * Delete issue mutation
 */
export function useDeleteIssue() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, gardenId }: { id: string; gardenId: string }) => {
      const { success, error } = await issuesApi.deleteIssue(id);
      if (error) throw new Error(error);
      return success;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: issueKeys.byGarden(variables.gardenId) });
      queryClient.invalidateQueries({ queryKey: gardenKeys.withRelations(variables.gardenId) });
      toast.success('Masalah berhasil dihapus!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Gagal menghapus masalah');
    },
  });
}

/**
 * Fetch maintenances for a garden
 */
export function useMaintenances(gardenId: string) {
  return useQuery({
    queryKey: maintenanceKeys.byGarden(gardenId),
    queryFn: async () => {
      const { data, error } = await maintenancesApi.getMaintenancesByGarden(gardenId);
      if (error) throw new Error(error);
      return data || [];
    },
    enabled: !!gardenId,
  });
}

/**
 * Fetch documentation for a garden
 */
export function useDocumentation(gardenId: string) {
  return useQuery({
    queryKey: documentationKeys.byGarden(gardenId),
    queryFn: async () => {
      const { data, error } = await documentationApi.getDocumentationByGarden(gardenId);
      if (error) throw new Error(error);
      return data || [];
    },
    enabled: !!gardenId,
  });
}

/**
 * Fetch expenses for a garden
 */
export function useExpenses(gardenId: string) {
  return useQuery({
    queryKey: expenseKeys.byGarden(gardenId),
    queryFn: async () => {
      const { data, error } = await expensesApi.getExpensesByGarden(gardenId);
      if (error) throw new Error(error);
      return data || [];
    },
    enabled: !!gardenId,
  });
}
