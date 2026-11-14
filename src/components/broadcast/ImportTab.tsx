import React, { useRef, useState } from 'react';
import { UploadCloud, FileSpreadsheet, CheckCircle2, Megaphone } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { useToast } from '../../context/ToastContext';
import { broadcastApi } from '../../services/broadcastApi';
import { errorMessage } from '../../utils/errorMessage';
import type { AudienceSeed, ImportConfirmResult, ImportPreview } from '../../types/broadcast';

interface ImportTabProps {
  onBroadcastToImport: (seed: AudienceSeed) => void;
}

const ACCEPTED = ['.xlsx', '.csv'];

const outcomeVariant = (outcome: string) =>
  outcome === 'valid' ? 'green' : outcome === 'invalid' ? 'hot' : 'warm';

export const ImportTab: React.FC<ImportTabProps> = ({ onBroadcastToImport }) => {
  const { toast } = useToast();
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [preview, setPreview] = useState<ImportPreview | null>(null);
  const [result, setResult] = useState<ImportConfirmResult | null>(null);

  const handleFile = async (file: File) => {
    if (!ACCEPTED.some((ext) => file.name.toLowerCase().endsWith(ext))) {
      toast({ title: 'Unsupported file', message: 'Upload an .xlsx or .csv file.', type: 'warning' });
      return;
    }
    setUploading(true);
    setPreview(null);
    setResult(null);
    try {
      setPreview(await broadcastApi.uploadLeadsFile(file));
    } catch (e) {
      toast({ title: 'Upload failed', message: errorMessage(e), type: 'error', duration: 6000 });
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  const confirm = async () => {
    if (!preview) return;
    setConfirming(true);
    try {
      const res = await broadcastApi.confirmImport(preview.import_id);
      setResult(res);
      toast({ title: 'Import confirmed', message: res.message, type: 'success' });
    } catch (e) {
      toast({ title: 'Could not confirm import', message: errorMessage(e), type: 'error', duration: 6000 });
    } finally {
      setConfirming(false);
    }
  };

  const reset = () => {
    setPreview(null);
    setResult(null);
  };

  return (
    <div className="space-y-6">
      <Card
        className={`p-8 border-2 border-dashed text-center transition ${dragging ? 'border-brand-navy bg-brand-navy/5' : 'border-border-base'}`}
        onDragOver={(e: React.DragEvent) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e: React.DragEvent) => {
          e.preventDefault();
          setDragging(false);
          const file = e.dataTransfer.files?.[0];
          if (file) void handleFile(file);
        }}
      >
        <UploadCloud className="w-10 h-10 mx-auto text-brand-navy mb-3" />
        <p className="text-sm font-semibold text-text-primary">Drop an Excel or CSV file of leads here</p>
        <p className="text-xs text-text-secondary mt-1">
          Phone columns (Phone, Mobile, WhatsApp, Contact…) are detected automatically; numbers are normalised to E.164 (+91 default).
        </p>
        <input
          ref={inputRef}
          type="file"
          accept=".xlsx,.csv"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) void handleFile(file);
          }}
        />
        <Button className="mt-4" variant="secondary" isLoading={uploading} onClick={() => inputRef.current?.click()}>
          Choose file
        </Button>
      </Card>

      {preview && (
        <Card className="p-5 space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <FileSpreadsheet className="w-6 h-6 text-emerald-500" />
            <div className="min-w-0">
              <div className="text-sm font-bold text-text-primary truncate">{preview.filename}</div>
              <div className="text-xs text-text-tertiary">Validation preview. Nothing is saved until you confirm.</div>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              ['Total rows', preview.total_rows],
              ['Valid', preview.valid_rows],
              ['Invalid', preview.invalid_rows],
              ['Duplicates', preview.duplicate_rows],
            ].map(([label, value]) => (
              <div key={label as string} className="rounded-xl border border-border-subtle bg-surface-subtle p-3">
                <div className="text-xs text-text-tertiary">{label}</div>
                <div className="text-xl font-bold text-text-primary">{value}</div>
              </div>
            ))}
          </div>

          <div className="overflow-x-auto rounded-xl border border-border-subtle">
            <table className="w-full text-xs">
              <thead className="bg-surface-subtle text-text-secondary">
                <tr>
                  <th className="text-left p-2">Row</th>
                  <th className="text-left p-2">Phone</th>
                  <th className="text-left p-2">Name</th>
                  <th className="text-left p-2">Outcome</th>
                  <th className="text-left p-2">Reason</th>
                </tr>
              </thead>
              <tbody>
                {preview.preview_sample.map((row) => (
                  <tr key={row.row_number} className="border-t border-border-subtle">
                    <td className="p-2">{row.row_number}</td>
                    <td className="p-2">{String(row.raw_data.phone_e164 ?? row.raw_data.phone_raw ?? '—')}</td>
                    <td className="p-2">{String(row.raw_data.full_name ?? '—')}</td>
                    <td className="p-2"><Badge size="xs" variant={outcomeVariant(row.outcome)}>{row.outcome}</Badge></td>
                    <td className="p-2 text-text-secondary">{row.error_reason ?? ''}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {preview.total_rows > preview.preview_sample.length && (
            <p className="text-xs text-text-tertiary">Showing the first {preview.preview_sample.length} of {preview.total_rows} rows.</p>
          )}

          {result ? (
            <div className="flex flex-wrap items-center gap-3 rounded-xl bg-brand-green/10 border border-brand-green/30 p-3">
              <CheckCircle2 className="w-5 h-5 text-brand-green" />
              <span className="text-sm text-text-primary flex-1">
                {result.inserted_leads} added, {result.updated_leads} updated.
              </span>
              <Button
                size="sm"
                variant="success"
                leftIcon={<Megaphone className="w-4 h-4" />}
                onClick={() => onBroadcastToImport({ kind: 'import', importId: preview.import_id, label: preview.filename })}
              >
                Broadcast to this import
              </Button>
              <Button size="sm" variant="ghost" onClick={reset}>Import another</Button>
            </div>
          ) : (
            <div className="flex gap-2 justify-end">
              <Button variant="ghost" onClick={reset}>Discard</Button>
              <Button variant="brand" isLoading={confirming} disabled={preview.valid_rows === 0} onClick={confirm}>
                Confirm import ({preview.valid_rows} valid)
              </Button>
            </div>
          )}
        </Card>
      )}
    </div>
  );
};
