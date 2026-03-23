import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import SmokyBackground from './components/SmokyBackground'
import Home from './pages/Home'
import Result from './pages/Result'
import Battle from './pages/Battle'
import Leaderboard from './pages/Leaderboard'
import JobFit from './pages/JobFit'
import ResumeRoast from './pages/ResumeRoast'

export default function App() {
  return (
    <BrowserRouter>
      <SmokyBackground />
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/result/:username" element={<Result />} />
        <Route path="/battle" element={<Battle />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/job-fit" element={<JobFit />} />
        <Route path="/resume-roast" element={<ResumeRoast />} />
      </Routes>
    </BrowserRouter>
  )
}
