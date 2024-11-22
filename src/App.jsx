
import { Route, Routes } from 'react-router-dom'
import './App.css'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Dashboard from './pages/Dashboard'
import PendingWorks from './pages/PendingWorks'
import AttendedWorks from './pages/AttendedWorks'
import CompletedWorks from './pages/CompletedWorks'
import Pnf from './pages/Pnf'
import Header from './components/Header'
import Footer from './components/Footer'

function App() {

  return (
    <>
    <Header/>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/pending-works" element={<PendingWorks />} />
        <Route path="/attended-works" element={<AttendedWorks />} />
        <Route path="/completed-works" element={<CompletedWorks />} />
        <Route path='/*' element={<Pnf />} />
      </Routes>
    <Footer />
    </>
  )
}

export default App
