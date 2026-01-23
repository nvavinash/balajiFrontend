import React from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import Home from "./pages/Home"
import Collection from './pages/Collection'
import About from './pages/About'
import Product from './pages/Product'
import Contact from './pages/Contact'
import Cart from './pages/Cart'
import Login from './pages/Login'
import PlaceOrder from './pages/PlaceOrder'
import Orders from './pages/Orders'
import Navbar from './components/Navbar'
import AdminNavbar from './components/AdminNavbar'
import Footer from './components/Footer'
import SearchBar from './components/SearchBar'
import ProtectedRoute from './components/ProtectedRoute'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AdminLogin from './pages/AdminLogin'
import AdminOrders from './pages/AdminOrders'
import AdminInvoice from './pages/AdminInvoice'
import AdminDashboard from './pages/AdminDashboard'
import AdminProducts from './pages/AdminProducts'
import AdminProtectedRoute from './components/AdminProtectedRoute'

const App = () => {
  // Get current location to determine if we're on admin routes
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin') && location.pathname !== '/admin/login';
  const isAdminLogin = location.pathname === '/admin/login';

  return (
    <div className='px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]'>
      <ToastContainer />

      {/* Conditionally render Admin Navbar or User Navbar */}
      {isAdminRoute ? <AdminNavbar /> : !isAdminLogin && <Navbar />}

      {/* Hide SearchBar on admin routes */}
      {!isAdminRoute && !isAdminLogin && <SearchBar />}

      <Routes>
        {/* Public routes */}
        <Route path='/' element={<Home />} />
        <Route path='/collection' element={<Collection />} />
        <Route path='/about' element={<About />} />
        <Route path='/contact' element={<Contact />} />
        <Route path='/product/:productId' element={<Product />} />
        <Route path='/login' element={<Login />} />
        <Route path='/admin/login' element={<AdminLogin />} />

        {/* Protected user routes */}
        <Route
          path='/cart'
          element={
            <ProtectedRoute>
              <Cart />
            </ProtectedRoute>
          }
        />
        <Route
          path='/place-order'
          element={
            <ProtectedRoute>
              <PlaceOrder />
            </ProtectedRoute>
          }
        />
        <Route
          path='/orders'
          element={
            <ProtectedRoute>
              <Orders />
            </ProtectedRoute>
          }
        />

        {/* Protected Admin routes */}
        <Route
          path='/admin/dashboard'
          element={
            <AdminProtectedRoute>
              <AdminDashboard />
            </AdminProtectedRoute>
          }
        />
        <Route
          path='/admin/orders'
          element={
            <AdminProtectedRoute>
              <AdminOrders />
            </AdminProtectedRoute>
          }
        />
        <Route
          path='/admin/products'
          element={
            <AdminProtectedRoute>
              <AdminProducts />
            </AdminProtectedRoute>
          }
        />
        <Route
          path='/admin/invoice/:orderId'
          element={
            <AdminProtectedRoute>
              <AdminInvoice />
            </AdminProtectedRoute>
          }
        />
      </Routes>

      {/* Hide Footer on admin routes */}
      {!isAdminRoute && !isAdminLogin && <Footer />}
    </div>
  )
}

export default App