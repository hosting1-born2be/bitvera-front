import { cache } from "react";

import {
  articleRegistry,
  articleRegistryMap,
} from "@/features/articles/lib/articleRegistry";
import type {
  ArticleDetail,
  ArticleImage,
  ArticleListItem,
  ArticleLocale,
  ArticleRichText,
} from "@/features/articles/model/types";

const DEFAULT_LOCALE: ArticleLocale = "en";
const SUPPORTED_LOCALES = new Set<ArticleLocale>(["en", "de", "it"]);

type PayloadMedia = {
  alt?: string | null;
  url?: string | null;
};

type PayloadPost = {
  id: number | string;
  slug?: string | null;
  title?: string | null;
  excerpt?: string | null;
  info?: ArticleRichText;
  content?: ArticleRichText;
  seo_title?: string | null;
  seo_description?: string | null;
  image?: number | PayloadMedia | null;
  createdAt?: string;
};

type PayloadCollectionResponse = {
  docs?: PayloadPost[];
};

const resolveLocale = (locale?: string): ArticleLocale =>
  SUPPORTED_LOCALES.has(locale as ArticleLocale)
    ? (locale as ArticleLocale)
    : DEFAULT_LOCALE;

const resolveCMSBaseUrl = () =>
  (
    process.env.SERVER_URL ??
    process.env.NEXT_PUBLIC_SERVER_URL ??
    ""
  ).replace(/\/$/, "");

const buildCollectionUrl = (params: Record<string, string>) => {
  const cmsBaseUrl = resolveCMSBaseUrl();

  if (!cmsBaseUrl) {
    return null;
  }

  const url = new URL("/api/posts", cmsBaseUrl);

  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value);
  }

  return url.toString();
};

const resolveMediaUrl = (url?: string | null) => {
  if (!url) {
    return null;
  }

  if (/^https?:\/\//i.test(url)) {
    return url;
  }

  const cmsBaseUrl = resolveCMSBaseUrl();
  return cmsBaseUrl ? `${cmsBaseUrl}${url}` : null;
};

const normalizeImage = (image?: number | PayloadMedia | null): ArticleImage => {
  if (!image || typeof image === "number") {
    return null;
  }

  const normalizedUrl = resolveMediaUrl(image.url);

  if (!normalizedUrl) {
    return null;
  }

  return {
    url: normalizedUrl,
    alt: image.alt?.trim() || "Bitvera article image",
  };
};

const mapPostToListItem = (
  post: PayloadPost,
  locale: ArticleLocale,
): ArticleListItem | null => {
  const slug = post.slug?.trim();

  if (!slug || !post.title?.trim()) {
    return null;
  }

  const registryEntry = articleRegistryMap.get(slug);

  return {
    id: String(post.id),
    slug,
    order: registryEntry?.order ?? Number.MAX_SAFE_INTEGER,
    locale,
    title: post.title.trim(),
    excerpt: post.excerpt?.trim() || "",
    seoTitle: post.seo_title?.trim() || post.title.trim(),
    seoDescription: post.seo_description?.trim() || post.excerpt?.trim() || "",
    image: normalizeImage(post.image),
  };
};

const mapPostToDetail = (
  post: PayloadPost,
  locale: ArticleLocale,
): ArticleDetail | null => {
  const listItem = mapPostToListItem(post, locale);

  if (!listItem) {
    return null;
  }

  return {
    ...listItem,
    info: post.info ?? null,
    content: post.content ?? null,
  };
};

const fetchCollection = cache(
  async (params: Record<string, string>): Promise<PayloadCollectionResponse | null> => {
    const url = buildCollectionUrl(params);

    if (!url) {
      return null;
    }

    try {
      const response = await fetch(url, {
        headers: {
          Accept: "application/json",
        },
        next: {
          revalidate: 300,
        },
      });

      if (!response.ok) {
        return null;
      }

      return (await response.json()) as PayloadCollectionResponse;
    } catch {
      return null;
    }
  },
);

export const getArticles = async ({
  locale = DEFAULT_LOCALE,
}: {
  locale?: string;
} = {}): Promise<ArticleListItem[]> => {
  const resolvedLocale = resolveLocale(locale);
  const payload = await fetchCollection({
    locale: resolvedLocale,
    "fallback-locale": DEFAULT_LOCALE,
    depth: "1",
    limit: "24",
  });

  const articles =
    payload?.docs
      ?.map((post) => mapPostToListItem(post, resolvedLocale))
      .filter((post): post is ArticleListItem => Boolean(post)) ?? [];

  return articles.sort((left, right) => left.order - right.order);
};

export const getArticle = async ({
  slug,
  locale = DEFAULT_LOCALE,
}: {
  slug: string;
  locale?: string;
}): Promise<ArticleDetail | null> => {
  const payload = await fetchCollection({
    locale: resolveLocale(locale),
    "fallback-locale": DEFAULT_LOCALE,
    depth: "1",
    limit: "1",
    "where[slug][equals]": slug,
  });

  const article = payload?.docs?.[0];

  if (!article) {
    return null;
  }

  return mapPostToDetail(article, resolveLocale(locale));
};

export const getArticleSlugs = () => articleRegistry.map((article) => article.slug);
