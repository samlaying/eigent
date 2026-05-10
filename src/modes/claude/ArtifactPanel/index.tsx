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
import { PanelRightClose } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function ArtifactPanel() {
  const { t } = useTranslation();
  const { toggleArtifact } = useNavigationStore();

  return (
    <div className="flex h-full flex-col bg-surface-primary">
      <div className="flex items-center justify-between px-3 py-2.5">
        <span className="text-label-md font-semibold text-text-heading">
          {t('artifacts.title', 'Artifacts')}
        </span>
        <button
          onClick={toggleArtifact}
          className="flex h-6 w-6 items-center justify-center rounded-md transition-colors hover:bg-surface-hover-subtle"
        >
          <PanelRightClose className="h-4 w-4" />
        </button>
      </div>

      <div className="flex flex-1 items-center justify-center px-4">
        <p className="text-center text-body-sm text-text-tertiary">
          {t(
            'artifacts.empty',
            'Code, HTML, and other artifacts will appear here'
          )}
        </p>
      </div>
    </div>
  );
}
