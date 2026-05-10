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

export type ActiveView =
  | 'home'
  | 'history'
  | 'settings'
  | 'artifacts'
  | 'connectors';

interface NavigationState {
  activeView: ActiveView;
  setActiveView: (view: ActiveView) => void;
  listPanelOpen: boolean;
  setListPanelOpen: (open: boolean) => void;
  toggleList: () => void;
  artifactPanelOpen: boolean;
  setArtifactPanelOpen: (open: boolean) => void;
  toggleArtifact: () => void;
}

export const useNavigationStore = create<NavigationState>((set) => ({
  activeView: 'home',
  setActiveView: (view) => set({ activeView: view }),
  listPanelOpen: true,
  setListPanelOpen: (open) => set({ listPanelOpen: open }),
  toggleList: () => set((state) => ({ listPanelOpen: !state.listPanelOpen })),
  artifactPanelOpen: false,
  setArtifactPanelOpen: (open) => set({ artifactPanelOpen: open }),
  toggleArtifact: () =>
    set((state) => ({ artifactPanelOpen: !state.artifactPanelOpen })),
}));
