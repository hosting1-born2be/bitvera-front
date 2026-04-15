import type { Children } from '../../model/types';
import { PolicyContent } from '../content/PolicyContent';

export const PolicyRenderer = ({ content }: { content: Children[] }) => (
  <>
    {!Array.isArray(content) ? null : (
      <>
        {content.map((node, i) => (
          <PolicyContent key={String(`node-${i}`)} node={node} type={node.type} />
        ))}
      </>
    )}
  </>
);
