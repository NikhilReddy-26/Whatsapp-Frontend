import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Check, Sparkles } from 'lucide-react';
import type { ExtractedField } from '../types/crm';
import { Button } from './ui/Button';

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
    <div className="space-y-3 pt-3 border-t border-border-subtle">
      <div className="flex items-center justify-between">
        <h4 className="text-[11px] font-mono font-bold uppercase tracking-wider text-text-tertiary flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-brand-green" />
          <span>Extracted Technical Fields ({fields.length})</span>
        </h4>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="text-xs font-bold text-brand-navy dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Field</span>
        </button>
      </div>

      <AnimatePresence>
        {isAdding && (
          <motion.form
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            onSubmit={handleCreate}
            className="bg-surface-subtle p-3.5 rounded-xl border border-border-base space-y-2.5 text-xs overflow-hidden"
          >
            <input
              type="text"
              placeholder="Field Key (e.g. Concrete Grade)"
              value={newKey}
              onChange={(e) => setNewKey(e.target.value)}
              className="w-full bg-surface border border-border-base rounded-lg px-3 py-2 text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-brand-navy"
            />
            <input
              type="text"
              placeholder="Field Value (e.g. M30 Tremix Slab)"
              value={newVal}
              onChange={(e) => setNewVal(e.target.value)}
              className="w-full bg-surface border border-border-base rounded-lg px-3 py-2 text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-brand-navy"
            />
            <div className="flex justify-end space-x-2 pt-1">
              <Button
                variant="ghost"
                size="xs"
                onClick={() => setIsAdding(false)}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                size="xs"
                type="submit"
              >
                Save Field
              </Button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      {/* FIELD ROWS WITH STAGGERED REVEAL & DRAW-ON CHECK */}
      <div className="divide-y divide-border-subtle text-xs">
        {fields.map((f, i) => {
          const rawConf = f.confidence;
          const hasConfidence = typeof rawConf === 'number' && !isNaN(rawConf);
          const normalizedConf = hasConfidence ? (rawConf > 1 ? rawConf / 100 : rawConf) : null;
          const isHighConf = normalizedConf !== null ? normalizedConf >= 0.9 : true;
          const percentDisplay = normalizedConf !== null ? `${Math.round(normalizedConf * 100)}%` : null;

          return (
            <motion.div
              key={f.key + i}
              initial={{ opacity: 0, x: -8, rotateX: -15 }}
              animate={{ opacity: 1, x: 0, rotateX: 0 }}
              transition={{ delay: i * 0.035, type: 'spring', stiffness: 360, damping: 25 }}
              style={{ transformPerspective: 800 }}
              className="py-2.5 flex items-center justify-between gap-4 group"
            >
              <div className="flex items-center space-x-2 min-w-0">
                <div
                  className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 ${
                    isHighConf ? 'bg-emerald-500/15 text-emerald-500' : 'bg-blue-500/15 text-blue-400'
                  }`}
                >
                  <Check className="w-2.5 h-2.5 stroke-[3]" />
                </div>
                <span className="text-text-secondary font-medium text-xs truncate max-w-[150px]">
                  {f.key}
                </span>
              </div>

              <div className="flex items-center space-x-2 text-right">
                <span className="font-bold text-text-primary text-xs sm:text-sm">
                  {f.value}
                </span>

                {percentDisplay && (
                  <span
                    className={`font-mono text-[10px] px-1.5 py-0.5 rounded font-bold ${
                      isHighConf
                        ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                        : 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                    }`}
                    title={`AI Confidence: ${percentDisplay}`}
                  >
                    {percentDisplay}
                  </span>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
