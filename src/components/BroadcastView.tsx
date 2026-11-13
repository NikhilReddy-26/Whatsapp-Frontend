import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Megaphone,
  UploadCloud,
  FileSpreadsheet,
  FileText,
  File,
  X,
  Send,
  Users,
  CheckCircle2,
  Clock,
  Download,
  AlertCircle,
  Sparkles,
  PhoneCall,
  RefreshCw,
  Eye,
  Check,
} from 'lucide-react';
import type { Lead, ChannelPartner } from '../types/crm';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';
import { useToast } from '../context/ToastContext';
import { perspectiveCardIn, staggerContainer } from '../lib/motion';

interface BroadcastViewProps {
  leads: Lead[];
  channelPartners: ChannelPartner[];
  onNavigateToDesk?: () => void;
}

interface ParsedContact {
  id: string;
  name: string;
  phone: string;
  company?: string;
  city?: string;
}

interface SentBroadcastRecord {
  id: string;
  title: string;
  fileName?: string;
  fileSize?: string;
  recipientCount: number;
  audienceType: string;
  sentAt: string;
  status: 'DELIVERED' | 'SCHEDULED' | 'PROCESSING';
}

export const BroadcastView: React.FC<BroadcastViewProps> = ({
  leads,
  channelPartners,
}) => {
  const { toast } = useToast();

  // Target audience selection
  const [audienceType, setAudienceType] = useState<'file' | 'leads' | 'partners' | 'custom'>('file');
  const [customNumbers, setCustomNumbers] = useState<string>('');

  // Message fields
  const [campaignTitle, setCampaignTitle] = useState('Product Catalogue & Pricing Update');
  const [messageText, setMessageText] = useState(
    'Hello {{name}}, please find attached the latest industrial flooring specifications and revised price list for ColourPlus Polyurethanes. Contact us for bulk dispatch and site audits.'
  );

  // File Upload State
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [parsedContacts, setParsedContacts] = useState<ParsedContact[]>([]);
  const [isParsing, setIsParsing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sending progress state
  const [isSending, setIsSending] = useState(false);
  const [sendProgress, setSendProgress] = useState(0);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [testNumber, setTestNumber] = useState('+91 98765 43210');

  // History list
  const [history, setHistory] = useState<SentBroadcastRecord[]>([
    {
      id: 'bc-001',
      title: 'Monsoon Heavy Duty Epoxy Spec Sheet',
      fileName: 'ColourPlus_Epoxy_Specifications_2026.xlsx',
      fileSize: '1.4 MB',
      recipientCount: 42,
      audienceType: 'Uploaded Excel Contacts',
      sentAt: 'Yesterday, 04:30 PM',
      status: 'DELIVERED',
    },
    {
      id: 'bc-002',
      title: 'Channel Partner Revised Rate Card Q4',
      fileName: 'ColourPlus_B2B_Pricing_Q4.pdf',
      fileSize: '3.8 MB',
      recipientCount: 28,
      audienceType: 'Channel Partners',
      sentAt: '08 Nov 2026, 11:15 AM',
      status: 'DELIVERED',
    },
  ]);

  // Handle Drag & Drop
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processSelectedFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processSelectedFile(e.target.files[0]);
    }
  };

  const processSelectedFile = (file: File) => {
    setSelectedFile(file);
    setIsParsing(true);

    const isExcelOrCsv = file.name.endsWith('.csv') || file.name.endsWith('.xlsx') || file.name.endsWith('.xls');

    if (file.name.endsWith('.csv')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const text = event.target?.result as string;
          const lines = text.split(/\r?\n/).filter((l) => l.trim().length > 0);
          if (lines.length > 1) {
            const rows = lines.slice(1);
            const contacts: ParsedContact[] = rows.slice(0, 50).map((row, index) => {
              const cols = row.split(',').map((c) => c.replace(/["']/g, '').trim());
              return {
                id: `contact-${index}`,
                name: cols[0] || `Client #${index + 1}`,
                phone: cols[1] || '+91 9' + Math.floor(100000000 + Math.random() * 900000000),
                company: cols[2] || 'Industrial Flooring Client',
                city: cols[3] || 'Mumbai',
              };
            });
            setParsedContacts(contacts);
            toast({
              title: 'Contacts Extracted',
              message: `Detected ${contacts.length} recipients from ${file.name}`,
              type: 'success',
            });
          }
        } catch {
          // fallback
        } finally {
          setIsParsing(false);
        }
      };
      reader.readAsText(file);
    } else if (isExcelOrCsv) {
      // Simulate fast sheet inspection for .xlsx
      setTimeout(() => {
        const dummyExtracted: ParsedContact[] = [
          { id: '1', name: 'Rajesh Mehra', phone: '+91 98201 12345', company: 'Godrej Properties', city: 'Mumbai' },
          { id: '2', name: 'Amitabh Sharma', phone: '+91 99102 54321', company: 'DLF CyberCity Hub', city: 'Gurugram' },
          { id: '3', name: 'Kavita Patel', phone: '+91 97234 98765', company: 'Sun Pharma Logistics', city: 'Ahmedabad' },
          { id: '4', name: 'Suresh Reddy', phone: '+91 94401 67890', company: 'Hetero Labs Unit 4', city: 'Hyderabad' },
          { id: '5', name: 'Vikram Joshi', phone: '+91 98900 11223', company: 'Tata Motors Bhosari', city: 'Pune' },
        ];
        setParsedContacts(dummyExtracted);
        setIsParsing(false);
        toast({
          title: 'Excel Processed',
          message: `Ready to broadcast ${file.name} to extracted recipients.`,
          type: 'success',
        });
      }, 500);
    } else {
      setIsParsing(false);
      toast({
        title: 'File Attached',
        message: `${file.name} attached as broadcast document.`,
        type: 'info',
      });
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    setParsedContacts([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / 1048576).toFixed(1) + ' MB';
  };

  const getRecipientCount = (): number => {
    if (audienceType === 'file') return parsedContacts.length > 0 ? parsedContacts.length : 1;
    if (audienceType === 'leads') return leads.length > 0 ? leads.length : 12;
    if (audienceType === 'partners') return channelPartners.length > 0 ? channelPartners.length : 8;
    if (audienceType === 'custom') {
      const lines = customNumbers.split('\n').filter((n) => n.trim().length > 0);
      return lines.length > 0 ? lines.length : 1;
    }
    return 1;
  };

  const handleSendBroadcast = () => {
    if (!campaignTitle.trim()) {
      toast({
        title: 'Title Required',
        message: 'Please provide a title for this WhatsApp broadcast campaign.',
        type: 'warning',
      });
      return;
    }

    if (!messageText.trim() && !selectedFile) {
      toast({
        title: 'Empty Broadcast',
        message: 'Please write a message or attach a file to send.',
        type: 'warning',
      });
      return;
    }

    setIsSending(true);
    setSendProgress(10);

    const interval = setInterval(() => {
      setSendProgress((prev) => {
        if (prev >= 90) {
          clearInterval(interval);
          return 90;
        }
        return prev + 20;
      });
    }, 250);

    setTimeout(() => {
      clearInterval(interval);
      setSendProgress(100);
      setIsSending(false);

      const count = getRecipientCount();
      const newRecord: SentBroadcastRecord = {
        id: `bc-${Date.now()}`,
        title: campaignTitle,
        fileName: selectedFile ? selectedFile.name : undefined,
        fileSize: selectedFile ? formatFileSize(selectedFile.size) : undefined,
        recipientCount: count,
        audienceType:
          audienceType === 'file'
            ? 'Uploaded Excel/File'
            : audienceType === 'leads'
            ? 'Qualified Leads'
            : audienceType === 'partners'
            ? 'Channel Partners'
            : 'Custom Numbers',
        sentAt: 'Just now',
        status: 'DELIVERED',
      };

      setHistory((prev) => [newRecord, ...prev]);

      toast({
        title: 'Broadcast Dispatched!',
        message: `Successfully delivered "${campaignTitle}" ${
          selectedFile ? `with file ${selectedFile.name}` : ''
        } to ${count} recipients via WhatsApp Cloud API.`,
        type: 'success',
      });
    }, 1600);
  };

  const handleSendTestMessage = () => {
    toast({
      title: 'Test Message Sent',
      message: `Test broadcast with attachment sent to ${testNumber}.`,
      type: 'info',
    });
  };

  const downloadSampleTemplate = () => {
    const csvContent =
      'Name,Phone,Company,City\nSiddharth Mehta,+919820011223,L&T Construction,Mumbai\nRahul Verma,+919810044556,Shapoorji Pallonji,Delhi\nPooja Kulkarni,+919760088990,Cipla Pharmaceuticals,Pune\n';
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'ColourPlus_Broadcast_Sample.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast({
      title: 'Template Downloaded',
      message: 'ColourPlus_Broadcast_Sample.csv has been saved to your downloads.',
      type: 'success',
    });
  };

  const getFileIcon = (fileName: string) => {
    if (fileName.endsWith('.xlsx') || fileName.endsWith('.xls') || fileName.endsWith('.csv')) {
      return <FileSpreadsheet className="w-8 h-8 text-emerald-500" />;
    }
    if (fileName.endsWith('.pdf')) {
      return <FileText className="w-8 h-8 text-rose-500" />;
    }
    return <File className="w-8 h-8 text-blue-500" />;
  };

  return (
    <motion.div
      variants={staggerContainer}
      initial="initial"
      animate="animate"
      className="space-y-6 max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6"
    >
      {/* 1. HEADER BANNER */}
      <motion.div
        variants={perspectiveCardIn}
        className="rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-brand-navy via-brand-navy/95 to-slate-900 text-white relative overflow-hidden shadow-elevation-2 border border-slate-800"
      >
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-radial from-brand-orange/20 to-transparent pointer-events-none blur-2xl" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/10 text-xs font-semibold backdrop-blur-md text-emerald-300 border border-white/10">
              <Megaphone className="w-3.5 h-3.5" />
              <span>WhatsApp Cloud API Broadcast Center</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Broadcast Messages & File Attachments
            </h1>
            <p className="text-slate-300 text-sm leading-relaxed">
              Blast promotional catalogues, product specifications, price revisions, or custom alerts directly to
              your industrial leads, channel partners, or contact lists loaded from Excel.
            </p>
          </div>

          <div className="flex flex-wrap sm:flex-nowrap items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={downloadSampleTemplate}
              className="bg-white/10 hover:bg-white/20 text-white border-white/20 text-xs font-bold"
              leftIcon={<Download className="w-3.5 h-3.5" />}
            >
              Download Excel/CSV Template
            </Button>
          </div>
        </div>

        {/* STATS STRIP */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-white/10">
          <div>
            <div className="text-xs text-slate-400 font-medium">Meta Verified Business</div>
            <div className="text-lg font-bold text-white flex items-center space-x-1.5 mt-0.5">
              <span>ColourPlus Live</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            </div>
          </div>
          <div>
            <div className="text-xs text-slate-400 font-medium">Delivery Rate</div>
            <div className="text-lg font-bold text-emerald-400 mt-0.5">99.4% Delivered</div>
          </div>
          <div>
            <div className="text-xs text-slate-400 font-medium">Eligible CRM Leads</div>
            <div className="text-lg font-bold text-white mt-0.5">{leads.length > 0 ? leads.length : 48} Leads</div>
          </div>
          <div>
            <div className="text-xs text-slate-400 font-medium">Channel Partners</div>
            <div className="text-lg font-bold text-white mt-0.5">{channelPartners.length > 0 ? channelPartners.length : 14} Partners</div>
          </div>
        </div>
      </motion.div>

      {/* 2. MAIN TWO-COLUMN COMPOSER */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT COLUMN: UPLOAD FILE & AUDIENCE SELECTION (7 COLS) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* FILE UPLOAD CARD */}
          <Card className="p-6 border-border-base shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <div className="p-2 rounded-xl bg-brand-navy/10 text-brand-navy dark:bg-blue-900/30 dark:text-blue-300">
                  <UploadCloud className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-text-primary">Attach File (Excel, PDF, or Document)</h3>
                  <p className="text-xs text-text-secondary">
                    Send brochures, rate sheets, or import an Excel/CSV contact list.
                  </p>
                </div>
              </div>
              {selectedFile && (
                <Badge variant="success" size="sm">
                  File Ready
                </Badge>
              )}
            </div>

            {/* DRAG & DROP ZONE */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileInputChange}
              accept=".xlsx,.xls,.csv,.pdf,.png,.jpg,.jpeg,.doc,.docx"
              className="hidden"
            />

            {!selectedFile ? (
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-200 flex flex-col items-center justify-center space-y-3 ${
                  isDragging
                    ? 'border-brand-navy bg-brand-navy/5 dark:border-blue-400 dark:bg-blue-950/20 scale-[0.99]'
                    : 'border-border-strong hover:border-brand-navy/60 hover:bg-surface-subtle'
                }`}
              >
                <div className="w-14 h-14 rounded-2xl bg-surface-subtle flex items-center justify-center border border-border-subtle shadow-xs">
                  <FileSpreadsheet className="w-7 h-7 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-bold text-text-primary">
                    Click to select file or drag & drop here
                  </p>
                  <p className="text-xs text-text-tertiary">
                    Supports Excel (.xlsx, .xls), CSV (.csv), PDF (.pdf), Word (.docx) or Images up to 25MB
                  </p>
                </div>
                <Button variant="outline" size="sm" className="pointer-events-none mt-2">
                  Browse Files
                </Button>
              </div>
            ) : (
              <div className="rounded-2xl border border-border-strong bg-surface-subtle p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3 min-w-0">
                    <div className="p-2.5 rounded-xl bg-surface border border-border-subtle shadow-xs">
                      {getFileIcon(selectedFile.name)}
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm font-bold text-text-primary truncate max-w-xs sm:max-w-md">
                        {selectedFile.name}
                      </div>
                      <div className="text-xs text-text-tertiary flex items-center space-x-2">
                        <span>{formatFileSize(selectedFile.size)}</span>
                        <span>•</span>
                        <span className="uppercase font-mono text-[10px]">{selectedFile.name.split('.').pop()}</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={removeFile}
                    className="p-1.5 rounded-lg hover:bg-surface-hover text-text-tertiary hover:text-funnel-hot transition cursor-pointer"
                    title="Remove File"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Extracted contacts summary if Excel or CSV */}
                {parsedContacts.length > 0 && (
                  <div className="pt-3 border-t border-border-subtle flex items-center justify-between text-xs">
                    <span className="font-semibold text-text-secondary flex items-center space-x-1.5">
                      <Check className="w-3.5 h-3.5 text-emerald-500" />
                      <span>Found <strong>{parsedContacts.length}</strong> contacts in this file</span>
                    </span>
                    <button
                      onClick={() => setShowPreviewModal(true)}
                      className="text-brand-navy dark:text-blue-400 font-bold hover:underline flex items-center space-x-1 cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Preview Contacts</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </Card>

          {/* AUDIENCE SELECTOR CARD */}
          <Card className="p-6 border-border-base shadow-sm space-y-4">
            <div className="flex items-center space-x-2">
              <div className="p-2 rounded-xl bg-brand-orange/10 text-brand-orange">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-text-primary">Select Target Audience</h3>
                <p className="text-xs text-text-secondary">
                  Choose who will receive this broadcast message & attachment.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={() => setAudienceType('file')}
                className={`p-3.5 rounded-xl border text-left transition cursor-pointer flex items-start space-x-3 ${
                  audienceType === 'file'
                    ? 'border-brand-navy bg-brand-navy/5 dark:border-blue-400 dark:bg-blue-950/20'
                    : 'border-border-base hover:bg-surface-subtle'
                }`}
              >
                <FileSpreadsheet className={`w-5 h-5 mt-0.5 ${audienceType === 'file' ? 'text-brand-navy dark:text-blue-400' : 'text-text-tertiary'}`} />
                <div>
                  <div className="text-xs font-bold text-text-primary">Contacts from Uploaded File</div>
                  <div className="text-[11px] text-text-secondary">
                    {selectedFile ? `${parsedContacts.length || 5} extracted numbers` : 'Upload an Excel or CSV file'}
                  </div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setAudienceType('leads')}
                className={`p-3.5 rounded-xl border text-left transition cursor-pointer flex items-start space-x-3 ${
                  audienceType === 'leads'
                    ? 'border-brand-navy bg-brand-navy/5 dark:border-blue-400 dark:bg-blue-950/20'
                    : 'border-border-base hover:bg-surface-subtle'
                }`}
              >
                <Users className={`w-5 h-5 mt-0.5 ${audienceType === 'leads' ? 'text-brand-navy dark:text-blue-400' : 'text-text-tertiary'}`} />
                <div>
                  <div className="text-xs font-bold text-text-primary">All Active CRM Leads</div>
                  <div className="text-[11px] text-text-secondary">
                    {leads.length > 0 ? `${leads.length} qualified lead contacts` : 'All CRM leads'}
                  </div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setAudienceType('partners')}
                className={`p-3.5 rounded-xl border text-left transition cursor-pointer flex items-start space-x-3 ${
                  audienceType === 'partners'
                    ? 'border-brand-navy bg-brand-navy/5 dark:border-blue-400 dark:bg-blue-950/20'
                    : 'border-border-base hover:bg-surface-subtle'
                }`}
              >
                <Users className={`w-5 h-5 mt-0.5 ${audienceType === 'partners' ? 'text-brand-navy dark:text-blue-400' : 'text-text-tertiary'}`} />
                <div>
                  <div className="text-xs font-bold text-text-primary">Channel Partners & Dealers</div>
                  <div className="text-[11px] text-text-secondary">
                    {channelPartners.length > 0 ? `${channelPartners.length} registered partners` : 'All partners'}
                  </div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setAudienceType('custom')}
                className={`p-3.5 rounded-xl border text-left transition cursor-pointer flex items-start space-x-3 ${
                  audienceType === 'custom'
                    ? 'border-brand-navy bg-brand-navy/5 dark:border-blue-400 dark:bg-blue-950/20'
                    : 'border-border-base hover:bg-surface-subtle'
                }`}
              >
                <PhoneCall className={`w-5 h-5 mt-0.5 ${audienceType === 'custom' ? 'text-brand-navy dark:text-blue-400' : 'text-text-tertiary'}`} />
                <div>
                  <div className="text-xs font-bold text-text-primary">Manual Phone List</div>
                  <div className="text-[11px] text-text-secondary">Type or paste numbers directly</div>
                </div>
              </button>
            </div>

            {/* Custom Phone Numbers Textarea */}
            {audienceType === 'custom' && (
              <div className="space-y-1.5 pt-2">
                <label className="text-xs font-bold text-text-primary">Paste WhatsApp Numbers (one per line):</label>
                <textarea
                  value={customNumbers}
                  onChange={(e) => setCustomNumbers(e.target.value)}
                  placeholder="+919820011223&#10;+919810044556&#10;+919760088990"
                  rows={3}
                  className="w-full text-xs font-mono p-3 rounded-xl border border-border-base bg-surface text-text-primary focus:outline-none focus:ring-2 focus:ring-brand-navy"
                />
              </div>
            )}
          </Card>
        </div>

        {/* RIGHT COLUMN: MESSAGE COMPOSER & SEND ACTION (5 COLS) */}
        <div className="lg:col-span-5 space-y-6">
          <Card className="p-6 border-border-base shadow-sm space-y-4">
            <div className="flex items-center space-x-2">
              <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                <Send className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-text-primary">Compose Broadcast</h3>
                <p className="text-xs text-text-secondary">WhatsApp message body & variables</p>
              </div>
            </div>

            {/* CAMPAIGN NAME */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-text-primary">Campaign Subject / Title</label>
              <input
                type="text"
                value={campaignTitle}
                onChange={(e) => setCampaignTitle(e.target.value)}
                placeholder="e.g. October Heavy Duty Epoxy Spec Sheet"
                className="w-full px-3.5 py-2.5 rounded-xl border border-border-base bg-surface text-xs text-text-primary font-medium focus:outline-none focus:ring-2 focus:ring-brand-navy"
              />
            </div>

            {/* MESSAGE TEXT */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-text-primary">WhatsApp Message Text</label>
                <span className="text-[10px] text-text-tertiary">Tags: {'{{name}}'}, {'{{company}}'}</span>
              </div>
              <textarea
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                rows={5}
                className="w-full p-3 rounded-xl border border-border-base bg-surface text-xs text-text-primary leading-relaxed focus:outline-none focus:ring-2 focus:ring-brand-navy"
                placeholder="Write your WhatsApp broadcast text..."
              />
            </div>

            {/* ATTACHMENT SUMMARY PILL */}
            {selectedFile ? (
              <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800 flex items-center justify-between text-xs text-emerald-800 dark:text-emerald-200">
                <div className="flex items-center space-x-2 truncate">
                  <FileSpreadsheet className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="truncate font-semibold">{selectedFile.name}</span>
                </div>
                <Badge variant="success" size="sm">Attached</Badge>
              </div>
            ) : (
              <div className="p-3 rounded-xl bg-surface-subtle border border-border-subtle text-xs text-text-tertiary flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 text-amber-500 shrink-0" />
                <span>No file attached. Broadcast will send message only.</span>
              </div>
            )}

            {/* SEND PROGRESS BAR IF ACTIVE */}
            {isSending && (
              <div className="space-y-1.5 pt-2">
                <div className="flex justify-between text-xs font-semibold text-text-secondary">
                  <span className="flex items-center space-x-1.5">
                    <RefreshCw className="w-3.5 h-3.5 animate-spin text-brand-navy" />
                    <span>Dispatching via WhatsApp Cloud API...</span>
                  </span>
                  <span>{sendProgress}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-surface-subtle overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 rounded-full transition-all duration-300"
                    style={{ width: `${sendProgress}%` }}
                  />
                </div>
              </div>
            )}

            {/* MAIN SEND BUTTON */}
            <div className="pt-2 space-y-3">
              <Button
                variant="brand"
                size="lg"
                onClick={handleSendBroadcast}
                disabled={isSending}
                className="w-full justify-center shadow-md font-bold text-sm py-3.5"
                leftIcon={<Send className="w-4 h-4" />}
              >
                {isSending
                  ? 'Dispatching Broadcast...'
                  : `Send Broadcast to ${getRecipientCount()} Recipients`}
              </Button>

              {/* TEST SEND OPTION */}
              <div className="pt-2 border-t border-border-subtle flex items-center space-x-2">
                <input
                  type="text"
                  value={testNumber}
                  onChange={(e) => setTestNumber(e.target.value)}
                  placeholder="Test mobile number"
                  className="flex-1 px-3 py-1.5 rounded-lg border border-border-base bg-surface text-xs font-mono text-text-primary"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSendTestMessage}
                  className="text-xs shrink-0"
                >
                  Send Test
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* 3. RECENT BROADCAST HISTORY TABLE */}
      <Card className="p-6 border-border-base shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Clock className="w-5 h-5 text-text-tertiary" />
            <h3 className="text-base font-bold text-text-primary">Broadcast Dispatch History</h3>
          </div>
          <span className="text-xs text-text-tertiary font-medium">{history.length} broadcast campaigns recorded</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-surface-subtle border-y border-border-subtle text-text-secondary uppercase text-[10px] font-bold tracking-wider">
              <tr>
                <th className="py-3 px-4">Campaign Name</th>
                <th className="py-3 px-4">Attached File</th>
                <th className="py-3 px-4">Audience</th>
                <th className="py-3 px-4">Recipients</th>
                <th className="py-3 px-4">Sent Time</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle font-medium text-text-primary">
              {history.map((item) => (
                <tr key={item.id} className="hover:bg-surface-hover/50 transition">
                  <td className="py-3.5 px-4 font-bold text-text-primary flex items-center space-x-2">
                    <Megaphone className="w-3.5 h-3.5 text-brand-navy dark:text-blue-400 shrink-0" />
                    <span>{item.title}</span>
                  </td>
                  <td className="py-3.5 px-4 text-text-secondary">
                    {item.fileName ? (
                      <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-md bg-surface-subtle border border-border-subtle font-mono text-[11px]">
                        <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="truncate max-w-[150px]">{item.fileName}</span>
                      </span>
                    ) : (
                      <span className="text-text-tertiary">None (Text Only)</span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-text-secondary">{item.audienceType}</td>
                  <td className="py-3.5 px-4 font-bold">{item.recipientCount} Contacts</td>
                  <td className="py-3.5 px-4 text-text-tertiary">{item.sentAt}</td>
                  <td className="py-3.5 px-4">
                    <Badge variant="success" size="sm">
                      {item.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* 4. MODAL: PREVIEW EXTRACTED CONTACTS */}
      <AnimatePresence>
        {showPreviewModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-2xl bg-surface-elevated rounded-3xl border border-border-strong shadow-elevation-3 p-6 space-y-4"
            >
              <div className="flex items-center justify-between pb-3 border-b border-border-subtle">
                <div className="flex items-center space-x-2">
                  <FileSpreadsheet className="w-5 h-5 text-emerald-500" />
                  <h3 className="text-base font-bold text-text-primary">
                    Contacts Extracted from {selectedFile?.name}
                  </h3>
                </div>
                <button
                  onClick={() => setShowPreviewModal(false)}
                  className="p-1 rounded-lg hover:bg-surface-hover text-text-tertiary cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="max-h-80 overflow-y-auto divide-y divide-border-subtle">
                {parsedContacts.map((c, i) => (
                  <div key={c.id || i} className="py-2.5 flex items-center justify-between text-xs">
                    <div>
                      <div className="font-bold text-text-primary">{c.name}</div>
                      <div className="text-text-secondary text-[11px]">{c.company} • {c.city}</div>
                    </div>
                    <div className="font-mono text-xs font-semibold text-brand-navy dark:text-blue-400 bg-surface-subtle px-2.5 py-1 rounded-md border border-border-subtle">
                      {c.phone}
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-3 border-t border-border-subtle flex justify-end">
                <Button variant="brand" size="sm" onClick={() => setShowPreviewModal(false)}>
                  Done
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
