import { cache } from "react";

import {
  policyRegistry,
  type PolicySlug,
} from "@/features/policies/lib/policyRegistry";
import type {
  PolicyDetail,
  PolicyListItem,
  PolicyLocale,
  PolicyRichText,
  PolicyRichTextNode,
} from "@/features/policies/model/types";

const DEFAULT_LOCALE: PolicyLocale = "en";
const SUPPORTED_LOCALES = new Set<PolicyLocale>(["en", "de", "it"]);
const FALLBACK_ORDER = Number.MAX_SAFE_INTEGER;
const policyOrderMap = new Map<string, number>(
  policyRegistry.map((policy) => [policy.slug, policy.order]),
);

type PayloadPolicy = {
  id: number | string;
  slug?: string | null;
  title?: string | null;
  content?: PolicyRichText;
  seo_title?: string | null;
  seo_description?: string | null;
  last_updated?: string | null;
  updatedAt?: string | null;
  createdAt?: string | null;
};

type PayloadCollectionResponse = {
  docs?: PayloadPolicy[];
};

const resolveLocale = (locale?: string): PolicyLocale =>
  SUPPORTED_LOCALES.has(locale as PolicyLocale)
    ? (locale as PolicyLocale)
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

  const url = new URL("/api/policies", cmsBaseUrl);

  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value);
  }

  return url.toString();
};

const extractText = (nodes?: PolicyRichTextNode[]): string =>
  (nodes ?? [])
    .map((node) => {
      if (typeof node.text === "string") {
        return node.text;
      }

      return extractText(node.children);
    })
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();

const buildExcerpt = (content?: PolicyRichText | null) => {
  const previewText = extractText(content?.root?.children);

  if (!previewText) {
    return "";
  }

  if (previewText.length <= 180) {
    return previewText;
  }

  return `${previewText.slice(0, 177).trimEnd()}...`;
};

const mapPolicyToListItem = (
  policy: PayloadPolicy,
  locale: PolicyLocale,
): PolicyListItem | null => {
  const slug = policy.slug?.trim();
  const title = policy.title?.trim();

  if (!slug || !title) {
    return null;
  }

  const excerpt = buildExcerpt(policy.content);

  return {
    id: String(policy.id),
    slug,
    order: policyOrderMap.get(slug) ?? FALLBACK_ORDER,
    locale,
    title,
    excerpt,
    seoTitle: policy.seo_title?.trim() || title,
    seoDescription: policy.seo_description?.trim() || excerpt,
    lastUpdated: policy.last_updated ?? policy.updatedAt ?? policy.createdAt ?? null,
  };
};

const mapPolicyToDetail = (
  policy: PayloadPolicy,
  locale: PolicyLocale,
): PolicyDetail | null => {
  const listItem = mapPolicyToListItem(policy, locale);

  if (!listItem) {
    return null;
  }

  return {
    ...listItem,
    content: policy.content ?? null,
  };
};

const fetchCollection = cache(
  async (url: string): Promise<PayloadCollectionResponse | null> => {
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

export const getPolicies = async ({
  locale = DEFAULT_LOCALE,
}: {
  locale?: string;
} = {}): Promise<PolicyListItem[]> => {
  const resolvedLocale = resolveLocale(locale);
  const url = buildCollectionUrl({
    locale: resolvedLocale,
    "fallback-locale": DEFAULT_LOCALE,
    depth: "2",
    draft: "false",
    trash: "false",
    limit: "100",
  });

  if (!url) {
    return [];
  }

  const payload = await fetchCollection(url);
  const policies =
    payload?.docs
      ?.map((policy) => mapPolicyToListItem(policy, resolvedLocale))
      .filter((policy): policy is PolicyListItem => Boolean(policy)) ?? [];

  return policies.sort((left, right) => left.order - right.order);
};

export const getPolicy = async ({
  slug,
  locale = DEFAULT_LOCALE,
}: {
  slug: string;
  locale?: string;
}): Promise<PolicyDetail | null> => {
  const resolvedLocale = resolveLocale(locale);
  const url = buildCollectionUrl({
    locale: resolvedLocale,
    "fallback-locale": DEFAULT_LOCALE,
    depth: "2",
    draft: "false",
    trash: "false",
    limit: "1",
    "where[slug][equals]": slug,
  });

  if (!url) {
    return null;
  }

  const payload = await fetchCollection(url);
  const policy = payload?.docs?.[0];

  if (!policy) {
    return null;
  }

  return mapPolicyToDetail(policy, resolvedLocale);
};

export const getPolicySlugs = (): PolicySlug[] =>
  policyRegistry.map((policy) => policy.slug);
