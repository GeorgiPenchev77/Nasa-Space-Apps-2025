import React, { useState, useRef, useEffect } from 'react'
import ResearchCard from './ResearchCard'
import Modal from './Modal'

export default function SwipeDeck({ items = [] }) {
  // keep a local mutable list so we can remove swiped cards
  const [localItems, setLocalItems] = useState(items.slice())
  const [index, setIndex] = useState(0)
  const [pos, setPos] = useState({ x: 0, y: 0, rotating: 0 })
  const [dragging, setDragging] = useState(false)
  const [animating, setAnimating] = useState(null)
  const [selected, setSelected] = useState(null)
  const startRef = useRef(null)
  const velocityRef = useRef({ time: 0, x: 0 })
  const rootRef = useRef(null)
  const wheelAccumRef = useRef(0)
  const wheelTimeoutRef = useRef(null)

  useEffect(() => {
    // only reset position when not dragging AND not animating
    if (!dragging && !animating) setPos({ x: 0, y: 0, rotating: 0 })
  }, [dragging, index, animating])

  function getPoint(e) {
    if (e.touches && e.touches[0]) return { x: e.touches[0].clientX, y: e.touches[0].clientY }
    return { x: e.clientX, y: e.clientY }
  }

  function onPointerDown(e) {
    if (e && e.preventDefault) e.preventDefault()
    const p = getPoint(e)
    startRef.current = { x: p.x, y: p.y, el: e.currentTarget, id: e.pointerId }
    try { if (e.currentTarget && e.pointerId && e.currentTarget.setPointerCapture) e.currentTarget.setPointerCapture(e.pointerId) } catch (err) {}
  setDragging(true)
  velocityRef.current = { time: Date.now(), x: p.x }
    window.addEventListener('pointermove', onPointerMove)
    window.addEventListener('pointerup', onPointerUp)
    window.addEventListener('pointercancel', onPointerUp)
  }

  function onPointerMove(e) {
    if (!dragging) return
    const p = getPoint(e)
    const dx = p.x - startRef.current.x
    const dy = p.y - startRef.current.y
    setPos({ x: dx, y: dy, rotating: dx / 20 })
    // track last pointer sample for velocity estimate
    velocityRef.current = { time: Date.now(), x: p.x }
  }

  function onPointerUp() {
    window.removeEventListener('pointermove', onPointerMove)
    window.removeEventListener('pointerup', onPointerUp)
    window.removeEventListener('pointercancel', onPointerUp)
    try { const s = startRef.current; if (s && s.el && s.id && s.el.releasePointerCapture) s.el.releasePointerCapture(s.id) } catch (err) {}
    const threshold = 120
    if (pos.x > threshold) {
      animateAndAdvance('right')
      return
    } else if (pos.x < -threshold) {
      animateAndAdvance('left')
      return
    }
    // not a swipe: stop dragging and reset position
    setDragging(false)
    setPos({ x: 0, y: 0, rotating: 0 })
  }

  function animateAndAdvance(dir) {
    if (localItems.length === 0) return
    setAnimating(dir)
    // Determine exit target based on current drag position so direction follows user's swipe
    const currentX = pos.x || 0
    // map direction to exit sign so right => positive X, left => negative X
    const sign = dir === 'right' ? 1 : -1

    // velocity-based extra distance (px)
    const { time: sampleT, x: sampleX } = velocityRef.current || { time: 0, x: 0 }
    const dt = Math.max(1, Date.now() - sampleT)
    const vel = (currentX - (sampleX || 0)) / dt // px/ms
    const speed = vel * 1000 // px/s
    const extra = Math.min(2200, Math.abs(speed) * 0.6) // tuned multiplier

    const base = Math.max(800, Math.abs(currentX))
    const exitX = (base + extra) * sign * 1.5
    setPos({ x: exitX, y: 0, rotating: exitX / 40 })
    setTimeout(() => {
      // remove the top card
      setLocalItems((prev) => prev.slice(1))
      // reset index to 0 for the new local list
      setIndex(0)
      // mark interaction finished, then clear animating so the reset effect can run safely
      setDragging(false)
      setAnimating(null)
      setPos({ x: 0, y: 0, rotating: 0 })
    }, 350)
  }

  function openDetails(item) { setSelected(item) }

  function onWheel(e) {
    if (e && e.preventDefault) e.preventDefault()
    const mode = e.deltaMode
    let rawX = e.deltaX
    let rawY = e.deltaY
    let dx = Math.abs(rawX) > Math.abs(rawY) ? rawX : -rawY
    if (mode === 1) dx = dx * 16
    if (mode === 2) dx = dx * 800
    dx = dx * 1.4
    wheelAccumRef.current += dx
    setDragging(true)
    setPos((prev) => ({ x: prev.x + dx, y: prev.y, rotating: (prev.x + dx) / 20 }))
    if (wheelTimeoutRef.current) clearTimeout(wheelTimeoutRef.current)
    wheelTimeoutRef.current = setTimeout(() => {
      const threshold = 120
      const total = wheelAccumRef.current
      wheelAccumRef.current = 0
      wheelTimeoutRef.current = null
      setDragging(false)
      if (total > threshold) animateAndAdvance('right')
      else if (total < -threshold) animateAndAdvance('left')
      else setPos({ x: 0, y: 0, rotating: 0 })
    }, 120)
  }

  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    const handler = (e) => onWheel(e)
    root.addEventListener('wheel', handler, { passive: false })
    return () => { root.removeEventListener('wheel', handler); if (wheelTimeoutRef.current) clearTimeout(wheelTimeoutRef.current) }
  }, [rootRef.current])

  useEffect(() => {
    return () => { if (wheelTimeoutRef.current) clearTimeout(wheelTimeoutRef.current) }
  }, [])

  if (!localItems || localItems.length === 0) return <div className="swipe-deck empty">No items</div>

  return (
    <div className="swipe-deck" ref={rootRef}>
      <div className="deck-controls">
        <button className="arrow left" aria-label="Swipe left" onClick={() => animateAndAdvance('left')}>‹</button>
        <button className="arrow right" aria-label="Swipe right" onClick={() => animateAndAdvance('right')}>›</button>
      </div>
      <div className="cards">
  {localItems.slice(index, index + 3).map((it, i) => {
          const isTop = i === 0
          const offset = i * 12
          const scale = 1 - i * 0.04
          const style = isTop
            ? { transform: `translate(${-pos.x}px, ${-pos.y}px) rotate(${-pos.rotating}deg)`, transition: animating || !dragging ? 'transform 350ms ease' : 'none', zIndex: 10 - i }
            : { transform: `translateY(${offset}px) scale(${scale})`, zIndex: 10 - i }
          return (
            <div key={it.id} className="card-wrapper" style={style} onPointerDown={isTop ? onPointerDown : undefined} onWheel={isTop ? onWheel : undefined}>
              <ResearchCard item={it} onClick={() => isTop && openDetails(it)} />
            </div>
          )
        })}
      </div>

      <Modal open={!!selected} onClose={() => setSelected(null)}>
        {selected && (
          <div>
            <h2>{selected.title}</h2>
            <p>{selected.details}</p>
            <p className="meta">Year: {selected.year}</p>
          </div>
        )}
      </Modal>
    </div>
  )
}
