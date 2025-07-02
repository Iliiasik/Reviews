// features/organization/api/getOrganizationById.ts
import api from '@shared/axios/axios';
import type { OrganizationProfile } from '../types/OrganizationProfile';

export const getOrganizationById = (id: string) =>
    api.get<OrganizationProfile>(`/organization/${id}`).then((res) => res.data);
