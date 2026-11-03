import React, { useState } from 'react';
import { StudentProvider, useStudentData } from './context/StudentContext';
import { MobileContainer } from './components/layout/MobileContainer';
import { TopBar } from './components/layout/TopBar';
import { BottomNav, MobileTab } from './components/layout/BottomNav';
import { HomeScreen } from './screens/HomeScreen';
import { ClassesScreen } from './screens/ClassesScreen';
import { RiyaazScreen } from './screens/RiyaazScreen';
import { LibraryScreen } from './screens/LibraryScreen';
import { ProfileScreen } from './screens/ProfileScreen';
import { NotificationsScreen } from './screens/NotificationsScreen';

const StudentAppLayout: React.FC = () => {
  const [activeTab, setActiveTab] = useState<MobileTab>('home');
  const [isNotifScreenOpen, setIsNotifScreenOpen] = useState(false);

  const { notifications, readNotifs } = useStudentData();
  const unreadCount = notifications.filter((n) => !readNotifs.has(n.id)).length;

  return (
    <MobileContainer>
      {/* Top Mobile Bar */}
      <TopBar
        onOpenNotifications={() => setIsNotifScreenOpen(true)}
        unreadCount={unreadCount}
      />

      {/* Screen Router */}
      <main className="flex-1 p-4 overflow-y-auto">
        {isNotifScreenOpen ? (
          <NotificationsScreen onBack={() => setIsNotifScreenOpen(false)} />
        ) : (
          <>
            {activeTab === 'home' && (
              <HomeScreen
                onNavigateTab={setActiveTab}
                onOpenNotifications={() => setIsNotifScreenOpen(true)}
              />
            )}
            {activeTab === 'classes' && <ClassesScreen />}
            {activeTab === 'riyaaz' && <RiyaazScreen />}
            {activeTab === 'library' && <LibraryScreen />}
            {activeTab === 'profile' && <ProfileScreen />}
          </>
        )}
      </main>

      {/* Bottom Mobile Tab Bar */}
      {!isNotifScreenOpen && (
        <BottomNav activeTab={activeTab} onSelectTab={setActiveTab} />
      )}
    </MobileContainer>
  );
};

export const App: React.FC = () => {
  return (
    <StudentProvider>
      <StudentAppLayout />
    </StudentProvider>
  );
};

export default App;

