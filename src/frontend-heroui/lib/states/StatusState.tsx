import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { ApiEndpoints } from '../enums/ApiEndpoints';
import type { ModelType } from '../enums/ModelType';
import { apiUrl } from '../functions/api';
import { api } from '../api';
import type { StatusCodeListInterface } from '../components/Status';
import { statusCodeList } from '../defaults';
import { useUserState } from './UserState';

export type StatusLookup = Record<ModelType | string, StatusCodeListInterface>;

interface ServerStateProps {
  status?: StatusLookup;
  setStatus: (newStatus: StatusLookup) => void;
  fetchStatus: () => void;
}

export const useGlobalStatusState = create<ServerStateProps>()(
  persist(
    (set) => ({
      status: undefined,
      setStatus: (newStatus: StatusLookup) => set({ status: newStatus }),
      fetchStatus: async () => {
        const { isLoggedIn } = useUserState.getState();

        // Fetch status data for rendering labels
        if (!isLoggedIn()) {
          return;
        }

        await api
          .get(apiUrl(ApiEndpoints.global_status))
          .then((response) => {
            const newStatusLookup: StatusLookup = {} as StatusLookup;
            for (const key in response.data) {
              newStatusLookup[statusCodeList[key] || key] = {
                status_class: key,
                values: response.data[key].values
              };
            }
            set({ status: newStatusLookup });
          })
          .catch(() => {
            console.error('ERR: Error fetching global status information');
          });
      }
    }),
    {
      name: 'global-status-state',
      storage: createJSONStorage(() => sessionStorage)
    }
  )
);
