import React from 'react';
import { motion } from 'motion/react';
import { Calendar, MapPin, User, Clock, CheckCircle2, Plus, XCircle, ClipboardList } from 'lucide-react';
import { Appointment } from '../types/crm';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';
import { AnimatedText } from './ui/AnimatedText';
import { perspectiveCardIn, staggerContainer } from '../lib/motion';

interface AppointmentsViewProps {
  appointments: Appointment[];
  onOpenConfirmVisit: () => void;
  onCompleteVisit?: (id: string) => Promise<void>;
  onCancelVisit?: (id: string) => Promise<void>;
}

export const AppointmentsView: React.FC<AppointmentsViewProps> = ({
  appointments,
  onOpenConfirmVisit,
  onCompleteVisit,
  onCancelVisit,
}) => {
  const [busyId, setBusyId] = React.useState<string | null>(null);

  const runAction = async (id: string, action?: (id: string) => Promise<void>) => {
    if (!action) return;
    setBusyId(id);
    try {
      await action(id);
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* HEADER */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-surface border border-border-subtle rounded-card p-6 shadow-elevation-1 transition-colors"
      >
        <div>
          <div className="flex items-center space-x-2 text-brand-green font-bold text-xs uppercase tracking-wider mb-1 font-mono">
            <Calendar className="w-4 h-4" />
            <span>Field Technical Audits & Schedule</span>
          </div>
          <AnimatedText
            text="Site Visit Appointments"
            as="h2"
            className="text-2xl font-black text-text-primary tracking-tight"
          />
          <p className="text-xs text-text-secondary mt-1 max-w-2xl">
            Confirmed application engineer site inspections, concrete substrate moisture (%) testing, and technical floor audits.
          </p>
        </div>

        <Button
          variant="brand"
          size="sm"
          onClick={onOpenConfirmVisit}
          leftIcon={<Plus className="w-4 h-4" />}
          className="rounded-full self-start sm:self-auto"
        >
          Schedule Site Visit
        </Button>
      </motion.div>

      {/* APPOINTMENTS CARDS GRID */}
      <motion.div
        variants={staggerContainer(0.06)}
        initial="initial"
        animate="animate"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4.5 sm:gap-5"
      >
        {appointments.map((app) => (
          <motion.div key={app.id} variants={perspectiveCardIn}>
            <Card
              elevation={1}
              interactive
              className="p-5 sm:p-6 space-y-4 flex flex-col justify-between h-full"
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <Badge variant="green" size="xs" icon={<CheckCircle2 className="w-3 h-3" />}>
                    {app.status.toUpperCase()}
                  </Badge>
                  <span className="text-xs font-mono text-text-tertiary flex items-center gap-1.5 font-semibold">
                    <Clock className="w-3.5 h-3.5 text-text-tertiary" /> {app.time}
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-bold text-text-primary tracking-tight">{app.lead_name}</h3>
                  <p className="text-xs text-text-secondary font-medium">{app.company}</p>
                </div>
              </div>

              <div className="space-y-2.5 text-xs pt-3 border-t border-border-subtle">
                <div className="flex items-start space-x-2 text-text-secondary">
                  <MapPin className="w-4 h-4 text-rose-500 flex-shrink-0 mt-0.5" />
                  <span className="leading-snug">{app.location}</span>
                </div>

                <div className="flex items-center space-x-2 text-text-secondary">
                  <User className="w-4 h-4 text-brand-navy dark:text-blue-400 flex-shrink-0" />
                  <span>Engineer: <strong className="text-text-primary">{app.engineer}</strong></span>
                </div>

                {app.inspection_objectives && (
                  <div className="flex items-start space-x-2 text-text-secondary">
                    <ClipboardList className="w-4 h-4 text-brand-green flex-shrink-0 mt-0.5" />
                    <span className="leading-snug">{app.inspection_objectives}</span>
                  </div>
                )}

                {app.notes && (
                  <div className="bg-surface-subtle p-3 rounded-xl border border-border-subtle text-text-secondary text-[11px] leading-relaxed shadow-2xs italic">
                    "{app.notes}"
                  </div>
                )}
              </div>

              <div className="pt-3 flex items-center justify-between text-xs text-text-tertiary font-semibold border-t border-border-subtle">
                <span className="font-mono">Date: {app.date}</span>
                <span className="text-brand-navy dark:text-blue-400 font-bold">Confirmed Audit</span>
              </div>

              {app.status === 'scheduled' && (onCompleteVisit || onCancelVisit) && (
                <div className="flex items-center justify-end gap-2">
                  {onCancelVisit && (
                    <Button
                      variant="ghost"
                      size="sm"
                      disabled={busyId === app.id}
                      onClick={() => runAction(app.id, onCancelVisit)}
                      leftIcon={<XCircle className="w-4 h-4" />}
                    >
                      Cancel Visit
                    </Button>
                  )}
                  {onCompleteVisit && (
                    <Button
                      variant="success"
                      size="sm"
                      disabled={busyId === app.id}
                      onClick={() => runAction(app.id, onCompleteVisit)}
                      leftIcon={<CheckCircle2 className="w-4 h-4" />}
                    >
                      Mark Completed
                    </Button>
                  )}
                </div>
              )}
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};
