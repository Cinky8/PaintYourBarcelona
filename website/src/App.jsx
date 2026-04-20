import { HashRouter as BrowserRouter, Routes, Route } from 'react-router-dom'
import Nav from './components/Nav'
import Footer from './components/Footer'
import Home from './pages/Home'
import Partner from './pages/Partner'

function App() {
  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-screen bg-cream">
        <Nav />
        <div className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/partner" element={<Partner />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </BrowserRouter>
  )
}

export default App
