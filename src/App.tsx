import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { crmApi } from './services/api';
import type { Lead, Message, KpiData, Appointment, CRMSettings, ActivePageView, PipelineStage, ChannelPartner } from './types/crm';
import type { AssignLeadOptions } from './services/api';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './context/ToastContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LoginPage } from './components/LoginPage';
import { pageVariants } from './lib/motion';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { KpiStrip } from './components/KpiStrip';
import { LeadInbox } from './components/LeadInbox';
import { LeadDetailView } from './components/LeadDetailView';
import { AssignLeadModal } from './components/AssignLeadModal';
import { ConfirmVisitModal } from './components/ConfirmVisitModal';
import { AddNoteModal } from './components/AddNoteModal';
import { AddChannelPartnerModal } from './components/AddChannelPartnerModal';
import { AppointmentsView } from './components/AppointmentsView';
import { SettingsView } from './components/SettingsView';
import { AnalyticsView } from './components/AnalyticsView';
import { ChannelPartnersView } from './components/ChannelPartnersView';
import { ApplicatorsView } from './components/ApplicatorsView';
import { Skeleton } from './components/ui/Skeleton';

function AppContent() {
  const { isAuthenticated } = useAuth();
  const [activePage, setActivePage] = useState<ActivePageView>('desk');
  const [leads, setLeads] = useState<Lead[]>([]);
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [kpis, setKpis] = useState<KpiData | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [settings, setSettings] = useState<CRMSettings | null>(null);
  const [channelPartners, setChannelPartners] = useState<ChannelPartner[]>([]);
  const [activeFilter, setActiveFilter] = useState<string>('ALL');
  const [isLoadingInitial, setIsLoadingInitial] = useState(true);

  // Modal States
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [isConfirmVisitModalOpen, setIsConfirmVisitModalOpen] = useState(false);
  const [isAddNoteModalOpen, setIsAddNoteModalOpen] = useState(false);
  const [isAddChannelPartnerModalOpen, setIsAddChannelPartnerModalOpen] = useState(false);
  const [headerAssignTrigger, setHeaderAssignTrigger] = useState(0);

  // Define data fetcher before useEffect to guarantee clean lifecycle
  const loadData = async () => {
    try {
      const [fetchedLeads, fetchedKpis, fetchedApps, fetchedSettings, fetchedPartners] = await Promise.all([
        crmApi.getLeads(),
        crmApi.getKpis(),
        crmApi.getAppointments(),
        crmApi.getSettings(),
        crmApi.getChannelPartners(),
      ]);

      setLeads(fetchedLeads);
      setKpis(fetchedKpis);
      setAppointments(fetchedApps);
      setSettings(fetchedSettings);
      setChannelPartners(fetchedPartners);
    } catch (err) {
      console.error('Failed to load initial CRM data:', err);
    } finally {
      setIsLoadingInitial(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadData();
    }
  }, [isAuthenticated]);

  // Add Channel Partner Handler
  const handleAddChannelPartner = async (partnerData: Omit<ChannelPartner, 'id'> & { id?: string }) => {
    await crmApi.addChannelPartner(partnerData);
    const updatedPartners = await crmApi.getChannelPartners();
    setChannelPartners(updatedPartners);
  };

  // Remove Channel Partner Handler
  const handleRemoveChannelPartner = async (partnerId: string) => {
    await crmApi.deleteChannelPartner(partnerId);
    const updatedPartners = await crmApi.getChannelPartners();
    setChannelPartners(updatedPartners);
  };

  // Approve Inbound Partner Lead Handler
  const handleApprovePartnerLead = async (leadId: string) => {
    await crmApi.approveChannelPartnerLead(leadId);
    const updatedPartners = await crmApi.getChannelPartners();
    setChannelPartners(updatedPartners);
  };

  // Lead Selection Handler
  const handleSelectLead = async (leadId: string) => {
    setSelectedLeadId(leadId);
    setHeaderAssignTrigger(0);
    setIsAssignModalOpen(false);
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    const msgs = await crmApi.getMessages(leadId);
    setMessages(msgs);
  };

  // Back to Full Inbox
  const handleBackToInbox = () => {
    setSelectedLeadId(null);
    setHeaderAssignTrigger(0);
    setIsAssignModalOpen(false);
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  };

  // Send Message Handler
  const handleSendMessage = async (text: string) => {
    if (!selectedLeadId) return;
    await crmApi.sendMessage(selectedLeadId, text, 'human');
    const updatedMsgs = await crmApi.getMessages(selectedLeadId);
    setMessages(updatedMsgs);
    const updatedKpis = await crmApi.getKpis();
    setKpis(updatedKpis);
  };

  // AI Active / Human Takeover Toggle Handler
  const handleToggleAi = async (aiActive: boolean) => {
    if (!selectedLeadId) return;
    const updated = await crmApi.toggleAiStatus(selectedLeadId, aiActive);
    setLeads((prev) => prev.map((l) => (l.id === updated.id ? updated : l)));
    const updatedMsgs = await crmApi.getMessages(selectedLeadId);
    setMessages(updatedMsgs);
  };

  // Stage Progress Handler
  const handleSelectStage = async (stage: PipelineStage) => {
    if (!selectedLeadId) return;
    const updated = await crmApi.updateLeadStage(selectedLeadId, stage);
    setLeads((prev) => prev.map((l) => (l.id === updated.id ? updated : l)));
  };

  // Add Field Handler
  const handleAddField = async (leadId: string, key: string, value: string) => {
    const updated = await crmApi.addExtractedField(leadId, { key, value, confidence: 1.0, source_message: 'Manually verified by sales rep' });
    setLeads((prev) => prev.map((l) => (l.id === updated.id ? updated : l)));
  };

  // Assign Lead Handler
  const handleAssignLead = async (leadId: string, assignee: string, options?: AssignLeadOptions) => {
    const updated = await crmApi.assignLead(leadId, assignee, options);
    setLeads((prev) => prev.map((l) => (l.id === updated.id ? updated : l)));
    if (selectedLeadId === leadId) {
      const msgs = await crmApi.getMessages(leadId);
      setMessages(msgs);
    }
    const updatedKpis = await crmApi.getKpis();
    setKpis(updatedKpis);
  };

  // Bulk Assign Multiple Leads Handler
  const handleAssignMultipleLeads = async (leadIds: string[], assignee: string, options?: AssignLeadOptions) => {
    await crmApi.assignMultipleLeads(leadIds, assignee, options);
    const reloadedLeads = await crmApi.getLeads();
    setLeads(reloadedLeads);
    const reloadedKpis = await crmApi.getKpis();
    setKpis(reloadedKpis);
  };

  // Auto-Assign Multiple Leads by Territory Match Handler
  const handleAutoAssignByTerritory = async (leadIds: string[]) => {
    const res = await crmApi.autoAssignLeadsByTerritory(leadIds);
    const reloadedLeads = await crmApi.getLeads();
    setLeads(reloadedLeads);
    const reloadedKpis = await crmApi.getKpis();
    setKpis(reloadedKpis);
    return res;
  };

  // Confirm Visit Handler
  const handleConfirmVisit = async (appData: Omit<Appointment, 'id' | 'status'>) => {
    await crmApi.createAppointment({ ...appData, status: 'scheduled' });
    const fetchedApps = await crmApi.getAppointments();
    setAppointments(fetchedApps);
    const fetchedLeads = await crmApi.getLeads();
    setLeads(fetchedLeads);
  };

  // Add Internal Note Handler
  const handleAddNote = async (leadId: string, noteText: string) => {
    if (!selectedLeadId) return;
    await crmApi.sendMessage(selectedLeadId, `📝 Internal Note: ${noteText}`, 'system');
    const updatedMsgs = await crmApi.getMessages(selectedLeadId);
    setMessages(updatedMsgs);
  };

  const handleHeaderAssignClick = () => {
    if (selectedLead) {
      setIsAssignModalOpen(true);
    } else {
      setHeaderAssignTrigger((prev) => prev + 1);
    }
  };

  const selectedLead = leads.find((l) => l.id === selectedLeadId) || null;

  if (!isAuthenticated) {
    return (
      <AnimatePresence mode="wait">
        <motion.div
          key="login-view"
          variants={pageVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          className="w-full min-h-screen"
        >
          <LoginPage />
        </motion.div>
      </AnimatePresence>
    );
  }

  return (
    <div className="min-h-screen bg-canvas text-text-primary flex flex-col font-sans selection:bg-brand-navy selection:text-white relative overflow-x-hidden transition-colors duration-200">
      {/* Decorative ambient command-center glow mesh */}
      <div
        className="fixed inset-0 pointer-events-none -z-10 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(15,63,138,0.12),rgba(255,255,255,0))] dark:bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(15,63,138,0.22),rgba(12,22,33,0))]"
        aria-hidden="true"
      />

      {/* 1. TOP HEADER */}
      <Header
        activePage={activePage}
        setActivePage={(page) => {
          setActivePage(page);
          if (page !== 'desk') {
            setSelectedLeadId(null);
          }
        }}
        onAssignLeadClick={handleHeaderAssignClick}
      />

      {/* 2. MAIN PAGE CONTENT WITH PAGE TRANSITIONS */}
      <main className="flex-1">
        {isLoadingInitial ? (
          <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
            <Skeleton className="h-28 w-full rounded-2xl" />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Skeleton className="h-24 rounded-2xl" />
              <Skeleton className="h-24 rounded-2xl" />
              <Skeleton className="h-24 rounded-2xl" />
              <Skeleton className="h-24 rounded-2xl" />
            </div>
            <Skeleton className="h-96 w-full rounded-2xl" />
          </div>
        ) : (
          <AnimatePresence mode="wait">
            {activePage === 'desk' && (
              <motion.div
                key="desk"
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
              >
                {/* HERO SECTION (Only on Lead Inbox Overview) */}
                {!selectedLead && <HeroSection activePage={activePage} />}

                {/* KPI STRIP (Only on Lead Inbox Overview) */}
                {!selectedLead && kpis && (
                  <KpiStrip
                    kpis={kpis}
                    activeFilter={activeFilter}
                    onFilterChange={setActiveFilter}
                    onNavigateToTab={setActivePage}
                  />
                )}

                {/* PAGE WORKFLOW: FULL-WIDTH LEAD INBOX OR DETAILED LEAD VIEW */}
                {!selectedLead ? (
                  /* LEVEL 1: FULL WIDTH LEAD INBOX */
                  <LeadInbox
                    leads={leads}
                    selectedLeadId={selectedLeadId}
                    onSelectLead={handleSelectLead}
                    activeFilter={activeFilter}
                    setActiveFilter={setActiveFilter}
                    onOpenAddChannelPartner={() => setIsAddChannelPartnerModalOpen(true)}
                    channelPartners={channelPartners}
                    onAssignMultipleLeads={handleAssignMultipleLeads}
                    onAutoAssignByTerritory={handleAutoAssignByTerritory}
                    onAssignLead={handleAssignLead}
                    headerAssignTrigger={headerAssignTrigger}
                    availableProducts={settings?.products}
                    availableStates={settings?.states}
                    availableFlooringAreas={settings?.facility_sectors}
                  />
                ) : (
                  /* LEVEL 2: DETAILED LEAD VIEW (EXTRACTED DATA ON LEFT 50%, WHATSAPP ON RIGHT 50%) */
                  <LeadDetailView
                    lead={selectedLead}
                    messages={messages}
                    channelPartners={channelPartners}
                    onBackToInbox={handleBackToInbox}
                    onSendMessage={handleSendMessage}
                    onToggleAi={handleToggleAi}
                    onOpenConfirmVisit={() => setIsConfirmVisitModalOpen(true)}
                    onOpenAddNote={() => setIsAddNoteModalOpen(true)}
                    onOpenAssignModal={() => setIsAssignModalOpen(true)}
                    onAddField={handleAddField}
                    onSelectStage={handleSelectStage}
                  />
                )}
              </motion.div>
            )}

            {/* ANALYTICS PAGE */}
            {activePage === 'analytics' && (
              <motion.div
                key="analytics"
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
              >
                <AnalyticsView
                  leads={leads}
                  onSelectCampaignForDesk={(_campaign) => {
                    setActivePage('desk');
                    setSelectedLeadId(null);
                  }}
                  onNavigateToDesk={() => {
                    setActivePage('desk');
                    setSelectedLeadId(null);
                  }}
                />
              </motion.div>
            )}

            {/* APPOINTMENTS PAGE */}
            {activePage === 'appointments' && (
              <motion.div
                key="appointments"
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
              >
                <AppointmentsView
                  appointments={appointments}
                  onOpenConfirmVisit={() => setIsConfirmVisitModalOpen(true)}
                />
              </motion.div>
            )}

            {/* CHANNEL PARTNERS PAGE */}
            {activePage === 'channel_partners' && (
              <motion.div
                key="channel_partners"
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
              >
                <ChannelPartnersView
                  channelPartners={channelPartners}
                  leads={leads}
                  onOpenAddPartner={() => setIsAddChannelPartnerModalOpen(true)}
                  onRemovePartner={handleRemoveChannelPartner}
                  onApprovePartnerLead={handleApprovePartnerLead}
                  availableStates={settings?.states}
                  onNavigateToDesk={() => {
                    setActivePage('desk');
                    setSelectedLeadId(null);
                  }}
                />
              </motion.div>
            )}

            {/* APPLICATORS PAGE */}
            {activePage === 'applicators' && (
              <motion.div
                key="applicators"
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
              >
                <ApplicatorsView
                  onNavigateToDesk={() => {
                    setActivePage('desk');
                    setSelectedLeadId(null);
                  }}
                  availableStates={settings?.states}
                />
              </motion.div>
            )}

            {/* SETTINGS PAGE */}
            {activePage === 'settings' && settings && (
              <motion.div
                key="settings"
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
              >
                <SettingsView
                  settings={settings}
                  onSaveSettings={async (updated) => {
                    await crmApi.updateSettings(updated);
                    setSettings(updated);
                    const reloadedKpis = await crmApi.getKpis();
                    setKpis(reloadedKpis);
                  }}
                />
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </main>

      {/* FOOTER */}
      <footer className="bg-surface/80 backdrop-blur-md border-t border-border-subtle py-4 text-center text-xs text-text-tertiary mt-auto">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>ColourPlus Lead Desk &copy; 2026 ColourPlus Polyurethanes Pvt. Ltd. All rights reserved.</span>
          <span className="text-[11px] font-mono text-text-tertiary">
            B2B Industrial Flooring & Waterproofing AI Qualification System
          </span>
        </div>
      </footer>

      {/* MODALS */}
      <AssignLeadModal
        isOpen={isAssignModalOpen}
        onClose={() => setIsAssignModalOpen(false)}
        lead={selectedLead}
        onAssign={handleAssignLead}
        channelPartners={channelPartners}
        onOpenAddChannelPartner={() => setIsAddChannelPartnerModalOpen(true)}
      />

      <ConfirmVisitModal
        isOpen={isConfirmVisitModalOpen}
        onClose={() => setIsConfirmVisitModalOpen(false)}
        lead={selectedLead}
        onConfirmVisit={handleConfirmVisit}
      />

      <AddNoteModal
        isOpen={isAddNoteModalOpen}
        onClose={() => setIsAddNoteModalOpen(false)}
        lead={selectedLead}
        onAddNote={handleAddNote}
      />

      <AddChannelPartnerModal
        isOpen={isAddChannelPartnerModalOpen}
        onClose={() => setIsAddChannelPartnerModalOpen(false)}
        onAddPartner={handleAddChannelPartner}
        availableStates={settings?.states}
        existingPartners={channelPartners}
      />
    </div>
  );
}

export function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}

export default App;
