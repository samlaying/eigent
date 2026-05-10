// ========= Copyright 2025-2026 @ Eigent.ai All Rights Reserved. =========
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
// ========= Copyright 2025-2026 @ Eigent.ai All Rights Reserved. =========

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type ProviderId = 'siliconflow' | 'mimo' | 'modelscope';

export interface ProviderConfig {
  id: ProviderId;
  label: string;
  baseUrl: string;
  defaultKey: string;
  authType: 'bearer' | 'api-key';
}

export const PROVIDERS: Record<ProviderId, ProviderConfig> = {
  siliconflow: {
    id: 'siliconflow',
    label: 'SiliconFlow',
    baseUrl: 'https://api.siliconflow.cn/v1',
    defaultKey: 'sk-nnrmbvsitmenuyixeywlohhczbwntzprzgivbwligexpssji',
    authType: 'bearer',
  },
  mimo: {
    id: 'mimo',
    label: 'Xiaomi MiMo',
    baseUrl: 'https://token-plan-cn.xiaomimimo.com/v1',
    defaultKey: 'tp-czq97wj2vol05hpfipuico337yuvk7tbo8ikslu5yh8vjnlb',
    authType: 'api-key',
  },
  modelscope: {
    id: 'modelscope',
    label: 'ModelScope',
    baseUrl: 'https://api-inference.modelscope.cn/v1',
    defaultKey: 'ms-d5cfc145-43bc-4f26-8601-f2882e2c09d5',
    authType: 'bearer',
  },
};

export function getProvider(id: ProviderId): ProviderConfig {
  return PROVIDERS[id];
}

export const PROVIDER_KEY = 'eigent-active-provider';

export function detectProviderByModel(model: string): ProviderId {
  const stored =
    typeof window !== 'undefined'
      ? (localStorage.getItem(PROVIDER_KEY) as ProviderId | null)
      : null;
  if (stored && PROVIDERS[stored]) return stored;
  if (model.startsWith('MiMo-') || model.startsWith('mimo-')) return 'mimo';
  return 'siliconflow';
}

interface ProviderState {
  activeProvider: ProviderId;
  customKeys: Partial<Record<ProviderId, string>>;
  setActiveProvider: (id: ProviderId) => void;
  setCustomKey: (id: ProviderId, key: string) => void;
  getEffectiveKey: (id: ProviderId) => string;
  getEffectiveBaseUrl: (id: ProviderId) => string;
}

export const useProviderStore = create<ProviderState>()(
  persist(
    (set, get) => ({
      activeProvider: 'siliconflow',
      customKeys: {},

      setActiveProvider: (id) => set({ activeProvider: id }),

      setCustomKey: (id, key) =>
        set((state) => ({
          customKeys: { ...state.customKeys, [id]: key },
        })),

      getEffectiveKey: (id) => {
        const cfg = PROVIDERS[id];
        const custom = get().customKeys[id];
        return custom || cfg.defaultKey;
      },

      getEffectiveBaseUrl: (id) => PROVIDERS[id].baseUrl,
    }),
    { name: 'eigent-llm-provider' }
  )
);
