import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Nav from './components/Nav'
import Footer from './components/Footer'
import ScrollToTop from './components/ScrollToTop'
import Home from './pages/Home'
import Partner from './pages/Partner'
import Events from './pages/Events'
import Admin from './pages/Admin'

function SiteLayout({ children }) {
  return (
    <div className="flex flex-col min-h-screen bg-cream">
      <Nav />
      <div className="flex-1">{children}</div>
      <Footer />
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<SiteLayout><Home /></SiteLayout>} />
        <Route path="/partner" element={<SiteLayout><Partner /></SiteLayout>} />
        <Route path="/events" element={<SiteLayout><Events /></SiteLayout>} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
