import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { CleanroomsPage } from './pages/CleanroomsPage';
import { CleanroomDetailsPage } from './pages/CleanroomDetailsPage';
import { MonitoringPage } from './pages/MonitoringPage';
import { ProfilesPage } from './pages/ProfilesPage';
import { SensorsPage } from './pages/SensorsPage';
import { EventsPage } from './pages/EventsPage';
import { CorrectiveActionsPage } from './pages/CorrectiveActionsPage';
import { DiagnosesPage } from './pages/DiagnosesPage';

import { NewCorrectiveActionModal } from './components/modals/NewCorrectiveActionModal';
import { NewDiagnosisModal } from './components/modals/NewDiagnosisModal';
import { EditProfileModal } from './components/modals/EditProfileModal';
import { SimulationModal } from './components/modals/SimulationModal';
import { EnvironmentalProfile } from './types';

const MainLayout: React.FC = () => {
  const { isAuthenticated, currentPage, profiles } = useApp();

  // Modal states
  const [isCorrectiveModalOpen, setIsCorrectiveModalOpen] = useState(false);
  const [correctiveModalEventId, setCorrectiveModalEventId] = useState<string | undefined>();

  const [isDiagnosisModalOpen, setIsDiagnosisModalOpen] = useState(false);
  const [diagnosisModalEventId, setDiagnosisModalEventId] = useState<string | undefined>();

  const [isEditProfileModalOpen, setIsEditProfileModalOpen] = useState(false);
  const [profileToEdit, setProfileToEdit] = useState<EnvironmentalProfile>(profiles[0]);

  const [isSimulationModalOpen, setIsSimulationModalOpen] = useState(false);

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  const handleOpenCorrectiveAction = (eventId?: string) => {
    setCorrectiveModalEventId(eventId);
    setIsCorrectiveModalOpen(true);
  };

  const handleOpenDiagnosis = (eventId?: string) => {
    setDiagnosisModalEventId(eventId);
    setIsDiagnosisModalOpen(true);
  };

  const handleEditProfile = (profile: EnvironmentalProfile) => {
    setProfileToEdit(profile);
    setIsEditProfileModalOpen(true);
  };

  return (
    <div className="flex h-screen bg-slate-100 text-slate-900 font-sans overflow-hidden">
      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <Header onOpenSimulationModal={() => setIsSimulationModalOpen(true)} />

        {/* Page Body */}
        <main className="flex-1 overflow-y-auto p-6 scrollbar-thin">
          <div className="max-w-7xl mx-auto pb-12">
            {currentPage === 'dashboard' && (
              <DashboardPage
                onOpenCorrectiveActionModal={handleOpenCorrectiveAction}
                onOpenDiagnosisModal={handleOpenDiagnosis}
              />
            )}
            {currentPage === 'cleanrooms' && <CleanroomsPage />}
            {currentPage === 'cleanroom-details' && (
              <CleanroomDetailsPage
                onOpenCorrectiveActionModal={handleOpenCorrectiveAction}
                onOpenDiagnosisModal={handleOpenDiagnosis}
              />
            )}
            {currentPage === 'monitoring' && <MonitoringPage />}
            {currentPage === 'profiles' && (
              <ProfilesPage onEditProfile={handleEditProfile} />
            )}
            {currentPage === 'sensors' && <SensorsPage />}
            {currentPage === 'events' && (
              <EventsPage
                onOpenCorrectiveActionModal={handleOpenCorrectiveAction}
                onOpenDiagnosisModal={handleOpenDiagnosis}
              />
            )}
            {currentPage === 'corrective-actions' && (
              <CorrectiveActionsPage
                onOpenNewActionModal={() => handleOpenCorrectiveAction()}
              />
            )}
            {currentPage === 'diagnoses' && (
              <DiagnosesPage
                onOpenNewDiagnosisModal={() => handleOpenDiagnosis()}
              />
            )}
          </div>
        </main>
      </div>

      {/* Modals */}
      <NewCorrectiveActionModal
        isOpen={isCorrectiveModalOpen}
        onClose={() => setIsCorrectiveModalOpen(false)}
        preselectedEventId={correctiveModalEventId}
      />

      <NewDiagnosisModal
        isOpen={isDiagnosisModalOpen}
        onClose={() => setIsDiagnosisModalOpen(false)}
        preselectedEventId={diagnosisModalEventId}
      />

      {profileToEdit && (
        <EditProfileModal
          isOpen={isEditProfileModalOpen}
          onClose={() => setIsEditProfileModalOpen(false)}
          profile={profileToEdit}
        />
      )}

      <SimulationModal
        isOpen={isSimulationModalOpen}
        onClose={() => setIsSimulationModalOpen(false)}
      />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
