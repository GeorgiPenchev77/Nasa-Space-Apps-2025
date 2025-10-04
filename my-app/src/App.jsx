import { useState } from 'react'
import moonButton from './assets/moon.png'
import marsButton from './assets/mars.png'
import './App.css'
import AstronautPopup from "./AstronautPopup";

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="space-background">
      <h1 className="gradient-text">Knowledge</h1>
      <h2 className="sub-text">Click on the planets for articles..blablabla</h2>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={moonButton} className="moon" alt="Moon" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={marsButton} className="mars" alt="Mars" />
        </a>
      </div>

      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
      <div className="relative min-h-screen bg-gray-950 text-white">
        <h1 className="p-10 text-3xl font-bold">Welcome to SpaceHub 🚀</h1>
        <AstronautPopup />
      </div>
    </div>
  )
}

export default App
