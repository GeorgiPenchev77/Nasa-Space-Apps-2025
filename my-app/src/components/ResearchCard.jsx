import React from 'react'

export default function ResearchCard({ item, style, onClick }) {
  return (
    <div className="research-card" style={style} onClick={onClick} role="button" tabIndex={0}>
      <div className="card-top">
        <h3>{item.title}</h3>
        <div className="meta">{item.year}</div>
      </div>
      <p className="summary">{item.summary}</p>
    </div>
  )
}
