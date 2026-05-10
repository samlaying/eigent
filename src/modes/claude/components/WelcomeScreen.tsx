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

import { ArrowUp } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import ModelSwitcher from './ModelSwitcher';

interface WelcomeScreenProps {
  onSendMessage?: (message: string) => void;
}

const suggestions = [
  {
    label: 'Create a project plan',
    message: 'Help me create a project plan for building a web application',
  },
  {
    label: 'Analyze this data',
    message: 'Help me analyze a CSV file and find insights',
  },
  {
    label: 'Write a script',
    message: 'Write a Python script to automate file organization',
  },
  {
    label: 'Draft an email',
    message: 'Draft a professional email about project updates',
  },
];

export default function WelcomeScreen({ onSendMessage }: WelcomeScreenProps) {
  const { t } = useTranslation();
  const [inputValue, setInputValue] = useState('');
  const [isComposing, setIsComposing] = useState(false);

  const handleSend = () => {
    if (inputValue.trim() && onSendMessage) {
      onSendMessage(inputValue.trim());
      setInputValue('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey && !isComposing) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="bg-white flex h-full flex-col items-center justify-center px-6 dark:bg-[#1F1F1F]">
      <div className="mx-auto flex w-full max-w-3xl flex-col items-center gap-8">
        <h2
          className="text-3xl font-light text-[#2F2F2F] dark:text-[#E8E8E8] md:text-4xl"
          style={{ fontFamily: "'Georgia', 'Tiempos Text', serif" }}
        >
          <span className="mr-2 text-[#d97757] dark:text-[#e89b7d]">🌸</span>
          {t('welcome.claude-title', 'How can I help you today?')}
        </h2>

        <div className="flex w-full flex-col gap-3">
          <div className="grid grid-cols-2 gap-2">
            {suggestions.map((s) => (
              <button
                key={s.label}
                onClick={() => onSendMessage?.(s.message)}
                className="rounded-xl border border-[#E5E5E5] bg-[#FAFAFA] px-4 py-3 text-left text-sm text-[#2F2F2F] transition-colors hover:border-[#8F8F8F] hover:bg-[#F0F0F0] dark:border-[#3A3A3A] dark:bg-[#2A2A2A] dark:text-[#E8E8E8] dark:hover:border-[#8A8A8A] dark:hover:bg-[#3A3A3A]"
              >
                {s.label}
              </button>
            ))}
          </div>

          <div className="relative mt-2 w-full max-w-3xl px-4 md:px-6">
            <div className="rounded-2xl border border-[#E5E5E5] bg-[#FAFAFA] p-3 transition-colors focus-within:border-[#8F8F8F] dark:border-[#3A3A3A] dark:bg-[#2A2A2A] dark:focus-within:border-[#8A8A8A] md:p-4">
              <textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                onCompositionStart={() => setIsComposing(true)}
                onCompositionEnd={() => setIsComposing(false)}
                placeholder={t(
                  'chat.ask-placeholder',
                  'How can I help you today?'
                )}
                className="max-h-[200px] min-h-[40px] w-full resize-none border-none bg-transparent text-base leading-relaxed text-[#2F2F2F] outline-none placeholder:text-[#8F8F8F] dark:text-[#E8E8E8] dark:placeholder:text-[#8A8A8A]"
                rows={1}
                onInput={(e) => {
                  const el = e.currentTarget;
                  el.style.height = 'auto';
                  el.style.height = `${Math.min(el.scrollHeight, 200)}px`;
                }}
              />
              <div className="mt-3 flex items-center justify-between">
                <div />
                <div className="flex items-center gap-2">
                  <ModelSwitcher compact />
                  <button
                    className="text-white flex h-8 w-8 items-center justify-center rounded-full bg-[#d97757] transition-colors hover:bg-[#c16540] disabled:cursor-not-allowed disabled:opacity-40"
                    onClick={handleSend}
                    disabled={!inputValue.trim()}
                  >
                    <ArrowUp size={18} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
