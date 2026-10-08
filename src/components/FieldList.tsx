import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import type { ExtractedField } from '../types/crm';

interface FieldListProps {
  fields: ExtractedField[];
  onAddField: (key: string, value: string) => void;
}

export const FieldList: React.FC<FieldListProps> = ({ fields, onAddField }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newKey, setNewKey] = useState('');
  const [newVal, setNewVal] = useState('');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKey.trim() || !newVal.trim()) return;
    onAddField(newKey.trim(), newVal.trim());
    setNewKey('');
    setNewVal('');
    setIsAdding(false);
  };

  return (
    <div className="space-y-3 pt-2 border-t border-[#1f2d3f]">
      <div className="flex items-center justify-between">
        <h4 className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-400">
          CAPTURED BY THE CONVERSATION
        </h4>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="text-[11px] font-semibold text-blue-400 hover:underline flex items-center gap-1"
        >
          <Plus className="w-3.5 h-3.5" /> Add Field
        </button>
      </div>

      {isAdding && (
        <form onSubmit={handleCreate} className="bg-[#0a1018] p-3 rounded-xl border border-[#1f2d3f] space-y-2 text-xs">
          <input
            type="text"
            placeholder="Field Key (e.g. Oil exposure)"
            value={newKey}
            onChange={(e) => setNewKey(e.target.value)}
            className="w-full bg-[#101823] border border-[#1f2d3f] rounded px-3 py-1.5 text-white placeholder-slate-500 focus:outline-none focus:border-[#0f3f8a]"
          />
          <input
            type="text"
            placeholder="Field Value (e.g. Yes)"
            value={newVal}
            onChange={(e) => setNewVal(e.target.value)}
            className="w-full bg-[#101823] border border-[#1f2d3f] rounded px-3 py-1.5 text-white placeholder-slate-500 focus:outline-none focus:border-[#0f3f8a]"
          />
          <div className="flex justify-end space-x-2 pt-1">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="px-3 py-1 rounded text-slate-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-3 py-1 rounded bg-[#0f3f8a] text-white font-semibold"
            >
              Save Field
            </button>
          </div>
        </form>
      )}

      {/* CLEAN ROWS MATCHING REFERENCE IMAGE */}
      <div className="divide-y divide-[#1f2d3f]/60 text-xs">
        {fields.map((f, i) => {
          const isLowConf = f.confidence < 0.8;

          return (
            <div key={i} className="py-2.5 flex items-center justify-between gap-4">
              <span className="text-slate-400 font-medium text-xs truncate max-w-[140px]">
                {f.key}
              </span>

              <div className="flex items-center space-x-2 text-right">
                <span className="font-bold text-white text-xs sm:text-sm">
                  {f.value}
                </span>

                <span
                  className={`font-mono text-[11px] font-semibold ${
                    isLowConf ? 'text-amber-400' : 'text-emerald-400'
                  }`}
                >
                  {f.confidence.toFixed(2)}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
