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

import type { CloudModelType } from '@/store/authStore';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
}

export interface Conversation {
  id: string;
  title: string;
  messages: ChatMessage[];
  model: CloudModelType | string;
  createdAt: number;
  updatedAt: number;
}

interface ClaudeChatState {
  conversations: Record<string, Conversation>;
  activeConversationId: string | null;
  streamingMessageId: string | null;
  streamingContent: string;
  isStreaming: boolean;

  createConversation: (model?: CloudModelType | string) => string;
  deleteConversation: (id: string) => void;
  setActiveConversation: (id: string) => void;
  addMessage: (conversationId: string, message: ChatMessage) => void;
  updateMessageContent: (
    conversationId: string,
    messageId: string,
    content: string
  ) => void;
  setStreaming: (messageId: string | null, content?: string) => void;
  appendToStreaming: (token: string) => void;
  clearStreaming: () => void;
  getActiveConversation: () => Conversation | null;
}

let idCounter = 0;
function generateId(): string {
  return `claude-${Date.now()}-${++idCounter}`;
}

export const useClaudeChatStore = create<ClaudeChatState>()(
  persist(
    (set, get) => ({
      conversations: {},
      activeConversationId: null,
      streamingMessageId: null,
      streamingContent: '',
      isStreaming: false,

      createConversation: (model = 'claude-sonnet-4-6') => {
        const id = generateId();
        const now = Date.now();
        const conv: Conversation = {
          id,
          title: 'New conversation',
          messages: [],
          model,
          createdAt: now,
          updatedAt: now,
        };
        set((state) => ({
          conversations: { ...state.conversations, [id]: conv },
          activeConversationId: id,
        }));
        return id;
      },

      deleteConversation: (id) => {
        set((state) => {
          const { [id]: _, ...rest } = state.conversations;
          return {
            conversations: rest,
            activeConversationId:
              state.activeConversationId === id
                ? null
                : state.activeConversationId,
          };
        });
      },

      setActiveConversation: (id) => set({ activeConversationId: id }),

      addMessage: (conversationId, message) => {
        set((state) => {
          const conv = state.conversations[conversationId];
          if (!conv) return state;
          const updated: Conversation = {
            ...conv,
            messages: [...conv.messages, message],
            updatedAt: Date.now(),
            title:
              conv.messages.length === 0 && message.role === 'user'
                ? message.content.slice(0, 60)
                : conv.title,
          };
          return {
            conversations: {
              ...state.conversations,
              [conversationId]: updated,
            },
          };
        });
      },

      updateMessageContent: (conversationId, messageId, content) => {
        set((state) => {
          const conv = state.conversations[conversationId];
          if (!conv) return state;
          return {
            conversations: {
              ...state.conversations,
              [conversationId]: {
                ...conv,
                messages: conv.messages.map((m) =>
                  m.id === messageId ? { ...m, content } : m
                ),
              },
            },
          };
        });
      },

      setStreaming: (messageId, content = '') =>
        set({
          streamingMessageId: messageId,
          streamingContent: content || '',
          isStreaming: messageId !== null,
        }),

      appendToStreaming: (token) =>
        set((state) => ({
          streamingContent: state.streamingContent + token,
        })),

      clearStreaming: () =>
        set({
          streamingMessageId: null,
          streamingContent: '',
          isStreaming: false,
        }),

      getActiveConversation: () => {
        const state = get();
        return state.activeConversationId
          ? state.conversations[state.activeConversationId] || null
          : null;
      },
    }),
    {
      name: 'eigent-claude-chat',
      partialize: (state) => ({
        conversations: state.conversations,
        activeConversationId: state.activeConversationId,
      }),
    }
  )
);
