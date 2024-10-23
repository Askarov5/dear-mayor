/// <reference types="vite-plugin-svgr/client" />

import SidebarIcon from '../../assets/i-sidebar.svg?react';
import Dropdown from '../Dropdown/Dropdown';
import IconButton from '../IconButton/IconButton';
import NewChat from '../NewChat/NewChat';

interface HeaderProps {
  setIsSideBarVisible: React.Dispatch<React.SetStateAction<boolean>>;
  isSidebarVisible: boolean;
}

const Header: React.FC<HeaderProps> = ({
  setIsSideBarVisible,
  isSidebarVisible,
}) => {
  return (
    <header className="flex justify-between items-center min-w-full gap-3 md:gap-6 py-3 px-5 dark:fill-default-txt-dark dark:text-default-txt-dark">
      <div className="left flex justify-between items-center gap-2 md:gap-4">
        {!isSidebarVisible && (
          <IconButton
            icon={<SidebarIcon />}
            tooltip={{ content: 'Expand history', place: 'bottom-start' }}
            onClick={() => setIsSideBarVisible(!isSidebarVisible)}
          />
        )}
        <Dropdown />
      </div>
      <div className="right flex flex-end gap-2">
        <NewChat />
      </div>
    </header>
  );
};

export default Header;
