import { useState } from 'react'
import tags from '../../../server/cache/tags.json'

function TagGrid({ onTagClick, selectedTags = [] }) {
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
        {getCurrentPageTags().map(tag => {
          const isSelected = selectedTags.includes(tag)
          return (
            <div
              key={tag}
              className={`tag-chip-grid ${isSelected ? 'tag-selected' : ''}`}
              onClick={() => !isSelected && onTagClick && onTagClick(tag)}
              style={{
                opacity: isSelected ? 0.5 : 1,
                cursor: isSelected ? 'not-allowed' : 'pointer'
              }}
            >
              <span>{tag}</span>
            </div>
          )
        })}
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
