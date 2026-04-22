export type PolicyLocale = "en" | "de" | "it";

export type PolicyLinkFields = {
  url?: string;
  newTab?: boolean;
  linkType?: string;
};

export type PolicyRichTextNode = {
  type: string;
  tag?: string;
  text?: string;
  format?: number;
  listType?: "bullet" | "number";
  value?: number;
  children?: PolicyRichTextNode[];
  fields?: PolicyLinkFields;
};

export type PolicyRichText = {
  root?: {
    children?: PolicyRichTextNode[];
  };
} | null;

export type PolicyListItem = {
  id: string;
  slug: string;
  order: number;
  locale: PolicyLocale;
  title: string;
  excerpt: string;
  seoTitle: string;
  seoDescription: string;
  lastUpdated: string | null;
};

export type PolicyDetail = PolicyListItem & {
  content: PolicyRichText;
};

export type PolicyDef = {
  docs: PolicyDetail[];
};

// Legacy aliases kept so the existing policies slice continues to compile.
export type Content = PolicyRichText;
export type Root2 = NonNullable<PolicyRichText>["root"] extends infer Root
  ? Root extends { children?: infer Children }
    ? {
        children?: Children;
      }
    : never
  : never;
export type Children = PolicyRichTextNode;
export type Children2 = PolicyRichTextNode;
export type Children3 = PolicyRichTextNode;
export type Children4 = PolicyRichTextNode;
export type Fields = PolicyLinkFields;
export type Fields2 = PolicyLinkFields;
