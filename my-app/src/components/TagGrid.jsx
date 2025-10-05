import { useState } from 'react'
import tags from '../../../resources/cache/tags.json'

function TagGrid({ onTagClick }) {
  const [currentPage, setCurrentPage] = useState(1)
  const tagsPerPage = 35 // 7 columns x 5 rows

  const allTags = Object.keys(tags)
  const totalPages = Math.ceil(allTags.length / tagsPerPage)

  const handlePrevious = () => {
    setCurrentPage(prev => Math.max(1, prev - 1))
  }

  const handleNext = () => {
    setCurrentPage(prev => Math.min(totalPages, prev + 1))
  }

  const getCurrentPageTags = () => {
    const startIndex = (currentPage - 1) * tagsPerPage
    const endIndex = currentPage * tagsPerPage
    return allTags.slice(startIndex, endIndex)
  }

  return (
    <div className="tag-grid-container">
      <div className="tag-grid">
        {getCurrentPageTags().map(tag => (
          <div 
            key={tag} 
            className="tag-chip-grid"
            onClick={() => onTagClick && onTagClick(tag)}
          >
            <span>{tag}</span>
          </div>
        ))}
      </div>
      <div className="pagination-controls">
        <button
          className="pagination-btn"
          onClick={handlePrevious}
          disabled={currentPage === 1}
        >
          ← Previous
        </button>
        <span className="page-indicator">
          Page {currentPage} of {totalPages}
        </span>
        <button
          className="pagination-btn"
          onClick={handleNext}
          disabled={currentPage === totalPages}
        >
          Next →
        </button>
      </div>
    </div>
  )
}

export default TagGrid
