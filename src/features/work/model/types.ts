export type WorkFeatureDefinition = {
  key: string;
  fallback: string;
};

export type WorkCaseStudyDefinition = {
  slug: string;
  titleKey: string;
  titleFallback: string;
  overviewKey: string;
  overviewFallback: string;
  challengeKey: string;
  challengeFallback: string;
  solutionKey: string;
  solutionFallback: string;
  featureItems: readonly WorkFeatureDefinition[];
};

export type WorkCaseStudyCardContent = {
  slug: string;
  title: string;
  overviewLabel: string;
  overview: string;
  challengeLabel: string;
  challenge: string;
  solutionLabel: string;
  solution: string;
  featuresLabel: string;
  featureItems: readonly string[];
};
