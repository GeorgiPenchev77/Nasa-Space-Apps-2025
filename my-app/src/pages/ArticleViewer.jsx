import React, { useEffect, useState } from 'react';
import { useRouter } from '../utils/router';
import apiClient from '../utils/apiClient';
import { ArrowLeft } from 'lucide-react';
import ArticleSidebar from '../components/ArticleSidebar';
import ArticleWindow from '../components/ArticleWindow';

const wrapperStyle = {
  minHeight: '100vh',
  padding: '36px 20px',
  boxSizing: 'border-box',
  color: 'white'
};

const headerWrap = {
  maxWidth: '1100px',
  margin: '0 auto 18px auto',
  display: 'flex',
  alignItems: 'center',
  gap: 18,
  justifyContent: 'space-between'
};

export default function ArticleViewerPage({ params = {} }) {
  const { currentPath, goBack } = useRouter();
  // prefer params.tag (router passes it). fallback to path segment.
  const guessedTag = params.tag
    ? decodeURIComponent(params.tag)
    : decodeURIComponent((currentPath || '').split('/').pop() || '');

  const [tagName, setTagName] = useState(guessedTag || '');
  const [articles, setArticles] = useState([]);
  const [selectedArticleId, setSelectedArticleId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // if router updates params/currentPath, update tagName and reload
    setTagName(guessedTag);
  }, [currentPath, params?.tag]);

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

      // data format is alternating title, url, title, url ...
      const parsed = [];
      for (let i = 0, id = 0; i < raw.length; i += 2, id++) {
        const title = raw[i] ?? `Article ${id + 1}`;
        const url = raw[i + 1] ?? '';
        parsed.push({ id, title, url });
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
      <div style={headerWrap}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button
            onClick={goBack}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '8px 14px',
              borderRadius: 999,
              border: '1px solid rgba(255,255,255,0.08)',
              background: 'rgba(255,255,255,0.03)',
              color: '#fff',
              cursor: 'pointer'
            }}
          >
            <ArrowLeft size={16} /> Back
          </button>

          <div>
            <h1 style={{ margin: 0, fontSize: '2rem', fontWeight: 800 }}>
              {tagName || 'Articles'}
            </h1>
            <div style={{ color: 'rgba(255,255,255,0.75)', marginTop: 6 }}>
              {loading ? 'Loading...' : `${articles.length} ${articles.length === 1 ? 'article' : 'articles'}`}
            </div>
          </div>
        </div>
      </div>

      <div style={{
        maxWidth: '1100px',
        margin: '8px auto 40px auto',
        display: 'flex',
        gap: 20,
        alignItems: 'flex-start',
        padding: '0 10px',
        boxSizing: 'border-box'
      }}>
        {loading ? (
          <div style={{
            width: '100%',
            textAlign: 'center',
            color: 'rgba(255,255,255,0.9)',
            padding: 36,
            background: 'rgba(255,255,255,0.02)',
            borderRadius: 12
          }}>
            Loading articles...
          </div>
        ) : error ? (
          <div style={{
            width: '100%',
            textAlign: 'center',
            color: '#ffd6d6',
            background: 'rgba(255,30,30,0.04)',
            border: '1px solid rgba(255,30,30,0.08)',
            padding: 20,
            borderRadius: 12
          }}>
            <div style={{ fontWeight: 700, marginBottom: 8 }}>Error</div>
            <div>{error}</div>
            <button
              onClick={loadArticles}
              style={{
                marginTop: 12,
                padding: '8px 12px',
                borderRadius: 10,
                border: 'none',
                cursor: 'pointer',
                background: 'linear-gradient(90deg,#6c5ce7,#a29bfe)',
                color: 'white'
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
  );
}
