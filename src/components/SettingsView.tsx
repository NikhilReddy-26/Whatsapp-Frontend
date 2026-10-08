import React, { useState } from 'react';
import { Settings as SettingsIcon, Save, Sliders, Shield, Bot, CheckCircle2 } from 'lucide-react';
import { CRMSettings } from '../types/crm';

interface SettingsViewProps {
  settings: CRMSettings;
  onSaveSettings: (settings: CRMSettings) => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ settings, onSaveSettings }) => {
  const [formData, setFormData] = useState<CRMSettings>({ ...settings });
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveSettings(formData);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="max-w-[1200px] mx-auto p-4 sm:p-6 space-y-6">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-brand-panel border border-brand-border rounded-[18px] p-5">
        <div>
          <div className="flex items-center space-x-2 text-purple-400 font-bold text-xs uppercase tracking-wider mb-1">
            <SettingsIcon className="w-4 h-4" />
            <span>AI Qualification & CRM Configuration</span>
          </div>
          <h2 className="text-2xl font-black text-brand-text">ColourPlus Engine Settings</h2>
          <p className="text-xs text-brand-muted mt-1">
            Configure lead scoring funnel thresholds, supported multilingual engines, and automated sales assignments.
          </p>
        </div>

        {savedSuccess && (
          <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 bg-emerald-500/20 px-4 py-2 rounded-full border border-emerald-500/30">
            <CheckCircle2 className="w-4 h-4" /> Settings Saved!
          </span>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* 1. SCORING THRESHOLDS CARD */}
        <div className="bg-brand-panel border border-brand-border rounded-[18px] p-5 space-y-4">
          <div className="flex items-center space-x-2 border-b border-brand-border pb-3">
            <Sliders className="w-5 h-5 text-cp-red" />
            <h3 className="text-base font-bold text-brand-text">Lead Funnel Scoring Thresholds</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            {/* HOT THRESHOLD */}
            <div className="bg-brand-body p-4 rounded-xl border border-funnel-hotBorder space-y-2">
              <label className="font-bold text-cp-red block">HOT Lead Minimum Score</label>
              <div className="flex items-center space-x-2">
                <input
                  type="number"
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
                  className="w-full bg-[#101823] border border-brand-border rounded-lg px-3 py-2 text-sm text-white font-bold focus:outline-none focus:border-cp-red"
                  required
                />
                <span className="text-brand-muted font-bold">/ 100</span>
              </div>
              <p className="text-[11px] text-brand-muted">
                Leads scoring &ge; {formData.scoring_thresholds.hot_min} are categorized as HOT (Immediate site visit recommended).
              </p>
            </div>

            {/* WARM THRESHOLD */}
            <div className="bg-brand-body p-4 rounded-xl border border-funnel-warmBorder space-y-2">
              <label className="font-bold text-amber-400 block">WARM Lead Minimum Score</label>
              <div className="flex items-center space-x-2">
                <input
                  type="number"
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
                  className="w-full bg-[#101823] border border-brand-border rounded-lg px-3 py-2 text-sm text-white font-bold focus:outline-none focus:border-amber-400"
                  required
                />
                <span className="text-brand-muted font-bold">/ 100</span>
              </div>
              <p className="text-[11px] text-brand-muted">
                Leads scoring between {formData.scoring_thresholds.warm_min} and {formData.scoring_thresholds.hot_min - 1} are WARM.
              </p>
            </div>

            {/* NURTURE THRESHOLD */}
            <div className="bg-brand-body p-4 rounded-xl border border-funnel-nurtureBorder space-y-2">
              <label className="font-bold text-emerald-400 block">NURTURE Lead Range</label>
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  disabled
                  value={0}
                  className="w-full bg-[#101823] border border-brand-border rounded-lg px-3 py-2 text-sm text-brand-muted font-bold opacity-60"
                />
                <span className="text-brand-muted font-bold">to {formData.scoring_thresholds.warm_min - 1}</span>
              </div>
              <p className="text-[11px] text-brand-muted">
                Leads scoring below {formData.scoring_thresholds.warm_min} are routed to automated long-term nurturing.
              </p>
            </div>
          </div>
        </div>



        {/* SAVE BUTTON */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="bg-cp-navy hover:bg-cp-navyHover text-white px-8 py-3 rounded-full text-sm font-bold shadow-md hover:scale-[1.01] transition flex items-center space-x-2"
          >
            <Save className="w-4 h-4" />
            <span>Save Configuration</span>
          </button>
        </div>

      </form>
    </div>
  );
};
