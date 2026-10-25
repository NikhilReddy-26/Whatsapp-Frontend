import { ProductType } from '../types/crm';

export interface ProductCatalogItem {
  id: string;
  name: ProductType;
  recommended_applications: string;
  brand: string;
  tag: string;
}

export const COLOURPLUS_PRODUCT_CATALOG: Record<ProductType, ProductCatalogItem> = {
  'Epoxy Floor Coating': {
    id: 'prod-01',
    name: 'Epoxy Floor Coating',
    recommended_applications: 'Warehouses, Manufacturing Plants, Printing Units, Commercial Garages',
    brand: 'ColourPlus',
    tag: 'Industrial Base',
  },
  'Epoxy Self-Leveling – Matt Finish': {
    id: 'prod-02',
    name: 'Epoxy Self-Leveling – Matt Finish',
    recommended_applications: 'Pharma Plants, Cleanrooms, Hospitals, Semiconductor Manufacturing, R&D Centers, Server Rooms',
    brand: 'ColourPlus',
    tag: 'Pharma & Cleanroom',
  },
  'Anti-Skid Coating Flooring': {
    id: 'prod-03',
    name: 'Anti-Skid Coating Flooring',
    recommended_applications: 'Ramps, Sloped Walkways, Parking Lots, Swimming Pool Decks, Food Industry Floors',
    brand: 'ColourPlus',
    tag: 'Safety & Ramps',
  },
  'ESD Coating Flooring': {
    id: 'prod-04',
    name: 'ESD Coating Flooring',
    recommended_applications: 'Semiconductor Plants, PCB Units, Mobile Robotics Assembly, High-Precision Manufacturing',
    brand: 'ColourPlus',
    tag: 'Electronics & ESD',
  },
  'Epoxy Matt Finish Flooring': {
    id: 'prod-05',
    name: 'Epoxy Matt Finish Flooring',
    recommended_applications: 'Showrooms, Retail Stores, Offices, Commercial Spaces, Cafeterias, Banks',
    brand: 'ColourPlus',
    tag: 'Commercial & Retail',
  },
  'High-Build Epoxy Mortar': {
    id: 'prod-06',
    name: 'High-Build Epoxy Mortar',
    recommended_applications: 'Heavy Engineering, Machine Foundations, Press Areas, Repair Bays, CNC Zones',
    brand: 'ColourPlus',
    tag: 'Heavy Duty Mortar',
  },
  'Epoxy Polyurethane (EPU) Coating': {
    id: 'prod-07',
    name: 'Epoxy Polyurethane (EPU) Coating',
    recommended_applications: 'Chemical Warehouses, Pharma Processing, Automobile Workshops, Textile Units, Repacking Zones',
    brand: 'ColourPlus',
    tag: 'Chemical & Auto',
  },
  'Polyurethane Coating': {
    id: 'prod-08',
    name: 'Polyurethane Coating',
    recommended_applications: 'Outdoor Yards, Fertilizer Plants, Mining Bays, Bulk Storage Warehouses',
    brand: 'ColourPlus',
    tag: 'Outdoor & Weather',
  },
  'Dielectric Insulation Flooring': {
    id: 'prod-09',
    name: 'Dielectric Insulation Flooring',
    recommended_applications: 'Electrical Substations, Transformer Yards, Control Rooms, Testing Labs, Server Rooms, Emergency Power Rooms',
    brand: 'ColourPlus',
    tag: 'Electrical Safety',
  },
  'Polycrete Flooring': {
    id: 'prod-10',
    name: 'Polycrete Flooring',
    recommended_applications: 'Breweries, Commercial Kitchens, Butchery, Food Processing, Pharmaceutical Cold Rooms',
    brand: 'ColourPlus',
    tag: 'Thermal Shock & Food',
  },
  'Wall Coating': {
    id: 'prod-11',
    name: 'Wall Coating',
    recommended_applications: 'Hospitals, Pharma Cleanrooms, Cosmetics Labs, Commercial Kitchens, Sterile Zones, Beverage Bottling Plants',
    brand: 'ColourPlus',
    tag: 'Hygienic Wall',
  },
  'Waterproofing': {
    id: 'prod-12',
    name: 'Waterproofing',
    recommended_applications: 'Rooftops, Basements, Lift Pits, Sunken Toilets, Balconies, External Walls',
    brand: 'ColourPlus',
    tag: 'Water & Seepage',
  },
  'Anti-Corrosive Coating': {
    id: 'prod-13',
    name: 'Anti-Corrosive Coating',
    recommended_applications: 'Coastal Facilities, Refineries, Pipelines, Oil & Gas Yards, Cooling Towers, Fertilizer Plants',
    brand: 'ColourPlus',
    tag: 'Corrosion Shield',
  },
  'Cementitious Underlay': {
    id: 'prod-14',
    name: 'Cementitious Underlay',
    recommended_applications: 'Uneven Subfloors, Renovation Projects, Leveling Large Areas, Base for Epoxy/PVC/Vinyl Flooring',
    brand: 'ColourPlus',
    tag: 'Subfloor Leveling',
  },
  'Coving': {
    id: 'prod-15',
    name: 'Coving',
    recommended_applications: 'Food Plants, Pharma Units, Hospitals, Dairies, Cleanroom Corners, High Washdown Zones',
    brand: 'ColourPlus',
    tag: 'Seamless Hygiene',
  },
  'Marking (Yellow / White)': {
    id: 'prod-16',
    name: 'Marking (Yellow / White)',
    recommended_applications: 'Warehouses, Assembly Lines, Safety Path Walkways, Equipment Movement Zones, Hazard Indicators',
    brand: 'ColourPlus',
    tag: 'Safety Lines & Zebra',
  },
};
