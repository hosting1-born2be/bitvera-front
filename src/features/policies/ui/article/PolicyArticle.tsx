"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import type { PolicyRichText } from "@/features/policies/model/types";

import styles from "./PolicyArticle.module.scss";
import { groupPolicySections,PolicyRichTextBlocks } from "./PolicyRichText";

type PolicyArticleLabels = {
  tableOfContents: string;
};

type PolicyArticleProps = {
  content: PolicyRichText;
  labels: PolicyArticleLabels;
};

export const PolicyArticle = ({ content, labels }: PolicyArticleProps) => {
  const sections = useMemo(() => groupPolicySections(content), [content]);
  const tocSections = useMemo(() => {
    const headingSections = sections.filter((section) => section.title);

    if (headingSections.length) {
      return headingSections;
    }

    return [
      {
        id: "policy",
        title: "Policy",
        titleTag: "h2" as const,
        nodes: [],
      },
    ];
  }, [sections]);
  const [activeId, setActiveId] = useState(tocSections[0]?.id ?? "");
  const sectionRefs = useRef(new Map<string, HTMLElement>());

  useEffect(() => {
    if (!tocSections.length) {
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntries = entries
          .filter((entry) => entry.isIntersecting)
          .sort((left, right) => left.boundingClientRect.top - right.boundingClientRect.top);

        if (visibleEntries[0]) {
          setActiveId(visibleEntries[0].target.id);
        }
      },
      {
        rootMargin: "-120px 0px -55% 0px",
        threshold: 0,
      },
    );

    for (const section of tocSections) {
      const fallbackElement =
        section.id === "policy" ? sectionRefs.current.get("policy-root") : null;
      const element = sectionRefs.current.get(section.id) ?? fallbackElement;

      if (element) {
        observer.observe(element);
      }
    }

    return () => observer.disconnect();
  }, [tocSections]);

  const handleScrollTo = (id: string) => {
    const fallbackElement =
      id === "policy" ? sectionRefs.current.get("policy-root") : null;
    const element = sectionRefs.current.get(id) ?? fallbackElement;

    if (!element) {
      return;
    }

    const top = element.getBoundingClientRect().top + window.scrollY - 110;
    window.scrollTo({ top, behavior: "smooth" });
  };

  return (
    <div className={styles.article}>
      {tocSections.length ? (
        <nav className={styles.toc} aria-label={labels.tableOfContents}>
          {tocSections.map((section) => {
            const isActive = section.id === activeId;

            return (
              <button
                key={section.id}
                type="button"
                className={`${styles.tocItem} ${
                  section.titleTag === "h3" ? styles.tocItemSub : ""
                } ${isActive ? styles.tocItemActive : ""}`}
                onClick={() => handleScrollTo(section.id)}
                aria-current={isActive ? "true" : undefined}
              >
                <span className={styles.tocLabel}>{section.title}</span>
              </button>
            );
          })}
        </nav>
      ) : null}

      <div
        className={styles.contentRail}
        ref={(element) => {
          if (element) {
            sectionRefs.current.set("policy-root", element);
            return;
          }

          sectionRefs.current.delete("policy-root");
        }}
      >
        {sections.map((section) => (
          <section
            key={section.id}
            id={section.title ? section.id : undefined}
            ref={(element) => {
              if (section.title && element) {
                sectionRefs.current.set(section.id, element);
                return;
              }

              if (section.title) {
                sectionRefs.current.delete(section.id);
              }
            }}
            className={styles.section}
          >
            {section.title ? (
              <h2
                className={
                  section.titleTag === "h2"
                    ? `${styles.sectionTitle} ${styles.sectionTitleMain}`
                    : `${styles.sectionTitle} ${styles.sectionTitleSub}`
                }
              >
                {section.title}
              </h2>
            ) : null}
            <div className={styles.sectionContent}>
              <PolicyRichTextBlocks content={{ root: { children: section.nodes } }} />
            </div>
          </section>
        ))}
      </div>
    </div>
  );
};
