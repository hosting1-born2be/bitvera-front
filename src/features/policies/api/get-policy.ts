import fs from "node:fs/promises";
import path from "node:path";

import { cache } from "react";
import matter from "gray-matter";
import { marked } from "marked";

import {
  policyRegistry,
  type PolicySlug,
} from "@/features/policies/lib/policyRegistry";
import type {
  PolicyDetail,
  PolicyListItem,
  PolicyLocale,
  PolicySection,
} from "@/features/policies/model/types";

const CONTENT_ROOT = path.join(process.cwd(), "src", "features", "policies", "lib");
const DEFAULT_LOCALE: PolicyLocale = "en";
const SUPPORTED_LOCALES = new Set<PolicyLocale>(["en", "de", "it"]);

type PolicyFrontmatter = {
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

const resolveLocale = (locale?: string): PolicyLocale =>
  SUPPORTED_LOCALES.has(locale as PolicyLocale) ? (locale as PolicyLocale) : DEFAULT_LOCALE;

const getPolicyPath = (locale: PolicyLocale, slug: PolicySlug) =>
  path.join(CONTENT_ROOT, locale, `${slug}.md`);

const parseSections = (markdown: string): PolicySection[] => {
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

const readPolicyFile = cache(async (slug: PolicySlug, locale: PolicyLocale) => {
  const requestedPath = getPolicyPath(locale, slug);

  try {
    return await fs.readFile(requestedPath, "utf8");
  } catch {
    if (locale === DEFAULT_LOCALE) {
      throw new Error(`Missing policy markdown for slug "${slug}" in locale "${locale}".`);
    }

    return fs.readFile(getPolicyPath(DEFAULT_LOCALE, slug), "utf8");
  }
});

const parsePolicy = async (
  slug: PolicySlug,
  locale: PolicyLocale,
  order: number,
): Promise<PolicyDetail> => {
  const rawFile = await readPolicyFile(slug, locale);
  const { data, content } = matter(rawFile);
  const frontmatter = data as PolicyFrontmatter;

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

export const getPolicies = async ({
  locale = DEFAULT_LOCALE,
}: {
  locale?: string;
} = {}): Promise<PolicyListItem[]> => {
  const resolvedLocale = resolveLocale(locale);

  const policies = await Promise.all(
    policyRegistry.map(async (policy) => {
      const parsed = await parsePolicy(policy.slug, resolvedLocale, policy.order);

      return {
        slug: parsed.slug,
        order: parsed.order,
        locale: parsed.locale,
        title: parsed.title,
        excerpt: parsed.excerpt,
        seoTitle: parsed.seoTitle,
        seoDescription: parsed.seoDescription,
        ctaTitle: parsed.ctaTitle,
      } satisfies PolicyListItem;
    }),
  );

  return policies.sort((left, right) => left.order - right.order);
};

export const getPolicy = async ({
  slug,
  locale = DEFAULT_LOCALE,
}: {
  slug: string;
  locale?: string;
}): Promise<PolicyDetail | null> => {
  const policy = policyRegistry.find((item) => item.slug === slug);

  if (!policy) {
    return null;
  }

  return parsePolicy(policy.slug, resolveLocale(locale), policy.order);
};

export const getPolicySlugs = () => policyRegistry.map((policy) => policy.slug);
