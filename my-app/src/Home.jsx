import { useState, useEffect } from 'react'
import moonButton from './assets/moon.png'
import marsButton from './assets/mars.png'
import './App.css'
import AstronautPopup from "./AstronautPopup"
import researchData from './data/research.json'
import PlanetOverlay from './components/PlanetOverlay'
import ArticleReader from './ArticleViewer'
import TagGrid from './components/TagGrid'
import Chatbot from './Chatbot'
import tags from '../../server/cache/tags.json'

function Home() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTags, setSelectedTags] = useState([])
  const [searchResults, setSearchResults] = useState(null)
  const [moonOpen, setMoonOpen] = useState(false)
  const [marsOpen, setMarsOpen] = useState(false)
  const [chatOpen, setChatOpen] = useState(false)
  const [tagScrollPosition, setTagScrollPosition] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const resultsPerPage = 5

  const handleSearch = (e) => {
    e.preventDefault()
    let results = []

    // If tags are selected, get articles for those tags
    if (selectedTags.length > 0) {
      selectedTags.forEach(tag => {
        if (tags[tag]) {
          tags[tag].forEach(url => {
            // Avoid duplicates
            if (!results.find(r => r.url === url)) {
              results.push({
                id: url,
                url: url,
                title: `Research Article - ${tag}`,
                description: `Article from ${tag} category`,
                tags: [tag]
              })
            }
          })
        }
      })
    }

    // If search query exists, filter by tag name
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      const matchingTags = Object.keys(tags).filter(tag => 
        tag.toLowerCase().includes(query)
      )

      matchingTags.forEach(tag => {
        tags[tag].forEach(url => {
          // Avoid duplicates
          if (!results.find(r => r.url === url)) {
            results.push({
              id: url,
              url: url,
              title: `Research Article - ${tag}`,
              description: `Article from ${tag} category`,
              tags: [tag]
            })
          }
        })
      })
    }

    // If both tags and query exist, show intersection
    if (selectedTags.length > 0 && searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      results = results.filter(article => 
        article.tags.some(tag => tag.toLowerCase().includes(query))
      )
    }

    setSearchResults(results)
  }

  const toggleTag = (tag) => {
    setSelectedTags(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    )
  }

  useEffect(() => {
    if (window.location.pathname === '/moon') setMoonOpen(true)
    if (window.location.pathname === '/chatroom') setChatOpen(true)
    const onPop = () => {
      setMoonOpen(window.location.pathname === '/moon')
      setChatOpen(window.location.pathname === '/chatroom')
    }
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  const removeTag = (tag) => setSelectedTags(prev => prev.filter(t => t !== tag))
  const clearSearch = () => { 
    setSearchResults(null)
    setSearchQuery('')
    setSelectedTags([])
    setCurrentPage(1)
  }
  const handleTagClick = (tag) => {
    setSelectedTags(prev => {
      if (prev.includes(tag)) {
        return prev
      }
      return [...prev, tag]
    })
    setCurrentPage(1)
  }

  const scrollTags = (direction) => {
    const container = document.querySelector('.tags-scroll-container')
    if (container) {
      const scrollAmount = 150
      const newPosition = direction === 'left' 
        ? Math.max(0, tagScrollPosition - scrollAmount)
        : Math.min(container.scrollWidth - container.clientWidth, tagScrollPosition + scrollAmount)
      
      container.scrollTo({ left: newPosition, behavior: 'smooth' })
      setTagScrollPosition(newPosition)
    }
  }

  return (
    <div className="space-background">
      <h1 className="gradient-text">Knowledge Station</h1>
      <h2 className="sub-text">Use our search box, tap a planet for its related articles, or chat with our astronaut!</h2>

      {searchResults === null && (
        <div className="planets-search-wrapper">
          {/* Moon button */}
          <img
            src={moonButton}
            className="moon"
            alt="Moon"
            role="button"
            onClick={() => {
              setMoonOpen(true)
              try { window.history.pushState({}, '', '/moon') } catch (e) {}
            }}
          />

          {/* Search form */}
          <form onSubmit={handleSearch} className="search-container">
            <div className="search-input-wrapper">
              <input
                type="text"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
              <button type="submit" className="search-icon-button">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8"></circle>
                  <path d="m21 21-4.35-4.35"></path>
                </svg>
              </button>
            </div>

            <button type="submit" className="filter-button">
              Search
            </button>

            {selectedTags.length > 0 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', maxWidth: '400px' }}>
                <button
                  type="button"
                  onClick={() => scrollTags('left')}
                  style={{
                    background: 'rgba(102, 102, 102, 0.1)',
                    border: 'none',
                    color: 'white',
                    padding: '4px 8px',
                    cursor: 'pointer',
                    borderRadius: '4px',
                    fontSize: '16px'
                  }}
                >
                  ‹
                </button>
                <div 
                  className="tags-scroll-container"
                  style={{ 
                    display: 'flex', 
                    gap: '8px', 
                    overflowX: 'hidden',
                    scrollBehavior: 'smooth',
                    flex: 1
                  }}
                >
                  {selectedTags.map(tag => (
                    <div key={tag} className="tag-chip" style={{ flexShrink: 0 }}>
                      <span>{tag.charAt(0).toUpperCase() + tag.slice(1)}</span>
                      <button type="button" className="tag-chip-remove" onClick={() => removeTag(tag)}>×</button>
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => scrollTags('right')}
                  style={{
                    background: 'rgba(255,255,255,0.1)',
                    border: 'none',
                    color: 'white',
                    padding: '4px 8px',
                    cursor: 'pointer',
                    borderRadius: '4px',
                    fontSize: '16px'
                  }}
                >
                  ›
                </button>
              </div>
            )}
          </form>

          {/* Mars button */}
          <img
            src={marsButton}
            className="mars"
            alt="Mars"
            role="button"
            onClick={() => {
              setMarsOpen(true)
              try { window.history.pushState({}, '', '/mars') } catch (e) {}
            }}
          />
        </div>
      )}

      {/* Planet overlays */}
      <PlanetOverlay open={moonOpen} onClose={() => setMoonOpen(false)} items={researchData} name="Moon" />
      <PlanetOverlay open={marsOpen} onClose={() => setMarsOpen(false)} items={researchData} name="Mars" />

      {/* Tag Grid */}
      {searchResults === null && (
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center',
          width: '100%', 
          padding: '0 20px',
          margin: '0 auto'
        }}>
          <div style={{ maxWidth: '1200px', width: '100%' }}>
            <TagGrid onTagClick={handleTagClick} selectedTags={selectedTags} />
          </div>
        </div>
      )}

      {/* Search Results */}
      {searchResults !== null && (
        <div className="search-results-container">
          <div className="search-results-header">
            <h3>{searchResults.length} {searchResults.length === 1 ? 'Result' : 'Results'} Found</h3>
            <button className="clear-search-btn" onClick={clearSearch}>Clear Search</button>
          </div>
          <div className="search-results-list">
            {searchResults.length > 0 ? (
              <>
                {searchResults
                  .slice((currentPage - 1) * resultsPerPage, currentPage * resultsPerPage)
                  .map(article => (
                    <div key={article.id} className="search-result-item">
                      <h4>{article.title}</h4>
                      <p>{article.description}</p>
                      <div className="button-row">
                        <div className="article-tags">
                          {article.tags.map(tag => (
                            <span key={tag} className="article-tag">{tag}</span>
                          ))}
                        </div>
                        <a href={article.url} target="_blank" rel="noopener noreferrer" className="read-more-btn">
                          Read More →
                        </a>
                      </div>
                    </div>
                  ))}
                
                {/* Pagination Controls */}
                {searchResults.length > resultsPerPage && (
                  <div className="pagination-controls" style={{ justifyContent: 'center', marginTop: '30px' }}>
                    <button
                      className="pagination-btn"
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                    >
                      ← Previous
                    </button>
                    <span className="page-indicator">
                      Page {currentPage} of {Math.ceil(searchResults.length / resultsPerPage)}
                    </span>
                    <button
                      className="pagination-btn"
                      onClick={() => setCurrentPage(prev => Math.min(Math.ceil(searchResults.length / resultsPerPage), prev + 1))}
                      disabled={currentPage === Math.ceil(searchResults.length / resultsPerPage)}
                    >
                      Next →
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="no-results"><p>No articles found matching your search.</p></div>
            )}
          </div>
        </div>
      )}

      {/* Astronaut + Article Reader */}
      <div className="relative min-h-screen bg-gray-950 text-white">
        <AstronautPopup />
      </div>
      <ArticleReader />
      {/* Chat overlay - opens when path is /chatroom or chatOpen is true */}
      {chatOpen && (
        <div className="chat-overlay" style={{position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          <div style={{width: '90%', maxWidth: '800px', background: 'transparent', color: 'inherit', borderRadius: '0', padding: '0', maxHeight: '90vh', overflow: 'auto'}}>
              <Chatbot onClose={() => { try { window.history.back(); } catch (e) { try { window.history.pushState({}, '', '/') } catch (e) {} } setChatOpen(false); }} />
          </div>
        </div>
      )}
    </div>
  )
}

export default Home