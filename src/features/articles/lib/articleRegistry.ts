export const articleRegistry = [
  {
    order: 1,
    slug: "why-simplicity-wins-in-modern-web-design",
  },
  {
    order: 2,
    slug: "what-makes-a-website-actually-work",
  },
  {
    order: 3,
    slug: "the-role-of-structure-in-digital-products",
  },
  {
    order: 4,
    slug: "when-to-choose-a-website-vs-a-web-application",
  },
  {
    order: 5,
    slug: "performance-isnt-optional-its-foundational",
  },
  {
    order: 6,
    slug: "why-templates-dont-work-for-unique-ideas",
  },
] as const;

export type ArticleSlug = (typeof articleRegistry)[number]["slug"];
