export type ArticleLocale = "en" | "de" | "it";

export type ArticleRichTextNode = {
  type: string;
  tag?: string;
  text?: string;
  format?: number;
  listType?: "bullet" | "number";
  children?: ArticleRichTextNode[];
  fields?: {
    url?: string;
    newTab?: boolean;
    linkType?: string;
  };
};

export type ArticleRichText = {
  root?: {
    children?: ArticleRichTextNode[];
  };
} | null;

export type ArticleImage = {
  url: string;
  alt: string;
} | null;

export type ArticleListItem = {
  id: string;
  slug: string;
  order: number;
  locale: ArticleLocale;
  title: string;
  excerpt: string;
  seoTitle: string;
  seoDescription: string;
  image: ArticleImage;
};

export type ArticleDetail = ArticleListItem & {
  info: ArticleRichText;
  content: ArticleRichText;
};
