export const policyRegistry = [
  {
    order: 1,
    slug: "terms-and-conditions",
  },
  {
    order: 2,
    slug: "privacy-policy",
  },
  {
    order: 3,
    slug: "cookie-policy",
  },
  {
    order: 4,
    slug: "refund-policy",
  },
] as const;

export type PolicySlug = (typeof policyRegistry)[number]["slug"];
