import { Routes, Route } from 'react-router-dom'
import Landing from './components/Landing.jsx'
import Assess from './components/Assess.jsx'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/assess" element={<Assess />} />
    </Routes>
  )
}
