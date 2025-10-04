import { useState, useEffect } from 'react'
import moonButton from './assets/moon.png'
import marsButton from './assets/mars.png'
import './App.css'
import AstronautPopup from "./AstronautPopup";
import SwipeDeck from './components/SwipeDeck'
import researchData from './data/research.json'
import PlanetOverlay from './components/PlanetOverlay'

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

  // Moon and Mars overlay state
  const [moonOpen, setMoonOpen] = useState(false)
  const [marsOpen, setMarsOpen] = useState(false)

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

      {/* Planet overlays for Moon and Mars */}
      <PlanetOverlay open={moonOpen} onClose={() => setMoonOpen(false)} items={researchData} name="Moon"/>
      <PlanetOverlay open={marsOpen} onClose={() => setMarsOpen(false)} items={researchData} name="Mars"/>

      <div className="relative min-h-screen bg-gray-950 text-white">
        <AstronautPopup />
      </div>
    </div>
  )
}

export default App
