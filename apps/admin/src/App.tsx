import React, { useState } from 'react';
import { AppDataProvider, useAppData } from './context/AppDataContext';
import { Header } from './components/layout/Header';
import { Sidebar, AdminTab } from './components/layout/Sidebar';
import { DashboardPage } from './pages/DashboardPage';
import { SchedulePage } from './pages/SchedulePage';
import { NotificationsPage } from './pages/NotificationsPage';
import { StudentsPage } from './pages/StudentsPage';
import { MaterialsPage } from './pages/MaterialsPage';
import { SubmissionsPage } from './pages/SubmissionsPage';
import { AttendancePage } from './pages/AttendancePage';
import { AddScheduleModal } from './components/schedule/AddScheduleModal';
import { SendBroadcastModal } from './components/notifications/SendBroadcastModal';
import { AddStudentModal } from './components/students/AddStudentModal';
import { AddMaterialModal } from './components/materials/AddMaterialModal';

const AdminLayout: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<AdminTab>('dashboard');
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);
  const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);
  const [isMaterialModalOpen, setIsMaterialModalOpen] = useState(false);

  const { submissions, notifications } = useAppData();
  const pendingReviewsCount = submissions.filter((s) => s.status === 'pending').length;

  return (
    <div className="min-h-screen bg-cream text-ink flex flex-col font-sans">
      {/* Top Bar */}
      <Header
        onOpenScheduleModal={() => setIsScheduleModalOpen(true)}
        onOpenNotificationModal={() => setIsNotificationModalOpen(true)}
        unreadNotifsCount={notifications.length}
      />

      <div className="flex-1 flex flex-col md:flex-row">
        {/* Left Navigation Sidebar */}
        <Sidebar
          currentTab={currentTab}
          onSelectTab={setCurrentTab}
          pendingReviewsCount={pendingReviewsCount}
        />

        {/* Dynamic Main Workspace */}
        <main className="flex-1 min-w-0 pb-12">
          {currentTab === 'dashboard' && (
            <DashboardPage
              onNavigate={setCurrentTab}
              onOpenScheduleModal={() => setIsScheduleModalOpen(true)}
              onOpenNotificationModal={() => setIsNotificationModalOpen(true)}
              onOpenStudentModal={() => setIsStudentModalOpen(true)}
              onOpenMaterialModal={() => setIsMaterialModalOpen(true)}
            />
          )}

          {currentTab === 'schedule' && (
            <SchedulePage onOpenScheduleModal={() => setIsScheduleModalOpen(true)} />
          )}

          {currentTab === 'notifications' && (
            <NotificationsPage
              onOpenNotificationModal={() => setIsNotificationModalOpen(true)}
            />
          )}

          {currentTab === 'students' && (
            <StudentsPage onOpenStudentModal={() => setIsStudentModalOpen(true)} />
          )}

          {currentTab === 'materials' && (
            <MaterialsPage onOpenMaterialModal={() => setIsMaterialModalOpen(true)} />
          )}

          {currentTab === 'submissions' && <SubmissionsPage />}

          {currentTab === 'attendance' && <AttendancePage />}
        </main>
      </div>

      {/* Global Modals */}
      <AddScheduleModal
        isOpen={isScheduleModalOpen}
        onClose={() => setIsScheduleModalOpen(false)}
      />

      <SendBroadcastModal
        isOpen={isNotificationModalOpen}
        onClose={() => setIsNotificationModalOpen(false)}
      />

      <AddStudentModal
        isOpen={isStudentModalOpen}
        onClose={() => setIsStudentModalOpen(false)}
      />

      <AddMaterialModal
        isOpen={isMaterialModalOpen}
        onClose={() => setIsMaterialModalOpen(false)}
      />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <AppDataProvider>
      <AdminLayout />
    </AppDataProvider>
  );
};

export default App;

