import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Settings as SettingsIcon,
  Save,
  Sliders,
  CheckCircle2,
  Package,
  MapPin,
  Factory,
  Plus,
  Trash2,
  Search,
  RotateCcw,
  Sparkles,
  Check,
} from 'lucide-react';
import { CRMSettings } from '../types/crm';
import { initialSettings } from '../data/settings';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';
import { AnimatedText } from './ui/AnimatedText';
import { useToast } from '../context/ToastContext';

interface SettingsViewProps {
  settings: CRMSettings;
  onSaveSettings: (settings: CRMSettings) => void;
}

type TabKey = 'products' | 'states' | 'sectors' | 'scoring';

export const SettingsView: React.FC<SettingsViewProps> = ({ settings, onSaveSettings }) => {
  const [formData, setFormData] = useState<CRMSettings>({
    ...settings,
    products: settings.products || [...initialSettings.products],
    states: settings.states || [...initialSettings.states],
    facility_sectors: settings.facility_sectors || [...initialSettings.facility_sectors],
  });

  const [activeTab, setActiveTab] = useState<TabKey>('products');
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [productSearch, setProductSearch] = useState('');
  const [newProductInput, setNewProductInput] = useState('');
  const [newStateInput, setNewStateInput] = useState('');
  const [newSectorInput, setNewSectorInput] = useState('');
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);

  const { toast } = useToast();

  // Sync internal state when settings prop updates
  useEffect(() => {
    setFormData({
      ...settings,
      products: settings.products || [...initialSettings.products],
      states: settings.states || [...initialSettings.states],
      facility_sectors: settings.facility_sectors || [...initialSettings.facility_sectors],
    });
  }, [settings]);

  // Save changes to database layer
  const commitSettings = (updated: CRMSettings, successMsg?: string) => {
    setFormData(updated);
    onSaveSettings(updated);
    setSavedSuccess(true);
    if (successMsg) {
      toast({
        title: 'Database Updated',
        message: successMsg,
        type: 'success',
      });
    }
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    commitSettings(formData, 'All master data and scoring thresholds saved successfully to database.');
  };

  // --- PRODUCTS HANDLERS ---
  const handleAddProduct = () => {
    const trimmed = newProductInput.trim();
    if (!trimmed) return;

    if (formData.products.some((p) => p.toLowerCase() === trimmed.toLowerCase())) {
      toast({
        title: 'Product Already Exists',
        message: `"${trimmed}" is already in the product catalog.`,
        type: 'warning',
      });
      return;
    }

    const updated: CRMSettings = {
      ...formData,
      products: [...formData.products, trimmed],
    };
    commitSettings(updated, `"${trimmed}" added to database and will appear in product filters.`);
    setNewProductInput('');
  };

  const handleDeleteProduct = (productToRemove: string) => {
    if (formData.products.length <= 1) {
      toast({
        title: 'Minimum Required',
        message: 'At least one product must remain in the catalog.',
        type: 'warning',
      });
      return;
    }

    const updated: CRMSettings = {
      ...formData,
      products: formData.products.filter((p) => p !== productToRemove),
    };
    commitSettings(updated, `"${productToRemove}" removed from product catalog.`);
  };

  // --- STATES HANDLERS ---
  const handleAddState = () => {
    const trimmed = newStateInput.trim();
    if (!trimmed) return;

    if (formData.states.some((s) => s.toLowerCase() === trimmed.toLowerCase())) {
      toast({
        title: 'State Already Exists',
        message: `"${trimmed}" is already in the coverage list.`,
        type: 'warning',
      });
      return;
    }

    const updated: CRMSettings = {
      ...formData,
      states: [...formData.states, trimmed],
    };
    commitSettings(updated, `"${trimmed}" added to database and will appear in territory filters & partner forms.`);
    setNewStateInput('');
  };

  const handleDeleteState = (stateToRemove: string) => {
    if (formData.states.length <= 1) {
      toast({
        title: 'Minimum Required',
        message: 'At least one territory state must remain in coverage.',
        type: 'warning',
      });
      return;
    }

    const updated: CRMSettings = {
      ...formData,
      states: formData.states.filter((s) => s !== stateToRemove),
    };
    commitSettings(updated, `"${stateToRemove}" removed from territory coverage.`);
  };

  // --- FACILITY SECTOR HANDLERS ---
  const handleAddSector = () => {
    const trimmed = newSectorInput.trim();
    if (!trimmed) return;

    if (formData.facility_sectors.some((sec) => sec.toLowerCase() === trimmed.toLowerCase())) {
      toast({
        title: 'Sector Already Exists',
        message: `"${trimmed}" is already in the facility sectors list.`,
        type: 'warning',
      });
      return;
    }

    const updated: CRMSettings = {
      ...formData,
      facility_sectors: [...formData.facility_sectors, trimmed],
    };
    commitSettings(updated, `"${trimmed}" added to database and will appear in facility sector filters.`);
    setNewSectorInput('');
  };

  const handleDeleteSector = (sectorToRemove: string) => {
    if (formData.facility_sectors.length <= 1) {
      toast({
        title: 'Minimum Required',
        message: 'At least one facility sector must remain in configuration.',
        type: 'warning',
      });
      return;
    }

    const updated: CRMSettings = {
      ...formData,
      facility_sectors: formData.facility_sectors.filter((sec) => sec !== sectorToRemove),
    };
    commitSettings(updated, `"${sectorToRemove}" removed from facility sectors.`);
  };

  // --- RESET TO SYSTEM DEFAULTS ---
  const handleResetDefaults = () => {
    commitSettings(initialSettings, 'Reset all settings and master data to factory ColourPlus defaults.');
    setIsResetConfirmOpen(false);
  };

  const filteredProducts = formData.products.filter((p) =>
    p.toLowerCase().includes(productSearch.toLowerCase())
  );

  const tabs: { key: TabKey; label: string; icon: React.ComponentType<{ className?: string }>; count?: number }[] = [
    { key: 'products', label: 'Product Catalog', icon: Package, count: formData.products.length },
    { key: 'states', label: 'Territories & States', icon: MapPin, count: formData.states.length },
    { key: 'sectors', label: 'Facility Sectors', icon: Factory, count: formData.facility_sectors.length },
    { key: 'scoring', label: 'AI Funnel Scoring', icon: Sliders },
  ];

  return (
    <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* 1. HEADER */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-surface border border-border-subtle rounded-card p-6 shadow-elevation-1 transition-colors"
      >
        <div>
          <div className="flex items-center space-x-2 text-brand-navy dark:text-blue-400 font-bold text-xs uppercase tracking-wider mb-1 font-mono">
            <SettingsIcon className="w-4 h-4" />
            <span>Master Data Catalog & AI Engine Settings</span>
          </div>
          <AnimatedText
            text="ColourPlus CRM Master Configuration"
            as="h2"
            className="text-2xl font-black text-text-primary tracking-tight"
          />
          <p className="text-xs text-text-secondary mt-1">
            Manage your official products, regional territory states, and facility sectors. All items are stored in the database layer and immediately reflected in CRM filter dropdowns.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <AnimatePresence>
            {savedSuccess && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
              >
                <Badge variant="green" size="md" icon={<CheckCircle2 className="w-4 h-4" />}>
                  Synced with Database!
                </Badge>
              </motion.div>
            )}
          </AnimatePresence>

          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={() => setIsResetConfirmOpen(true)}
            leftIcon={<RotateCcw className="w-3.5 h-3.5 text-text-tertiary" />}
            className="text-xs text-text-secondary hover:text-text-primary"
          >
            Reset Defaults
          </Button>
        </div>
      </motion.div>

      {/* 2. NAVIGATION TABS */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1 text-xs border-b border-border-subtle">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.key;
          const Icon = tab.icon;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={`relative px-4 py-2.5 rounded-xl font-semibold transition-all flex items-center gap-2 cursor-pointer select-none whitespace-nowrap ${
                isActive
                  ? 'text-white'
                  : 'text-text-secondary hover:text-text-primary hover:bg-surface-subtle'
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="settings-tab-indicator"
                  transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                  className="absolute inset-0 bg-brand-navy rounded-xl shadow-elevation-1"
                />
              )}
              <span className="relative z-10 flex items-center gap-2">
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
                {typeof tab.count === 'number' && (
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold ${
                      isActive ? 'bg-white/20 text-white' : 'bg-surface-subtle text-text-tertiary'
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </span>
            </button>
          );
        })}
      </div>

      {/* 4. MAIN CONTENT ACCORDING TO TAB */}
      <form onSubmit={handleFormSubmit} className="space-y-6">

        {/* ============================================================== */}
        {/* CARD A: PRODUCTS CATALOG MANAGEMENT */}
        {/* ============================================================== */}
        {activeTab === 'products' && (
          <Card elevation={1} className="p-6 space-y-5 border border-border-subtle">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border-subtle pb-4">
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center shrink-0">
                  <Package className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-text-primary tracking-tight">ColourPlus Product Catalog</h3>
                    <Badge variant="navy" size="xs">
                      {formData.products.length} Products
                    </Badge>
                  </div>
                  <p className="text-xs text-text-secondary">
                    Products ingested from WhatsApp inquiries and selectable in the Lead Inbox filters.
                  </p>
                </div>
              </div>

              {/* Search products filter */}
              <div className="relative w-full sm:w-64">
                <Search className="w-3.5 h-3.5 text-text-tertiary absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 bg-surface-subtle border border-border-base rounded-xl text-xs text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-indigo-500 transition shadow-2xs"
                />
              </div>
            </div>

            {/* ADD PRODUCT INPUT BAR */}
            <div className="bg-surface-subtle p-3.5 rounded-2xl border border-border-subtle flex flex-col sm:flex-row gap-2.5">
              <div className="relative flex-1">
                <Package className="w-4 h-4 text-text-tertiary absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Enter new product name (e.g. PU Concrete Screed 6mm, Food-Grade Wall Coating)..."
                  value={newProductInput}
                  onChange={(e) => setNewProductInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddProduct();
                    }
                  }}
                  className="w-full pl-10 pr-3.5 py-2.5 bg-surface border border-border-base rounded-xl text-xs text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-indigo-500 transition shadow-2xs"
                />
              </div>
              <Button
                type="button"
                variant="brand"
                size="sm"
                onClick={handleAddProduct}
                disabled={!newProductInput.trim()}
                leftIcon={<Plus className="w-3.5 h-3.5" />}
                className="shrink-0 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl px-5"
              >
                Add Product
              </Button>
            </div>

            {/* PRODUCT CHIPS GRID */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-text-secondary">
                <span>Active Catalog Items ({filteredProducts.length})</span>
                <span className="text-text-tertiary font-normal">Click trash to remove from database</span>
              </div>

              {filteredProducts.length === 0 ? (
                <div className="text-center py-8 bg-surface-subtle/50 rounded-2xl border border-dashed border-border-base text-xs text-text-tertiary">
                  No products matched "{productSearch}". Add it above or clear search.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5">
                  {filteredProducts.map((prod) => (
                    <motion.div
                      key={prod}
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="group flex items-center justify-between gap-2 p-3 bg-surface hover:bg-surface-subtle border border-border-base hover:border-indigo-500/40 rounded-xl text-xs transition-all shadow-2xs"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="w-2 h-2 rounded-full bg-indigo-500 shrink-0" />
                        <span className="font-semibold text-text-primary truncate" title={prod}>
                          {prod}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleDeleteProduct(prod)}
                        title={`Remove "${prod}" from database`}
                        className="opacity-70 group-hover:opacity-100 p-1 rounded-lg text-text-tertiary hover:text-funnel-hot hover:bg-funnel-hot/10 transition shrink-0"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </Card>
        )}

        {/* ============================================================== */}
        {/* CARD B: REGIONAL TERRITORIES & STATES MANAGEMENT */}
        {/* ============================================================== */}
        {activeTab === 'states' && (
          <Card elevation={1} className="p-6 space-y-5 border border-border-subtle">
            <div className="flex items-center space-x-3 border-b border-border-subtle pb-4">
              <div className="w-9 h-9 rounded-xl bg-rose-500/10 text-rose-500 flex items-center justify-center shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-text-primary tracking-tight">Territory Coverage & States</h3>
                  <Badge variant="navy" size="xs">
                    {formData.states.length} Regions
                  </Badge>
                </div>
                <p className="text-xs text-text-secondary">
                  States where ColourPlus operates, assigned to channel partners and used for lead region filtering.
                </p>
              </div>
            </div>

            {/* ADD STATE INPUT BAR */}
            <div className="bg-surface-subtle p-3.5 rounded-2xl border border-border-subtle flex flex-col sm:flex-row gap-2.5">
              <div className="relative flex-1">
                <MapPin className="w-4 h-4 text-text-tertiary absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Enter state name (e.g. Rajasthan, Odisha, Punjab, West Bengal)..."
                  value={newStateInput}
                  onChange={(e) => setNewStateInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddState();
                    }
                  }}
                  className="w-full pl-10 pr-3.5 py-2.5 bg-surface border border-border-base rounded-xl text-xs text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-rose-500 transition shadow-2xs"
                />
              </div>
              <Button
                type="button"
                variant="brand"
                size="sm"
                onClick={handleAddState}
                disabled={!newStateInput.trim()}
                leftIcon={<Plus className="w-3.5 h-3.5" />}
                className="shrink-0 bg-rose-600 hover:bg-rose-700 text-white rounded-xl px-5"
              >
                Add Territory State
              </Button>
            </div>

            {/* STATES CHIPS GRID */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5">
              {formData.states.map((st) => (
                <motion.div
                  key={st}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="group flex items-center justify-between gap-2 p-3 bg-surface hover:bg-surface-subtle border border-border-base hover:border-rose-500/40 rounded-xl text-xs transition-all shadow-2xs"
                >
                  <div className="flex items-center gap-1.5 min-w-0">
                    <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                    <span className="font-semibold text-text-primary truncate" title={st}>
                      {st}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDeleteState(st)}
                    title={`Remove "${st}" from coverage`}
                    className="opacity-70 group-hover:opacity-100 p-1 rounded-lg text-text-tertiary hover:text-funnel-hot hover:bg-funnel-hot/10 transition shrink-0"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </motion.div>
              ))}
            </div>
          </Card>
        )}

        {/* ============================================================== */}
        {/* CARD C: FACILITY SECTORS MANAGEMENT */}
        {/* ============================================================== */}
        {activeTab === 'sectors' && (
          <Card elevation={1} className="p-6 space-y-5 border border-border-subtle">
            <div className="flex items-center space-x-3 border-b border-border-subtle pb-4">
              <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0">
                <Factory className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-text-primary tracking-tight">Facility Sectors & Verticals</h3>
                  <Badge variant="warm" size="xs">
                    {formData.facility_sectors.length} Sectors
                  </Badge>
                </div>
                <p className="text-xs text-text-secondary">
                  Flooring application categories (Cleanrooms, Heavy Industry, Commercial, etc.) available in lead filter dropdowns.
                </p>
              </div>
            </div>

            {/* ADD SECTOR INPUT BAR */}
            <div className="bg-surface-subtle p-3.5 rounded-2xl border border-border-subtle flex flex-col sm:flex-row gap-2.5">
              <div className="relative flex-1">
                <Factory className="w-4 h-4 text-text-tertiary absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Enter facility sector (e.g. Semiconductor Cleanrooms, Aerospace Hangars, Data Centers)..."
                  value={newSectorInput}
                  onChange={(e) => setNewSectorInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddSector();
                    }
                  }}
                  className="w-full pl-10 pr-3.5 py-2.5 bg-surface border border-border-base rounded-xl text-xs text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-amber-500 transition shadow-2xs"
                />
              </div>
              <Button
                type="button"
                variant="brand"
                size="sm"
                onClick={handleAddSector}
                disabled={!newSectorInput.trim()}
                leftIcon={<Plus className="w-3.5 h-3.5" />}
                className="shrink-0 bg-amber-600 hover:bg-amber-700 text-white rounded-xl px-5"
              >
                Add Sector
              </Button>
            </div>

            {/* SECTORS CHIPS GRID */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5">
              {formData.facility_sectors.map((sec) => (
                <motion.div
                  key={sec}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="group flex items-center justify-between gap-2 p-3 bg-surface hover:bg-surface-subtle border border-border-base hover:border-amber-500/40 rounded-xl text-xs transition-all shadow-2xs"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <Factory className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                    <span className="font-semibold text-text-primary truncate" title={sec}>
                      {sec}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDeleteSector(sec)}
                    title={`Remove "${sec}" from facility sectors`}
                    className="opacity-70 group-hover:opacity-100 p-1 rounded-lg text-text-tertiary hover:text-funnel-hot hover:bg-funnel-hot/10 transition shrink-0"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </motion.div>
              ))}
            </div>
          </Card>
        )}

        {/* ============================================================== */}
        {/* CARD D: AI FUNNEL SCORING THRESHOLDS */}
        {/* ============================================================== */}
        {activeTab === 'scoring' && (
          <Card elevation={1} className="p-6 space-y-5 border border-border-subtle">
            <div className="flex items-center space-x-2.5 border-b border-border-subtle pb-3">
              <Sliders className="w-5 h-5 text-funnel-hot" />
              <div>
                <h3 className="text-base font-bold text-text-primary tracking-tight">Lead Funnel Scoring Thresholds</h3>
                <p className="text-xs text-text-secondary">Tune the minimum cut-off scores for automated qualification funnels.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4.5 text-xs">
              {/* HOT THRESHOLD */}
              <div className="bg-surface-subtle p-4 rounded-2xl border border-funnel-hotBorder/50 space-y-2.5">
                <label className="font-bold text-funnel-hot block text-xs flex items-center justify-between">
                  <span>HOT Lead Minimum Score</span>
                  <span className="font-mono font-black text-sm">{formData.scoring_thresholds.hot_min}</span>
                </label>
                <input
                  type="range"
                  min={70}
                  max={95}
                  value={formData.scoring_thresholds.hot_min}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      scoring_thresholds: {
                        ...formData.scoring_thresholds,
                        hot_min: Number(e.target.value),
                      },
                    })
                  }
                  className="w-full accent-funnel-hot cursor-pointer"
                />
                <p className="text-[11px] text-text-tertiary leading-relaxed">
                  Leads scoring &ge; {formData.scoring_thresholds.hot_min} are categorized as HOT (immediate site visit recommended).
                </p>
              </div>

              {/* WARM THRESHOLD */}
              <div className="bg-surface-subtle p-4 rounded-2xl border border-funnel-warmBorder/50 space-y-2.5">
                <label className="font-bold text-funnel-warm block text-xs flex items-center justify-between">
                  <span>WARM Lead Minimum Score</span>
                  <span className="font-mono font-black text-sm">{formData.scoring_thresholds.warm_min}</span>
                </label>
                <input
                  type="range"
                  min={40}
                  max={formData.scoring_thresholds.hot_min - 5}
                  value={formData.scoring_thresholds.warm_min}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      scoring_thresholds: {
                        ...formData.scoring_thresholds,
                        warm_min: Number(e.target.value),
                      },
                    })
                  }
                  className="w-full accent-funnel-warm cursor-pointer"
                />
                <p className="text-[11px] text-text-tertiary leading-relaxed">
                  Leads scoring between {formData.scoring_thresholds.warm_min} and {formData.scoring_thresholds.hot_min - 1} are WARM.
                </p>
              </div>

              {/* NURTURE THRESHOLD */}
              <div className="bg-surface-subtle p-4 rounded-2xl border border-funnel-nurtureBorder/50 space-y-2.5">
                <label className="font-bold text-brand-green block text-xs flex items-center justify-between">
                  <span>NURTURE Lead Range</span>
                  <span className="font-mono font-black text-sm">&lt; {formData.scoring_thresholds.warm_min}</span>
                </label>
                <div className="h-6 flex items-center">
                  <div className="w-full bg-border-base/40 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-brand-green h-full rounded-full"
                      style={{ width: `${formData.scoring_thresholds.warm_min}%` }}
                    />
                  </div>
                </div>
                <p className="text-[11px] text-text-tertiary leading-relaxed">
                  Leads scoring below {formData.scoring_thresholds.warm_min} are routed to automated long-term nurturing.
                </p>
              </div>
            </div>
          </Card>
        )}

        {/* SAVE BUTTON FOOTER */}
        <div className="flex items-center justify-between pt-2">
          <div className="text-xs text-text-tertiary flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-brand-navy dark:text-blue-400" />
            <span>Master catalog additions persist across browser refreshes and feed all CRM dropdowns.</span>
          </div>

          <Button
            type="submit"
            variant="brand"
            size="lg"
            leftIcon={<Save className="w-4 h-4" />}
            className="rounded-full px-8 shadow-elevation-2"
          >
            Save All Changes
          </Button>
        </div>

      </form>

      {/* RESET CONFIRMATION MODAL */}
      <AnimatePresence>
        {isResetConfirmOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-surface border border-border-base rounded-2xl p-6 max-w-md w-full shadow-elevation-3 space-y-4"
            >
              <div className="flex items-center gap-3 text-funnel-hot">
                <div className="w-10 h-10 rounded-xl bg-funnel-hot/10 flex items-center justify-center">
                  <RotateCcw className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-text-primary text-base">Reset Master Data?</h3>
                  <p className="text-xs text-text-secondary">This will restore original ColourPlus default products, states, and sectors.</p>
                </div>
              </div>
              <p className="text-xs text-text-tertiary">
                Are you sure you want to revert to factory defaults? Any custom added items will be reset.
              </p>
              <div className="flex items-center justify-end gap-3 pt-2">
                <Button variant="secondary" size="sm" onClick={() => setIsResetConfirmOpen(false)}>
                  Cancel
                </Button>
                <Button variant="danger" size="sm" onClick={handleResetDefaults} leftIcon={<Check className="w-3.5 h-3.5" />}>
                  Confirm Reset
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
