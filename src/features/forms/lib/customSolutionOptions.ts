export const customSolutionProjectTypeOptions = [
  'website',
  'webApplication',
  'ecommerce',
  'landingPage',
  'redesign',
  'performanceImprovements',
  'ongoingSupport',
  'other',
] as const;

export const customSolutionBudgetOptions = [
  'under1000',
  'budget1000To2500',
  'budget2500To5000',
  'budget5000Plus',
] as const;

export const customSolutionTimelineOptions = [
  'asSoonAsPossible',
  'withinOneToTwoMonths',
  'withinTwoToFourMonths',
  'flexible',
] as const;

export const customSolutionCommunicationOptions = ['email', 'phone', 'videoCall'] as const;

export type CustomSolutionProjectType = (typeof customSolutionProjectTypeOptions)[number];
export type CustomSolutionBudget = (typeof customSolutionBudgetOptions)[number];
export type CustomSolutionTimeline = (typeof customSolutionTimelineOptions)[number];
export type CustomSolutionCommunication =
  (typeof customSolutionCommunicationOptions)[number];
