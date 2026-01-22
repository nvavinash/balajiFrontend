import React from 'react'
import { Routes, Route } from 'react-router-dom'
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

  return (
    <div className='px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]'>
      <ToastContainer />
      <Navbar />
      <SearchBar />

      {/* Admin Quick Links (Visible only on admin paths for clarity) */}
      {window.location.pathname.startsWith('/admin') && window.location.pathname !== '/admin/login' && (
        <div className='flex justify-center gap-6 py-4 border-b text-sm font-bold uppercase tracking-wider'>
          <a href="/admin/dashboard" className='hover:text-black text-gray-500'>Dashboard</a>
          <a href="/admin/products" className='hover:text-black text-gray-500'>Products</a>
          <a href="/admin/orders" className='hover:text-black text-gray-500'>Orders</a>
        </div>
      )}

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
      <Footer />
    </div>
  )
}

export default App