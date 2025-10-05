import React, { useState, useRef, useEffect } from 'react'
import ResearchCard from './ResearchCard'
import Modal from './Modal'

export default function SwipeDeck({ items = [] }) {
  // keep a local mutable list so we can remove swiped cards
  const [localItems, setLocalItems] = useState(items.slice())
  // flip this to true if visual dragging appears inverted on your machine
  const INVERT_DRAG = false
  const [index, setIndex] = useState(0)
  const [pos, setPos] = useState({ x: 0, y: 0, rotating: 0 })
  const [dragging, setDragging] = useState(false)
  const [animating, setAnimating] = useState(null)
  const [selected, setSelected] = useState(null)
  const startRef = useRef(null)
  const rootRef = useRef(null)
  const lastRawRef = useRef(0)
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
    window.addEventListener('pointermove', onPointerMove)
    window.addEventListener('pointerup', onPointerUp)
    window.addEventListener('pointercancel', onPointerUp)
  }

  function onPointerMove(e) {
    if (!dragging) return
    const p = getPoint(e)
    const dx = p.x - startRef.current.x
    const dy = p.y - startRef.current.y
    // store raw delta for direction checks
    lastRawRef.current = dx
    // visualX may need to be inverted to match pointer movement on this layout
    const visualX = INVERT_DRAG ? -dx : dx
    setPos({ x: visualX, y: dy, rotating: visualX / 20 })
  }

  function onPointerUp() {
    window.removeEventListener('pointermove', onPointerMove)
    window.removeEventListener('pointerup', onPointerUp)
    window.removeEventListener('pointercancel', onPointerUp)
    try { const s = startRef.current; if (s && s.el && s.id && s.el.releasePointerCapture) s.el.releasePointerCapture(s.id) } catch (err) {}
    const threshold = 120
    // use raw delta to determine swipe direction (avoids visual inversion issues)
    const rawDx = lastRawRef.current || pos.x || 0
    if (rawDx > threshold) {
      animateAndAdvance('right')
      return
    } else if (rawDx < -threshold) {
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
    // Determine exit target based on current drag position magnitude but use dir for sign
    // prefer raw delta for magnitude (avoids visual inversion issues)
    const currentX = lastRawRef.current || pos.x || 0
    // prefer the actual pointer direction for exit sign; fall back to dir when not available
    const rawSign = Math.sign(lastRawRef.current || 0)
    const sign = rawSign !== 0 ? rawSign : (dir === 'right' ? 1 : -1)
    const exitX = sign * Math.max(800, Math.abs(currentX)) * 1.5
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
  // use wheel delta: keep raw dx for detection but invert visual movement if needed
  const raw = dx
  const visualDelta = -dx
  wheelAccumRef.current += raw
  lastRawRef.current = raw
  setDragging(true)
  setPos((prev) => ({ x: prev.x + visualDelta, y: prev.y, rotating: (prev.x + visualDelta) / 20 }))
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
            ? { transform: `translate(${pos.x}px, ${pos.y}px) rotate(${pos.rotating}deg)`, transition: animating || !dragging ? 'transform 350ms ease' : 'none', zIndex: 10 - i }
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
