// src/hooks/useUser.ts
import { useQuery } from "@tanstack/react-query";
import  api from "@/services/api";
import { User } from "@/types/User";

export function useUser() {
  return useQuery<User>({
    queryKey: ["user"],
    queryFn: async () => {
      const { data } = await api.get<User>("/users/me/data");
      return data;
    },
    staleTime: 1000 * 60 * 5, // cache de 5 minutos
    retry: 1, // tentar 1 vez em caso de erro
  });
}
