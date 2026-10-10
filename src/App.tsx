import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { ToastProvider } from './context/ToastContext';
import { OnboardingFlow } from './components/onboarding/OnboardingFlow';
import { DashboardLayout } from './components/layout/DashboardLayout';
import { HomeView } from './components/views/HomeView';
import { ProfileView } from './components/views/ProfileView';
import { ContentView } from './components/views/ContentView';
import { BookingsView } from './components/views/BookingsView';
import { AgendaView } from './components/views/AgendaView';
import { ClientsView } from './components/views/ClientsView';
import { ReviewsView } from './components/views/ReviewsView';
import { StatsView } from './components/views/StatsView';
import { TeamView } from './components/views/TeamView';
import { BoostView } from './components/views/BoostView';
import { BillingView } from './components/views/BillingView';
import { SettingsView } from './components/views/SettingsView';
import { ClientPreviewModal } from './components/common/ClientPreviewModal';

const AppContent: React.FC = () => {
  const { businessProfile, currentSection } = useApp();

  // If onboarding is not completed, show the smooth progressive onboarding flow
  if (!businessProfile.onboardingCompleted) {
    return <OnboardingFlow />;
  }

  // Active view router
  const renderCurrentView = () => {
    switch (currentSection) {
      case 'home':
        return <HomeView />;
      case 'profile':
        return <ProfileView />;
      case 'content':
        return <ContentView />;
      case 'bookings':
        return <BookingsView />;
      case 'agenda':
        return <AgendaView />;
      case 'clients':
        return <ClientsView />;
      case 'reviews':
        return <ReviewsView />;
      case 'stats':
        return <StatsView />;
      case 'team':
        return <TeamView />;
      case 'boost':
        return <BoostView />;
      case 'billing':
        return <BillingView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <HomeView />;
    }
  };

  return (
    <DashboardLayout>
      {renderCurrentView()}
      <ClientPreviewModal />
    </DashboardLayout>
  );
};

export default function App() {
  return (
    <ToastProvider>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </ToastProvider>
  );
}
