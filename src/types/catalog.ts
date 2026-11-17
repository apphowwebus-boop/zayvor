export type ProductCategory =
  | 'all'
  | 'gis'
  | 'rash-guards'
  | 'no-gi-shorts'
  | 'spats';

export type GenderDivision = 'Women' | 'Men' | 'Unisex';

export interface ProductionTier {
  range: string;
  leadTime: string;
}

export interface ProductItem {
  id: string;
  sku: string;
  name: string;
  category: Exclude<ProductCategory, 'all'>;
  categoryLabel: string;
  division: GenderDivision;
  colorway: string;
  colorHex: string;
  fabricSpec: string;
  gsm: string;
  moq: number;
  image: string;
  imageAlt: string;
  description: string;
  sizes: string[];
  customizationMethods: string[];
  productionTiers: ProductionTier[];
  badge?: string;
}

export interface HeroSlide {
  id: string;
  divisionLabel: string;
  headline: string;
  subheadline: string;
  image: string;
  imageAlt: string;
  primaryCtaLabel: string;
  primaryCategory: ProductCategory;
  secondaryCtaLabel: string;
}

export interface QuoteBagItem {
  key: string;
  product: ProductItem;
  size: string;
  customization: string;
  quantity: number;
}

export interface CustomizationCapability {
  id: string;
  title: string;
  detail: string;
}

export interface ManufacturingStep {
  step: string;
  title: string;
  detail: string;
}
