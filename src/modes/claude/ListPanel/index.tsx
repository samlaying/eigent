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

import { Button } from '@/components/ui/button';
import { useNavigationStore } from '@/store/navigationStore';
import { MessageSquare, PanelLeftClose, Plus, Search } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useClaudeChatStore } from '../store/chatStore';

export default function ListPanel() {
  const { t } = useTranslation();
  const store = useClaudeChatStore();
  const { toggleList } = useNavigationStore();
  const [searchQuery, setSearchQuery] = useState('');

  const conversations = Object.values(store.conversations).sort(
    (a, b) => b.updatedAt - a.updatedAt
  );
  const activeConversationId = store.activeConversationId;

  const handleNewChat = () => {
    store.createConversation();
  };

  const handleSwitchChat = (conversationId: string) => {
    store.setActiveConversation(conversationId);
  };

  const filteredConversations = conversations.filter((conv) => {
    if (!searchQuery) return true;
    return conv.title.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className="flex h-full flex-col bg-surface-primary">
      <div className="flex items-center justify-between px-3 py-2.5">
        <span className="text-label-md font-semibold text-text-heading">
          {t('layout.projects', 'Projects')}
        </span>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 rounded-md"
            onClick={handleNewChat}
          >
            <Plus className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 rounded-md"
            onClick={toggleList}
          >
            <PanelLeftClose className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="px-2 pb-2">
        <div className="flex items-center gap-1.5 rounded-lg bg-surface-secondary px-2 py-1.5">
          <Search className="h-3.5 w-3.5 text-icon-secondary" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t('layout.search-projects', 'Search projects...')}
            className="flex-1 bg-transparent text-body-xs text-text-body outline-none placeholder:text-text-tertiary"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-2">
        {filteredConversations.length === 0 ? (
          <div className="px-2 py-8 text-center text-body-sm text-text-tertiary">
            {searchQuery
              ? t('layout.no-search-results', 'No matching projects')
              : t('layout.no-projects', 'No projects yet')}
          </div>
        ) : (
          filteredConversations.map((conv) => {
            const isActive = conv.id === activeConversationId;

            return (
              <div key={conv.id} className="mb-1">
                <button
                  onClick={() => handleSwitchChat(conv.id)}
                  className={`w-full rounded-lg px-3 py-2 text-left transition-colors ${
                    isActive
                      ? 'bg-menubutton-fill-active'
                      : 'hover:bg-menubutton-fill-hover'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <MessageSquare
                      className={`h-4 w-4 shrink-0 ${
                        isActive
                          ? 'text-menutabs-text-active'
                          : 'text-icon-secondary'
                      }`}
                    />
                    <span
                      className={`truncate text-body-sm ${
                        isActive
                          ? 'font-medium text-menutabs-text-active'
                          : 'text-text-body'
                      }`}
                    >
                      {conv.title || t('layout.new-project')}
                    </span>
                  </div>
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
