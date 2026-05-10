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

import { useCallback, useRef } from 'react';
import { chat, type ClaudeMessage } from '../api/llmClient';
import { useClaudeChatStore, type ChatMessage } from '../store/chatStore';
import {
  detectProviderByModel,
  getProvider,
  useProviderStore,
} from '../store/providerStore';

const MODEL_KEY = 'eigent-active-model';

export function useClaudeChat() {
  const store = useClaudeChatStore();
  const abortRef = useRef<AbortController | null>(null);

  const ensureConversation = useCallback(() => {
    let convId = store.activeConversationId;
    if (!convId || !store.conversations[convId]) {
      convId = store.createConversation();
    }
    return convId;
  }, [store]);

  const sendMessage = useCallback(
    async (text: string) => {
      const convId = ensureConversation();
      const model =
        (typeof window !== 'undefined'
          ? localStorage.getItem(MODEL_KEY)
          : null) || 'deepseek-ai/DeepSeek-V3';

      const providerId = detectProviderByModel(model);
      const provider = getProvider(providerId);
      const apiKey = useProviderStore.getState().getEffectiveKey(providerId);

      if (!apiKey) {
        store.addMessage(convId, {
          id: `err-${Date.now()}`,
          role: 'assistant',
          content:
            'No API key configured. Please set your API key in Settings.',
          timestamp: Date.now(),
        });
        return;
      }

      const userMsg: ChatMessage = {
        id: `user-${Date.now()}`,
        role: 'user',
        content: text,
        timestamp: Date.now(),
      };
      store.addMessage(convId, userMsg);

      const assistantId = `ai-${Date.now()}`;
      const assistantMsg: ChatMessage = {
        id: assistantId,
        role: 'assistant',
        content: '',
        timestamp: Date.now(),
      };
      store.addMessage(convId, assistantMsg);
      store.setStreaming(assistantId, '');

      const latest = useClaudeChatStore.getState();
      const conv = latest.conversations[convId];
      const messages: ClaudeMessage[] = (conv?.messages || [])
        .filter((m) => m.id !== assistantId)
        .filter((m) => !m.id.startsWith('err-'))
        .map((m) => ({ role: m.role, content: m.content }));

      const abortController = new AbortController();
      abortRef.current = abortController;

      try {
        await chat(
          messages,
          {
            apiKey,
            model,
            baseUrl: provider.baseUrl,
            authType: provider.authType,
          },
          (token) => {
            store.appendToStreaming(token);
          },
          (full) => {
            store.updateMessageContent(convId, assistantId, full);
            store.clearStreaming();
          }
        );
      } catch (err: any) {
        if (err.name === 'AbortError') return;
        store.updateMessageContent(
          convId,
          assistantId,
          `Error: ${err.message || 'Failed to get response'}`
        );
        store.clearStreaming();
      }
    },
    [store, ensureConversation]
  );

  const stopGeneration = useCallback(() => {
    abortRef.current?.abort();
    const state = useClaudeChatStore.getState();
    if (state.streamingMessageId && state.activeConversationId) {
      state.updateMessageContent(
        state.activeConversationId,
        state.streamingMessageId,
        state.streamingContent
      );
    }
    state.clearStreaming();
  }, []);

  return { sendMessage, stopGeneration };
}
