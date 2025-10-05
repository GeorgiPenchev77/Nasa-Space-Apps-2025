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

function Home() {
  const [searchQuery, setSearchQuery] = useState('')
  const [showFilterPopup, setShowFilterPopup] = useState(false)
  const [selectedTags, setSelectedTags] = useState([])
  const [searchResults, setSearchResults] = useState(null)
  const [moonOpen, setMoonOpen] = useState(false)
  const [marsOpen, setMarsOpen] = useState(false)
  const [chatOpen, setChatOpen] = useState(false)

  // Temporary mock articles
  const allArticles = [
    { id: 1, title: "The Moon's Formation", description: "How Earth's satellite came to be", tags: ['moon'] },
    { id: 2, title: "Lunar Phases Explained", description: "Understanding the moon's cycle", tags: ['moon'] },
    { id: 3, title: "Apollo Missions", description: "Humanity's journey to the moon", tags: ['moon'] },
    { id: 4, title: "Moon Base Alpha", description: "Future of lunar colonization", tags: ['moon'] },
    { id: 5, title: "Mars Rover Discoveries", description: "Latest findings from Perseverance", tags: ['mars'] },
    { id: 6, title: "Water on Mars", description: "Evidence of ancient oceans", tags: ['mars'] },
    { id: 7, title: "Terraforming Mars", description: "Making Mars habitable", tags: ['mars'] },
    { id: 8, title: "Journey to Mars", description: "Planning human missions", tags: ['mars'] }
  ]

  const handleSearch = (e) => {
    e.preventDefault()
    let results = allArticles

    if (selectedTags.length > 0) {
      results = results.filter(article =>
        article.tags.some(tag => selectedTags.includes(tag))
      )
    }

    if (searchQuery.trim()) {
      results = results.filter(article =>
        article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.description.toLowerCase().includes(searchQuery.toLowerCase())
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
  const clearSearch = () => { setSearchResults(null); setSearchQuery(''); setSelectedTags([]) }
  const handleTagClick = (tag) => setSelectedTags(prev => [...prev, tag])

  return (
    <div className="space-background">
      <h1 className="gradient-text">Knowledge Station</h1>
      <h2 className="sub-text">Use our search box, tap a planet for its related articles, or chat with our astronaut!</h2>

      {/* 🌙 Moon | Search | Mars */}
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

            <button
              type="button"
              className="filter-button"
              onClick={() => setShowFilterPopup(!showFilterPopup)}
            >
              Filter
            </button>

            {selectedTags.map(tag => (
              <div key={tag} className="tag-chip">
                <span>{tag.charAt(0).toUpperCase() + tag.slice(1)}</span>
                <button type="button" className="tag-chip-remove" onClick={() => removeTag(tag)}>×</button>
              </div>
            ))}
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

      {/* Filter popup */}
      {showFilterPopup && (
        <div className="filter-popup">
          <div className="filter-popup-content">
            <h3>Filter by Tags</h3>
            <div className="tag-options">
              <button className={`tag-option ${selectedTags.includes('moon') ? 'selected' : ''}`} onClick={() => toggleTag('moon')}>Moon</button>
              <button className={`tag-option ${selectedTags.includes('mars') ? 'selected' : ''}`} onClick={() => toggleTag('mars')}>Mars</button>
            </div>
            <button className="close-filter-button" onClick={() => setShowFilterPopup(false)}>Apply Filters</button>
          </div>
        </div>
      )}

      {/* Tag Grid */}
      {searchResults === null && <TagGrid onTagClick={handleTagClick} />}

      {/* Search Results */}
      {searchResults !== null && (
        <div className="search-results-container">
          <div className="search-results-header">
            <h3>{searchResults.length} {searchResults.length === 1 ? 'Result' : 'Results'} Found</h3>
            <button className="clear-search-btn" onClick={clearSearch}>Clear Search</button>
          </div>
          <div className="search-results-list">
            {searchResults.length > 0 ? (
              searchResults.map(article => (
                <div key={article.id} className="search-result-item">
                  <h4>{article.title}</h4>
                  <p>{article.description}</p>
                  <div className="button-row">
                    <div className="article-tags">
                      {article.tags.map(tag => (
                        <span key={tag} className="article-tag">{tag}</span>
                      ))}
                    </div>
                    <button className="read-more-btn">Read More →</button>
                  </div>
                </div>
              ))
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
          <div style={{width: '90%', maxWidth: '800px', background: 'white', color: 'black', borderRadius: '12px', padding: '1rem', maxHeight: '90vh', overflow: 'auto'}}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem'}}>
              <h3 style={{margin: 0}}>Chatroom</h3>
              <button onClick={() => { try { window.history.pushState({}, '', '/') } catch(e){}; setChatOpen(false); }} style={{padding: '6px 10px'}}>Close</button>
            </div>
            <Chatbot />
          </div>
        </div>
      )}
    </div>
  )
}

export default Home