import { Fragment, type ReactNode } from "react";

import type { ArticleRichText, ArticleRichTextNode } from "@/features/articles/model/types";

type ArticleSection = {
  id: string;
  title: string;
  nodes: ArticleRichTextNode[];
};

const slugify = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/(^-|-$)/g, "");

const extractText = (nodes?: ArticleRichTextNode[]): string =>
  (nodes ?? [])
    .map((node) => {
      if (node.text) {
        return node.text;
      }

      return extractText(node.children);
    })
    .join("")
    .trim();

const isBold = (format?: number) => Boolean(format && (format & 1) === 1);

const renderInlineNode = (node: ArticleRichTextNode, key: string): ReactNode => {
  if (node.type === "linebreak") {
    return <br key={key} />;
  }

  if (node.type === "link" || node.type === "autolink") {
    return (
      <a
        key={key}
        href={node.fields?.url || "#"}
        target={node.fields?.newTab ? "_blank" : undefined}
        rel={node.fields?.newTab ? "noreferrer noopener" : undefined}
      >
        {renderInlineNodes(node.children)}
      </a>
    );
  }

  if (typeof node.text === "string") {
    const content = node.text === "" ? "\u00A0" : node.text;
    return isBold(node.format) ? <strong key={key}>{content}</strong> : <Fragment key={key}>{content}</Fragment>;
  }

  return <Fragment key={key}>{renderInlineNodes(node.children)}</Fragment>;
};

const renderInlineNodes = (nodes?: ArticleRichTextNode[]) =>
  (nodes ?? []).map((node, index) => renderInlineNode(node, `${node.type}-${index}`));

const renderBlockNode = (node: ArticleRichTextNode, key: string): ReactNode => {
  if (node.type === "paragraph") {
    return <p key={key}>{renderInlineNodes(node.children)}</p>;
  }

  if (node.type === "list") {
    const ListTag = node.listType === "number" ? "ol" : "ul";

    return (
      <ListTag key={key}>
        {(node.children ?? []).map((child, index) => (
          <li key={`${key}-item-${index}`}>{renderInlineNodes(child.children)}</li>
        ))}
      </ListTag>
    );
  }

  if (node.type === "quote") {
    return <blockquote key={key}>{renderInlineNodes(node.children)}</blockquote>;
  }

  if (node.type === "heading") {
    const HeadingTag = node.tag === "h3" ? "h3" : node.tag === "h4" ? "h4" : "h2";
    return <HeadingTag key={key}>{renderInlineNodes(node.children)}</HeadingTag>;
  }

  return <Fragment key={key}>{renderInlineNodes(node.children)}</Fragment>;
};

export const groupArticleSections = (content: ArticleRichText): ArticleSection[] => {
  const nodes = content?.root?.children ?? [];
  const sections: ArticleSection[] = [];
  let currentSection: ArticleSection | null = null;

  for (const node of nodes) {
    if (node.type === "heading" && node.tag === "h2") {
      const title = extractText(node.children);
      currentSection = {
        id: slugify(title || `section-${sections.length + 1}`),
        title,
        nodes: [],
      };
      sections.push(currentSection);
      continue;
    }

    if (!currentSection) {
      currentSection = {
        id: `section-${sections.length + 1}`,
        title: "",
        nodes: [],
      };
      sections.push(currentSection);
    }

    currentSection.nodes.push(node);
  }

  return sections.filter((section) => section.nodes.length > 0);
};

export const ArticleRichTextBlocks = ({ content }: { content: ArticleRichText }) => (
  <>
    {(content?.root?.children ?? []).map((node, index) =>
      renderBlockNode(node, `${node.type}-${index}`),
    )}
  </>
);
