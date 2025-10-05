import React from 'react';
import { ExternalLink } from 'lucide-react';

const containerStyle = {
  flex: 1,
  background: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(255,255,255,0.06)',
  borderRadius: '18px',
  padding: '22px',
  boxSizing: 'border-box',
  boxShadow: '0 10px 40px rgba(8,8,12,0.45)',
  maxHeight: '80vh',
  overflowY: 'auto',
};

export default function ArticleWindow({ article }) {
  if (!article) {
    return (
      <div style={containerStyle} aria-live="polite">
        <div style={{ color: '#e6e6e6', fontSize: '1.1rem' }}>Select an article from the left to view it.</div>
        <div style={{ marginTop: 12, color: '#bfbfbf', fontSize: '0.95rem' }}>
          Titles and links are read from the tag data structure.
        </div>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <h2 style={{
        margin: 0,
        fontSize: '1.7rem',
        lineHeight: 1.05,
        background: 'linear-gradient(90deg,#fff,#cba7ff)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        fontWeight: 800
      }}>
        {article.title}
      </h2>

      <div style={{ marginTop: 12, display: 'flex', gap: 12, alignItems: 'center' }}>
        <a
          href={article.url}
          target="_blank"
          rel="noreferrer noopener"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            padding: '8px 12px',
            borderRadius: 12,
            textDecoration: 'none',
            border: '1px solid rgba(124,77,162,0.18)',
            background: 'linear-gradient(180deg, rgba(124,77,162,0.08), rgba(103,58,183,0.03))',
            color: '#f5f0ff',
            fontWeight: 700
          }}
        >
          Open full article <ExternalLink size={14} />
        </a>

        <div style={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.9rem', wordBreak: 'break-all' }}>
          {article.url}
        </div>
      </div>

      <div style={{ marginTop: 18, color: 'rgba(255,255,255,0.86)', fontSize: '0.97rem', lineHeight: 1.6 }}>
        {/* Placeholder region for future abstract/content preview.
            Currently tags.json does not include abstracts, so we display a placeholder.
         */}
        This panel is prepared for a text preview (abstract) or embedded viewer. Your current tag dataset contains title + URL pairs; if you later provide article abstracts (or an API to fetch them), we can fetch and render the abstract here inline.
      </div>
    </div>
  );
}
