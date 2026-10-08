import React, { useState, useEffect } from 'react';
import { crmApi } from './services/api';
import type { Lead, Message, KpiData, Appointment, Followup, CRMSettings, ActivePageView, PipelineStage } from './types/crm';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { KpiStrip } from './components/KpiStrip';
import { LeadInbox } from './components/LeadInbox';
import { LeadDetailView } from './components/LeadDetailView';
import { AssignLeadModal } from './components/AssignLeadModal';
import { ConfirmVisitModal } from './components/ConfirmVisitModal';
import { AddNoteModal } from './components/AddNoteModal';
import { AppointmentsView } from './components/AppointmentsView';
import { FollowupsView } from './components/FollowupsView';
import { WhatsAppSimulatorView } from './components/WhatsAppSimulatorView';
import { SettingsView } from './components/SettingsView';

export function App() {
  const [activePage, setActivePage] = useState<ActivePageView>('desk');
  const [leads, setLeads] = useState<Lead[]>([]);
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [kpis, setKpis] = useState<KpiData | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [followups, setFollowups] = useState<Followup[]>([]);
  const [settings, setSettings] = useState<CRMSettings | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>('ALL');

  // Modal States
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [isConfirmVisitModalOpen, setIsConfirmVisitModalOpen] = useState(false);
  const [isAddNoteModalOpen, setIsAddNoteModalOpen] = useState(false);

  // Initial Data Fetching
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const fetchedLeads = await crmApi.getLeads();
    setLeads(fetchedLeads);

    const fetchedKpis = await crmApi.getKpis();
    setKpis(fetchedKpis);

    const fetchedApps = await crmApi.getAppointments();
    setAppointments(fetchedApps);

    const fetchedFols = await crmApi.getFollowups();
    setFollowups(fetchedFols);

    const fetchedSettings = await crmApi.getSettings();
    setSettings(fetchedSettings);
  };

  // Lead Selection Handler
  const handleSelectLead = async (leadId: string) => {
    setSelectedLeadId(leadId);
    const msgs = await crmApi.getMessages(leadId);
    setMessages(msgs);
  };

  // Back to Full Inbox
  const handleBackToInbox = () => {
    setSelectedLeadId(null);
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
  const handleAssignLead = async (leadId: string, assignee: string) => {
    const updated = await crmApi.assignLead(leadId, assignee);
    setLeads((prev) => prev.map((l) => (l.id === updated.id ? updated : l)));
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

  // Simulator Interaction Handler
  const handleSimulateWhatsAppMessage = async (leadId: string, text: string) => {
    const { lead: updatedLead, messages: updatedMsgs } = await crmApi.simulateWhatsAppInteraction(leadId, text);
    setLeads((prev) => prev.map((l) => (l.id === updatedLead.id ? updatedLead : l)));
    if (selectedLeadId === leadId) {
      setMessages(updatedMsgs);
    }
    const updatedKpis = await crmApi.getKpis();
    setKpis(updatedKpis);
  };

  const selectedLead = leads.find((l) => l.id === selectedLeadId) || null;

  return (
    <div className="min-h-screen bg-brand-body text-brand-text flex flex-col font-sans selection:bg-[#0f3f8a] selection:text-white">
      {/* 1. TOP HEADER */}
      <Header
        activePage={activePage}
        setActivePage={setActivePage}
        onAssignLeadClick={() => setIsAssignModalOpen(true)}
      />

      {/* 2. MAIN PAGE CONTENT */}
      <main className="flex-1">
        {activePage === 'desk' && (
          <div>
            {/* HERO SECTION */}
            <HeroSection
              activePage={activePage}
              onOpenSimulator={() => setActivePage('simulator')}
            />

            {/* KPI STRIP */}
            {kpis && <KpiStrip kpis={kpis} />}

            {/* PAGE WORKFLOW: FULL-WIDTH LEAD INBOX OR DETAILED LEAD VIEW */}
            {!selectedLead ? (
              /* LEVEL 1: FULL WIDTH LEAD INBOX */
              <LeadInbox
                leads={leads}
                selectedLeadId={selectedLeadId}
                onSelectLead={handleSelectLead}
                activeFilter={activeFilter}
                setActiveFilter={setActiveFilter}
              />
            ) : (
              /* LEVEL 2: DETAILED LEAD VIEW (EXTRACTED DATA ON LEFT 50%, WHATSAPP ON RIGHT 50%) */
              <LeadDetailView
                lead={selectedLead}
                messages={messages}
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
          </div>
        )}

        {/* EXTRA PAGES */}
        {activePage === 'appointments' && (
          <AppointmentsView
            appointments={appointments}
            onOpenConfirmVisit={() => setIsConfirmVisitModalOpen(true)}
          />
        )}

        {activePage === 'followups' && (
          <FollowupsView
            followups={followups}
            onToggleStatus={async (id) => {
              await crmApi.toggleFollowupStatus(id);
              const updated = await crmApi.getFollowups();
              setFollowups(updated);
            }}
            onCreateFollowup={async (fol) => {
              await crmApi.createFollowup({ ...fol, status: 'pending' });
              const updated = await crmApi.getFollowups();
              setFollowups(updated);
            }}
          />
        )}

        {activePage === 'simulator' && (
          <WhatsAppSimulatorView
            leads={leads}
            activeLead={selectedLead}
            messages={messages}
            onSimulateCustomerMessage={handleSimulateWhatsAppMessage}
            onSelectLead={handleSelectLead}
          />
        )}

        {activePage === 'settings' && settings && (
          <SettingsView
            settings={settings}
            onSaveSettings={async (updated) => {
              await crmApi.updateSettings(updated);
              setSettings(updated);
              const reloadedKpis = await crmApi.getKpis();
              setKpis(reloadedKpis);
            }}
          />
        )}
      </main>

      {/* FOOTER */}
      <footer className="bg-brand-panel border-t border-brand-border py-4 px-6 text-center text-xs text-brand-muted mt-auto">
        <div className="max-w-[1600px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>ColourPlus Lead Desk &copy; 2026 ColourPlus Polyurethanes Pvt. Ltd. All rights reserved.</span>
          <span className="text-[11px] font-mono text-brand-subtle">
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
    </div>
  );
}

export default App;
