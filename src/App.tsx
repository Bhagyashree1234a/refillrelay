import React, { useState } from 'react';
import { RefillProvider, useRefillContext } from './context/RefillContext';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { DashboardView } from './components/views/DashboardView';
import { RefillQueueView } from './components/views/RefillQueueView';
import { RefillDetailView } from './components/views/RefillDetailView';
import { MyTasksView } from './components/views/MyTasksView';
import { PatientsView } from './components/views/PatientsView';
import { PracticesView } from './components/views/PracticesView';
import { EscalationsView } from './components/views/EscalationsView';
import { AnalyticsView } from './components/views/AnalyticsView';
import { AuditLogView } from './components/views/AuditLogView';
import { SettingsView } from './components/views/SettingsView';
import { LandingPageView } from './components/views/LandingPageView';
import { LoginView } from './components/views/LoginView';
import { ProviderReviewModal } from './components/modals/ProviderReviewModal';
import { ReassignModal } from './components/modals/ReassignModal';
import { NewRefillModal } from './components/modals/NewRefillModal';
import { ToastContainer } from './components/common/ToastContainer';

const MainLayout: React.FC = () => {
  const { activeTab, setActiveTab, selectedRefillId } = useRefillContext();

  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [providerModalRefillId, setProviderModalRefillId] = useState<string | null>(null);
  const [reassignModalRefillId, setReassignModalRefillId] = useState<string | null>(null);
  const [isNewRefillModalOpen, setIsNewRefillModalOpen] = useState(false);

  if (!isLoggedIn) {
    return <LoginView onSuccess={() => setIsLoggedIn(true)} />;
  }

  // Render view component
  const renderCurrentView = () => {
    switch (activeTab) {
      case 'overview':
        return <DashboardView />;
      case 'queue':
        return <RefillQueueView />;
      case 'detail':
        return (
          <RefillDetailView
            onOpenProviderModal={(id) => setProviderModalRefillId(id)}
            onOpenReassignModal={(id) => setReassignModalRefillId(id)}
          />
        );
      case 'tasks':
        return (
          <MyTasksView
            onOpenReassignModal={(id) => setReassignModalRefillId(id)}
          />
        );
      case 'patients':
        return <PatientsView />;
      case 'practices':
        return <PracticesView />;
      case 'escalations':
        return <EscalationsView />;
      case 'analytics':
        return <AnalyticsView />;
      case 'audit':
        return <AuditLogView />;
      case 'settings':
        return <SettingsView />;
      case 'landing':
        return <LandingPageView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 text-slate-900 overflow-hidden">
      {/* Left Sidebar */}
      <Sidebar />

      {/* Main View Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Navbar */}
        <Navbar
          onOpenNewRefillModal={() => setIsNewRefillModalOpen(true)}
          onSignOut={() => setIsLoggedIn(false)}
        />

        {/* Scrollable View Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {renderCurrentView()}
        </main>
      </div>

      {/* Global Modals */}
      <ProviderReviewModal
        refillId={providerModalRefillId}
        isOpen={Boolean(providerModalRefillId)}
        onClose={() => setProviderModalRefillId(null)}
      />

      <ReassignModal
        refillId={reassignModalRefillId}
        isOpen={Boolean(reassignModalRefillId)}
        onClose={() => setReassignModalRefillId(null)}
      />

      <NewRefillModal
        isOpen={isNewRefillModalOpen}
        onClose={() => setIsNewRefillModalOpen(false)}
      />

      {/* Global Toast Container */}
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <RefillProvider>
      <MainLayout />
    </RefillProvider>
  );
}
