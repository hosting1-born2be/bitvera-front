export type PolicyLocale = "en" | "de" | "it";

export type PolicySection = {
  id: string;
  title: string;
  html: string;
};

export type PolicyListItem = {
  slug: string;
  order: number;
  locale: PolicyLocale;
  title: string;
  excerpt: string;
  seoTitle: string;
  seoDescription: string;
  ctaTitle: string;
};

export type PolicyDetail = PolicyListItem & {
  sections: PolicySection[];
};

export type PolicyDef = {
  docs: Root2[];
};

export type Content = {
  root: Root2;
};

export type Root2 = {
  type: string;
  title: string;
  format: string;
  indent: number;
  version: number;
  content: { root: { children: Children[] } };
  direction: string;
};

export type Children = {
  type: string;
  format: string;
  indent: number;
  version: number;
  children: Children2[];
  direction: string;
  textStyle?: string;
  textFormat?: number;
  tag?: string;
  start?: number;
  listType?: string;
};

export type Children2 = {
  mode?: string;
  text?: string;
  type: string;
  style?: string;
  detail?: number;
  format: number;
  version: number;
  id?: string;
  fields?: Fields;
  indent?: number;
  children?: Children3[];
  direction?: string;
  value?: number;
  textFormat?: number;
};

export type Fields = {
  url: string;
  newTab: boolean;
  linkType: string;
};

export type Children3 = {
  mode?: string;
  text?: string;
  type: string;
  style?: string;
  detail?: number;
  format: number;
  version: number;
  id?: string;
  fields?: Fields2;
  indent?: number;
  children?: Children4[];
  direction?: string;
};

export type Fields2 = {
  url: string;
  newTab: boolean;
  linkType: string;
};

export type Children4 = {
  mode: string;
  text: string;
  type: string;
  style: string;
  detail: number;
  format: number;
  version: number;
};
