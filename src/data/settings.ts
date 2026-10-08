import { CRMSettings } from '../types/crm';

export const initialSettings: CRMSettings = {
  scoring_thresholds: {
    hot_min: 75,
    warm_min: 50,
    nurture_min: 0,
  },
  supported_languages: ['English', 'Kannada', 'Hindi', 'Kannada/English Mixed'],
  ai_mode: 'auto',
  auto_assign_hot: true,
  unreplied_warning_threshold_hours: 20,
  whatsapp_business_number: '+91 80 4912 3000'
};
