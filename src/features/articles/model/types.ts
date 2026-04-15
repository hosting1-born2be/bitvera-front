export type ArticleLocale = "en" | "de" | "it";

export type ArticleSection = {
  id: string;
  title: string;
  html: string;
};

export type ArticleListItem = {
  slug: string;
  order: number;
  locale: ArticleLocale;
  title: string;
  excerpt: string;
  seoTitle: string;
  seoDescription: string;
  ctaTitle: string;
};

export type ArticleDetail = ArticleListItem & {
  sections: ArticleSection[];
};
