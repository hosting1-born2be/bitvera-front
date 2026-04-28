export const policyRegistry = [
  {
    order: 1,
    slug: "terms-and-conditions",
  },
  {
    order: 2,
    slug: "terms-of-service",
  },
  {
    order: 3,
    slug: "privacy-policy",
  },
  {
    order: 4,
    slug: "risk-disclosure",
  },
  {
    order: 5,
    slug: "cookie-policy",
  },
  {
    order: 6,
    slug: "refund-policy",
  },
  {
    order: 7,
    slug: "aml-and-kyc-policy",
  },
] as const;

export type PolicySlug = (typeof policyRegistry)[number]["slug"];
