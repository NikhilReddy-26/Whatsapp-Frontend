import { CRMSettings, COLOURPLUS_PRODUCTS } from '../types/crm';
import { TERRITORY_STATES } from './territories';

export const initialSettings: CRMSettings = {
  scoring_thresholds: {
    hot_min: 75,
    warm_min: 50,
    nurture_min: 0,
  },
  supported_languages: ['English', 'Kannada', 'Hindi', 'Marathi', 'Gujarati', 'Tamil', 'Telugu'],
  ai_mode: 'auto',
  auto_assign_hot: true,
  unreplied_warning_threshold_hours: 20,
  products: [...COLOURPLUS_PRODUCTS],
  states: [...TERRITORY_STATES],
  facility_sectors: [
    'Factory & Industrial',
    'Pharma & Cleanroom',
    'Warehouse & Logistics',
    'Commercial & Terrace',
    'Cold Storage & Food',
    'Household & Residential',
    'Automobile & Garages',
    'Other / General',
  ],
};

