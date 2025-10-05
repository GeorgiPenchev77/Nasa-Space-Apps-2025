import { useState, useEffect } from 'react'
import moonButton from './assets/moon.png'
import marsButton from './assets/mars.png'
import './App.css'
import AstronautPopup from "./AstronautPopup";
import SwipeDeck from './components/SwipeDeck'
import researchData from './data/research.json'
import PlanetOverlay from './components/PlanetOverlay'
import Chatbot from './Chatbot' 
import ArticleReader from './ArticleViewer'
import tags from '../../server/cache/tags.json'

function App() {
  const [searchQuery, setSearchQuery] = useState('')
  const [showFilterPopup, setShowFilterPopup] = useState(false)
  const [selectedTags, setSelectedTags] = useState([])
  const [searchResults, setSearchResults] = useState(null)
  
  // TODO: REPLACE WITH ACTUAL BACKEND ARTICLES
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
    console.log('Searching for:', searchQuery)
    console.log('Selected tags:', selectedTags)

    // Filter articles based on search query and selected tags
    let results = allArticles

    // Filter by tags if any selected
    if (selectedTags.length > 0) {
      results = results.filter(article => 
        article.tags.some(tag => selectedTags.includes(tag))
      )
    }

    // Filter by search query
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

  // Moon and Mars overlay state
  const [moonOpen, setMoonOpen] = useState(false)
  const [marsOpen, setMarsOpen] = useState(false)

  useEffect(() => {
    if (window.location.pathname === '/moon') setMoonOpen(true)
    const onPop = () => {
      if (window.location.pathname !== '/moon') setMoonOpen(false)
      else setMoonOpen(true)
    }
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  const removeTag = (tag) => {
    setSelectedTags(prev => prev.filter(t => t !== tag))
  }

  const clearSearch = () => {
    setSearchResults(null)
    setSearchQuery('')
    setSelectedTags([])
    setSearchResults(null)
    setSearchQuery('')
    setSelectedTags([])
  }


  return (
    <div className="space-background">
      <h1 className="gradient-text">Knowledge Station</h1>
      <h2 className="sub-text">Use our search box, tap a planet for its related articles, or chat with our astronaut!</h2>

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
            <button
              type="button"
              className="tag-chip-remove"
              onClick={() => removeTag(tag)}
            >
              ×
            </button>
          </div>
        ))}
      </form>

      {showFilterPopup && (
        <div className="filter-popup">
          <div className="filter-popup-content">
            <h3>Filter by Tags</h3>
            <div className="tag-options">
              <button
                className={`tag-option ${selectedTags.includes('moon') ? 'selected' : ''}`}
                onClick={() => toggleTag('moon')}
              >
                Moon
              </button>
              <button
                className={`tag-option ${selectedTags.includes('mars') ? 'selected' : ''}`}
                onClick={() => toggleTag('mars')}
              >
                Mars
              </button>
            </div>
            <button 
              className="close-filter-button"
              onClick={() => setShowFilterPopup(false)}
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}

      {/* Tag Grid - only show when not searching */}
      {searchResults === null && (
        <div className="tag-grid-container">
          <div className="tag-grid">
            {Object.keys(tags).map(tag => (
              <div key={tag} className="tag-chip-grid">
                <span>{tag}</span>
              </div>
            ))}
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
              <div className="no-results">
                <p>No articles found matching your search.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Only show planets when not searching */}
      {searchResults === null && (
        <div>
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
          <img
            src={marsButton}
            className="mars"
            alt="Mars"
            role="button"
            style={{ cursor: 'pointer' }}
            onClick={() => {
              setMarsOpen(true)
              try { window.history.pushState({}, '', '/mars') } catch (e) {}
            }}
          />
        </div>
      )}

      {/* Planet overlays for Moon and Mars */}
      <PlanetOverlay open={moonOpen} onClose={() => setMoonOpen(false)} items={researchData} name="Moon"/>
      <PlanetOverlay open={marsOpen} onClose={() => setMarsOpen(false)} items={researchData} name="Mars"/>

      <div className="relative min-h-screen bg-gray-950 text-white">
        <AstronautPopup />
      </div>
      <ArticleReader/>
    </div>
  )
}

export default App