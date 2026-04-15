export type ServiceItemDefinition = {
  key: string;
  fallback: string;
};

export type ServiceDefinition = {
  slug: string;
  order: string;
  titleKey: string;
  titleFallback: string;
  descriptionKey: string;
  descriptionFallback: string;
  includedItems: readonly ServiceItemDefinition[];
};

export type ServiceCardContent = {
  slug: string;
  order: string;
  title: string;
  description: string;
  includedLabel: string;
  includedItems: readonly string[];
  ctaLabel: string;
};

export type EngagementPlanDefinition = {
  slug: string;
  order: string;
  titleKey: string;
  titleFallback: string;
  descriptionKey: string;
  descriptionFallback: string;
  priceKey: string;
  priceFallback: string;
  ctaKey: string;
  ctaFallback: string;
  includedItems: readonly ServiceItemDefinition[];
};

export type EngagementPlanCardContent = {
  slug: string;
  order: string;
  title: string;
  description: string;
  price: string;
  includedLabel: string;
  includedItems: readonly string[];
  ctaLabel: string;
};
