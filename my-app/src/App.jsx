import { useState, useEffect } from 'react'
import moonButton from './assets/moon.png'
import marsButton from './assets/mars.png'
import './App.css'
import AstronautPopup from "./AstronautPopup";
import SwipeDeck from './components/SwipeDeck'
import researchData from './data/research.json'
import MoonOverlay from './components/MoonOverlay'

function App() {
  const [searchQuery, setSearchQuery] = useState('')
  const [showFilterPopup, setShowFilterPopup] = useState(false)
  const [selectedTags, setSelectedTags] = useState([])

  const handleSearch = (e) => {
    e.preventDefault()
    console.log('Searching for:', searchQuery)
    console.log('Selected tags:', selectedTags)
  }

  const toggleTag = (tag) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    )
  }

  // Moon overlay state
  const [moonOpen, setMoonOpen] = useState(false)

  useEffect(() => {
    // If the page loads on /moon, open the overlay
    if (window.location.pathname === '/moon') setMoonOpen(true)
    const onPop = () => {
      // close overlay if navigating away
      if (window.location.pathname !== '/moon') setMoonOpen(false)
      else setMoonOpen(true)
    }
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  const removeTag = (tag) => {
    setSelectedTags(prev => prev.filter(t => t !== tag))
  }

  return (
    <div className="space-background">
      <h1 className="gradient-text">Knowledge Station</h1>
      <h2 className="sub-text">Click on the planets for articles..blablabla</h2>

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

      <div>
        <img
          src={moonButton}
          className="moon"
          alt="Moon"
          role="button"
          onClick={() => {
            // open overlay and push URL without reload
            setMoonOpen(true)
            try { window.history.pushState({}, '', '/moon') } catch (e) {}
          }}
        />
        <a href="https://react.dev" target="_blank">
          <img src={marsButton} className="mars" alt="Mars" />
        </a>
      </div>

      {/* Moon overlay handled by component */}
      <MoonOverlay open={moonOpen} onClose={() => setMoonOpen(false)} items={researchData} />

      {/* Swipe deck moved into moon overlay */}

      <div className="relative min-h-screen bg-gray-950 text-white">
        <AstronautPopup />
      </div>
    </div>
  )
}

export default App
