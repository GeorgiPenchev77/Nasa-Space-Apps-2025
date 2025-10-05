import { useState, useEffect } from 'react';
import { useNavigate } from '../utils/router';
import apiClient from '../utils/apiClient';
import FloatingChatButton from '../components/ChatbotButton';
import { Search, ChevronDown, ChevronUp } from 'lucide-react';

export default function HomePage() {
  const navigate = useNavigate();
  const [tags, setTags] = useState({});
  const [filteredTags, setFilteredTags] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [displayCount, setDisplayCount] = useState(20);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    loadTags();
  }, []);

  useEffect(() => {
    filterAndSortTags();
  }, [tags, searchQuery]);

  const loadTags = async () => {
    setLoading(true);
    setError(null);
    try {
      const tagsData = await apiClient.articles.getTags();
      setTags(tagsData);
    } catch (err) {
      console.error('Failed to load tags:', err);
      setError('Failed to load tags. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortTags = () => {
    let tagArray = Object.entries(tags).map(([name, urls]) => ({
      name,
      count: urls.length,
      urls
    }));

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      tagArray = tagArray.filter(tag => 
        tag.name.toLowerCase().includes(query)
      );
    }

    tagArray.sort((a, b) => b.count - a.count);
    setFilteredTags(tagArray);
  };

  const handleTagClick = (tag) => {
    navigate(`/articles/${encodeURIComponent(tag.name)}`);
  };

  const handleShowMore = () => {
    setDisplayCount(prev => prev + 20);
  };

  const toggleShowAll = () => {
    if (showAll) {
      setDisplayCount(20);
      setShowAll(false);
    } else {
      setDisplayCount(filteredTags.length);
      setShowAll(true);
    }
  };

  const displayedTags = filteredTags.slice(0, displayCount);
  const hasMore = filteredTags.length > displayCount;

  return (
    <div className="space-background">
      <div style={{ textAlign: 'center', paddingTop: '3rem' }}>
        <h1 className="gradient-text">Knowledge Station</h1>
        <h2 className="sub-text">
          Explore research articles organized by topics. Click any tag to dive into related articles.
        </h2>
      </div>

      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        padding: '2rem 20px 1rem',
        maxWidth: '800px',
        margin: '0 auto'
      }}>
        <div className="search-input-wrapper">
          <input
            type="text"
            placeholder="Search tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
            style={{ width: '100%' }}
          />
          <button type="button" className="search-icon-button">
            <Search size={20} />
          </button>
        </div>
      </div>

      {!loading && (
        <div style={{
          textAlign: 'center',
          color: 'white',
          fontSize: '1rem',
          marginBottom: '1.5rem',
          opacity: 0.9
        }}>
          {searchQuery ? (
            <span>Found {filteredTags.length} tags matching "{searchQuery}"</span>
          ) : (
            <span>Showing {displayedTags.length} of {filteredTags.length} tags</span>
          )}
        </div>
      )}

      {loading && (
        <div style={{ 
          textAlign: 'center', 
          color: 'white', 
          padding: '3rem',
          fontSize: '1.2rem'
        }}>
          Loading tags...
        </div>
      )}

      {error && (
        <div style={{
          maxWidth: '600px',
          margin: '2rem auto',
          padding: '1.5rem',
          background: 'rgba(220, 53, 69, 0.2)',
          border: '2px solid rgba(220, 53, 69, 0.5)',
          borderRadius: '15px',
          color: 'white',
          textAlign: 'center'
        }}>
          <p style={{ margin: 0, fontSize: '1.1rem' }}>⚠️ {error}</p>
          <button
            onClick={loadTags}
            style={{
              marginTop: '1rem',
              padding: '10px 20px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '20px',
              cursor: 'pointer',
              fontSize: '1rem'
            }}
          >
            Retry
          </button>
        </div>
      )}

      {!loading && !error && (
        <>
          {filteredTags.length > 0 ? (
            <div style={{
              maxWidth: '1400px',
              margin: '0 auto',
              padding: '0 20px 3rem'
            }}>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
                gap: '20px',
                marginBottom: '2rem'
              }}>
                {displayedTags.map(tag => (
                  <div
                    key={tag.name}
                    onClick={() => handleTagClick(tag)}
                    className="tag-card"
                    style={{
                      background: 'rgba(60, 74, 135, 0.8)',
                      border: '2px solid rgba(37, 45, 83, 0.8)',
                      borderRadius: '15px',
                      padding: '20px',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '10px'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgba(102, 126, 234, 0.8)';
                      e.currentTarget.style.transform = 'translateY(-5px)';
                      e.currentTarget.style.boxShadow = '0 8px 20px rgba(102, 126, 234, 0.4)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'rgba(60, 74, 135, 0.8)';
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    <h3 style={{
                      margin: 0,
                      color: 'white',
                      fontSize: '1.2rem',
                      fontWeight: '600',
                      wordBreak: 'break-word'
                    }}>
                      {tag.name}
                    </h3>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      color: 'rgba(255, 255, 255, 0.8)',
                      fontSize: '0.9rem'
                    }}>
                      <span style={{
                        background: 'rgba(255, 255, 255, 0.2)',
                        padding: '4px 12px',
                        borderRadius: '12px',
                        fontWeight: '500'
                      }}>
                        {tag.count} {tag.count === 1 ? 'article' : 'articles'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {filteredTags.length > 20 && (
                <div style={{
                  display: 'flex',
                  justifyContent: 'center',
                  gap: '15px',
                  paddingTop: '1rem'
                }}>
                  {!showAll && hasMore && (
                    <button
                      onClick={handleShowMore}
                      style={{
                        padding: '12px 30px',
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '25px',
                        cursor: 'pointer',
                        fontSize: '1rem',
                        fontWeight: '600',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        transition: 'transform 0.2s'
                      }}
                      onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
                      onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                    >
                      Show More <ChevronDown size={20} />
                    </button>
                  )}
                  
                  <button
                    onClick={toggleShowAll}
                    style={{
                      padding: '12px 30px',
                      background: showAll 
                        ? 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)'
                        : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '25px',
                      cursor: 'pointer',
                      fontSize: '1rem',
                      fontWeight: '600',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      transition: 'transform 0.2s'
                    }}
                    onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
                    onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                  >
                    {showAll ? (
                      <>Show Less <ChevronUp size={20} /></>
                    ) : (
                      <>Show All <ChevronDown size={20} /></>
                    )}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div style={{
              textAlign: 'center',
              padding: '3rem',
              color: 'white'
            }}>
              <p style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>
                No tags found matching "{searchQuery}"
              </p>
              <button
                onClick={() => setSearchQuery('')}
                style={{
                  padding: '10px 20px',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '20px',
                  cursor: 'pointer',
                  fontSize: '1rem'
                }}
              >
                Clear Search
              </button>
            </div>
          )}
        </>
      )}

      <FloatingChatButton />
    </div>
  );
}
