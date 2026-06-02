import Home from './pages/Home'
import Contactus from './pages/Contactus'
import Login from './pages/Login'
import Aboutus from './pages/Aboutus'
import Cart from './pages/Cart'
import Orders from './pages/Orders'
import Admin from './pages/Admin'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './pages/Navbar'
import Footer from './pages/Footer'
import './App.css'

const App = () => {
  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-900 font-sans text-slate-800 dark:text-slate-200">
        <Navbar />
        <main className="flex-1 w-full max-w-6xl mx-auto px-4 py-8">
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/contactus' element={<Contactus />} />
            <Route path='/login' element={<Login />} />
            <Route path='/aboutus' element={<Aboutus />} />
            <Route path='/cart' element={<Cart />} />
            <Route path='/orders' element={<Orders />} />
            <Route path='/admin' element={<Admin />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  )
}

export default App