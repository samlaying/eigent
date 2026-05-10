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

import { useNavigationStore } from '@/store/navigationStore';
import { Box, Home, Puzzle, ScrollText, Settings } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const navItems = [
  { view: 'home' as const, icon: Home, route: '/' },
  { view: 'history' as const, icon: ScrollText, route: '/history' },
  { view: 'artifacts' as const, icon: Box, route: '/history?tab=settings' },
  { view: 'connectors' as const, icon: Puzzle, route: '/history?tab=settings' },
  { view: 'settings' as const, icon: Settings, route: '/history?tab=settings' },
];

export default function NavBar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { activeView, setActiveView } = useNavigationStore();

  const isActive = (item: (typeof navItems)[number]) => {
    if (item.view === 'home') return location.pathname === '/';
    if (item.view === 'history') return location.pathname === '/history';
    if (item.view === 'settings')
      return (
        location.pathname === '/history' && location.search === '?tab=settings'
      );
    return false;
  };

  return (
    <div className="flex h-full w-12 flex-col items-center gap-2 border-r border-border-secondary py-3">
      {navItems.map((item) => (
        <button
          key={item.view}
          onClick={() => {
            setActiveView(item.view);
            if (item.view === 'artifacts') {
              toast.info('Artifacts panel coming soon');
              return;
            }
            if (item.view === 'connectors') {
              toast.info('Connectors management coming soon');
              return;
            }
            navigate(item.route);
          }}
          className={`flex h-9 w-9 items-center justify-center rounded-lg transition-colors ${
            isActive(item)
              ? 'bg-menubutton-fill-active text-menutabs-text-active'
              : 'text-menubutton-text-default opacity-70 hover:bg-menubutton-fill-hover hover:opacity-100'
          }`}
          title={
            item.view === 'artifacts'
              ? 'Artifacts (Coming Soon)'
              : item.view === 'connectors'
                ? 'Connectors (Coming Soon)'
                : undefined
          }
        >
          <item.icon className="h-5 w-5" />
        </button>
      ))}
    </div>
  );
}
