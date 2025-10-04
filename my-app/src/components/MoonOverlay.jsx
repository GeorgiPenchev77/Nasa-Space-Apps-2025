import React from 'react'
import SwipeDeck from './SwipeDeck'

export default function MoonOverlay({ open, onClose, items = [] }) {
  if (!open) return null
  return (
    <div className="moon-overlay" role="dialog" aria-modal="true">
      <div className="moon-overlay-inner">
        <button
          className="moon-overlay-close"
          onClick={() => {
            try {
              onClose && onClose()
            } catch (e) {}
            try {
              window.history.back()
            } catch (e) {}
          }}
        >
          ✕
        </button>
        <h1>Moon Research</h1>
        <p style={{ color: '#bbb' }}>Swipe through moon-related research.</p>
        <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'center' }}>
          <SwipeDeck items={items} />
        </div>
      </div>
    </div>
  )
}
