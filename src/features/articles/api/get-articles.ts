import fs from "node:fs/promises";
import path from "node:path";

import { cache } from "react";
import matter from "gray-matter";
import { marked } from "marked";

import { articleRegistry, type ArticleSlug } from "@/features/articles/lib/articleRegistry";
import type { ArticleDetail, ArticleListItem, ArticleLocale, ArticleSection } from "@/features/articles/model/types";

const CONTENT_ROOT = path.join(process.cwd(), "src", "features", "articles", "lib");
const DEFAULT_LOCALE: ArticleLocale = "en";
const SUPPORTED_LOCALES = new Set<ArticleLocale>(["en", "de", "it"]);

type ArticleFrontmatter = {
  title: string;
  excerpt: string;
  seoTitle: string;
  seoDescription: string;
  ctaTitle: string;
};

const slugify = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/(^-|-$)/g, "");

const resolveLocale = (locale?: string): ArticleLocale =>
  SUPPORTED_LOCALES.has(locale as ArticleLocale) ? (locale as ArticleLocale) : DEFAULT_LOCALE;

const getArticlePath = (locale: ArticleLocale, slug: ArticleSlug) =>
  path.join(CONTENT_ROOT, locale, `${slug}.md`);

const parseSections = (markdown: string): ArticleSection[] => {
  const tokens = marked.lexer(markdown);
  const sections: Array<{ title: string; body: string[] }> = [];
  let currentSection: { title: string; body: string[] } | null = null;

  for (const token of tokens) {
    if (token.type === "heading" && token.depth === 2) {
      if (currentSection) {
        sections.push(currentSection);
      }

      currentSection = {
        title: token.text,
        body: [],
      };
      continue;
    }

    if (!currentSection) {
      currentSection = {
        title: "Introduction",
        body: [],
      };
    }

    currentSection.body.push(token.raw ?? "");
  }

  if (currentSection) {
    sections.push(currentSection);
  }

  return sections
    .map((section) => ({
      id: slugify(section.title),
      title: section.title,
      html: (marked.parse(section.body.join("").trim()) as string).trim(),
    }))
    .filter((section) => section.title && section.html);
};

const readArticleFile = cache(async (slug: ArticleSlug, locale: ArticleLocale) => {
  const requestedPath = getArticlePath(locale, slug);

  try {
    return await fs.readFile(requestedPath, "utf8");
  } catch {
    if (locale === DEFAULT_LOCALE) {
      throw new Error(`Missing article markdown for slug "${slug}" in locale "${locale}".`);
    }

    return fs.readFile(getArticlePath(DEFAULT_LOCALE, slug), "utf8");
  }
});

const parseArticle = async (
  slug: ArticleSlug,
  locale: ArticleLocale,
  order: number,
): Promise<ArticleDetail> => {
  const rawFile = await readArticleFile(slug, locale);
  const { data, content } = matter(rawFile);
  const frontmatter = data as ArticleFrontmatter;

  return {
    slug,
    order,
    locale,
    title: frontmatter.title,
    excerpt: frontmatter.excerpt,
    seoTitle: frontmatter.seoTitle,
    seoDescription: frontmatter.seoDescription,
    ctaTitle: frontmatter.ctaTitle,
    sections: parseSections(content),
  };
};

export const getArticles = async ({
  locale = DEFAULT_LOCALE,
}: {
  locale?: string;
} = {}): Promise<ArticleListItem[]> => {
  const resolvedLocale = resolveLocale(locale);

  const articles = await Promise.all(
    articleRegistry.map(async (article) => {
      const parsed = await parseArticle(article.slug, resolvedLocale, article.order);
      return {
        slug: parsed.slug,
        order: parsed.order,
        locale: parsed.locale,
        title: parsed.title,
        excerpt: parsed.excerpt,
        seoTitle: parsed.seoTitle,
        seoDescription: parsed.seoDescription,
        ctaTitle: parsed.ctaTitle,
      } satisfies ArticleListItem;
    }),
  );

  return articles.sort((left, right) => left.order - right.order);
};

export const getArticle = async ({
  slug,
  locale = DEFAULT_LOCALE,
}: {
  slug: string;
  locale?: string;
}): Promise<ArticleDetail | null> => {
  const article = articleRegistry.find((item) => item.slug === slug);

  if (!article) {
    return null;
  }

  return parseArticle(article.slug, resolveLocale(locale), article.order);
};

export const getArticleSlugs = () => articleRegistry.map((article) => article.slug);
