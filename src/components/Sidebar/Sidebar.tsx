import React from 'react';
import SidebarLaunchLogo from '../../assets/sidebar-launch-logo.svg?react';
import Close from '../../assets/i-close.svg?react';
import IconButton from '../IconButton/IconButton';
import ChatHistoryList from '../ChatHistoryList/ChatHistoryList';

interface SidebarProps {
  setIsSideBarVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

const Sidebar: React.FC<SidebarProps> = ({ setIsSideBarVisible }) => {
  return (
    <div className="flex w-[272px] h-screen md:relative absolute md:z-0 z-10 py-2 px-2 border-r bg-chat-default dark:bg-chat-dark border-r-interactive-secondary flex-col items-start gap-0 shrink-0 self-stretch">
      <div className="space-y-3">
        <div className="flex items-center gap-20">
          <div className="text-base font-semibold font-impact">
            Chat History
          </div>
          <div className="p-2">
            <IconButton
              icon={<Close />}
              tooltip={{ content: 'Close', place: 'bottom' }}
              onClick={() => setIsSideBarVisible(false)}
            />
          </div>
        </div>
        <div className="flex-1">
          <ChatHistoryList />
        </div>
      </div>
      <div className="absolute bottom-0">
        <a
          target="_blank"
          href="https://launch.nttdata.com/"
          className="flex flex-col gap-1 py-2"
        >
          <p className="text-xs text-secondary-txt dark:text-default-txt-dark">
            powered by
          </p>
          <SidebarLaunchLogo className="fill-default-txt dark:fill-default-txt-dark" />
        </a>
      </div>
    </div>
  );
};

export default Sidebar;
