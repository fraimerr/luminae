import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { getData } from "~/lib/api/getData";

export function useApi<T>(url: string, enabled: boolean): UseQueryResult<T> {
  return useQuery({
    queryKey: [url],
    queryFn: () => getData<T>(url),
    enabled,
  });
}
