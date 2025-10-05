import React, { useEffect, useState } from 'react';
import { useRouter } from '../utils/router';
import apiClient from '../utils/apiClient';
import { ArrowLeft } from 'lucide-react';
import ArticleSidebar from '../components/ArticleSidebar';
import ArticleWindow from '../components/ArticleWindow';

const wrapperStyle = {
  minHeight: '100vh',
  padding: '40px 20px 80px 20px',
  color: 'white',
  background: 'my-app\src\assets\background.jpg',
  fontFamily: 'Inter, system-ui, sans-serif'
};

export default function ArticleViewerPage({ params = {} }) {
  const { currentPath, goBack } = useRouter();
  const guessedTag = params.tag
    ? decodeURIComponent(params.tag)
    : decodeURIComponent((currentPath || '').split('/').pop() || '');

  const [tagName, setTagName] = useState(guessedTag || '');
  const [articles, setArticles] = useState([]);
  const [selectedArticleId, setSelectedArticleId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => setTagName(guessedTag), [currentPath, params?.tag]);

  useEffect(() => {
    if (tagName) loadArticles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tagName]);

  const loadArticles = async () => {
    setLoading(true);
    setError(null);
    try {
      const tagsData = await apiClient.articles.getTags();
      const raw = tagsData[tagName];

      if (!raw || !Array.isArray(raw) || raw.length === 0) {
        setArticles([]);
        setSelectedArticleId(null);
        setLoading(false);
        return;
      }

      const parsed = [];
      for (let i = 0, id = 0; i < raw.length; i += 2, id++) {
        parsed.push({ id, title: raw[i], url: raw[i + 1] });
      }

      setArticles(parsed);
      setSelectedArticleId(parsed.length ? parsed[0].id : null);
    } catch (err) {
      console.error('Error loading tags/articles', err);
      setError('Unable to load articles for this tag.');
    } finally {
      setLoading(false);
    }
  };

  const selectedArticle = articles.find((a) => a.id === selectedArticleId) || null;

  return (
    <div className="space-background" style={wrapperStyle}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Back button */}
        <button
          onClick={goBack}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            padding: '8px 16px',
            borderRadius: 999,
            border: '1px solid rgba(255,255,255,0.1)',
            background: 'rgba(255,255,255,0.08)',
            color: '#fff',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            marginBottom: '40px'
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.15)')}
          onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.08)')}
        >
          <ArrowLeft size={16} /> Back
        </button>

        {/* Centered header */}
        <div
          style={{
            textAlign: 'center',
            marginBottom: '40px'
          }}
        >
          <h1
            style={{
              margin: 0,
              fontSize: '2.5rem',
              fontWeight: 800,
              background: 'linear-gradient(90deg,#fff,#b58eff)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            {tagName}
          </h1>
          <p style={{ color: '#d9d9d9', fontSize: '1.05rem', marginTop: 10 }}>
            {loading
              ? 'Loading...'
              : `${articles.length} ${articles.length === 1 ? 'article' : 'articles'} found`}
          </p>
        </div>

        {/* Main content */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 20,
            justifyContent: 'center'
          }}
        >
          {loading ? (
            <div
              style={{
                color: 'rgba(255,255,255,0.9)',
                background: 'rgba(255,255,255,0.05)',
                padding: 30,
                borderRadius: 16,
                minWidth: '300px'
              }}
            >
              Loading articles...
            </div>
          ) : error ? (
            <div
              style={{
                color: '#ffd6d6',
                background: 'rgba(255,0,0,0.08)',
                border: '1px solid rgba(255,0,0,0.15)',
                padding: 20,
                borderRadius: 16,
                textAlign: 'center'
              }}
            >
              <strong>Error:</strong> {error}
              <button
                onClick={loadArticles}
                style={{
                  marginTop: 12,
                  padding: '8px 16px',
                  borderRadius: 8,
                  border: 'none',
                  background: 'linear-gradient(90deg,#6c5ce7,#a29bfe)',
                  color: '#fff',
                  cursor: 'pointer'
                }}
              >
                Retry
              </button>
            </div>
          ) : (
            <>
              <ArticleSidebar
                tagName={tagName}
                articles={articles}
                selectedId={selectedArticleId}
                onSelect={(id) => setSelectedArticleId(id)}
              />
              <ArticleWindow article={selectedArticle} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
