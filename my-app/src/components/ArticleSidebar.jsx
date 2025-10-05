import React from 'react';

const containerStyle = {
  width: '320px',
  maxWidth: '32%',
  minWidth: '210px',
  background: 'rgba(30, 20, 50, 0.92)',
  border: '1px solid rgba(255,255,255,0.12)',
  backdropFilter: 'blur(8px)',
  borderRadius: '18px',
  padding: '20px',
  boxSizing: 'border-box',
  boxShadow: '0 8px 30px rgba(0,0,0,0.5)',
  overflowY: 'auto',
  maxHeight: '85vh'
};

const headerStyle = {
  color: 'white',
  fontSize: '1.1rem',
  marginBottom: '16px',
  fontWeight: 700
};

const itemStyleBase = {
  padding: '12px 14px',
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
              background: isSelected ? 'rgba(124, 77, 162, 0.35)' : 'rgba(255,255,255,0.05)',
              color: isSelected ? '#fff' : '#e8e8e8',
              border: isSelected ? '1px solid rgba(181, 142, 255, 0.4)' : '1px solid rgba(255,255,255,0.08)',
            };

            return (
              <div
                key={a.id}
                role="button"
                tabIndex={0}
                onClick={() => onSelect(a.id)}
                onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onSelect(a.id)}
                onMouseEnter={(e) => {
                  if (!isSelected) {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.12)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isSelected) {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                  }
                }}
                style={itemStyle}
                title={a.title}
              >
                <div style={{ fontSize: '0.96rem', fontWeight: 600, lineHeight: 1.3 }}>
                  {a.title}
                </div>
                <div style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.55)', marginTop: 6, wordBreak: 'break-word' }}>
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