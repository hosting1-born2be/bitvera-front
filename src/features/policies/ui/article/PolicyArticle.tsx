'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import type { Children } from '../../model/types';
import { PolicyContent } from '../content/PolicyContent';
import st from './PolicyArticle.module.scss';

function extractHeadingText(node: Children): string {
  return (
    node.children
      ?.map((c) => c.text ?? '')
      .join('')
      .trim() ?? ''
  );
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, '-')
    .replace(/(^-|-$)/g, '');
}

type Section = {
  id: string;
  title: string;
  nodes: Children[];
};

function groupIntoSections(content: Children[]): Section[] {
  const sections: Section[] = [];
  let current: Section | null = null;

  for (const node of content) {
    if (node.type === 'heading' && node.tag === 'h2') {
      const title = extractHeadingText(node);
      const id = slugify(title);
      current = { id, title, nodes: [node] };
      sections.push(current);
    } else if (current) {
      current.nodes.push(node);
    } else {
      if (sections.length === 0) {
        current = { id: 'intro', title: '', nodes: [node] };
        sections.push(current);
      } else {
        current!.nodes.push(node);
      }
    }
  }

  return sections;
}

type PolicyArticleProps = {
  content: Children[];
};

export const PolicyArticle = ({ content }: PolicyArticleProps) => {
  const sections = useMemo(() => groupIntoSections(content), [content]);
  const headings = useMemo(() => sections.filter((s) => s.title), [sections]);

  const [activeId, setActiveId] = useState(headings[0]?.id ?? '');
  const sectionRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  const setSectionRef = useCallback(
    (id: string) => (el: HTMLDivElement | null) => {
      if (el) sectionRefs.current.set(id, el);
      else sectionRefs.current.delete(id);
    },
    []
  );

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

        if (visible.length > 0) {
          const id = visible[0].target.getAttribute('data-section-id');
          if (id) setActiveId(id);
        }
      },
      { rootMargin: '-80px 0px -60% 0px', threshold: 0 }
    );

    sectionRefs.current.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [sections]);

  const scrollTo = (id: string) => {
    const el = sectionRefs.current.get(id);
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 100;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };

  return (
    <div className={st.article}>
      <nav className={st.toc}>
        {headings.map((h) => {
          const isActive = activeId === h.id;
          return (
            <button
              key={h.id}
              type="button"
              className={`${st.toc__item} ${isActive ? st['toc__item--active'] : ''}`}
              onClick={() => scrollTo(h.id)}
            >
              {isActive && (
                <span className={st.toc__icon} aria-hidden="true">
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3.75 9H14.25M14.25 9L10.5 5.25M14.25 9L10.5 12.75" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              )}
              <span className={st.toc__label}>{h.title}</span>
            </button>
          );
        })}
      </nav>

      <div className={st.content}>
        {sections.map((section) => (
          <div
            key={section.id}
            ref={setSectionRef(section.id)}
            data-section-id={section.id}
            className={st.section}
          >
            {section.nodes.map((node, i) => (
              <PolicyContent key={`${section.id}-${i}`} node={node} type={node.type} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};
