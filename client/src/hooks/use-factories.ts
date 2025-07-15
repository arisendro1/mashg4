import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { Factory, InsertFactory, UpdateFactory } from "@shared/schema";

export function useFactories() {
  return useQuery<Factory[]>({
    queryKey: ["/api/factories"],
  });
}

export function useFactory(id: string) {
  return useQuery<Factory>({
    queryKey: ["/api/factories", id],
    enabled: !!id,
  });
}

export function useSearchFactories(query: string) {
  return useQuery({
    queryKey: ["/api/factories/search", query],
    queryFn: async () => {
      const response = await fetch(`/api/factories/search?q=${encodeURIComponent(query)}`);
      if (!response.ok) {
        throw new Error("Failed to search factories");
      }
      return response.json() as Promise<Factory[]>;
    },
    enabled: !!query.trim(),
  });
}

export function useCreateFactory() {
  return useMutation({
    mutationFn: async (factory: InsertFactory) => {
      return apiRequest("POST", "/api/factories", factory);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/factories"] });
    },
  });
}

export function useUpdateFactory() {
  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: UpdateFactory }) => {
      return apiRequest("PUT", `/api/factories/${id}`, data);
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["/api/factories"] });
      queryClient.invalidateQueries({ queryKey: ["/api/factories", id.toString()] });
    },
  });
}

export function useDeleteFactory() {
  return useMutation({
    mutationFn: async (id: number) => {
      return apiRequest("DELETE", `/api/factories/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/factories"] });
    },
  });
}