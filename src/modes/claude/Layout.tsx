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

import animationData from '@/assets/animation/onboarding_success.json';
import { AnimationJson } from '@/components/AnimationJson';
import CloseNoticeDialog from '@/components/Dialog/CloseNotice';
import HistorySidebar from '@/components/HistorySidebar';
import InstallationErrorDialog from '@/components/InstallStep/InstallationErrorDialog/InstallationErrorDialog';
import { InstallDependencies } from '@/components/InstallStep/InstallDependencies';
import useChatStoreAdapter from '@/hooks/useChatStoreAdapter';
import { useInstallationSetup } from '@/hooks/useInstallationSetup';
import { useAuthStore } from '@/store/authStore';
import { useInstallationUI } from '@/store/installationStore';
import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import NavBar from './NavBar';
import ClaudeTopBar from './TopBar';

const ClaudeLayout = () => {
  const {
    initState,
    isFirstLaunch,
    setIsFirstLaunch,
    setInitState: _setInitState,
  } = useAuthStore();
  const [noticeOpen, setNoticeOpen] = useState(false);

  const { chatStore } = useChatStoreAdapter();

  const {
    installationState,
    latestLog,
    error,
    backendError,
    isInstalling,
    isBackendReady,
    shouldShowInstallScreen,
    retryInstallation,
    retryBackend,
  } = useInstallationUI();

  useInstallationSetup();

  useEffect(() => {
    if (!chatStore) return;
    const handleBeforeClose = () => {
      const currentStatus =
        chatStore.tasks[chatStore.activeTaskId as string]?.status;
      if (['running', 'pause'].includes(currentStatus)) {
        setNoticeOpen(true);
      } else {
        window.electronAPI.closeWindow(true);
      }
    };

    window.ipcRenderer.on('before-close', handleBeforeClose);

    return () => {
      window.ipcRenderer.removeAllListeners('before-close');
    };
  }, [chatStore]);

  const shouldShowOnboarding =
    initState === 'done' && isFirstLaunch && !isInstalling;

  const actualShouldShowInstallScreen =
    shouldShowInstallScreen || initState !== 'done' || !isBackendReady;
  const shouldShowMainContent = !actualShouldShowInstallScreen;

  if (!chatStore) {
    console.log(chatStore);
    return <div>Loading...</div>;
  }

  return (
    <div className="relative flex h-full flex-col overflow-hidden">
      <ClaudeTopBar />
      <div className="relative h-full min-h-0 flex-1 overflow-hidden">
        {shouldShowOnboarding && (
          <AnimationJson
            onComplete={() => setIsFirstLaunch(false)}
            animationData={animationData}
          />
        )}

        {actualShouldShowInstallScreen && <InstallDependencies />}

        {shouldShowMainContent && (
          <div className="flex h-full flex-row">
            <NavBar />
            <div className="relative flex-1 overflow-hidden">
              <Outlet />
              <HistorySidebar />
            </div>
          </div>
        )}

        {(backendError || (error && installationState === 'error')) && (
          <InstallationErrorDialog
            error={error || ''}
            backendError={backendError}
            installationState={installationState}
            latestLog={latestLog}
            retryInstallation={retryInstallation}
            retryBackend={retryBackend}
          />
        )}

        <CloseNoticeDialog onOpenChange={setNoticeOpen} open={noticeOpen} />
      </div>
    </div>
  );
};

export default ClaudeLayout;
