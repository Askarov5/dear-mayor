import { useState } from 'react';
import Header from './components/Header/Header';
import Sidebar from './components/Sidebar/Sidebar';
import Conversation from './components/Conversation/Conversation';
import { ConversationProvider } from './contexts/ConversationContext';
import { UserProvider } from './contexts/UserContext';

function App() {
  const [isSidebarVisible, setSidebarVisible] = useState(false);
  return (
    <UserProvider>
      <ConversationProvider>
        <div
          className={`flex relative w-screen h-screen bg-chat-white dark:bg-chat-dark dark:text-default-txt-dark transition-all duration-1000 ${
            isSidebarVisible ? 'px-2' : 'px-5'
          }`}
        >
          {isSidebarVisible && (
            <Sidebar setIsSideBarVisible={setSidebarVisible} />
          )}
          <div className="flex flex-col items-center flex-1 font-default dark:bg-chat-dark dark:text-default-txt-dark">
            <Header
              setIsSideBarVisible={setSidebarVisible}
              isSidebarVisible={isSidebarVisible}
            />
            <Conversation />
          </div>
        </div>
      </ConversationProvider>
    </UserProvider>
  );
}

export default App;
