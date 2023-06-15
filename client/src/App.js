import Footer from './components/footer/Footer';
import Home from './components/home';
import Navbar from './components/navbar/Navbar';
import RecommendedProperties from './components/recommendedProperties/RecommendedProperties';
import Signin from './components/signin/Signin';
import Signup from './components/signup/Signup';
import Properties from './components/properties/Properties';
import PropertyDetail from './components/propertyDetail/PropertyDetail';
import { useSelector } from 'react-redux'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import './App.css';
import { useEffect } from 'react';
import MyProperties from './components/myProperties/MyProperties';
import EditProperty from './components/editProperty/EditProperty';
import Cart from './components/Cart';
import Bookings from './components/Bookings';
import MyPropertyBookings from './components/MyPropertyBookings';
import AcceptedBookings from './components/AcceptedBookings';
import Profile from './components/Profile';

function App() {
  const { user } = useSelector((state) => state.auth)
  const url = useLocation().pathname

  useEffect(() => {
    url && window.scrollTo(0, 0)
  }, [url])

  return (
    <div>
      <Routes>
        <Route path='/' element={
          <>
            <Navbar />
            <Home />
            <Footer />
          </>
        } />
        <Route path='/recommendations' element={
          <>
            <Navbar />
            <RecommendedProperties />
            <Footer />
          </>
        } />
        <Route path='/signup' element={!user ? <><Navbar /><Signup />    <Footer /></> : <Navigate to='/' />} />
        <Route path='/signin' element={!user ? <><Navbar /><Signin />    <Footer /></> : <Navigate to='/' />} />
        <Route path='/properties' element={
          <>
            <Navbar />
            <Properties />
            <Footer />
          </>
        } />
        <Route path='/propertyDetail/:id' element={
          <>
            <Navbar />
            <PropertyDetail />
          </>
        } />
        <Route path='/myproperties' element={
          user?.isAdmin ?
            <>
              <Navbar />
              <MyProperties />
              <Footer />
            </>
            : <Navigate to='/signin' />
        } />
        <Route path='/editproperty/:id' element={
          user ?
            <>
              <Navbar />
              <EditProperty />
              <Footer />
            </>
            : <Navigate to='/signin' />
        } />
        <Route path='/cart' element={
          user ?
            <>
              <Navbar />
              <Cart />
              <Footer />
            </>
            : <Navigate to='/signin' />
        } />

        <Route path='/bookings' element={
          user ?
            <>
              <Navbar />
              <Bookings />
              <Footer />
            </>
            : <Navigate to='/signin' />
        } />

        <Route path='/myproperty-bookings' element={
          user?.isAdmin ?
            <>
              <Navbar />
              <MyPropertyBookings />
              <Footer />
            </>
            : <Navigate to='/signin' />
        } />

        <Route path='/accepted-bookings' element={
          user?.isAdmin ?
            <>
              <Navbar />
              <AcceptedBookings />
              <Footer />
            </>
            : <Navigate to='/signin' />
        } />

        <Route path='/profile' element={
          user ?
            <>
              <Navbar />
              <Profile />
              <Footer />
            </>
            : <Navigate to='/signin' />
        } />
      </Routes>


    </div>
  );
}

export default App;
