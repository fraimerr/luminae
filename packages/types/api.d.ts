import type { Users } from "@prisma/client";

export type APIUser = {
  user: Users;
};

export interface Guild {
  id: string;
  name: string;
  icon: string | null;
  botPresent: boolean;
}

export interface Module {
  name: string;
  enabled: boolean;
}

export interface APIResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export type APIV1UserGuildsResponse = APIResponse<Guild[]>;

export type APIV1ModulesResponse = APIResponse<Module[]>;
