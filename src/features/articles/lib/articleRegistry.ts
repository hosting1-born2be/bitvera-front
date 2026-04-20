export const articleRegistry = [
  {
    order: 1,
    slug: "answering-key-questions-about-crypto-transactions-with-bitvera",
    heroDesktopImage: "/images/blog/bitvera/article-hero-1-desktop.png",
    heroMobileImage: "/images/blog/bitvera/article-hero-1-mobile.png",
  },
  {
    order: 2,
    slug: "why-kyc-matters-in-crypto-transactions-bitvera-approach",
    heroDesktopImage: "/images/blog/bitvera/article-hero-2-desktop.png",
    heroMobileImage: "/images/blog/bitvera/article-hero-1-mobile.png",
  },
  {
    order: 3,
    slug: "crypto-security-10-practical-guidelines-for-bitvera-users",
    heroDesktopImage: "/images/blog/bitvera/article-hero-3-desktop.png",
    heroMobileImage: "/images/blog/bitvera/article-hero-1-mobile.png",
  },
  {
    order: 4,
    slug: "central-bank-digital-currencies-what-they-mean-for-crypto",
    heroDesktopImage: "/images/blog/bitvera/article-hero-1-desktop.png",
    heroMobileImage: "/images/blog/bitvera/article-hero-1-mobile.png",
  },
  {
    order: 5,
    slug: "introduction-to-layer-2-a-new-dynamic-for-crypto-transactions-bitvera-explains",
    heroDesktopImage: "/images/blog/bitvera/article-hero-2-desktop.png",
    heroMobileImage: "/images/blog/bitvera/article-hero-1-mobile.png",
  },
  {
    order: 6,
    slug: "before-buying-bitcoin-how-crypto-and-traditional-finance-work-together",
    heroDesktopImage: "/images/blog/bitvera/article-hero-3-desktop.png",
    heroMobileImage: "/images/blog/bitvera/article-hero-1-mobile.png",
  },
] as const;

export type ArticleSlug = (typeof articleRegistry)[number]["slug"];

export const articleRegistryMap = new Map<string, (typeof articleRegistry)[number]>(
  articleRegistry.map((article) => [article.slug, article]),
);

export const getArticleRegistryEntry = (slug: string) =>
  articleRegistryMap.get(slug);
