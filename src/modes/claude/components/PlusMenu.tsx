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

import useChatStoreAdapter from '@/hooks/useChatStoreAdapter';
import { usePageTabStore } from '@/store/pageTabStore';
import {
  Code,
  FileImage,
  Globe,
  Monitor,
  Palette,
  Puzzle,
  Users,
} from 'lucide-react';
import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

interface PlusMenuProps {
  className?: string;
}

interface MenuItem {
  id: string;
  icon: React.ReactNode;
  label: string;
  desc: string;
  action: () => void;
}

export default function PlusMenu({ className = '' }: PlusMenuProps) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { chatStore, projectStore } = useChatStoreAdapter();
  const { setActiveWorkspaceTab } = usePageTabStore();

  const handleAddFiles = () => {
    fileInputRef.current?.click();
    setOpen(false);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const activeProjectId = projectStore.activeProjectId;
    if (!activeProjectId || !chatStore.activeTaskId) return;
    for (const file of Array.from(files)) {
      try {
        const reader = new FileReader();
        reader.onload = async () => {
          if (reader.result && window.ipcRenderer) {
            await window.ipcRenderer.invoke('save-file-to-agent-folder', {
              projectId: activeProjectId,
              fileName: file.name,
              content: reader.result,
            });
          }
        };
        reader.readAsArrayBuffer(file);
      } catch (error) {
        console.error('Error uploading file:', error);
      }
    }
    toast.success(t('chat.files-added', 'Files added'));
    e.target.value = '';
  };

  const handleScreenshot = async () => {
    setOpen(false);
    try {
      if (window.electronAPI?.captureScreen) {
        await window.electronAPI.captureScreen();
        toast.success(t('chat.screenshot-taken', 'Screenshot taken'));
      } else {
        toast.info(
          t(
            'chat.screenshot-unavailable',
            'Screenshot not available in browser mode'
          )
        );
      }
    } catch {
      toast.error(t('chat.screenshot-failed', 'Failed to take screenshot'));
    }
  };

  const handleAddToProject = () => {
    setOpen(false);
    setActiveWorkspaceTab('inbox');
    toast.info(
      t('chat.add-to-project-hint', 'Open the project folder to manage files')
    );
  };

  const handleSkills = () => {
    setOpen(false);
    toast.info(t('chat.skills-coming', 'Skills management coming soon'));
  };

  const handleConnectors = () => {
    setOpen(false);
    toast.info(
      t('chat.connectors-coming', 'Connectors management coming soon')
    );
  };

  const handleWebSearch = () => {
    setOpen(false);
    toast.info(
      t('chat.web-search-coming', 'Web search configuration coming soon')
    );
  };

  const handleStyle = () => {
    setOpen(false);
    toast.info(t('chat.style-coming', 'Style customization coming soon'));
  };

  const menuItems: MenuItem[] = [
    {
      id: 'files',
      icon: <FileImage className="h-4 w-4" />,
      label: t('plus-menu.add-files', 'Add files or photos'),
      desc: t('plus-menu.add-files-desc', 'Upload documents or images'),
      action: handleAddFiles,
    },
    {
      id: 'screenshot',
      icon: <Monitor className="h-4 w-4" />,
      label: t('plus-menu.take-screenshot', 'Take a screenshot'),
      desc: t(
        'plus-menu.take-screenshot-desc',
        'Capture what is on your screen'
      ),
      action: handleScreenshot,
    },
    {
      id: 'project',
      icon: <Users className="h-4 w-4" />,
      label: t('plus-menu.add-to-project', 'Add to project'),
      desc: t(
        'plus-menu.add-to-project-desc',
        'Organize related conversations'
      ),
      action: handleAddToProject,
    },
    {
      id: 'skills',
      icon: <Code className="h-4 w-4" />,
      label: t('plus-menu.skills', 'Skills'),
      desc: t('plus-menu.skills-desc', 'Training manual for AI workers'),
      action: handleSkills,
    },
    {
      id: 'connectors',
      icon: <Puzzle className="h-4 w-4" />,
      label: t('plus-menu.connectors', 'Add connectors'),
      desc: t(
        'plus-menu.connectors-desc',
        'Connect email, cloud storage, and more'
      ),
      action: handleConnectors,
    },
    {
      id: 'websearch',
      icon: <Globe className="h-4 w-4" />,
      label: t('plus-menu.web-search', 'Web search'),
      desc: t('plus-menu.web-search-desc', 'Search the web for information'),
      action: handleWebSearch,
    },
    {
      id: 'style',
      icon: <Palette className="h-4 w-4" />,
      label: t('plus-menu.use-style', 'Use style'),
      desc: t('plus-menu.use-style-desc', 'Customize how AI responds'),
      action: handleStyle,
    },
  ];

  return (
    <div className={className}>
      <div className="relative">
        <button
          onClick={() => setOpen(!open)}
          className="rounded-lg p-2 text-[#8F8F8F] transition-colors hover:bg-[#F0F0F0] hover:text-[#2F2F2F] dark:text-[#8A8A8A] dark:hover:bg-[#3A3A3A] dark:hover:text-[#E8E8E8]"
          title={t('plus-menu.title', 'More options')}
        >
          <svg width="20" height="20" viewBox="0 0 16 16" fill="none">
            <path
              d="M8 3V13M3 8H13"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </button>

        {open && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setOpen(false)}
            />
            <div className="bg-white absolute bottom-full left-0 z-50 mb-2 w-64 overflow-hidden rounded-xl border border-[#E5E5E5] shadow-lg dark:border-[#3A3A3A] dark:bg-[#1F1F1F]">
              <div className="max-h-[360px] overflow-y-auto py-1">
                {/* eslint-disable-next-line react-hooks/refs */}
                {menuItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={item.action}
                    className="flex w-full items-start gap-3 px-3 py-2.5 text-left transition-colors hover:bg-[#F0F0F0] dark:hover:bg-[#3A3A3A]"
                  >
                    <span className="mt-0.5 flex h-6 w-6 items-center justify-center rounded-md bg-[#F5F5F5] text-[#6B6B6B] dark:bg-[#333333] dark:text-[#A8A8A8]">
                      {item.icon}
                    </span>
                    <div className="flex-1">
                      <div className="text-sm font-medium text-[#2F2F2F] dark:text-[#E8E8E8]">
                        {item.label}
                      </div>
                      <div className="text-xs text-[#8F8F8F] dark:text-[#8A8A8A]">
                        {item.desc}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </>
        )}

        <input
          ref={fileInputRef}
          type="file"
          multiple
          className="hidden"
          onChange={handleFileChange}
        />
      </div>
    </div>
  );
}
