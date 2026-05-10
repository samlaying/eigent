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

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { PROVIDER_KEY } from '@/modes/claude/store/providerStore';
import { Sparkles } from 'lucide-react';
import { useState } from 'react';

interface ModelEntry {
  id: string;
  label: string;
  desc: string;
  provider: 'siliconflow' | 'mimo' | 'modelscope';
}

const MODELS: ModelEntry[] = [
  // SiliconFlow
  {
    id: 'deepseek-ai/DeepSeek-V3',
    label: 'DeepSeek V3',
    desc: 'Powerful general-purpose model',
    provider: 'siliconflow',
  },
  {
    id: 'deepseek-ai/DeepSeek-V3.2',
    label: 'DeepSeek V3.2',
    desc: 'Latest DeepSeek version',
    provider: 'siliconflow',
  },
  {
    id: 'deepseek-ai/DeepSeek-R1',
    label: 'DeepSeek R1',
    desc: 'Advanced reasoning model',
    provider: 'siliconflow',
  },
  {
    id: 'Pro/deepseek-ai/DeepSeek-V3.1-Terminus',
    label: 'DeepSeek V3.1 Terminus Pro',
    desc: 'Enterprise-grade reasoning',
    provider: 'siliconflow',
  },
  {
    id: 'Pro/deepseek-ai/DeepSeek-V3.2',
    label: 'DeepSeek V3.2 Pro',
    desc: 'Pro version with enhanced performance',
    provider: 'siliconflow',
  },
  {
    id: 'deepseek-ai/DeepSeek-V3.1-Terminus',
    label: 'DeepSeek V3.1 Terminus',
    desc: 'Specialized reasoning model',
    provider: 'siliconflow',
  },
  {
    id: 'deepseek-ai/DeepSeek-V2.5',
    label: 'DeepSeek V2.5',
    desc: 'Balanced speed and quality',
    provider: 'siliconflow',
  },
  {
    id: 'Pro/zai-org/GLM-4.7',
    label: 'GLM-4.7 Pro',
    desc: 'Most capable GLM model',
    provider: 'siliconflow',
  },
  {
    id: 'zai-org/GLM-4.7',
    label: 'GLM-4.7',
    desc: 'Latest GLM generation',
    provider: 'siliconflow',
  },
  {
    id: 'zai-org/GLM-4.6',
    label: 'GLM-4.6',
    desc: 'Strong all-around model',
    provider: 'siliconflow',
  },
  {
    id: 'THUDM/GLM-4-32B-0414',
    label: 'GLM-4-32B',
    desc: 'High-parameter GLM',
    provider: 'siliconflow',
  },
  {
    id: 'THUDM/GLM-Z1-32B-0414',
    label: 'GLM-Z1-32B',
    desc: 'Reasoning-focused GLM',
    provider: 'siliconflow',
  },
  {
    id: 'Qwen/Qwen3-235B-A22B',
    label: 'Qwen3 235B',
    desc: 'Largest Qwen model',
    provider: 'siliconflow',
  },
  {
    id: 'Qwen/Qwen3-32B',
    label: 'Qwen3 32B',
    desc: 'High-performance Qwen',
    provider: 'siliconflow',
  },
  {
    id: 'Qwen/Qwen3-14B',
    label: 'Qwen3 14B',
    desc: 'Efficient Qwen model',
    provider: 'siliconflow',
  },
  {
    id: 'Qwen/Qwen3-8B',
    label: 'Qwen3 8B',
    desc: 'Lightning-fast Qwen',
    provider: 'siliconflow',
  },
  {
    id: 'Qwen/QwQ-32B',
    label: 'QwQ-32B',
    desc: 'Strong reasoning capabilities',
    provider: 'siliconflow',
  },
  {
    id: 'moonshotai/Kimi-K2-Instruct-0905',
    label: 'Kimi K2',
    desc: 'Moonshot advanced model',
    provider: 'siliconflow',
  },
  {
    id: 'moonshotai/Kimi-K2-Thinking',
    label: 'Kimi K2 Thinking',
    desc: 'Kimi with reasoning mode',
    provider: 'siliconflow',
  },
  {
    id: 'moonshotai/Kimi-Dev-72B',
    label: 'Kimi Dev 72B',
    desc: 'Developer-optimized model',
    provider: 'siliconflow',
  },
  {
    id: 'tencent/Hunyuan-A13B-Instruct',
    label: 'Hunyuan A13B',
    desc: 'Tencent large model',
    provider: 'siliconflow',
  },
  {
    id: 'MiniMaxAI/MiniMax-M1-80k',
    label: 'MiniMax M1 80K',
    desc: 'Long context window',
    provider: 'siliconflow',
  },
  {
    id: 'MiniMaxAI/MiniMax-M2',
    label: 'MiniMax M2',
    desc: 'Latest MiniMax model',
    provider: 'siliconflow',
  },
  // Xiaomi MiMo
  {
    id: 'mimo-v2.5-pro',
    label: 'MiMo V2.5 Pro',
    desc: 'Flagship MiMo model',
    provider: 'mimo',
  },
  {
    id: 'mimo-v2.5',
    label: 'MiMo V2.5',
    desc: 'Balanced MiMo model',
    provider: 'mimo',
  },
  // ModelScope (free tier)
  {
    id: 'deepseek-ai/DeepSeek-V4-Pro',
    label: 'DeepSeek V4 Pro',
    desc: 'Most capable DeepSeek model (free)',
    provider: 'modelscope',
  },
  {
    id: 'deepseek-ai/DeepSeek-R1-0528',
    label: 'DeepSeek R1 0528',
    desc: 'Latest reasoning model (free)',
    provider: 'modelscope',
  },
  {
    id: 'Qwen/Qwen3-235B-A22B',
    label: 'Qwen3 235B',
    desc: 'Largest Qwen model (free)',
    provider: 'modelscope',
  },
  {
    id: 'Qwen/Qwen3-32B',
    label: 'Qwen3 32B',
    desc: 'High-performance Qwen (free)',
    provider: 'modelscope',
  },
  {
    id: 'Qwen/QwQ-32B',
    label: 'QwQ-32B',
    desc: 'Reasoning model (free)',
    provider: 'modelscope',
  },
];

