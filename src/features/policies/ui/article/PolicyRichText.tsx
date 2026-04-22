import { Fragment, type ReactNode } from "react";

import type {
  PolicyRichText,
  PolicyRichTextNode,
} from "@/features/policies/model/types";

export type PolicySection = {
  id: string;
  title: string;
  titleTag?: "h2" | "h3";
  nodes: PolicyRichTextNode[];
};

const slugify = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/(^-|-$)/g, "");

const extractText = (nodes?: PolicyRichTextNode[]): string =>
  (nodes ?? [])
    .map((node) => {
      if (typeof node.text === "string") {
        return node.text;
      }

      return extractText(node.children);
    })
    .join("")
    .trim();

const hasVisibleContent = (node?: PolicyRichTextNode): boolean => {
  if (!node) {
    return false;
  }

  if (node.type === "linebreak") {
    return false;
  }

  if (typeof node.text === "string" && node.text.trim() !== "") {
    return true;
  }

  return (node.children ?? []).some((child) => hasVisibleContent(child));
};

const hasVisibleChildren = (nodes?: PolicyRichTextNode[]) =>
  (nodes ?? []).some((node) => hasVisibleContent(node));

const isBold = (format?: number) => Boolean(format && (format & 1) === 1);

const renderInlineNode = (node: PolicyRichTextNode, key: string): ReactNode => {
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
    return isBold(node.format) ? (
      <strong key={key}>{content}</strong>
    ) : (
      <Fragment key={key}>{content}</Fragment>
    );
  }

  return <Fragment key={key}>{renderInlineNodes(node.children)}</Fragment>;
};

const renderInlineNodes = (nodes?: PolicyRichTextNode[]) =>
  (nodes ?? []).map((node, index) => renderInlineNode(node, `${node.type}-${index}`));

const renderBlockNode = (node: PolicyRichTextNode, key: string): ReactNode => {
  if (node.type === "paragraph") {
    if (!hasVisibleChildren(node.children)) {
      return null;
    }

    return <p key={key}>{renderInlineNodes(node.children)}</p>;
  }

  if (node.type === "list") {
    const visibleItems = (node.children ?? []).filter((child) =>
      hasVisibleChildren(child.children),
    );

    if (!visibleItems.length) {
      return null;
    }

    const ListTag = node.listType === "number" ? "ol" : "ul";

    return (
      <ListTag key={key}>
        {visibleItems.map((child, index) => (
          <li key={`${key}-item-${index}`}>{renderInlineNodes(child.children)}</li>
        ))}
      </ListTag>
    );
  }

  if (node.type === "quote") {
    if (!hasVisibleChildren(node.children)) {
      return null;
    }

    return <blockquote key={key}>{renderInlineNodes(node.children)}</blockquote>;
  }

  if (node.type === "heading") {
    if (!hasVisibleChildren(node.children)) {
      return null;
    }

    const HeadingTag =
      node.tag === "h4" ? "h4" : node.tag === "h3" ? "h3" : "h2";

    return <HeadingTag key={key}>{renderInlineNodes(node.children)}</HeadingTag>;
  }

  if (!hasVisibleChildren(node.children)) {
    return null;
  }

  return <Fragment key={key}>{renderInlineNodes(node.children)}</Fragment>;
};

export const groupPolicySections = (content: PolicyRichText): PolicySection[] => {
  const nodes = content?.root?.children ?? [];
  const sections: PolicySection[] = [];
  let currentSection: PolicySection | null = null;

  for (const node of nodes) {
    if (
      node.type === "heading" &&
      (node.tag === "h2" || node.tag === "h3")
    ) {
      const title = extractText(node.children);
      currentSection = {
        id: slugify(title || `section-${sections.length + 1}`),
        title,
        titleTag: node.tag,
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

  return sections.filter((section) => section.title || section.nodes.length > 0);
};

export const PolicyRichTextBlocks = ({ content }: { content: PolicyRichText }) => (
  <>
    {(content?.root?.children ?? []).map((node, index) =>
      renderBlockNode(node, `${node.type}-${index}`),
    )}
  </>
);
