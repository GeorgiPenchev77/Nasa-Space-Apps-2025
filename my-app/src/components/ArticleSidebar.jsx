import React from 'react';

const containerStyle = {
  width: '320px',
  maxWidth: '32%',
  minWidth: '210px',
  background: 'rgba(255,255,255,0.06)',
  border: '1px solid rgba(255,255,255,0.08)',
  backdropFilter: 'blur(6px)',
  borderRadius: '18px',
  padding: '16px',
  boxSizing: 'border-box',
  boxShadow: '0 8px 30px rgba(10,10,20,0.35)',
  overflowY: 'auto',
  maxHeight: '76vh'
};

const headerStyle = {
  color: 'white',
  fontSize: '1.1rem',
  marginBottom: '12px',
  fontWeight: 700
};

const itemStyleBase = {
  padding: '10px 12px',
  borderRadius: '12px',
  cursor: 'pointer',
  userSelect: 'none',
  transition: 'all 160ms ease',
  marginBottom: '8px',
  display: 'block',
  textDecoration: 'none',
};

export default function ArticleSidebar({ tagName, articles, selectedId, onSelect }) {
  return (
    <aside style={containerStyle} aria-label="Article list">
      <div style={headerStyle}>
        Articles for <span style={{ color: '#cbb7ff' }}>{tagName || '—'}</span>
      </div>

      {articles.length === 0 ? (
        <div style={{ color: '#d6d6d6' }}>No articles found.</div>
      ) : (
        <div>
          {articles.map((a) => {
            const isSelected = selectedId === a.id;
            const itemStyle = {
              ...itemStyleBase,
              background: isSelected ? 'linear-gradient(90deg, rgba(103,58,183,0.16), rgba(124,77,162,0.08))' : 'transparent',
              color: isSelected ? '#fff' : '#e8e8e8',
              border: isSelected ? '1px solid rgba(124,77,162,0.22)' : '1px solid transparent',
            };

            return (
              <div
                key={a.id}
                role="button"
                tabIndex={0}
                onClick={() => onSelect(a.id)}
                onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onSelect(a.id)}
                style={itemStyle}
                title={a.title}
              >
                <div style={{ fontSize: '0.96rem', fontWeight: 600, lineHeight: 1.2 }}>
                  {a.title}
                </div>
                <div style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.6)', marginTop: 6, wordBreak: 'break-word' }}>
                  {a.url}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </aside>
  );
}
