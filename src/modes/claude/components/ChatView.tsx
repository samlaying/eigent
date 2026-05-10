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

import { MarkDown } from '@/components/ChatBox/MessageItem/MarkDown';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { ArrowUp, Bot, Key, Settings, StopCircle, User } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useClaudeChat } from '../hooks/useClaudeChat';
import { useClaudeChatStore } from '../store/chatStore';
import {
  PROVIDERS,
  useProviderStore,
  type ProviderId,
} from '../store/providerStore';
import ModelSwitcher from './ModelSwitcher';
import PlusMenu from './PlusMenu';

export default function ChatView() {
  const { t } = useTranslation();
  const store = useClaudeChatStore();
  const providerStore = useProviderStore();
  const { sendMessage, stopGeneration } = useClaudeChat();
  const [input, setInput] = useState('');
  const [isComposing, setIsComposing] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const [keyDialogOpen, setKeyDialogOpen] = useState(false);
  const [settingsProvider, setSettingsProvider] = useState<ProviderId>(
    providerStore.activeProvider
  );
  const [tempKey, setTempKey] = useState(
    providerStore.getEffectiveKey(settingsProvider)
  );

  const conv = store.activeConversationId
    ? store.conversations[store.activeConversationId]
    : null;
  const messages = conv?.messages || [];
  const hasMessages = messages.length > 0;
  const hasApiKey = providerStore.activeProvider
    ? !!providerStore.getEffectiveKey(providerStore.activeProvider)
    : false;

  useEffect(() => {
    const unsub = useProviderStore.subscribe(() => {
      const state = useProviderStore.getState();
      setTempKey(state.getEffectiveKey(settingsProvider));
    });
    return unsub;
  }, [settingsProvider]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, store.streamingContent]);

  useEffect(() => {
    if (textareaRef.current && input === '') {
      textareaRef.current.style.height = 'auto';
    }
  }, [input]);

  const handleSettingsProviderChange = (id: ProviderId) => {
    providerStore.setActiveProvider(id);
    setSettingsProvider(id);
    setTempKey(providerStore.getEffectiveKey(id));
  };

  const handleSend = () => {
    if (!input.trim() || store.isStreaming) return;
    sendMessage(input.trim());
    setInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey && !isComposing) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSaveKey = () => {
    providerStore.setCustomKey(settingsProvider, tempKey);
    const activeKey = providerStore.getEffectiveKey(
      providerStore.activeProvider
    );
    if (!activeKey) {
      setKeyDialogOpen(true);
    } else {
      setKeyDialogOpen(false);
    }
  };

  const handleModelChange = (_model: string) => {
    // model is persisted to localStorage by ModelSwitcher
  };

  if (!hasApiKey) {
    return (
      <div className="bg-white flex h-full flex-col items-center justify-center gap-4 px-6 dark:bg-[#1F1F1F]">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#d97757]/10">
          <Key className="h-6 w-6 text-[#d97757]" />
        </div>
        <h2 className="text-xl font-semibold text-[#2F2F2F] dark:text-[#E8E8E8]">
          {t('settings.api-key-required', 'API Key Required')}
        </h2>
        <p className="max-w-md text-center text-sm text-[#8F8F8F] dark:text-[#8A8A8A]">
          {t(
            'settings.api-key-desc',
            'Enter your API key to start chatting. Select a provider to get started.'
          )}
        </p>
        <div className="flex w-full max-w-sm flex-col gap-3">
          <div className="flex gap-2">
            {(
              Object.values(PROVIDERS) as Array<(typeof PROVIDERS)[ProviderId]>
            ).map((p) => (
              <button
                key={p.id}
                className={`flex-1 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  settingsProvider === p.id
                    ? 'text-white bg-[#d97757]'
                    : 'bg-[#F0F0F0] text-[#6B6B6B] hover:bg-[#E5E5E5] dark:bg-[#333333] dark:text-[#A8A8A8] dark:hover:bg-[#3A3A3A]'
                }`}
                onClick={() => handleSettingsProviderChange(p.id)}
              >
                {p.label}
              </button>
            ))}
          </div>
          <input
            type="password"
            value={tempKey}
            onChange={(e) => setTempKey(e.target.value)}
            placeholder={
              PROVIDERS[settingsProvider].authType === 'api-key'
                ? 'tp-...'
                : 'sk-...'
            }
            className="rounded-xl border border-[#E5E5E5] bg-[#FAFAFA] px-4 py-2.5 text-sm text-[#2F2F2F] outline-none transition-colors focus:border-[#8F8F8F] dark:border-[#3A3A3A] dark:bg-[#2A2A2A] dark:text-[#E8E8E8] dark:focus:border-[#8A8A8A]"
            autoFocus
          />
          <button
            className="text-white w-full rounded-lg bg-[#d97757] px-4 py-2.5 text-sm font-medium transition-colors hover:bg-[#c16540] disabled:opacity-40"
            onClick={handleSaveKey}
            disabled={!tempKey.trim()}
          >
            {t('settings.save-key', 'Save API Key')}
          </button>
        </div>
      </div>
    );
  }

  // Shared chat input — Open-claude style
  const chatInputArea = (
    <div className="rounded-2xl border border-[#E5E5E5] bg-[#FAFAFA] p-3 transition-colors focus-within:border-[#8F8F8F] dark:border-[#3A3A3A] dark:bg-[#2A2A2A] dark:focus-within:border-[#8A8A8A] md:p-4">
      <textarea
        ref={textareaRef}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        onCompositionStart={() => setIsComposing(true)}
        onCompositionEnd={() => setIsComposing(false)}
        placeholder={t('chat.ask-placeholder', 'How can I help you today?')}
        className="max-h-[200px] min-h-[40px] w-full resize-none border-none bg-transparent text-base leading-relaxed text-[#2F2F2F] outline-none placeholder:text-[#8F8F8F] dark:text-[#E8E8E8] dark:placeholder:text-[#8A8A8A]"
        rows={1}
        disabled={store.isStreaming}
        autoFocus={!hasMessages}
        onInput={(e) => {
          const el = e.currentTarget;
          el.style.height = 'auto';
          el.style.height = `${Math.min(el.scrollHeight, 200)}px`;
        }}
      />
      <div className="mt-3 flex items-center justify-between">
        <div className="flex items-center gap-0.5">
          <PlusMenu />
        </div>
        <div className="flex items-center gap-2">
          <ModelSwitcher compact onChange={handleModelChange} />
          <Dialog open={keyDialogOpen} onOpenChange={setKeyDialogOpen}>
            <DialogTrigger asChild>
              <button
                className="rounded-lg p-2 text-[#8F8F8F] transition-colors hover:bg-[#F0F0F0] hover:text-[#2F2F2F] dark:text-[#8A8A8A] dark:hover:bg-[#3A3A3A] dark:hover:text-[#E8E8E8]"
                title={t('settings.api-key', 'API Key Settings')}
              >
                <Settings size={18} />
              </button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {t('settings.api-key', 'API Key Settings')}
                </DialogTitle>
              </DialogHeader>
              <div className="flex flex-col gap-3">
                <div className="flex gap-2">
                  {(
                    Object.values(PROVIDERS) as Array<
                      (typeof PROVIDERS)[ProviderId]
                    >
                  ).map((p) => (
                    <Button
                      key={p.id}
                      variant={
                        settingsProvider === p.id ? 'primary' : 'secondary'
                      }
                      size="sm"
                      className="flex-1"
                      onClick={() => handleSettingsProviderChange(p.id)}
                    >
                      {p.label}
                    </Button>
                  ))}
                </div>
                <input
                  type="password"
                  value={tempKey}
                  onChange={(e) => setTempKey(e.target.value)}
                  placeholder={
                    PROVIDERS[settingsProvider].authType === 'api-key'
                      ? 'tp-...'
                      : 'sk-...'
                  }
                  className="rounded-xl border border-input-border-default bg-input-bg-input px-4 py-2.5 text-body-sm outline-none transition-colors focus:border-input-border-focus"
                />
                <Button variant="primary" onClick={handleSaveKey}>
                  {t('settings.save', 'Save')}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
          {store.isStreaming ? (
            <button
              className="flex h-8 w-8 items-center justify-center rounded-full text-[#fb2c36] transition-colors hover:bg-[#fb2c36]/10"
              onClick={stopGeneration}
            >
              <StopCircle size={18} />
            </button>
          ) : (
            <button
              className="text-white flex h-8 w-8 items-center justify-center rounded-full bg-[#d97757] transition-colors hover:bg-[#c16540] disabled:cursor-not-allowed disabled:opacity-40"
              onClick={handleSend}
              disabled={!input.trim()}
            >
              <ArrowUp size={18} />
            </button>
          )}
        </div>
      </div>
    </div>
  );

  if (!hasMessages) {
    return (
      <div className="bg-white flex h-full flex-col dark:bg-[#1F1F1F]">
        <div className="flex flex-1 flex-col items-center justify-center px-6">
          <div className="mx-auto flex w-full max-w-3xl flex-col items-center gap-6">
            <h2
              className="text-3xl font-light text-[#2F2F2F] dark:text-[#E8E8E8] md:text-4xl"
              style={{ fontFamily: "'Georgia', 'Tiempos Text', serif" }}
            >
              <span className="mr-2 text-[#d97757] dark:text-[#e89b7d]">
                🌸
              </span>
              {t('welcome.claude-title', 'How can I help you today?')}
            </h2>
            <p className="text-sm text-[#8F8F8F] dark:text-[#8A8A8A]">
              {t(
                'welcome.claude-subtitle',
                'Ask Eigent to automate your tasks'
              )}
            </p>

            <div className="w-full max-w-3xl px-4 md:px-6">{chatInputArea}</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white flex h-full flex-col dark:bg-[#1F1F1F]">
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-4 py-6 md:px-6 md:py-8"
      >
        <div className="mx-auto flex w-full max-w-3xl flex-col gap-4">
          {messages
            .filter(
              (msg) => !store.isStreaming || msg.id !== store.streamingMessageId
            )
            .map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3 rounded-lg px-4 py-6 md:gap-4 ${
                  msg.role === 'assistant'
                    ? 'bg-[#FAFAFA] dark:bg-[#2A2A2A]'
                    : ''
                }`}
              >
                <div
                  className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-lg md:h-7 md:w-7 ${
                    msg.role === 'user' ? 'bg-[#F0F0F0] dark:bg-[#3A3A3A]' : ''
                  }`}
                >
                  {msg.role === 'user' ? (
                    <User className="h-3.5 w-3.5 text-[#6B6B6B] dark:text-[#A8A8A8]" />
                  ) : (
                    <Bot className="h-3.5 w-3.5 text-[#d97757] dark:text-[#e89b7d]" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="mb-1.5 text-sm font-medium text-[#2F2F2F] dark:text-[#E8E8E8]">
                    {msg.role === 'user' ? 'You' : 'Assistant'}
                  </div>
                  <div className="text-[15px] leading-relaxed text-[#2F2F2F] dark:text-[#E8E8E8]">
                    {msg.role === 'user' ? (
                      <div className="whitespace-pre-wrap">{msg.content}</div>
                    ) : (
                      <MarkDown
                        content={msg.content}
                        enableTypewriter={false}
                      />
                    )}
                  </div>
                </div>
              </div>
            ))}

          {store.isStreaming && store.streamingMessageId && (
            <div className="flex gap-3 rounded-lg bg-[#FAFAFA] px-4 py-6 dark:bg-[#2A2A2A] md:gap-4">
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg md:h-7 md:w-7">
                <Bot className="h-3.5 w-3.5 text-[#d97757] dark:text-[#e89b7d]" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="mb-1.5 text-sm font-medium text-[#2F2F2F] dark:text-[#E8E8E8]">
                  Assistant
                </div>
                <div className="text-[15px] leading-relaxed text-[#2F2F2F] dark:text-[#E8E8E8]">
                  <MarkDown
                    content={store.streamingContent}
                    enableTypewriter={false}
                  />
                  <span className="ml-1 inline-block h-4 w-1.5 animate-pulse rounded-sm bg-[#d97757] dark:bg-[#e89b7d]" />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="w-full px-4 py-4 md:px-6 md:py-6">
        <div className="mx-auto max-w-3xl">{chatInputArea}</div>
      </div>
    </div>
  );
}