const MODEL_KEY = 'eigent-active-model';

const grouped = MODELS.reduce(
  (acc, m) => {
    (acc[m.provider] ??= []).push(m);
    return acc;
  },
  {} as Record<string, ModelEntry[]>
);

export interface ModelSwitcherProps {
  value?: string;
  onChange?: (model: string) => void;
  compact?: boolean;
}

export default function ModelSwitcher({
  value,
  onChange,
  compact,
}: ModelSwitcherProps) {
  const [internalModel, setInternalModel] = useState(
    () => localStorage.getItem(MODEL_KEY) || MODELS[0].id
  );

  const currentModel = value || internalModel;

  const handleChange = (val: string) => {
    localStorage.setItem(MODEL_KEY, val);
    const model = MODELS.find((m) => m.id === val);
    if (model) {
      localStorage.setItem(PROVIDER_KEY, model.provider);
    }
    setInternalModel(val);
    onChange?.(val);
  };

  return (
    <div className={`flex items-center gap-2 ${compact ? '' : 'px-4 py-2'}`}>
      {!compact && (
        <Sparkles className="h-4 w-4 text-[#8F8F8F] dark:text-[#8A8A8A]" />
      )}
      <Select value={currentModel} onValueChange={handleChange}>
        <SelectTrigger
          className={`rounded-lg border-0 bg-transparent font-medium shadow-none hover:bg-[#F0F0F0] dark:hover:bg-[#3A3A3A] [&>svg]:h-3 [&>svg]:w-3 ${
            compact
              ? 'h-auto min-w-[80px] px-2 py-1.5 text-xs text-[#6B6B6B] dark:text-[#A8A8A8]'
              : 'h-7 min-w-[160px] px-2 text-xs text-[#6B6B6B] dark:text-[#A8A8A8]'
          }`}
        >
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="bg-white max-h-80 rounded-xl border border-[#E5E5E5] shadow-lg dark:border-[#3A3A3A] dark:bg-[#1F1F1F]">
          {Object.entries(grouped).map(([provider, models]) => (
            <SelectGroup key={provider}>
              <SelectLabel className="px-3 py-2 text-xs font-medium uppercase tracking-wide text-[#8F8F8F] dark:text-[#8A8A8A]">
                {provider === 'siliconflow'
                  ? 'SiliconFlow'
                  : provider === 'mimo'
                    ? 'Xiaomi MiMo'
                    : 'ModelScope (Free)'}
              </SelectLabel>
              {models.map((model) => (
                <SelectItem
                  key={model.id}
                  value={model.id}
                  className="flex-col items-start px-3 py-2 text-sm hover:bg-[#F0F0F0] dark:hover:bg-[#3A3A3A]"
                >
                  <div className="flex flex-col">
                    <span className="font-medium text-[#2F2F2F] dark:text-[#E8E8E8]">
                      {model.label}
                    </span>
                    <span className="text-xs text-[#8F8F8F] dark:text-[#8A8A8A]">
                      {model.desc}
                    </span>
                  </div>
                </SelectItem>
              ))}
            </SelectGroup>
          ))}
        </SelectContent>
      </Select>
      {currentModel && !compact && (
        <span className="hidden text-xs text-[#8F8F8F] dark:text-[#8A8A8A] sm:inline">
          {MODELS.find((m) => m.id === currentModel)?.desc}
        </span>
      )}
    </div>
  );
}

export { MODELS };
